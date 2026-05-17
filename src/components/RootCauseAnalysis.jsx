import { useState } from 'react'
import { getRegionById } from '../data/regions'
import { generateRootCauseAnalysis } from '../utils/huggingface'

export default function RootCauseAnalysis({ regionId }) {
  const [loading, setLoading] = useState(false)
  const [analysis, setAnalysis] = useState(null)
  const [error, setError] = useState(null)
  const [expanded, setExpanded] = useState(false)

  const region = getRegionById(regionId)

  const handleAnalyze = async () => {
    setExpanded(true)
    setLoading(true)
    setError(null)
    setAnalysis(null)

    try {
      const result = await generateRootCauseAnalysis(region)
      setAnalysis(result)
    } catch (err) {
      setError(err.message || 'Unable to generate analysis. Check your Hugging Face key and network connection.')
    } finally {
      setLoading(false)
    }
  }

  if (!region) {
    return <div className="text-center text-gray-500 py-8">No region selected</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {region.name}
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            AI-powered analysis of performance trends and root causes
          </p>
        </div>
        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 font-medium text-sm transition-colors"
        >
          {loading ? 'Analyzing...' : 'Analyze Region'}
        </button>
      </div>

      {!expanded && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
          <p className="text-xs text-gray-500">
            Click the button to run a region-specific root cause review.
          </p>
        </div>
      )}

      {expanded && !analysis && !loading && !error && (
        <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <p className="text-gray-600 text-sm mb-4">
            Click "Analyze Region" to generate an AI-powered root cause analysis of {region.name}'s performance.
          </p>
          <p className="text-xs text-gray-500">
            The system will analyze appraiser behavior, order volume, capacity, and timing data to identify why performance is changing.
          </p>
        </div>
      )}

      {loading && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
          <div className="inline-block">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
          <p className="text-gray-700 font-medium mt-4">
            Analyzing {region.name} performance data...
          </p>
          <p className="text-xs text-gray-600 mt-2">
            This may take a moment as we analyze patterns across appraisers and metrics.
          </p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 font-medium">Error</p>
          <p className="text-red-700 text-sm mt-1">{error}</p>
          <button
            onClick={handleAnalyze}
            className="mt-3 text-sm text-red-700 hover:text-red-800 font-medium"
          >
            Try again
          </button>
        </div>
      )}

      {analysis && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 space-y-4">
          <div>
            <h4 className="font-semibold text-green-900 mb-2">Summary</h4>
            <p className="text-green-800 text-sm leading-relaxed">
              {analysis.summary}
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-green-900 mb-2">Findings</h4>
            <ul className="space-y-2">
              {analysis.findings.map((finding, idx) => (
                <li key={idx} className="text-sm text-green-800 flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>{finding}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-green-900 mb-2">Recommended Actions</h4>
            <ol className="space-y-2">
              {analysis.recommendations.map((rec, idx) => (
                <li key={idx} className="text-sm text-green-800 flex items-start gap-2">
                  <span className="text-green-600 font-bold">{idx + 1}.</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}
    </div>
  )
}
