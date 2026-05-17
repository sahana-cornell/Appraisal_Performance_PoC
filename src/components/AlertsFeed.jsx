import { useState } from 'react'
import { getAllAlerts, getAlertCountBySeverity, severityIcon } from '../data/alerts'

const AlertItem = ({ alert, status, onStatusChange }) => {
  const formatTime = (date) => {
    const now = new Date()
    const diff = now - date
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)

    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return date.toLocaleDateString()
  }

  const severityStyles = {
    critical: 'bg-red-50 border-red-200',
    warning: 'bg-yellow-50 border-yellow-200',
    healthy: 'bg-green-50 border-green-200'
  }

  const textStyles = {
    critical: 'text-red-900',
    warning: 'text-yellow-900',
    healthy: 'text-green-900'
  }

  return (
    <div className={`border rounded-lg p-4 ${severityStyles[alert.severity]}`}>
      <div className="flex gap-3">
        <div className="text-2xl mt-1">{severityIcon[alert.severity]}</div>
        <div className="flex-1">
          <div className="flex justify-between items-start mb-1">
            <h4 className={`font-semibold ${textStyles[alert.severity]}`}>
              {alert.title}
            </h4>
            <span className="text-xs text-gray-600 whitespace-nowrap ml-2">
              {formatTime(alert.timestamp)}
            </span>
          </div>
          <p className={`text-sm ${textStyles[alert.severity]} mb-3`}>
            {alert.message}
          </p>
          <div className="bg-white bg-opacity-50 rounded p-3 mb-3">
            <p className="text-xs font-medium text-gray-700 mb-1">Suggested Action:</p>
            <p className="text-sm text-gray-800">
              {alert.suggestedAction}
            </p>
          </div>
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="px-2 py-1 bg-white bg-opacity-50 rounded text-xs font-medium text-gray-700">
              {alert.targetTeam}
            </span>
            <span className={`px-2 py-1 rounded text-xs font-medium ${
              alert.actionType === 'urgent' ? 'bg-red-100 text-red-800' :
              alert.actionType === 'escalate' ? 'bg-red-100 text-red-800' :
              alert.actionType === 'review' ? 'bg-yellow-100 text-yellow-800' :
              alert.actionType === 'proactive' ? 'bg-blue-100 text-blue-800' :
              alert.actionType === 'investigate' ? 'bg-purple-100 text-purple-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {alert.actionType.charAt(0).toUpperCase() + alert.actionType.slice(1)}
            </span>
            <span className="px-2 py-1 bg-white bg-opacity-50 rounded text-xs font-medium text-gray-700">
              Priority {alert.priority}
            </span>
          </div>
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="px-2 py-1 bg-white bg-opacity-50 rounded text-xs font-medium text-gray-700">
              Assigned to {alert.assignedTo}
            </span>
            <span className="px-2 py-1 bg-white bg-opacity-50 rounded text-xs font-medium text-gray-700">
              Status: {status}
            </span>
            {alert.impactedOrders != null && (
              <span className="px-2 py-1 bg-white bg-opacity-50 rounded text-xs font-medium text-gray-700">
                {alert.impactedOrders} order{alert.impactedOrders !== 1 ? 's' : ''} at risk
              </span>
            )}
            {alert.rule && (
              <span className="px-2 py-1 bg-white bg-opacity-50 rounded text-xs font-medium text-gray-700">
                Rule: {alert.rule.replaceAll('_', ' ')}
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {['New', 'In Progress', 'Resolved'].map((nextStatus) => (
              <button
                key={nextStatus}
                onClick={() => onStatusChange(alert.id, nextStatus)}
                className={`px-3 py-1 rounded text-xs font-medium border ${
                  status === nextStatus
                    ? 'bg-gray-900 text-white border-gray-900'
                    : 'bg-white bg-opacity-70 text-gray-700 border-gray-200 hover:border-gray-400'
                }`}
              >
                {nextStatus}
              </button>
            ))}
            <span className="px-2 py-1 bg-white bg-opacity-50 rounded text-xs font-medium text-gray-700">
              Deterministic alert
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AlertsFeed() {
  const alerts = getAllAlerts('priority')
  const alertCounts = getAlertCountBySeverity()
  const [statusOverrides, setStatusOverrides] = useState({})

  const handleStatusChange = (alertId, status) => {
    setStatusOverrides((current) => ({
      ...current,
      [alertId]: status,
    }))
  }

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-xs uppercase tracking-wide text-red-700 font-semibold">
            Critical Alerts
          </p>
          <p className="text-3xl font-bold text-red-700 mt-2">
            {alertCounts.critical}
          </p>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-xs uppercase tracking-wide text-yellow-700 font-semibold">
            Warning Alerts
          </p>
          <p className="text-3xl font-bold text-yellow-700 mt-2">
            {alertCounts.warning}
          </p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-xs uppercase tracking-wide text-green-700 font-semibold">
            Healthy Status
          </p>
          <p className="text-3xl font-bold text-green-700 mt-2">
            {alertCounts.healthy}
          </p>
        </div>
      </div>

      {/* Alerts List */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Alerts & Escalation Feed
        </h2>
        <div className="space-y-3">
          {alerts.length === 0 ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
              <p className="text-green-800 font-medium">
                No alerts at this time
              </p>
            </div>
          ) : (
            alerts.map((alert) => (
              <AlertItem
                key={alert.id}
                alert={alert}
                status={statusOverrides[alert.id] || alert.status}
                onStatusChange={handleStatusChange}
              />
            ))
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h3 className="font-semibold text-gray-900 mb-3 text-sm">
          Action Types
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 bg-red-100 text-red-800 rounded">Urgent</span>
            <span className="text-gray-700">Immediate action required</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 bg-red-100 text-red-800 rounded">Escalate</span>
            <span className="text-gray-700">Needs management attention</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded">Review</span>
            <span className="text-gray-700">Performance assessment needed</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">Proactive</span>
            <span className="text-gray-700">Prevention/early action</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded">Investigate</span>
            <span className="text-gray-700">Root cause analysis</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded">Info</span>
            <span className="text-gray-700">FYI / Reference</span>
          </div>
        </div>
      </div>
    </div>
  )
}
