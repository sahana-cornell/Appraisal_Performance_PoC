/**
 * Synthesized Regional Appraisal Performance Data
 *
 * This is hardcoded data for the POC. In production, this would come from
 * an appraisal order management system via API calls.
 */

export const regions = [
  {
    id: 'tx-houston',
    name: 'Houston, TX',
    state: 'TX',
    county: 'Harris',
    lat: 29.7604,
    lng: -95.3698,
    status: 'degrading',
    severity: 'critical',
    metrics: {
      turnaroundTime: 13.8, // calendar days, target is 7-10
      vendorAvailability: 0.78, // 78%, target 95%
      reassignmentRate: 0.18, // 18%, target <5%
      onTimeCompletion: 0.68, // 68%, target >90%
      capacityUtilization: 0.95, // 95%, delay risk
      rejectionRate: 0.12, // 12% revision/defect rate, target <5%
      ordersAgingOverSla: 0.31,
      oldestOpenOrderAge: 19,
      responseLag: 5.0,
    },
    metricsChange: {
      turnaroundTime: 2.1,
      vendorAvailability: -0.05,
      reassignmentRate: 0.05,
      onTimeCompletion: -0.05,
      capacityUtilization: 0.08,
      rejectionRate: 0.03,
      ordersAgingOverSla: 0.09,
      oldestOpenOrderAge: 3,
      responseLag: 1.4,
    },
    history: {
      turnaroundTime: [11.2, 11.8, 12.6, 13.1, 13.8],
      vendorAvailability: [0.88, 0.85, 0.82, 0.80, 0.78],
      reassignmentRate: [0.13, 0.14, 0.15, 0.17, 0.18],
      onTimeCompletion: [0.74, 0.71, 0.70, 0.69, 0.68],
      capacityUtilization: [0.87, 0.90, 0.92, 0.94, 0.95],
      rejectionRate: [0.08, 0.09, 0.10, 0.11, 0.12],
      ordersAgingOverSla: [0.18, 0.21, 0.24, 0.28, 0.31],
      responseLag: [3.2, 3.7, 4.1, 4.5, 5.0],
    },
    trend: 'down',
    ordersThisWeek: 42,
    activeVendors: 4,
    topIssues: ['Appraiser capacity utilization high', 'Appraiser availability declining', 'Appraisal turn times increasing'],
    healthHistory: [62, 60, 58, 56, 54, 52, 50, 49, 48, 47, 46, 44, 43, 41]
  },
  {
    id: 'ca-sf',
    name: 'San Francisco, CA',
    state: 'CA',
    county: 'San Francisco',
    lat: 37.7749,
    lng: -122.4194,
    status: 'degrading',
    severity: 'warning',
    metrics: {
      turnaroundTime: 11.4,
      vendorAvailability: 0.82,
      reassignmentRate: 0.12,
      onTimeCompletion: 0.75,
      capacityUtilization: 0.88,
      rejectionRate: 0.08,
      ordersAgingOverSla: 0.22,
      oldestOpenOrderAge: 15,
      responseLag: 4.2,
    },
    metricsChange: {
      turnaroundTime: 1.2,
      vendorAvailability: -0.03,
      reassignmentRate: 0.03,
      onTimeCompletion: -0.03,
      capacityUtilization: 0.05,
      rejectionRate: 0.02,
      ordersAgingOverSla: 0.06,
      oldestOpenOrderAge: 2,
      responseLag: 0.9,
    },
    history: {
      turnaroundTime: [9.8, 10.2, 10.6, 11.0, 11.4],
      vendorAvailability: [0.86, 0.85, 0.84, 0.83, 0.82],
      reassignmentRate: [0.09, 0.10, 0.10, 0.11, 0.12],
      onTimeCompletion: [0.79, 0.78, 0.77, 0.76, 0.75],
      capacityUtilization: [0.82, 0.84, 0.86, 0.87, 0.88],
      rejectionRate: [0.06, 0.07, 0.07, 0.08, 0.08],
      ordersAgingOverSla: [0.13, 0.15, 0.17, 0.20, 0.22],
      responseLag: [3.0, 3.2, 3.6, 3.9, 4.2],
    },
    trend: 'down',
    ordersThisWeek: 11,
    activeVendors: 1,
    topIssues: ['Capacity approaching limits', 'One appraiser underperforming'],
    healthHistory: [78, 76, 74, 73, 72, 71, 70, 70, 69, 69, 68, 68, 68, 68]
  },
  {
    id: 'ny-nyc',
    name: 'New York, NY',
    state: 'NY',
    county: 'New York',
    lat: 40.7128,
    lng: -74.0060,
    status: 'healthy',
    severity: 'healthy',
    metrics: {
      turnaroundTime: 8.0,
      vendorAvailability: 0.98,
      reassignmentRate: 0.03,
      onTimeCompletion: 0.91,
      capacityUtilization: 0.68,
      rejectionRate: 0.02,
      ordersAgingOverSla: 0.05,
      oldestOpenOrderAge: 10,
      responseLag: 0.9,
    },
    metricsChange: {
      turnaroundTime: -0.4,
      vendorAvailability: 0.01,
      reassignmentRate: -0.01,
      onTimeCompletion: 0.02,
      capacityUtilization: -0.03,
      rejectionRate: 0.0,
      ordersAgingOverSla: -0.02,
      oldestOpenOrderAge: -1,
      responseLag: -0.1,
    },
    history: {
      turnaroundTime: [8.8, 8.5, 8.3, 8.1, 8.0],
      vendorAvailability: [0.92, 0.93, 0.93, 0.94, 0.94],
      reassignmentRate: [0.04, 0.04, 0.03, 0.03, 0.03],
      onTimeCompletion: [0.89, 0.90, 0.90, 0.91, 0.91],
      capacityUtilization: [0.71, 0.70, 0.70, 0.69, 0.68],
      rejectionRate: [0.03, 0.03, 0.03, 0.03, 0.03],
      ordersAgingOverSla: [0.08, 0.07, 0.06, 0.05, 0.05],
      responseLag: [1.1, 1.0, 1.0, 0.9, 0.9],
    },
    trend: 'up',
    ordersThisWeek: 19,
    activeVendors: 2,
    topIssues: [],
    healthHistory: [93, 94, 95, 95, 96, 97, 98, 98, 99, 99, 98, 99, 99, 99]
  },
  {
    id: 'fl-miami',
    name: 'Miami, FL',
    state: 'FL',
    county: 'Miami-Dade',
    lat: 25.7617,
    lng: -80.1918,
    status: 'stable',
    severity: 'neutral',
    metrics: {
      turnaroundTime: 9.6,
      vendorAvailability: 0.89,
      reassignmentRate: 0.06,
      onTimeCompletion: 0.83,
      capacityUtilization: 0.75,
      rejectionRate: 0.05,
      ordersAgingOverSla: 0.09,
      oldestOpenOrderAge: 11,
      responseLag: 2.1,
    },
    metricsChange: {
      turnaroundTime: 0.1,
      vendorAvailability: 0.0,
      reassignmentRate: 0.0,
      onTimeCompletion: 0.0,
      capacityUtilization: 0.0,
      rejectionRate: 0.0,
      ordersAgingOverSla: 0.01,
      oldestOpenOrderAge: 0,
      responseLag: 0.0,
    },
    history: {
      turnaroundTime: [9.5, 9.5, 9.6, 9.6, 9.6],
      vendorAvailability: [0.89, 0.89, 0.89, 0.89, 0.89],
      reassignmentRate: [0.06, 0.06, 0.06, 0.06, 0.06],
      onTimeCompletion: [0.83, 0.83, 0.83, 0.83, 0.83],
      capacityUtilization: [0.74, 0.75, 0.75, 0.75, 0.75],
      rejectionRate: [0.05, 0.05, 0.05, 0.05, 0.05],
      ordersAgingOverSla: [0.08, 0.08, 0.09, 0.09, 0.09],
      responseLag: [2.0, 2.1, 2.1, 2.1, 2.1],
    },
    trend: 'stable',
    ordersThisWeek: 15,
    activeVendors: 2,
    topIssues: [],
    healthHistory: [84, 85, 86, 87, 87, 88, 88, 88, 87, 87, 88, 87, 87, 87]
  },
  {
    id: 'wa-seattle',
    name: 'Seattle, WA',
    state: 'WA',
    county: 'King',
    lat: 47.6062,
    lng: -122.3321,
    status: 'stable',
    severity: 'neutral',
    metrics: {
      turnaroundTime: 8.8,
      vendorAvailability: 0.92,
      reassignmentRate: 0.04,
      onTimeCompletion: 0.87,
      capacityUtilization: 0.67,
      rejectionRate: 0.04,
      ordersAgingOverSla: 0.06,
      oldestOpenOrderAge: 10,
      responseLag: 1.7,
    },
    metricsChange: {
      turnaroundTime: -0.3,
      vendorAvailability: 0.01,
      reassignmentRate: 0.0,
      onTimeCompletion: 0.01,
      capacityUtilization: -0.02,
      rejectionRate: 0.0,
      ordersAgingOverSla: -0.01,
      oldestOpenOrderAge: -1,
      responseLag: -0.2,
    },
    history: {
      turnaroundTime: [9.3, 9.1, 9.0, 8.9, 8.8],
      vendorAvailability: [0.90, 0.91, 0.91, 0.91, 0.92],
      reassignmentRate: [0.05, 0.05, 0.04, 0.04, 0.04],
      onTimeCompletion: [0.86, 0.86, 0.87, 0.87, 0.87],
      capacityUtilization: [0.70, 0.69, 0.68, 0.67, 0.67],
      rejectionRate: [0.04, 0.04, 0.04, 0.04, 0.04],
      ordersAgingOverSla: [0.08, 0.08, 0.07, 0.06, 0.06],
      responseLag: [2.1, 2.0, 1.9, 1.8, 1.7],
    },
    trend: 'up',
    ordersThisWeek: 13,
    activeVendors: 2,
    topIssues: [],
    healthHistory: [86, 87, 88, 89, 90, 91, 92, 92, 93, 93, 94, 94, 94, 94]
  },
  {
    id: 'il-chicago',
    name: 'Chicago, IL',
    state: 'IL',
    county: 'Cook',
    lat: 41.8781,
    lng: -87.6298,
    status: 'critical',
    severity: 'critical',
    metrics: {
      turnaroundTime: 16.2,
      vendorAvailability: 0.70,
      reassignmentRate: 0.26,
      onTimeCompletion: 0.55,
      capacityUtilization: 1.13,
      rejectionRate: 0.18,
      ordersAgingOverSla: 0.46,
      oldestOpenOrderAge: 24,
      responseLag: 6.6,
    },
    metricsChange: {
      turnaroundTime: 2.6,
      vendorAvailability: -0.08,
      reassignmentRate: 0.08,
      onTimeCompletion: -0.07,
      capacityUtilization: 0.14,
      rejectionRate: 0.05,
      ordersAgingOverSla: 0.14,
      oldestOpenOrderAge: 5,
      responseLag: 1.8,
    },
    history: {
      turnaroundTime: [12.9, 13.7, 14.6, 15.4, 16.2],
      vendorAvailability: [0.84, 0.79, 0.75, 0.73, 0.71],
      reassignmentRate: [0.18, 0.20, 0.22, 0.24, 0.26],
      onTimeCompletion: [0.63, 0.60, 0.58, 0.56, 0.55],
      capacityUtilization: [0.92, 0.98, 1.04, 1.09, 1.13],
      rejectionRate: [0.13, 0.14, 0.16, 0.17, 0.18],
      ordersAgingOverSla: [0.26, 0.30, 0.35, 0.41, 0.46],
      responseLag: [4.2, 4.9, 5.4, 6.0, 6.6],
    },
    trend: 'down',
    ordersThisWeek: 24,
    activeVendors: 2,
    topIssues: ['Critical appraiser capacity shortage', 'Multiple appraiser failures', 'Order backlog building'],
    healthHistory: [45, 42, 39, 35, 32, 30, 28, 25, 23, 22, 21, 20, 19, 18]
  },
  {
    id: 'az-phoenix',
    name: 'Phoenix, AZ',
    state: 'AZ',
    county: 'Maricopa',
    lat: 33.4484,
    lng: -112.0742,
    status: 'healthy',
    severity: 'healthy',
    metrics: {
      turnaroundTime: 8.4,
      vendorAvailability: 0.91,
      reassignmentRate: 0.04,
      onTimeCompletion: 0.89,
      capacityUtilization: 0.80,
      rejectionRate: 0.03,
      ordersAgingOverSla: 0.04,
      oldestOpenOrderAge: 9,
      responseLag: 1.1,
    },
    metricsChange: {
      turnaroundTime: -0.2,
      vendorAvailability: 0.01,
      reassignmentRate: -0.01,
      onTimeCompletion: 0.01,
      capacityUtilization: -0.02,
      rejectionRate: 0.0,
      ordersAgingOverSla: -0.01,
      oldestOpenOrderAge: -1,
      responseLag: -0.1,
    },
    history: {
      turnaroundTime: [8.8, 8.7, 8.6, 8.5, 8.4],
      vendorAvailability: [0.90, 0.90, 0.91, 0.91, 0.91],
      reassignmentRate: [0.05, 0.05, 0.04, 0.04, 0.04],
      onTimeCompletion: [0.88, 0.88, 0.89, 0.89, 0.89],
      capacityUtilization: [0.82, 0.81, 0.81, 0.80, 0.80],
      rejectionRate: [0.03, 0.03, 0.03, 0.03, 0.03],
      ordersAgingOverSla: [0.06, 0.05, 0.05, 0.04, 0.04],
      responseLag: [1.3, 1.2, 1.2, 1.1, 1.1],
    },
    trend: 'stable',
    ordersThisWeek: 8,
    activeVendors: 1,
    topIssues: [],
    healthHistory: [88, 89, 90, 90, 91, 91, 92, 92, 91, 91, 91, 91, 91, 91]
  },
]

export const KPI_TARGETS = {
  turnaroundTime: 10,
  vendorAvailability: 0.95,
  reassignmentRate: 0.05,
  onTimeCompletion: 0.90,
  capacityUtilization: 0.80,
  rejectionRate: 0.05,
  ordersAgingOverSla: 0.10,
  responseLag: 2.5,
}

const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value))

const scoreLowerIsBetter = (value, target, failAt, weight) => {
  if (value <= target) return weight
  if (value >= failAt) return 0
  return weight * (1 - ((value - target) / (failAt - target)))
}

const scoreHigherIsBetter = (value, target, failAt, weight) => {
  if (value >= target) return weight
  if (value <= failAt) return 0
  return weight * ((value - failAt) / (target - failAt))
}

export const calculateHealthScore = (region) => {
  const { metrics } = region
  const trendScore = region.trend === 'up' ? 5 : region.trend === 'stable' ? 3 : 0

  const score =
    scoreLowerIsBetter(metrics.turnaroundTime, KPI_TARGETS.turnaroundTime, 16, 20) +
    scoreHigherIsBetter(metrics.vendorAvailability, KPI_TARGETS.vendorAvailability, 0.70, 15) +
    scoreLowerIsBetter(metrics.reassignmentRate, KPI_TARGETS.reassignmentRate, 0.25, 15) +
    scoreHigherIsBetter(metrics.onTimeCompletion, KPI_TARGETS.onTimeCompletion, 0.55, 20) +
    scoreLowerIsBetter(metrics.capacityUtilization, KPI_TARGETS.capacityUtilization, 1.10, 12) +
    scoreLowerIsBetter(metrics.rejectionRate, KPI_TARGETS.rejectionRate, 0.18, 8) +
    scoreLowerIsBetter(metrics.ordersAgingOverSla || 0, KPI_TARGETS.ordersAgingOverSla, 0.45, 8) +
    scoreLowerIsBetter(metrics.responseLag || 0, KPI_TARGETS.responseLag, 7, 7) +
    trendScore

  if (score >= 85) {
    const excellencePenalty =
      Math.max(0, metrics.turnaroundTime - 8) * 2 +
      Math.max(0, KPI_TARGETS.vendorAvailability - metrics.vendorAvailability) * 30 +
      Math.max(0, 0.92 - metrics.onTimeCompletion) * 40 +
      Math.max(0, metrics.capacityUtilization - 0.65) * 15 +
      Math.max(0, (metrics.ordersAgingOverSla || 0) - 0.05) * 30 +
      Math.max(0, (metrics.responseLag || 0) - 1) * 1.2 +
      (region.activeVendors <= 1 ? 3 : 0)

    return Math.round(clamp(100 - excellencePenalty, 85, 99))
  }

  return Math.round(clamp(score, 18, 99))
}

export const getHealthDrivers = (region) => {
  const drivers = []
  const { metrics, metricsChange = {} } = region

  if (metrics.turnaroundTime > KPI_TARGETS.turnaroundTime) {
    drivers.push({
      metric: 'Turnaround',
      severity: metrics.turnaroundTime >= 14 ? 'critical' : 'warning',
      text: `Turnaround is ${metrics.turnaroundTime.toFixed(1)} days vs ${KPI_TARGETS.turnaroundTime} day target`,
    })
  }

  if (metrics.capacityUtilization > 0.85) {
    drivers.push({
      metric: 'Capacity',
      severity: metrics.capacityUtilization >= 0.95 ? 'critical' : 'warning',
      text: `Capacity is ${(metrics.capacityUtilization * 100).toFixed(0)}%, above the 85% early-warning threshold`,
    })
  }

  if (metrics.reassignmentRate > 0.07) {
    drivers.push({
      metric: 'Reassignment',
      severity: metrics.reassignmentRate >= 0.15 ? 'critical' : 'warning',
      text: `Reassignment rate is ${(metrics.reassignmentRate * 100).toFixed(0)}%, above the 7% early-warning threshold`,
    })
  }

  if (metrics.onTimeCompletion < 0.80) {
    drivers.push({
      metric: 'On-Time',
      severity: metrics.onTimeCompletion <= 0.70 ? 'critical' : 'warning',
      text: `On-time completion is ${(metrics.onTimeCompletion * 100).toFixed(0)}%, below the 80% early-warning threshold`,
    })
  }

  if (metrics.vendorAvailability < 0.85) {
    drivers.push({
      metric: 'Availability',
      severity: metrics.vendorAvailability <= 0.80 ? 'critical' : 'warning',
      text: `Appraiser availability is ${(metrics.vendorAvailability * 100).toFixed(0)}%, below the 85% early-warning threshold`,
    })
  }

  if (metrics.rejectionRate > KPI_TARGETS.rejectionRate) {
    drivers.push({
      metric: 'Revision',
      severity: metrics.rejectionRate >= 0.12 ? 'critical' : 'warning',
      text: `Revision rate is ${(metrics.rejectionRate * 100).toFixed(0)}% vs ${(KPI_TARGETS.rejectionRate * 100).toFixed(0)}% target`,
    })
  }

  if ((metrics.ordersAgingOverSla || 0) > KPI_TARGETS.ordersAgingOverSla) {
    drivers.push({
      metric: 'Order Aging',
      severity: metrics.ordersAgingOverSla >= 0.30 ? 'critical' : 'warning',
      text: `${(metrics.ordersAgingOverSla * 100).toFixed(0)}% of open appraisal orders are aging beyond SLA`,
    })
  }

  if ((metrics.responseLag || 0) > KPI_TARGETS.responseLag) {
    drivers.push({
      metric: 'Response Lag',
      severity: metrics.responseLag >= 5 ? 'critical' : 'warning',
      text: `Average appraiser response lag is ${metrics.responseLag.toFixed(1)} hours vs ${KPI_TARGETS.responseLag.toFixed(1)} hour target`,
    })
  }

  if (metricsChange.turnaroundTime >= 1 || metricsChange.reassignmentRate >= 0.03 || metricsChange.capacityUtilization >= 0.05 || metricsChange.ordersAgingOverSla >= 0.05) {
    drivers.push({
      metric: 'Trend Velocity',
      severity: 'warning',
      text: `Negative momentum detected: turnaround ${metricsChange.turnaroundTime >= 0 ? '+' : ''}${(metricsChange.turnaroundTime || 0).toFixed(1)}d, reassignment ${((metricsChange.reassignmentRate || 0) * 100).toFixed(1)}pp, capacity ${((metricsChange.capacityUtilization || 0) * 100).toFixed(1)}pp vs prior period`,
    })
  }

  return drivers
}

export const getPatternSummary = (region) => {
  const drivers = getHealthDrivers(region)
  if (drivers.length === 0) {
    return 'No material degradation pattern detected. Region is operating within expected appraisal workflow thresholds.'
  }

  const criticalCount = drivers.filter((driver) => driver.severity === 'critical').length
  const driverNames = drivers.slice(0, 3).map((driver) => driver.metric.toLowerCase()).join(', ')
  const severity = criticalCount > 0 ? 'critical' : 'early-warning'

  return `${severity.charAt(0).toUpperCase() + severity.slice(1)} pattern detected across ${driverNames}. ${drivers.length} rule${drivers.length !== 1 ? 's' : ''} breached current operating thresholds.`
}

const average = (values) => values.reduce((sum, value) => sum + value, 0) / values.length

export const getAdaptiveBaseline = (region) => {
  const previous = (key) => region.history?.[key]?.slice(0, -1) || []
  const current = region.metrics

  const baselineTurnaround = previous('turnaroundTime').length ? average(previous('turnaroundTime')) : current.turnaroundTime
  const baselineAging = previous('ordersAgingOverSla').length ? average(previous('ordersAgingOverSla')) : current.ordersAgingOverSla
  const baselineResponse = previous('responseLag').length ? average(previous('responseLag')) : current.responseLag
  const baselineCapacity = previous('capacityUtilization').length ? average(previous('capacityUtilization')) : current.capacityUtilization

  return {
    turnaroundTime: parseFloat(baselineTurnaround.toFixed(1)),
    ordersAgingOverSla: parseFloat(baselineAging.toFixed(2)),
    responseLag: parseFloat(baselineResponse.toFixed(1)),
    capacityUtilization: parseFloat(baselineCapacity.toFixed(2)),
    turnaroundDelta: parseFloat((current.turnaroundTime - baselineTurnaround).toFixed(1)),
    agingDelta: parseFloat((current.ordersAgingOverSla - baselineAging).toFixed(2)),
    responseDelta: parseFloat((current.responseLag - baselineResponse).toFixed(1)),
    capacityDelta: parseFloat((current.capacityUtilization - baselineCapacity).toFixed(2)),
  }
}

const withComputedHealth = (region) => {
  const healthScore = calculateHealthScore(region)
  const severity = getHealthSeverity(healthScore)
  const drivers = getHealthDrivers(region)
  const status = severity === 'critical' ? 'critical' : drivers.length > 0 && region.trend === 'down' ? 'degrading' : region.status

  return {
    ...region,
    healthScore,
    severity,
    status,
    healthHistory: region.healthHistory?.length
      ? [...region.healthHistory.slice(0, -1), healthScore]
      : [healthScore],
    topIssues: drivers.length > 0 ? drivers.slice(0, 3).map((driver) => driver.text) : region.topIssues,
    patternSummary: getPatternSummary(region),
    healthDrivers: drivers,
    adaptiveBaseline: getAdaptiveBaseline(region),
  }
}

export const getRegionsWithComputedHealth = () => regions.map(withComputedHealth)

/**
 * Get a region by ID
 */
export const getRegionById = (id) => {
  const region = regions.find(r => r.id === id)
  return region ? withComputedHealth(region) : undefined
}

/**
 * Get regions by health status
 */
export const getRegionsByStatus = (status) => {
  return getRegionsWithComputedHealth().filter(r => r.status === status)
}

/**
 * Get regions sorted by health score (worst first)
 */
export const getRegionsSortedByHealth = (direction = 'asc') => {
  return getRegionsWithComputedHealth().sort((a, b) => {
    return direction === 'asc' ? a.healthScore - b.healthScore : b.healthScore - a.healthScore
  })
}

/**
 * Network-wide averages
 */
export const getNetworkAverages = () => {
  const computedRegions = getRegionsWithComputedHealth()
  const sum = (key) => computedRegions.reduce((acc, r) => acc + r.metrics[key], 0) / computedRegions.length
  
  return {
    turnaroundTime: parseFloat(sum('turnaroundTime').toFixed(2)),
    vendorAvailability: parseFloat(sum('vendorAvailability').toFixed(2)),
    reassignmentRate: parseFloat(sum('reassignmentRate').toFixed(2)),
    onTimeCompletion: parseFloat(sum('onTimeCompletion').toFixed(2)),
    capacityUtilization: parseFloat(sum('capacityUtilization').toFixed(2)),
    rejectionRate: parseFloat(sum('rejectionRate').toFixed(2)),
    ordersAgingOverSla: parseFloat(sum('ordersAgingOverSla').toFixed(2)),
    responseLag: parseFloat(sum('responseLag').toFixed(2)),
  }
}

/**
 * Status severity indicator
 */
export const getSeverityColor = (severity) => {
  const map = {
    critical: '#dc2626', // red
    warning: '#f59e0b', // amber
    neutral: '#6b7280', // gray
    healthy: '#10b981' // green
  }
  return map[severity] || map.neutral
}

export const getHealthSeverity = (score) => {
  if (score < 45) return 'critical'
  if (score < 70) return 'warning'
  if (score < 85) return 'neutral'
  return 'healthy'
}

/**
 * Health score interpretation
 */
export const getHealthLabel = (score) => {
  if (score >= 85) return 'Excellent'
  if (score >= 70) return 'Good'
  if (score >= 45) return 'At Risk'
  return 'Critical'
}
