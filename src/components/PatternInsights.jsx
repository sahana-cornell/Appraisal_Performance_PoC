import { getRegionById } from '../data/regions'
import { getAlertsByRegion } from '../data/alerts'
import { getVendorsByRegion } from '../data/vendors'

const formatSigned = (value, suffix = '') => {
  if (value == null) return '0'
  const sign = value > 0 ? '+' : ''
  return `${sign}${value.toFixed(1)}${suffix}`
}

export default function PatternInsights({ regionId }) {
  const region = getRegionById(regionId)
  const alerts = getAlertsByRegion(regionId).filter((alert) => alert.severity !== 'healthy')
  const appraisers = getVendorsByRegion(regionId)

  if (!region) {
    return null
  }

  const drivers = region.healthDrivers || []
  const impactedOrders = alerts.reduce((sum, alert) => sum + (alert.impactedOrders || 0), 0)
  const scoreDelta = region.healthScore - (region.healthHistory?.[region.healthHistory.length - 2] || region.healthScore)
  const atRiskShare = region.ordersThisWeek ? Math.min(100, Math.round((impactedOrders / region.ordersThisWeek) * 100)) : 0
  const overloadedAppraisers = appraisers.filter((vendor) => vendor.capacity >= 100).length
  const capacityGap = Math.max(0, Math.round((region.metrics.capacityUtilization - 0.80) * region.ordersThisWeek))
  const highestRevisionAppraiser = [...appraisers].sort((a, b) => b.rejectionRate - a.rejectionRate)[0]
  const slowestAppraiser = [...appraisers].sort((a, b) => b.averageTurnaroundTime - a.averageTurnaroundTime)[0]
  const slowestResponder = [...appraisers].sort((a, b) => b.responseTime - a.responseTime)[0]
  const baseline = region.adaptiveBaseline
  const primaryAction = alerts[0]?.suggestedAction || 'Maintain current routing and monitor normal operating thresholds.'
  const severityStyles = {
    critical: 'bg-red-50 border-red-200 text-red-900',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-900',
    neutral: 'bg-gray-50 border-gray-200 text-gray-900',
    healthy: 'bg-green-50 border-green-200 text-green-900',
  }

  return (
    <div className={`border rounded-lg p-5 ${severityStyles[region.severity]}`}>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs uppercase font-semibold opacity-75">
            Market Signal
          </p>
          <h3 className="text-lg font-bold mt-1">
            {region.severity === 'critical'
              ? `${region.name} needs immediate appraisal capacity intervention`
              : region.severity === 'warning'
              ? `${region.name} is showing early operational stress`
              : `${region.name} is operating within guardrails`}
          </h3>
          <p className="text-sm mt-2 opacity-85">
            This card translates KPI movement into the operational story: where orders are getting stuck, which appraisers may be creating drag, and what ops should do next.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-3 text-center min-w-full lg:min-w-[420px]">
          <div className="bg-white bg-opacity-60 rounded-lg p-3">
            <p className="text-xs opacity-75">Score Movement</p>
            <p className="text-2xl font-bold">{formatSigned(scoreDelta)}</p>
            <p className="text-[11px] mt-1 opacity-75">change from last score</p>
          </div>
          <div className="bg-white bg-opacity-60 rounded-lg p-3">
            <p className="text-xs opacity-75">Order Exposure</p>
            <p className="text-2xl font-bold">{atRiskShare}%</p>
            <p className="text-[11px] mt-1 opacity-75">share touched by alerts</p>
          </div>
          <div className="bg-white bg-opacity-60 rounded-lg p-3">
            <p className="text-xs opacity-75">Capacity Gap</p>
            <p className="text-2xl font-bold">{capacityGap}</p>
            <p className="text-[11px] mt-1 opacity-75">orders above target load</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
        <div className="bg-white bg-opacity-60 rounded-lg p-3">
          <p className="text-xs uppercase font-semibold opacity-75">Aged Orders</p>
          <p className="text-sm mt-1">
            {(region.metrics.ordersAgingOverSla * 100).toFixed(0)}% beyond SLA; oldest order is {region.metrics.oldestOpenOrderAge} days
          </p>
          <p className="text-[11px] mt-2 opacity-75">
            Orders sitting too long are usually the clearest ops fire.
          </p>
        </div>
        <div className="bg-white bg-opacity-60 rounded-lg p-3">
          <p className="text-xs uppercase font-semibold opacity-75">Response Delay</p>
          <p className="text-sm mt-1">
            {slowestResponder ? `${slowestResponder.name}: ${slowestResponder.responseTime.toFixed(1)}h response lag` : 'No appraiser data'}
          </p>
          <p className="text-[11px] mt-2 opacity-75">
            Slow acceptance or updates often precede missed deadlines.
          </p>
        </div>
        <div className="bg-white bg-opacity-60 rounded-lg p-3">
          <p className="text-xs uppercase font-semibold opacity-75">Vs. Recent Normal</p>
          <p className="text-sm mt-1">
            Turnaround {formatSigned(baseline.turnaroundDelta, 'd')} vs recent norm
          </p>
          <p className="text-[11px] mt-2 opacity-75">
            Compares the region to its own recent pattern, not only a static target.
          </p>
        </div>
        <div className="bg-white bg-opacity-60 rounded-lg p-3">
          <p className="text-xs uppercase font-semibold opacity-75">Overloaded Appraisers</p>
          <p className="text-sm mt-1">
            {overloadedAppraisers > 0
              ? `${overloadedAppraisers} appraiser${overloadedAppraisers !== 1 ? 's' : ''} at or above full capacity`
              : 'No appraiser is above full capacity'}
          </p>
          <p className="text-[11px] mt-2 opacity-75">
            High workload means new orders are likely to queue or be reassigned.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
        <div className="bg-white bg-opacity-60 rounded-lg p-3">
          <p className="text-xs uppercase font-semibold opacity-75">Slowest Appraiser</p>
          <p className="text-sm mt-1">
            {slowestAppraiser ? `${slowestAppraiser.name}: ${slowestAppraiser.averageTurnaroundTime.toFixed(1)} days` : 'No appraiser data'}
          </p>
          <p className="text-[11px] mt-2 opacity-75">
            The appraiser most likely to be driving regional turnaround delay.
          </p>
        </div>
        <div className="bg-white bg-opacity-60 rounded-lg p-3">
          <p className="text-xs uppercase font-semibold opacity-75">Most Rework</p>
          <p className="text-sm mt-1">
            {highestRevisionAppraiser ? `${highestRevisionAppraiser.name}: ${(highestRevisionAppraiser.rejectionRate * 100).toFixed(0)}% revisions` : 'No appraiser data'}
          </p>
          <p className="text-[11px] mt-2 opacity-75">
            Revisions are appraisal reports sent back for correction or clarification.
          </p>
        </div>
        <div className="bg-white bg-opacity-60 rounded-lg p-3">
          <p className="text-xs uppercase font-semibold opacity-75">Breached Rules</p>
          <p className="text-sm mt-1">
            {drivers.length > 0 ? `${drivers.length} threshold${drivers.length !== 1 ? 's' : ''} breached` : 'No degradation thresholds breached'}
          </p>
          <p className="text-[11px] mt-2 opacity-75">
            These are deterministic checks that create ops alerts.
          </p>
        </div>
      </div>

      <div className="bg-white bg-opacity-60 rounded-lg p-3 mt-3">
        <p className="text-xs uppercase font-semibold opacity-75">Recommended Ops Move</p>
        <p className="text-sm mt-1">{primaryAction}</p>
      </div>
    </div>
  )
}
