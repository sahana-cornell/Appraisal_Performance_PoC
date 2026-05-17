import { getVendorsByRegion, getVendorStats } from '../data/vendors'
import { getRegionById } from '../data/regions'

const getTenureBenchmark = (vendor) => {
  if (vendor.tenure < 2) {
    return {
      label: 'Ramp-up baseline',
      turnaround: 12.5,
      onTime: 0.72,
      revision: 0.10,
      response: 5,
    }
  }

  if (vendor.tenure < 4) {
    return {
      label: 'Developing baseline',
      turnaround: 11,
      onTime: 0.80,
      revision: 0.07,
      response: 3.5,
    }
  }

  return {
    label: 'Established baseline',
    turnaround: 10,
    onTime: 0.86,
    revision: 0.05,
    response: 2.5,
  }
}

const getTenureAdjustedStatus = (vendor) => {
  const benchmark = getTenureBenchmark(vendor)
  const misses = [
    vendor.averageTurnaroundTime > benchmark.turnaround,
    vendor.onTimeCompletionRate < benchmark.onTime,
    vendor.rejectionRate > benchmark.revision,
    vendor.responseTime > benchmark.response,
  ].filter(Boolean).length

  if (misses >= 3) return { label: 'Below tenure expectation', color: 'text-red-700', bg: 'bg-red-50' }
  if (misses >= 1) return { label: 'Watch against tenure band', color: 'text-yellow-700', bg: 'bg-yellow-50' }
  return { label: 'Meeting tenure expectation', color: 'text-green-700', bg: 'bg-green-50' }
}

const VendorCard = ({ vendor, regionMaxCost, stats }) => {
  const ratingColor = 
    vendor.rating >= 4.0 ? 'text-green-600' :
    vendor.rating >= 3.5 ? 'text-blue-600' :
    vendor.rating >= 3.0 ? 'text-yellow-600' :
    'text-red-600'

  const trendIcon = 
    vendor.trend === 'up' ? '↑' :
    vendor.trend === 'down' ? '↓' :
    '→'

  const trendColor =
    vendor.trend === 'up' ? 'text-green-600' :
    vendor.trend === 'down' ? 'text-red-600' :
    'text-gray-600'

  const isWorstValue = vendor.costPerOrder === regionMaxCost
  const tenureBenchmark = getTenureBenchmark(vendor)
  const tenureStatus = getTenureAdjustedStatus(vendor)
  const isAtRisk = vendor.rating < 3.5 || vendor.trend === 'down' || tenureStatus.label === 'Below tenure expectation'

  const recommendation = isWorstValue && isAtRisk
    ? 'Reduce volume and review cost/value for this underperforming appraiser.'
    : isWorstValue
    ? 'Cost is highest in-region; monitor for value or shift orders if quality slips.'
    : isAtRisk
    ? 'Investigate appraiser availability and workload; consider temporary reroute.'
    : 'Continue to leverage this appraiser and preserve capacity.'

  const tenureLabel = vendor.tenure <= 2 ? 'New appraiser' : 'Established appraiser'

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h4 className="font-semibold text-gray-900">{vendor.name}</h4>
          <p className="text-xs text-gray-600 mt-1">{tenureLabel}</p>
        </div>
        <div className={`text-2xl font-bold ${ratingColor}`}>
          {vendor.rating.toFixed(1)}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs mb-3">
        <div>
          <p className="text-gray-600">On-Time Rate</p>
          <p className="font-bold text-gray-900">{(vendor.onTimeCompletionRate * 100).toFixed(0)}%</p>
        </div>
        <div>
          <p className="text-gray-600">Turnaround</p>
          <p className="font-bold text-gray-900">{vendor.averageTurnaroundTime.toFixed(1)}d</p>
        </div>
        <div>
          <p className="text-gray-600">Revision Rate</p>
          <p className="font-bold text-gray-900">{(vendor.rejectionRate * 100).toFixed(1)}%</p>
        </div>
        <div>
          <p className="text-gray-600">Availability</p>
          <p className="font-bold text-gray-900">{(vendor.vendorAvailability * 100).toFixed(0)}%</p>
        </div>
        <div>
          <p className="text-gray-600">Response Lag</p>
          <p className="font-bold text-gray-900">{vendor.responseTime.toFixed(1)}h</p>
        </div>
        <div>
          <p className="text-gray-600">Recent Orders</p>
          <p className="font-bold text-gray-900">{vendor.recentOrders}</p>
        </div>
        <div>
          <p className="text-gray-600">Capacity</p>
          <p className={`font-bold ${vendor.capacity > 100 ? 'text-red-600' : 'text-gray-900'}`}>
            {vendor.capacity}%
          </p>
          {vendor.capacity > 100 && (
            <p className="text-[11px] font-semibold text-red-700 mt-1">Over capacity</p>
          )}
        </div>
      </div>

      <div className="border-t pt-3 flex justify-between items-center gap-4">
        <div>
          <p className="text-xs text-gray-600">Trend</p>
          <p className={`text-lg font-bold ${trendColor}`}>{trendIcon}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-600">Fee per Order</p>
          <p className={`font-bold ${isWorstValue ? 'text-red-600' : 'text-gray-900'}`}>${vendor.costPerOrder}</p>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t text-xs text-gray-700 space-y-1">
        <p>{recommendation}</p>
        {isWorstValue && <p className="font-semibold text-red-600">Highest fee appraiser in this region</p>}
      </div>

      <div className={`mt-3 pt-3 border-t text-xs rounded ${tenureStatus.bg} p-3`}>
        <div className="flex justify-between gap-3">
          <p className={`font-semibold ${tenureStatus.color}`}>{tenureStatus.label}</p>
          <p className="text-gray-600">{tenureBenchmark.label}</p>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-2 text-gray-700">
          <p>Turnaround target: {tenureBenchmark.turnaround.toFixed(1)}d</p>
          <p>On-time target: {(tenureBenchmark.onTime * 100).toFixed(0)}%</p>
          <p>Revision max: {(tenureBenchmark.revision * 100).toFixed(0)}%</p>
          <p>Response max: {tenureBenchmark.response.toFixed(1)}h</p>
        </div>
      </div>

      {stats && (
        <div className="mt-3 pt-3 border-t text-xs text-gray-600">
          <p className="font-semibold text-gray-900 mb-2">Network comparison</p>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span>Rating vs network</span>
              <span className={vendor.rating >= stats.averageRating ? 'text-green-600 font-bold' : 'text-red-600'}>
                {vendor.rating >= stats.averageRating ? '+' : ''}{(vendor.rating - stats.averageRating).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>On-Time vs network</span>
              <span className={vendor.onTimeCompletionRate >= stats.averageOnTimeRate ? 'text-green-600 font-bold' : 'text-red-600'}>
                {vendor.onTimeCompletionRate >= stats.averageOnTimeRate ? '+' : ''}{((vendor.onTimeCompletionRate - stats.averageOnTimeRate) * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function VendorScorecard({ regionId }) {
  const region = getRegionById(regionId)
  const vendors = getVendorsByRegion(regionId)
  const stats = getVendorStats(regionId)
  const vendorCount = vendors.length

  if (!region) {
    return <div className="text-center text-gray-500 py-8">No region selected</div>
  }

  if (vendorCount === 0) {
    return <div className="text-center text-gray-500 py-8">No appraisers in this region</div>
  }

  const regionMaxCost = Math.max(...vendors.map((vendor) => vendor.costPerOrder))
  const sortedVendors = [...vendors].sort((a, b) => b.rating - a.rating)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Appraiser Performance Scorecards
        </h2>
        <p className="text-sm text-gray-600">
          Individual appraiser benchmarking for {region.name}
        </p>
        <p className="text-xs text-gray-500 mt-2">
          Showing {vendorCount} appraiser scorecard{vendorCount !== 1 ? 's' : ''} for this region. Benchmarks adjust by tenure band so newer appraisers are not judged against mature-provider expectations.
        </p>
      </div>

      {/* Network Stats Summary */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-3 text-sm">
          Network Benchmarks
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-blue-700 text-xs uppercase">Avg Rating</p>
            <p className="font-bold text-blue-900">{stats.averageRating.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-blue-700 text-xs uppercase">Avg Turnaround</p>
            <p className="font-bold text-blue-900">{stats.averageTurnaroundTime.toFixed(1)}d</p>
          </div>
          <div>
            <p className="text-blue-700 text-xs uppercase">Avg On-Time</p>
            <p className="font-bold text-blue-900">{(stats.averageOnTimeRate * 100).toFixed(0)}%</p>
          </div>
          <div>
            <p className="text-blue-700 text-xs uppercase">Total Appraisers</p>
            <p className="font-bold text-blue-900">{stats.totalVendors}</p>
          </div>
        </div>
      </div>

      {/* Vendor Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedVendors.map((vendor) => (
          <VendorCard key={vendor.id} vendor={vendor} regionMaxCost={regionMaxCost} stats={stats} />
        ))}
      </div>

      {/* Legend */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-xs">
        <h3 className="font-semibold text-gray-900 mb-2">
          Rating Scale
        </h3>
        <div className="space-y-1 text-gray-700">
          <p><span className="font-bold text-green-600">4.0+</span> Excellent performer</p>
          <p><span className="font-bold text-blue-600">3.5-3.9</span> Strong performer</p>
          <p><span className="font-bold text-yellow-600">3.0-3.4</span> Acceptable performer</p>
          <p><span className="font-bold text-red-600">&lt;3.0</span> At-risk appraiser</p>
        </div>
      </div>
    </div>
  )
}
