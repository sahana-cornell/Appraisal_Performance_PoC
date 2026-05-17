import { getRegionsWithComputedHealth, KPI_TARGETS } from './regions.js'
import { getVendorsByRegion } from './vendors.js'

/**
 * Synthesized Alerts & Escalation Feed
 * 
 * Alerts are generated from current regional metrics by generateRuleBasedAlerts().
 */

export const alerts = []

const minutesAgo = (minutes) => new Date(Date.now() - minutes * 60000)

const getWorstAppraiser = (regionId, selector) => {
  const appraisers = getVendorsByRegion(regionId)
  if (appraisers.length === 0) return null
  return [...appraisers].sort(selector)[0]
}

const getAlertOwner = (region) => {
  if (region.severity === 'critical') return `${region.name.split(',')[0]} Ops Lead`
  if (region.severity === 'warning') return `${region.state} Capacity Lead`
  return 'Regional Insights'
}

const createCapacityAlert = (region, priority, timestamp) => {
  const worstAvailability = getWorstAppraiser(region.id, (a, b) => a.vendorAvailability - b.vendorAvailability)
  return {
    id: `rule-capacity-${region.id}`,
    regionId: region.id,
    severity: region.metrics.capacityUtilization >= 0.95 ? 'critical' : 'warning',
    timestamp,
    title: `${region.name}: Capacity Threshold Breach`,
    message: `${region.name} is at ${(region.metrics.capacityUtilization * 100).toFixed(0)}% appraisal capacity with ${region.ordersThisWeek} active orders this week.`,
    suggestedAction: worstAvailability
      ? `Reduce new assignments to ${worstAvailability.name} until availability recovers from ${(worstAvailability.vendorAvailability * 100).toFixed(0)}%. Shift urgent orders to appraisers under 90% utilization.`
      : 'Activate backup appraisers and throttle new assignments until capacity returns below 85%.',
    actionType: region.metrics.capacityUtilization >= 0.95 ? 'escalate' : 'proactive',
    targetTeam: 'Appraisal Operations',
    assignedTo: getAlertOwner(region),
    status: region.severity === 'critical' ? 'In Progress' : 'Monitoring',
    priority,
    impactedOrders: Math.round(region.ordersThisWeek * Math.max(0.2, region.metrics.capacityUtilization - 0.75)),
    rule: 'capacity_utilization_above_threshold',
    related: {
      type: 'region',
      id: region.id
    }
  }
}

const createTurnaroundAlert = (region, priority, timestamp) => {
  const slowest = getWorstAppraiser(region.id, (a, b) => b.averageTurnaroundTime - a.averageTurnaroundTime)
  return {
    id: `rule-turnaround-${region.id}`,
    regionId: region.id,
    severity: region.metrics.turnaroundTime >= 14 ? 'critical' : 'warning',
    timestamp,
    title: `${region.name}: Appraisal Turnaround Pattern Detected`,
    message: `Average appraisal turnaround is ${region.metrics.turnaroundTime.toFixed(1)} days, ${Math.max(0, region.metrics.turnaroundTime - KPI_TARGETS.turnaroundTime).toFixed(1)} days above target.`,
    suggestedAction: slowest
      ? `Review ${slowest.name}, currently averaging ${slowest.averageTurnaroundTime.toFixed(1)} days. Prioritize aged orders and reroute rush files until the region returns below ${KPI_TARGETS.turnaroundTime} days.`
      : 'Review aged orders, inspection access blockers, and appraiser assignment balance.',
    actionType: 'investigate',
    targetTeam: 'Operations Analytics',
    assignedTo: getAlertOwner(region),
    status: 'Awaiting Review',
    priority,
    impactedOrders: Math.round(region.ordersThisWeek * (1 - region.metrics.onTimeCompletion)),
    rule: 'turnaround_above_target',
    related: {
      type: 'region',
      id: region.id
    }
  }
}

const createQualityAlert = (region, priority, timestamp) => {
  const highestRevision = getWorstAppraiser(region.id, (a, b) => b.rejectionRate - a.rejectionRate)
  return {
    id: `rule-quality-${region.id}`,
    regionId: region.id,
    severity: region.metrics.rejectionRate >= 0.12 ? 'critical' : 'warning',
    timestamp,
    title: `${region.name}: Revision Rate Spike`,
    message: `Revision rate is ${(region.metrics.rejectionRate * 100).toFixed(0)}%, above the ${(KPI_TARGETS.rejectionRate * 100).toFixed(0)}% target.`,
    suggestedAction: highestRevision
      ? `Audit recent files from ${highestRevision.name}, currently at ${(highestRevision.rejectionRate * 100).toFixed(0)}% revisions. Check property complexity, report completeness, and reviewer feedback themes.`
      : 'Audit recent revised files and categorize defects by property complexity, report completeness, and review findings.',
    actionType: 'review',
    targetTeam: 'Quality Control',
    assignedTo: 'Appraisal QC Lead',
    status: 'New',
    priority,
    impactedOrders: Math.round(region.ordersThisWeek * region.metrics.rejectionRate),
    rule: 'revision_rate_above_threshold',
    related: {
      type: 'region',
      id: region.id
    }
  }
}

const createReassignmentAlert = (region, priority, timestamp) => ({
  id: `rule-reassignment-${region.id}`,
  regionId: region.id,
  severity: region.metrics.reassignmentRate >= 0.15 ? 'critical' : 'warning',
  timestamp,
  title: `${region.name}: Reassignment Pattern Detected`,
  message: `Reassignment rate is ${(region.metrics.reassignmentRate * 100).toFixed(0)}%, indicating appraisal orders are bouncing before completion.`,
  suggestedAction: 'Review the last reassigned orders for appraiser declines, inspection scheduling failures, property complexity, and assignment coverage gaps.',
  actionType: 'investigate',
  targetTeam: 'Operations Analytics',
  assignedTo: getAlertOwner(region),
  status: 'New',
  priority,
  impactedOrders: Math.round(region.ordersThisWeek * region.metrics.reassignmentRate),
  rule: 'reassignment_rate_above_threshold',
  related: {
    type: 'region',
    id: region.id
  }
})

const createAgingAlert = (region, priority, timestamp) => ({
  id: `rule-aging-${region.id}`,
  regionId: region.id,
  severity: region.metrics.ordersAgingOverSla >= 0.30 ? 'critical' : 'warning',
  timestamp,
  title: `${region.name}: Aging Order Exposure`,
  message: `${(region.metrics.ordersAgingOverSla * 100).toFixed(0)}% of open appraisal orders are aging beyond SLA; oldest open order is ${region.metrics.oldestOpenOrderAge} days old.`,
  suggestedAction: 'Pull the aged-order queue, separate access issues from appraiser delay, and assign same-day follow-up ownership for every order beyond SLA.',
  actionType: region.metrics.ordersAgingOverSla >= 0.30 ? 'urgent' : 'investigate',
  targetTeam: 'Appraisal Operations',
  assignedTo: getAlertOwner(region),
  status: region.metrics.ordersAgingOverSla >= 0.30 ? 'In Progress' : 'New',
  priority,
  impactedOrders: Math.round(region.ordersThisWeek * region.metrics.ordersAgingOverSla),
  rule: 'orders_aging_above_adaptive_baseline',
  related: {
    type: 'region',
    id: region.id
  }
})

const createResponseLagAlert = (region, priority, timestamp) => {
  const slowestResponder = getWorstAppraiser(region.id, (a, b) => b.responseTime - a.responseTime)
  return {
    id: `rule-response-lag-${region.id}`,
    regionId: region.id,
    severity: region.metrics.responseLag >= 5 ? 'critical' : 'warning',
    timestamp,
    title: `${region.name}: Appraiser Response Lag`,
    message: `Average appraiser response lag is ${region.metrics.responseLag.toFixed(1)} hours, which is an early indicator of capacity or scheduling friction.`,
    suggestedAction: slowestResponder
      ? `Contact ${slowestResponder.name}, currently averaging ${slowestResponder.responseTime.toFixed(1)} hours to respond. Rebalance new orders if response time does not recover today.`
      : 'Contact slow responders and verify inspection scheduling capacity before assigning additional rush orders.',
    actionType: 'proactive',
    targetTeam: 'Appraisal Operations',
    assignedTo: getAlertOwner(region),
    status: 'Monitoring',
    priority,
    impactedOrders: Math.round(region.ordersThisWeek * 0.25),
    rule: 'response_lag_above_adaptive_baseline',
    related: {
      type: 'region',
      id: region.id
    }
  }
}

const createConcentrationAlert = (region, priority, timestamp) => ({
  id: `rule-concentration-${region.id}`,
  regionId: region.id,
  severity: region.metrics.capacityUtilization >= 0.80 ? 'warning' : 'healthy',
  timestamp,
  title: `${region.name}: Appraiser Concentration Risk`,
  message: `${region.name} has ${region.activeVendors} active appraiser${region.activeVendors !== 1 ? 's' : ''} in this POC sample, creating limited surge coverage.`,
  suggestedAction: 'Recruit or activate backup appraisers before volume spikes. Concentration risk should be handled before it becomes an SLA event.',
  actionType: 'strategic',
  targetTeam: 'Appraiser Recruitment',
  assignedTo: 'Recruitment Lead',
  status: 'Pending',
  priority,
  impactedOrders: region.ordersThisWeek,
  rule: 'single_appraiser_concentration',
  related: {
    type: 'region',
    id: region.id
  }
})

export const generateRuleBasedAlerts = () => {
  const generated = []
  let priority = 1

  getRegionsWithComputedHealth().forEach((region, index) => {
    const timestamp = minutesAgo(15 + index * 20)
    const regionCandidates = []
    const addCandidate = (alert) => {
      regionCandidates.push(alert)
    }

    if (region.metrics.capacityUtilization > 0.85) {
      addCandidate(createCapacityAlert(region, priority, timestamp))
    }

    if (region.metrics.turnaroundTime > KPI_TARGETS.turnaroundTime || (region.metricsChange?.turnaroundTime || 0) >= 1) {
      addCandidate(createTurnaroundAlert(region, priority, minutesAgo(25 + index * 20)))
    }

    if (region.metrics.reassignmentRate > 0.07) {
      addCandidate(createReassignmentAlert(region, priority, minutesAgo(35 + index * 20)))
    }

    if (region.metrics.rejectionRate > KPI_TARGETS.rejectionRate) {
      addCandidate(createQualityAlert(region, priority, minutesAgo(45 + index * 20)))
    }

    if (region.metrics.ordersAgingOverSla > KPI_TARGETS.ordersAgingOverSla || region.adaptiveBaseline?.agingDelta >= 0.05) {
      addCandidate(createAgingAlert(region, priority, minutesAgo(50 + index * 20)))
    }

    if (region.metrics.responseLag > KPI_TARGETS.responseLag || region.adaptiveBaseline?.responseDelta >= 1) {
      addCandidate(createResponseLagAlert(region, priority, minutesAgo(52 + index * 20)))
    }

    if (region.activeVendors <= 1) {
      addCandidate(createConcentrationAlert(region, priority, minutesAgo(55 + index * 20)))
    }

    const maxAlertsForRegion = region.severity === 'critical' ? 2 : region.severity === 'warning' ? 1 : 0
    regionCandidates
      .sort((a, b) => {
        const severityRank = { critical: 0, warning: 1, healthy: 2 }
        return severityRank[a.severity] - severityRank[b.severity] || b.impactedOrders - a.impactedOrders
      })
      .slice(0, maxAlertsForRegion)
      .forEach((alert) => {
        generated.push({ ...alert, priority: priority++ })
      })
  })

  const healthyRegions = getRegionsWithComputedHealth().filter((region) => region.severity === 'healthy')
  healthyRegions.slice(0, 1).forEach((region) => {
    generated.push({
      id: `rule-healthy-${region.id}`,
      regionId: region.id,
      severity: 'healthy',
      timestamp: minutesAgo(240),
      title: `${region.name}: Performance Within Guardrails`,
      message: `${region.name} is operating at ${region.healthScore}/100 health with ${(region.metrics.onTimeCompletion * 100).toFixed(0)}% on-time completion.`,
      suggestedAction: 'Use this market as a benchmark for appraiser coverage, order balancing, and quality control practices.',
      actionType: 'informational',
      targetTeam: 'Leadership',
      assignedTo: 'Regional Insights',
      status: 'Complete',
      priority: priority++,
      impactedOrders: 0,
      rule: 'healthy_reference_market',
      related: {
        type: 'region',
        id: region.id
      }
    })
  })

  return generated.sort((a, b) => a.priority - b.priority)
}

/**
 * Get all alerts sorted by priority (most urgent first)
 */
export const getAllAlerts = (sortBy = 'priority') => {
  return generateRuleBasedAlerts().sort((a, b) => {
    if (sortBy === 'priority') return a.priority - b.priority
    if (sortBy === 'timestamp') return b.timestamp - a.timestamp
    return 0
  })
}

/**
 * Get alerts by severity
 */
export const getAlertsBySeverity = (severity) => {
  return generateRuleBasedAlerts().filter(a => a.severity === severity)
}

/**
 * Get alerts for a specific region
 */
export const getAlertsByRegion = (regionId) => {
  return generateRuleBasedAlerts().filter(a => a.regionId === regionId || a.related?.id === regionId)
}

/**
 * Get alerts for a specific appraiser
 */
export const getAlertsByVendor = (vendorId) => {
  return generateRuleBasedAlerts().filter(a => a.related?.type === 'vendor' && a.related?.id === vendorId)
}

/**
 * Count critical alerts
 */
export const getCriticalAlertCount = () => {
  return generateRuleBasedAlerts().filter(a => a.severity === 'critical').length
}

/**
 * Get alert count by severity
 */
export const getAlertCountBySeverity = () => {
  const generatedAlerts = generateRuleBasedAlerts()
  return {
    critical: generatedAlerts.filter(a => a.severity === 'critical').length,
    warning: generatedAlerts.filter(a => a.severity === 'warning').length,
    healthy: generatedAlerts.filter(a => a.severity === 'healthy').length,
  }
}

/**
 * Severity color mapping
 */
export const severityColor = {
  critical: '#dc2626',
  warning: '#f59e0b',
  healthy: '#10b981'
}

/**
 * Severity icons (emoji for POC, can be replaced with proper icons)
 */
export const severityIcon = {
  critical: '🔴',
  warning: '🟡',
  healthy: '🟢'
}
