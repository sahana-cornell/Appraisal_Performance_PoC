import { useState } from 'react'
import HeatMap from './HeatMap'
import KPIPanel from './KPIPanel'
import RootCauseAnalysis from './RootCauseAnalysis'
import AlertsFeed from './AlertsFeed'
import VendorScorecard from './VendorScorecard'
import RegionDetails from './RegionDetails'
import PatternInsights from './PatternInsights'
import { getAllAlerts, getCriticalAlertCount } from '../data/alerts'
import { getRegionsWithComputedHealth } from '../data/regions'

export default function Dashboard() {
  const [selectedRegion, setSelectedRegion] = useState('tx-houston')
  const [showRegionDetails, setShowRegionDetails] = useState(false)
  const [activeTab, setActiveTab] = useState('overview') // 'overview', 'details', 'vendors'

  const criticalCount = getCriticalAlertCount()
  const alerts = getAllAlerts('priority')
  const regions = getRegionsWithComputedHealth()
  const criticalMarkets = regions.filter((region) => region.severity === 'critical').length
  const topAlert = alerts.find((alert) => alert.severity !== 'healthy')
  const lastUpdated = new Date().toLocaleTimeString()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Appraisal Performance Monitor
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Regional Appraisal Analytics Dashboard
              </p>
            </div>
            <div className="flex items-center gap-4">
              {criticalCount > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-2">
                  <p className="text-sm font-medium text-red-700">
                    {criticalCount} Critical Alert{criticalCount !== 1 ? 's' : ''}
                  </p>
                </div>
              )}
              <div className="text-right text-xs text-gray-500">
                <p>Last updated: {new Date().toLocaleTimeString()}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <p className="text-xs uppercase font-semibold text-gray-500">Critical Markets</p>
            <p className="text-3xl font-bold text-red-600 mt-2">{criticalMarkets}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <p className="text-xs uppercase font-semibold text-gray-500">Generated Alerts</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{alerts.length}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <p className="text-xs uppercase font-semibold text-gray-500">Top Ops Action</p>
            <p className="text-sm font-semibold text-gray-900 mt-2">
              {topAlert ? topAlert.title : 'No action required'}
            </p>
          </div>
        </section>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'overview'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('details')}
            className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'details'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Region Details
          </button>
          <button
            onClick={() => setActiveTab('vendors')}
            className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'vendors'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Appraiser Scorecards
          </button>
          <button
            onClick={() => setActiveTab('alerts')}
            className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'alerts'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Alerts & Actions
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Heat Map Section */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Regional Performance Heat Map
              </h2>
              <div className="bg-white rounded-lg shadow p-6">
                <HeatMap selectedRegion={selectedRegion} onRegionSelect={setSelectedRegion} lastUpdated={lastUpdated} />
              </div>
            </section>

            {/* KPI Dashboard */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Key Performance Indicators
              </h2>
              <KPIPanel regionId={selectedRegion} />
            </section>

            {/* Market Signal */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Market Signal
              </h2>
              <PatternInsights regionId={selectedRegion} />
            </section>

            {/* Root Cause Analysis */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                AI Root Cause Analysis
              </h2>
              <div className="bg-white rounded-lg shadow p-6">
                <RootCauseAnalysis regionId={selectedRegion} />
              </div>
            </section>
          </div>
        )}

        {/* Details Tab */}
        {activeTab === 'details' && (
          <RegionDetails regionId={selectedRegion} />
        )}

        {/* Vendors Tab */}
        {activeTab === 'vendors' && (
          <VendorScorecard regionId={selectedRegion} />
        )}

        {/* Alerts Tab */}
        {activeTab === 'alerts' && (
          <AlertsFeed />
        )}
      </main>
    </div>
  )
}
