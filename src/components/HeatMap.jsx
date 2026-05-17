import { getRegionsWithComputedHealth, getSeverityColor, getHealthSeverity } from '../data/regions'

const trendLabel = (trend) => {
  if (trend === 'up') return '↑ Recovering'
  if (trend === 'down') return '↓ Worsening'
  return '→ Stable'
}

const ScoreSparkline = ({ data }) => {
  if (!data || data.length === 0) return null

  const width = 120
  const height = 60
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const points = data.map((value, idx) => {
    const x = (idx / (data.length - 1)) * width
    const y = height - ((value - min) / range) * (height - 12) - 4
    return `${x},${y}`
  }).join(' ')

  return (
    <svg width={width} height={height} className="mx-auto mt-3" aria-hidden="true">
      <polyline
        fill="none"
        stroke="rgba(255,255,255,0.92)"
        strokeWidth="2"
        strokeLinecap="round"
        points={points}
      />
      <circle cx={width} cy={height - ((data[data.length - 1] - min) / range) * (height - 12) - 4} r="3" fill="#fff" />
    </svg>
  )
}

export default function HeatMap({ selectedRegion, onRegionSelect, lastUpdated }) {
  const regions = getRegionsWithComputedHealth()
  const trendWindowLabel = 'Trailing 14 days'

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-gray-600">
          Click a region to view detailed metrics and AI analysis
        </p>
        <p className="text-xs font-medium text-gray-500">
          Trend window: {trendWindowLabel}
        </p>
      </div>
      
      {/* Simple Grid Heat Map */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {regions.map((region) => (
          <button
            key={region.id}
            onClick={() => onRegionSelect(region.id)}
            className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
              selectedRegion === region.id
                ? 'border-blue-500 shadow-lg ring-2 ring-blue-200'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            style={{
              backgroundColor: getSeverityColor(getHealthSeverity(region.healthScore)),
              opacity: selectedRegion === region.id ? 1 : 0.7,
            }}
          >
            <div className="text-white text-center">
              <p className="font-bold text-sm">{region.name}</p>
              <p className="text-xs mt-1 opacity-90">
                Score: {region.healthScore}
              </p>
              <p className="text-xs opacity-75 mt-0.5">
                {region.ordersThisWeek} orders
              </p>
              <ScoreSparkline data={region.healthHistory} />
              <p className="text-[11px] opacity-75 mt-1">
                {trendWindowLabel}
              </p>
              <p className="text-xs opacity-90 mt-3">
                {trendLabel(region.trend)}
              </p>
            </div>
          </button>
        ))}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-6 mt-6 p-4 bg-gray-100 rounded-lg text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded" style={{ backgroundColor: '#10b981' }}></div>
          <span>Healthy (85+)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded" style={{ backgroundColor: '#6b7280' }}></div>
          <span>Neutral (70-84)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded" style={{ backgroundColor: '#f59e0b' }}></div>
          <span>Warning (45-69)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded" style={{ backgroundColor: '#dc2626' }}></div>
          <span>Critical (&lt;45)</span>
        </div>
      </div>

      <p className="text-xs text-gray-500 mt-2">
        Score is a weighted composite of appraisal turnaround time, order aging, response lag, appraiser availability, on-time completion, revision rate, and capacity utilization.
      </p>
      <p className="text-xs text-gray-500">
        Last refreshed: {lastUpdated}
      </p>
    </div>
  )
}
