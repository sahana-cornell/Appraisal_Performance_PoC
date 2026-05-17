import { getRegionById } from '../data/regions'
import { getVendorsByRegion } from '../data/vendors'
import { getAlertsByRegion } from '../data/alerts'

export default function RegionDetails({ regionId }) {
  const region = getRegionById(regionId)
  const vendors = getVendorsByRegion(regionId)
  const alerts = getAlertsByRegion(regionId)

  if (!region) {
    return <div className="text-center text-gray-500 py-8">No region selected</div>
  }

  const vendorCount = vendors.length || region.activeVendors
  const severityColor = {
    critical: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-900' },
    warning: { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-900' },
    healthy: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-900' },
    neutral: { bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-900' }
  }

  const color = severityColor[region.severity]
  const targetOrdersPerAppraiser = 10
  const avgOrdersPerVendor = vendorCount ? Math.round(region.ordersThisWeek / vendorCount) : 'N/A'
  const recommendedVendorCount = Math.ceil(region.ordersThisWeek / targetOrdersPerAppraiser)
  const vendorShortage = Math.max(0, recommendedVendorCount - vendorCount)
  const showStaffingAlert = vendorShortage > 0 && (region.healthScore < 60 || ['critical', 'degrading'].includes(region.status?.toLowerCase()))

  return (
    <div className="space-y-6">
      {/* Region Header */}
      <div className={`${color.bg} border ${color.border} rounded-lg p-6`}>
        <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-start mb-4">
          <div>
            <h2 className={`text-2xl font-bold ${color.text}`}>
              {region.name}
            </h2>
            <p className={`${color.text} opacity-75 mt-1`}>
              {region.name} • {region.county} County, {region.state}
            </p>
          </div>
          <div className="text-right">
            <div className={`text-4xl font-bold ${color.text}`}>
              {region.healthScore}
            </div>
            <p className={`text-sm ${color.text} opacity-75`}>
              Health Score
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Updated: {new Date().toLocaleTimeString()}
            </p>
          </div>
        </div>

        {/* Status Badges */}
        <div className="flex flex-wrap gap-2">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            region.severity === 'critical' ? 'bg-red-100 text-red-800' :
            region.severity === 'warning' ? 'bg-yellow-100 text-yellow-800' :
            region.severity === 'healthy' ? 'bg-green-100 text-green-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {region.status.charAt(0).toUpperCase() + region.status.slice(1)}
          </span>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
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

      {/* Metrics Overview */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          Performance Metrics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <p className="text-xs uppercase text-gray-600 font-semibold mb-1">
              Turnaround Time
            </p>
            <div className="flex justify-between items-end">
              <p className="text-2xl font-bold text-gray-900">
                {region.metrics.turnaroundTime.toFixed(1)}
              </p>
              <p className="text-xs text-gray-600">days</p>
            </div>
            <p className="text-xs text-gray-600 mt-2">Target: 7-10 days</p>
            {region.metricsChange?.turnaroundTime != null && (
              <p className="text-xs text-gray-700 mt-2">
                {region.metricsChange.turnaroundTime > 0 ? '↑' : '↓'} {Math.abs(region.metricsChange.turnaroundTime).toFixed(1)} days vs prior period
              </p>
            )}
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <p className="text-xs uppercase text-gray-600 font-semibold mb-1">
              Appraiser Availability
            </p>
            <div className="flex justify-between items-end">
              <p className="text-2xl font-bold text-gray-900">
                {(region.metrics.vendorAvailability * 100).toFixed(0)}%
              </p>
            </div>
            <p className="text-xs text-gray-600 mt-2">Target: 95%</p>
            {region.metricsChange?.vendorAvailability != null && (
              <p className="text-xs text-gray-700 mt-2">
                {region.metricsChange.vendorAvailability > 0 ? '↑' : '↓'} {(Math.abs(region.metricsChange.vendorAvailability) * 100).toFixed(1)}pp vs prior period
              </p>
            )}
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <p className="text-xs uppercase text-gray-600 font-semibold mb-1">
              Reassignment Rate
            </p>
            <div className="flex justify-between items-end">
              <p className="text-2xl font-bold text-gray-900">
                {(region.metrics.reassignmentRate * 100).toFixed(0)}%
              </p>
            </div>
            <p className="text-xs text-gray-600 mt-2">Target: &lt;5%</p>
            {region.metricsChange?.reassignmentRate != null && (
              <p className="text-xs text-gray-700 mt-2">
                {region.metricsChange.reassignmentRate > 0 ? '↑' : '↓'} {(Math.abs(region.metricsChange.reassignmentRate) * 100).toFixed(1)}pp vs prior period
              </p>
            )}
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <p className="text-xs uppercase text-gray-600 font-semibold mb-1">
              On-Time Completion
            </p>
            <div className="flex justify-between items-end">
              <p className="text-2xl font-bold text-gray-900">
                {(region.metrics.onTimeCompletion * 100).toFixed(0)}%
              </p>
            </div>
            <p className="text-xs text-gray-600 mt-2">Target: 90%</p>
            {region.metricsChange?.onTimeCompletion != null && (
              <p className="text-xs text-gray-700 mt-2">
                {region.metricsChange.onTimeCompletion > 0 ? '↑' : '↓'} {(Math.abs(region.metricsChange.onTimeCompletion) * 100).toFixed(1)}pp vs prior period
              </p>
            )}
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <p className="text-xs uppercase text-gray-600 font-semibold mb-1">
              Capacity Utilization
            </p>
            <div className="flex justify-between items-end">
              <p className="text-2xl font-bold text-gray-900">
                {(region.metrics.capacityUtilization * 100).toFixed(0)}%
              </p>
            </div>
            <p className="text-xs text-gray-600 mt-2">Target: 75-85%</p>
            {region.metricsChange?.capacityUtilization != null && (
              <p className="text-xs text-gray-700 mt-2">
                {region.metricsChange.capacityUtilization > 0 ? '↑' : '↓'} {(Math.abs(region.metricsChange.capacityUtilization) * 100).toFixed(1)}pp vs prior period
              </p>
            )}
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <p className="text-xs uppercase text-gray-600 font-semibold mb-1">
              Revision Rate
            </p>
            <div className="flex justify-between items-end">
              <p className="text-2xl font-bold text-gray-900">
                {(region.metrics.rejectionRate * 100).toFixed(1)}%
              </p>
            </div>
            <p className="text-xs text-gray-600 mt-2">Target: &lt;5%</p>
            {region.metricsChange?.rejectionRate != null && (
              <p className="text-xs text-gray-700 mt-2">
                {region.metricsChange.rejectionRate > 0 ? '↑' : '↓'} {(Math.abs(region.metricsChange.rejectionRate) * 100).toFixed(1)}pp vs prior period
              </p>
            )}
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <p className="text-xs uppercase text-gray-600 font-semibold mb-1">
              Orders Aging Over SLA
            </p>
            <div className="flex justify-between items-end">
              <p className="text-2xl font-bold text-gray-900">
                {(region.metrics.ordersAgingOverSla * 100).toFixed(0)}%
              </p>
            </div>
            <p className="text-xs text-gray-600 mt-2">Target: &lt;10%</p>
            {region.metricsChange?.ordersAgingOverSla != null && (
              <p className="text-xs text-gray-700 mt-2">
                {region.metricsChange.ordersAgingOverSla > 0 ? '↑' : '↓'} {(Math.abs(region.metricsChange.ordersAgingOverSla) * 100).toFixed(1)}pp vs prior period
              </p>
            )}
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <p className="text-xs uppercase text-gray-600 font-semibold mb-1">
              Response Lag
            </p>
            <div className="flex justify-between items-end">
              <p className="text-2xl font-bold text-gray-900">
                {region.metrics.responseLag.toFixed(1)}
              </p>
              <p className="text-xs text-gray-600">hours</p>
            </div>
            <p className="text-xs text-gray-600 mt-2">Target: &lt;2.5 hours</p>
            {region.metricsChange?.responseLag != null && (
              <p className="text-xs text-gray-700 mt-2">
                {region.metricsChange.responseLag > 0 ? '↑' : '↓'} {Math.abs(region.metricsChange.responseLag).toFixed(1)}h vs prior period
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Regional Context */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          Regional Context
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <p className="text-xs uppercase text-gray-600 font-semibold">
              Orders This Week
            </p>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {region.ordersThisWeek}
            </p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <p className="text-xs uppercase text-gray-600 font-semibold">
              Avg Orders / Appraiser
            </p>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {avgOrdersPerVendor}
            </p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <p className="text-xs uppercase text-gray-600 font-semibold">
              Recommended Appraisers
            </p>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {recommendedVendorCount}
            </p>
            <p className="text-xs text-gray-600 mt-2">
              Target: {targetOrdersPerAppraiser} appraisal orders/appraiser max → {region.ordersThisWeek} ÷ {targetOrdersPerAppraiser} = {recommendedVendorCount} appraisers needed
            </p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <p className="text-xs uppercase text-gray-600 font-semibold">
              Oldest Open Order
            </p>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {region.metrics.oldestOpenOrderAge}d
            </p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <p className="text-xs uppercase text-gray-600 font-semibold">
              Adaptive Turnaround Baseline
            </p>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {region.adaptiveBaseline.turnaroundTime.toFixed(1)}d
            </p>
          </div>
        </div>
      </div>

      {/* Key Issues */}
      {region.topIssues.length > 0 && (
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Key Issues
          </h3>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 space-y-2">
            {region.topIssues.map((issue, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <span className="text-yellow-600 font-bold text-lg mt-0.5">!</span>
                <p className="text-yellow-900">{issue}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Alerts for this Region */}
      {alerts.length > 0 && (
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Active Alerts
          </h3>
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div 
                key={alert.id}
                className={`border rounded-lg p-4 ${
                  alert.severity === 'critical' ? 'bg-red-50 border-red-200' :
                  alert.severity === 'warning' ? 'bg-yellow-50 border-yellow-200' :
                  'bg-green-50 border-green-200'
                }`}
              >
                <div className="flex flex-wrap justify-between gap-3 mb-2">
                  <h4 className={`font-semibold ${
                    alert.severity === 'critical' ? 'text-red-900' :
                    alert.severity === 'warning' ? 'text-yellow-900' :
                    'text-green-900'
                  }`}>
                    {alert.title}
                  </h4>
                  <div className="space-x-2 text-xs">
                    <span className="inline-flex px-2 py-1 bg-white rounded-full text-gray-700 border border-gray-200">
                      {alert.status}
                    </span>
                    <span className="inline-flex px-2 py-1 bg-white rounded-full text-gray-700 border border-gray-200">
                      Assigned to {alert.assignedTo}
                    </span>
                  </div>
                </div>
                <p className={`text-sm ${
                  alert.severity === 'critical' ? 'text-red-800' :
                  alert.severity === 'warning' ? 'text-yellow-800' :
                  'text-green-800'
                }`}>
                  {alert.message}
                </p>
                <div className="bg-white bg-opacity-50 rounded p-3 mt-3">
                  <p className="text-xs font-medium text-gray-700 mb-1">Suggested Action:</p>
                  <p className="text-sm text-gray-800">
                    {alert.suggestedAction}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Appraisers in Region */}
      {vendors.length > 0 && (
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Appraisers Operating in This Region ({vendors.length})
          </h3>
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-900">Appraiser</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-900">Rating</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-900">On-Time</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-900">Turnaround</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-900">Availability</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-900">Capacity</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-900">Fee/Order</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {vendors.map((vendor) => (
                  <tr key={vendor.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {vendor.name}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`font-bold ${
                        vendor.rating >= 4.0 ? 'text-green-600' :
                        vendor.rating >= 3.5 ? 'text-blue-600' :
                        vendor.rating >= 3.0 ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {vendor.rating.toFixed(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {(vendor.onTimeCompletionRate * 100).toFixed(0)}%
                    </td>
                    <td className="px-4 py-3">
                      {vendor.averageTurnaroundTime.toFixed(1)}d
                    </td>
                    <td className="px-4 py-3">
                      {(vendor.vendorAvailability * 100).toFixed(0)}%
                    </td>
                    <td className={`px-4 py-3 ${vendor.capacity > 100 ? 'text-red-600 font-semibold' : 'text-gray-900'}`}>
                      {vendor.capacity}%
                      {vendor.capacity > 100 && (
                        <span className="ml-2 inline-flex rounded-full bg-red-100 px-2 py-0.5 text-[11px] font-semibold text-red-800">
                          Over capacity
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      ${vendor.costPerOrder}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showStaffingAlert && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
          <p className="text-sm font-semibold text-red-900">
            Region is critically understaffed.
          </p>
          <p className="text-sm text-red-800">
            {vendorShortage} additional appraiser{vendorShortage !== 1 ? 's' : ''} required to meet order demand at target capacity.
          </p>
        </div>
      )}
    </div>
  )
}
