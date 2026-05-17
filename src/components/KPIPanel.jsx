import { getRegionById, getNetworkAverages } from '../data/regions'
import { getVendorsByRegion } from '../data/vendors'

const formatValue = (value, format) => {
  if (format === 'percent') return `${(value * 100).toFixed(1)}%`
  if (format === 'days') return `${value.toFixed(1)} days`
  if (format === 'hours') return `${value.toFixed(1)} hrs`
  return value
}

const isMetricGood = (value, target, format, higherIsBetter = true) => {
  if (format === 'percent') {
    return higherIsBetter ? value >= target : value <= target
  }
  if (format === 'days') return value <= target
  if (format === 'hours') return value <= target
  return true
}

const Sparkline = ({ history }) => {
  if (!history || history.length === 0) return null
  const min = Math.min(...history)
  const max = Math.max(...history)
  const range = max - min || 1

  return (
    <div className="flex items-end gap-1 mt-3" style={{ height: 60 }}>
      {history.map((value, idx) => {
        const normalized = ((value - min) / range) * 100
        return (
          <span
            key={idx}
            className="w-1 rounded-sm bg-blue-400"
            style={{ height: `${Math.max(18, normalized)}%` }}
          />
        )
      })}
    </div>
  )
}

const getTrendLabel = (delta, format) => {
  if (delta == null) return null
  if (format === 'days') {
    return delta > 0 ? `↑ +${delta.toFixed(1)}d vs prior` : `↓ ${Math.abs(delta).toFixed(1)}d vs prior`
  }
  if (format === 'hours') {
    return delta > 0 ? `↑ +${delta.toFixed(1)}h vs prior` : `↓ ${Math.abs(delta).toFixed(1)}h vs prior`
  }
  if (format === 'percent') {
    return delta > 0 ? `↑ +${(delta * 100).toFixed(1)}pp vs prior` : `↓ ${Math.abs(delta * 100).toFixed(1)}pp vs prior`
  }
  return null
}

const KPICard = ({ label, value, target, format = 'number', higherIsBetter = true, delta, history }) => {
  const displayValue = formatValue(value, format)
  const comparison = target != null ? (format === 'percent' ? `Target: ${(target * 100).toFixed(0)}%` : `Target: ${target}${format === 'days' ? ' days' : ''}`) : null
  const good = isMetricGood(value, target, format, higherIsBetter)
  const trendLabel = getTrendLabel(delta, format)

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold">
        {label}
      </p>
      <p className={`text-2xl font-bold mt-2 ${good ? 'text-green-600' : 'text-red-600'}`}>
        {displayValue}
      </p>
      {comparison && (
        <p className="text-xs text-gray-600 mt-2">{comparison}</p>
      )}
      {trendLabel && (
        <p className="text-xs mt-2 text-gray-700">{trendLabel}</p>
      )}
      {history && <Sparkline history={history} />}
    </div>
  )
}

export default function KPIPanel({ regionId }) {
  const region = getRegionById(regionId)
  const vendors = getVendorsByRegion(regionId)
  const networkAvg = getNetworkAverages()

  if (!region) {
    return <div className="text-center text-gray-500 py-8">No region selected</div>
  }

  const vendorCount = vendors.length || region.activeVendors
  const averageOrdersPerVendor = (region.ordersThisWeek / vendorCount).toFixed(1)
  const targetOrdersPerAppraiser = 10
  const recommendedVendors = Math.ceil(region.ordersThisWeek / targetOrdersPerAppraiser)

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {region.name}
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Region-level KPIs with trend direction and movement versus the prior period.
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            region.severity === 'critical' ? 'bg-red-100 text-red-800' :
            region.severity === 'warning' ? 'bg-yellow-100 text-yellow-800' :
            region.severity === 'healthy' ? 'bg-green-100 text-green-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {region.status.charAt(0).toUpperCase() + region.status.slice(1)}
          </span>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            region.trend === 'up' ? 'bg-green-100 text-green-800' :
            region.trend === 'down' ? 'bg-red-100 text-red-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {region.trend === 'up' ? '↑ Improving' :
             region.trend === 'down' ? '↓ Declining' :
             '→ Stable'}
          </span>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <KPICard
          label="Turnaround Time"
          value={region.metrics.turnaroundTime}
          target={10}
          format="days"
          delta={region.metricsChange?.turnaroundTime}
          history={region.history?.turnaroundTime}
        />
        <KPICard
          label="Appraiser Availability"
          value={region.metrics.vendorAvailability}
          target={0.95}
          format="percent"
          delta={region.metricsChange?.vendorAvailability}
          history={region.history?.vendorAvailability}
        />
        <KPICard
          label="Reassignment Rate"
          value={region.metrics.reassignmentRate}
          target={0.05}
          format="percent"
          higherIsBetter={false}
          delta={region.metricsChange?.reassignmentRate}
          history={region.history?.reassignmentRate}
        />
        <KPICard
          label="On-Time Completion"
          value={region.metrics.onTimeCompletion}
          target={0.90}
          format="percent"
          delta={region.metricsChange?.onTimeCompletion}
          history={region.history?.onTimeCompletion}
        />
        <KPICard
          label="Capacity Utilization"
          value={region.metrics.capacityUtilization}
          target={0.80}
          format="percent"
          higherIsBetter={false}
          delta={region.metricsChange?.capacityUtilization}
          history={region.history?.capacityUtilization}
        />
        <KPICard
          label="Revision Rate"
          value={region.metrics.rejectionRate}
          target={0.05}
          format="percent"
          higherIsBetter={false}
          delta={region.metricsChange?.rejectionRate}
          history={region.history?.rejectionRate}
        />
        <KPICard
          label="Orders Aging Over SLA"
          value={region.metrics.ordersAgingOverSla}
          target={0.10}
          format="percent"
          higherIsBetter={false}
          delta={region.metricsChange?.ordersAgingOverSla}
          history={region.history?.ordersAgingOverSla}
        />
        <KPICard
          label="Response Lag"
          value={region.metrics.responseLag}
          target={2.5}
          format="hours"
          higherIsBetter={false}
          delta={region.metricsChange?.responseLag}
          history={region.history?.responseLag}
        />
      </div>

      {/* Regional Context */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
        <h4 className="font-semibold text-blue-900 text-sm mb-3">
          Regional Context
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-gray-600 text-xs uppercase">Orders This Week</p>
            <p className="font-bold text-blue-900">{region.ordersThisWeek}</p>
          </div>
          <div>
            <p className="text-gray-600 text-xs uppercase">Active Appraiser Scorecards</p>
            <p className="font-bold text-blue-900">{vendorCount}</p>
          </div>
          <div>
            <p className="text-gray-600 text-xs uppercase">Average Orders / Appraiser</p>
            <p className="font-bold text-blue-900">{averageOrdersPerVendor}</p>
          </div>
          <div>
            <p className="text-gray-600 text-xs uppercase">Recommended Appraiser Count</p>
            <p className="font-bold text-blue-900">{recommendedVendors}</p>
          </div>
          <div>
            <p className="text-gray-600 text-xs uppercase">Network Average Turnaround</p>
            <p className="font-bold text-blue-900">{networkAvg.turnaroundTime.toFixed(1)} days</p>
          </div>
          <div>
            <p className="text-gray-600 text-xs uppercase">Health Score</p>
            <p className="font-bold text-blue-900">{region.healthScore}/100</p>
          </div>
          <div>
            <p className="text-gray-600 text-xs uppercase">Oldest Open Order</p>
            <p className="font-bold text-blue-900">{region.metrics.oldestOpenOrderAge} days</p>
          </div>
          <div>
            <p className="text-gray-600 text-xs uppercase">Adaptive Turnaround Baseline</p>
            <p className="font-bold text-blue-900">{region.adaptiveBaseline.turnaroundTime.toFixed(1)} days</p>
          </div>
        </div>
      </div>

      {/* Top Issues */}
      {region.topIssues.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
          <h4 className="font-semibold text-yellow-900 text-sm mb-3">
            Key Issues
          </h4>
          <ul className="space-y-2">
            {region.topIssues.map((issue, idx) => (
              <li key={idx} className="text-sm text-yellow-800 flex items-start gap-2">
                <span className="text-yellow-600 mt-0.5">•</span>
                <span>{issue}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
