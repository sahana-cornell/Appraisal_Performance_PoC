/**
 * Synthesized Appraiser Scorecard Data
 * 
 * Individual appraiser performance metrics for benchmarking
 */

export const vendors = [
  // Houston region appraisers
  {
    id: 'v-001',
    name: 'Lone Star Valuation',
    region: 'tx-houston',
    tenure: 2.1, // years
    rating: 3.4, // out of 5
    completedOrders: 1240,
    averageTurnaroundTime: 16.1,
    onTimeCompletionRate: 0.58,
    rejectionRate: 0.16,
    responseTime: 7.4, // hours
    trend: 'down', // performance trend
    recentOrders: 11,
    capacity: 110,
    costPerOrder: 575,
    vendorAvailability: 0.72
  },
  {
    id: 'v-002',
    name: 'Gulf State Appraisals',
    region: 'tx-houston',
    tenure: 5.3,
    rating: 4.1,
    completedOrders: 3100,
    averageTurnaroundTime: 12.6,
    onTimeCompletionRate: 0.73,
    rejectionRate: 0.08,
    responseTime: 3.2,
    trend: 'stable',
    recentOrders: 12,
    capacity: 85,
    costPerOrder: 515,
    vendorAvailability: 0.84
  },
  {
    id: 'v-003',
    name: 'Houston Valuation Partners',
    region: 'tx-houston',
    tenure: 1.2,
    rating: 3.0,
    completedOrders: 420,
    averageTurnaroundTime: 14.8,
    onTimeCompletionRate: 0.66,
    rejectionRate: 0.13,
    responseTime: 6.3,
    trend: 'down',
    recentOrders: 9,
    capacity: 98,
    costPerOrder: 545,
    vendorAvailability: 0.68
  },
  {
    id: 'v-004',
    name: 'Texas Appraisal Solutions',
    region: 'tx-houston',
    tenure: 4.5,
    rating: 4.3,
    completedOrders: 2890,
    averageTurnaroundTime: 10.9,
    onTimeCompletionRate: 0.82,
    rejectionRate: 0.07,
    responseTime: 3.8,
    trend: 'up',
    recentOrders: 10,
    capacity: 88,
    costPerOrder: 525,
    vendorAvailability: 0.86
  },

  // Chicago region appraisers
  {
    id: 'v-005',
    name: 'Midwest Appraisal Group',
    region: 'il-chicago',
    tenure: 3.2,
    rating: 2.5,
    completedOrders: 1800,
    averageTurnaroundTime: 18.3,
    onTimeCompletionRate: 0.52,
    rejectionRate: 0.22,
    responseTime: 10.4,
    trend: 'down',
    recentOrders: 13,
    capacity: 118,
    costPerOrder: 625,
    vendorAvailability: 0.58
  },
  {
    id: 'v-006',
    name: 'Chicago Valuation Associates',
    region: 'il-chicago',
    tenure: 6.1,
    rating: 3.8,
    completedOrders: 3400,
    averageTurnaroundTime: 13.7,
    onTimeCompletionRate: 0.59,
    rejectionRate: 0.13,
    responseTime: 3.1,
    trend: 'stable',
    recentOrders: 11,
    capacity: 108,
    costPerOrder: 560,
    vendorAvailability: 0.82
  },

  // NYC region appraisers (high performers)
  {
    id: 'v-007',
    name: 'Manhattan Valuation Corp',
    region: 'ny-nyc',
    tenure: 8.2,
    rating: 4.6,
    completedOrders: 5200,
    averageTurnaroundTime: 7.8,
    onTimeCompletionRate: 0.94,
    rejectionRate: 0.02,
    responseTime: 0.8,
    trend: 'up',
    recentOrders: 10,
    capacity: 68,
    costPerOrder: 495,
    vendorAvailability: 0.99
  },
  {
    id: 'v-008',
    name: 'NY Appraisal Services',
    region: 'ny-nyc',
    tenure: 4.8,
    rating: 4.4,
    completedOrders: 2950,
    averageTurnaroundTime: 8.3,
    onTimeCompletionRate: 0.90,
    rejectionRate: 0.02,
    responseTime: 1.0,
    trend: 'up',
    recentOrders: 9,
    capacity: 68,
    costPerOrder: 505,
    vendorAvailability: 0.97
  },

  // San Francisco region
  {
    id: 'v-009',
    name: 'Bay Area Valuation',
    region: 'ca-sf',
    tenure: 2.9,
    rating: 3.6,
    completedOrders: 1100,
    averageTurnaroundTime: 11.4,
    onTimeCompletionRate: 0.75,
    rejectionRate: 0.08,
    responseTime: 4.2,
    trend: 'down',
    recentOrders: 11,
    capacity: 88,
    costPerOrder: 645,
    vendorAvailability: 0.82
  },

  // Phoenix region
  {
    id: 'v-010',
    name: 'Phoenix Valuation Co',
    region: 'az-phoenix',
    tenure: 3.5,
    rating: 4.3,
    completedOrders: 1650,
    averageTurnaroundTime: 8.4,
    onTimeCompletionRate: 0.89,
    rejectionRate: 0.03,
    responseTime: 1.1,
    trend: 'stable',
    recentOrders: 8,
    capacity: 80,
    costPerOrder: 485,
    vendorAvailability: 0.91
  },

  // Miami region appraisers
  {
    id: 'v-011',
    name: 'Miami Appraisal Alliance',
    region: 'fl-miami',
    tenure: 4.0,
    rating: 3.9,
    completedOrders: 720,
    averageTurnaroundTime: 9.1,
    onTimeCompletionRate: 0.86,
    rejectionRate: 0.04,
    responseTime: 1.8,
    trend: 'stable',
    recentOrders: 8,
    capacity: 74,
    costPerOrder: 505,
    vendorAvailability: 0.92
  },
  {
    id: 'v-012',
    name: 'South Florida Valuation',
    region: 'fl-miami',
    tenure: 2.8,
    rating: 3.5,
    completedOrders: 510,
    averageTurnaroundTime: 10.2,
    onTimeCompletionRate: 0.81,
    rejectionRate: 0.06,
    responseTime: 2.4,
    trend: 'down',
    recentOrders: 7,
    capacity: 76,
    costPerOrder: 535,
    vendorAvailability: 0.88
  },

  // Seattle region appraisers
  {
    id: 'v-013',
    name: 'Seattle Appraisal Works',
    region: 'wa-seattle',
    tenure: 5.1,
    rating: 4.2,
    completedOrders: 860,
    averageTurnaroundTime: 8.5,
    onTimeCompletionRate: 0.88,
    rejectionRate: 0.04,
    responseTime: 1.4,
    trend: 'up',
    recentOrders: 7,
    capacity: 66,
    costPerOrder: 515,
    vendorAvailability: 0.93
  },
  {
    id: 'v-014',
    name: 'Pacific Northwest Valuation',
    region: 'wa-seattle',
    tenure: 3.9,
    rating: 3.7,
    completedOrders: 620,
    averageTurnaroundTime: 9.1,
    onTimeCompletionRate: 0.84,
    rejectionRate: 0.04,
    responseTime: 2.0,
    trend: 'stable',
    recentOrders: 6,
    capacity: 68,
    costPerOrder: 530,
    vendorAvailability: 0.90
  }
]

/**
 * Get appraisers by region
 */
export const getVendorsByRegion = (regionId) => {
  return vendors.filter(v => v.region === regionId)
}

/**
 * Get appraiser by ID
 */
export const getVendorById = (id) => {
  return vendors.find(v => v.id === id)
}

/**
 * Get top-performing appraisers network-wide
 */
export const getTopVendors = (limit = 5) => {
  return [...vendors]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit)
}

/**
 * Get appraisers at risk (low rating or declining trend)
 */
export const getAtRiskVendors = () => {
  return vendors.filter(v => v.rating < 3.5 || v.trend === 'down')
}

/**
 * Get network benchmark appraiser statistics
 */
export const getVendorStats = (excludeRegionId = null) => {
  const benchmarkVendors = excludeRegionId
    ? vendors.filter((v) => v.region !== excludeRegionId)
    : vendors

  const vendorCount = benchmarkVendors.length || vendors.length
  const averageRating = benchmarkVendors.reduce((sum, v) => sum + v.rating, 0) / vendorCount
  const averageTurnaroundTime = benchmarkVendors.reduce((sum, v) => sum + v.averageTurnaroundTime, 0) / vendorCount
  const averageOnTimeRate = benchmarkVendors.reduce((sum, v) => sum + v.onTimeCompletionRate, 0) / vendorCount

  return {
    totalVendors: vendorCount,
    averageRating: parseFloat(averageRating.toFixed(2)),
    averageTurnaroundTime: parseFloat(averageTurnaroundTime.toFixed(2)),
    averageOnTimeRate: parseFloat(averageOnTimeRate.toFixed(2)),
  }
}
