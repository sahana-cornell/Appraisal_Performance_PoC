import { getVendorsByRegion } from '../data/vendors'

const createPrompt = (region) => {
  const vendors = getVendorsByRegion(region.id)
  const vendorDetails = vendors.map((vendor) =>
    `- ${vendor.name}: rating ${vendor.rating.toFixed(1)}, capacity ${vendor.capacity}%, on-time ${(vendor.onTimeCompletionRate * 100).toFixed(0)}%, turnaround ${vendor.averageTurnaroundTime.toFixed(1)}d, revision ${(vendor.rejectionRate * 100).toFixed(1)}%`
  ).join('\n')

  return `You are an operations analyst for a mortgage appraisal operations network.

Analyze this region's appraisal performance metrics and provide a concise, region-specific diagnosis.

Region: ${region.name}
County: ${region.county}
State: ${region.state}

Metrics:
- Turnaround time: ${region.metrics.turnaroundTime.toFixed(1)} days
- Appraiser availability: ${(region.metrics.vendorAvailability * 100).toFixed(0)}%
- Reassignment rate: ${(region.metrics.reassignmentRate * 100).toFixed(0)}%
- On-time completion: ${(region.metrics.onTimeCompletion * 100).toFixed(0)}%
- Capacity utilization: ${(region.metrics.capacityUtilization * 100).toFixed(0)}%
- Revision rate: ${(region.metrics.rejectionRate * 100).toFixed(0)}%
- Orders aging beyond SLA: ${(region.metrics.ordersAgingOverSla * 100).toFixed(0)}%
- Oldest open order: ${region.metrics.oldestOpenOrderAge} days
- Appraiser response lag: ${region.metrics.responseLag.toFixed(1)} hours
- Adaptive turnaround baseline: ${region.adaptiveBaseline?.turnaroundTime?.toFixed(1) || 'N/A'} days

Orders this week: ${region.ordersThisWeek}
Active appraisers: ${region.activeVendors}
Health score: ${region.healthScore}
Trend: ${region.trend}
Status: ${region.status}
Top issues: ${region.topIssues.length > 0 ? region.topIssues.join('; ') : 'None'}

Appraiser details:
${vendorDetails || '- No appraiser details available'}

Use the appraiser names and metrics above to make recommendations precise for this region. Specifically call out the most over-capacity or highest-revision appraiser by name, reference estimated order redistribution or appraiser count, and quantify the expected impact on turnaround or throughput.

Return valid JSON only in this exact structure:
{
  "summary": "One short executive summary of the primary performance driver.",
  "findings": [
    "Finding 1",
    "Finding 2",
    "Finding 3"
  ],
  "recommendations": [
    "Action 1",
    "Action 2",
    "Action 3"
  ]
}

Rules:
- Always include summary, findings, and recommendations.
- Findings must be an array of 3-5 concise observations.
- Recommendations must be an array of 3-4 actionable next steps.
- Do not rename keys.
- Do not return empty arrays.

Do not include markdown, code fences, or any text outside the JSON object.`
}

const stripJson = (text) => {
  const jsonMatch = text.match(/\{[\s\S]*\}/m)
  return jsonMatch ? jsonMatch[0] : text
}

const cleanModelText = (text) => String(text || '')
  .replace(/```json|```/gi, '')
  .replace(/^\s*json\s*/i, '')
  .trim()

const extractStringValue = (text, key) => {
  const regex = new RegExp(`"${key}"\\s*:\\s*"([\\s\\S]*?)"\\s*(?:,\\s*"|\\}|$)`, 'i')
  const match = text.match(regex)
  if (match) return match[1].replace(/\\"/g, '"').trim()

  const looseRegex = new RegExp(`"?${key}"?\\s*:\\s*([\\s\\S]*?)(?:\\n\\s*"?findings"?\\s*:|\\n\\s*"?recommendations"?\\s*:|$)`, 'i')
  const looseMatch = text.match(looseRegex)
  return looseMatch
    ? looseMatch[1].replace(/^[\s"{:]+|[",}\s]+$/g, '').trim()
    : ''
}

const extractStringArray = (text, key) => {
  const jsonArrayRegex = new RegExp(`"${key}"\\s*:\\s*\\[([\\s\\S]*?)\\]`, 'i')
  const jsonMatch = text.match(jsonArrayRegex)
  if (jsonMatch) {
    return jsonMatch[1]
      .split(/"\s*,\s*"|\n|\r|\*|-/)
      .map((item) => item.replace(/^["\s\-\*]+|["\s\-\*]+$/g, '').trim())
      .filter(Boolean)
  }

  const headingRegex = new RegExp(`${key.replace(/([A-Z])/g, ' $1')}\\s*[:\\n]+([\\s\\S]*?)(?:\\n\\S|$)`, 'i')
  const headingMatch = text.match(headingRegex)
  if (headingMatch) {
    return headingMatch[1]
      .split(/\n|\r|\*|-/)
      .map((item) => item.trim())
      .filter(Boolean)
  }

  return []
}

const normalizeList = (items, fallbackItems, limit = 5) => {
  const normalized = (Array.isArray(items) ? items : [])
    .map((item) => String(item || '').trim())
    .filter(Boolean)

  const combined = [...normalized, ...fallbackItems].filter(Boolean)
  return [...new Set(combined)].slice(0, limit)
}

const looksLikeRawJson = (value) => {
  const text = String(value || '').trim()
  return text.startsWith('{') || text.startsWith('[') || /"summary"\s*:|"findings"\s*:|"recommendations"\s*:/i.test(text)
}

const cleanSummary = (summary) => {
  const text = String(summary || '').trim()
  if (!text || looksLikeRawJson(text)) return ''
  return text.replace(/^summary\s*:\s*/i, '').replace(/^["']|["']$/g, '').trim()
}

const createFallbackAnalysis = (region, text = '') => {
  const vendors = getVendorsByRegion(region.id)
  const slowest = [...vendors].sort((a, b) => b.averageTurnaroundTime - a.averageTurnaroundTime)[0]
  const highestRevision = [...vendors].sort((a, b) => b.rejectionRate - a.rejectionRate)[0]
  const overCapacity = vendors.filter((vendor) => vendor.capacity >= 100)

  return {
    summary: cleanSummary(text) || `${region.name} is showing appraisal workflow stress driven by turnaround, capacity, aging orders, and appraiser availability.`,
    findings: [
      `Regional turnaround is ${region.metrics.turnaroundTime.toFixed(1)} days with ${(region.metrics.ordersAgingOverSla * 100).toFixed(0)}% of orders aging beyond SLA.`,
      `Capacity utilization is ${(region.metrics.capacityUtilization * 100).toFixed(0)}% and appraiser availability is ${(region.metrics.vendorAvailability * 100).toFixed(0)}%.`,
      slowest ? `${slowest.name} is the slowest appraiser at ${slowest.averageTurnaroundTime.toFixed(1)} days average turnaround.` : '',
      highestRevision ? `${highestRevision.name} has the highest revision rate at ${(highestRevision.rejectionRate * 100).toFixed(0)}%.` : '',
    ],
    recommendations: [
      overCapacity.length > 0 ? `Reduce new assignments to ${overCapacity.map((vendor) => vendor.name).join(', ')} until capacity falls below target.` : 'Protect capacity by holding new assignments to appraisers already near target utilization.',
      'Review aged orders and separate access issues from appraiser-driven delays.',
      'Rebalance urgent orders toward appraisers with lower capacity and stronger on-time performance.',
    ]
  }
}

const enforceAnalysisShape = (analysis, region) => {
  const fallback = createFallbackAnalysis(region, analysis.summary)
  const summary = cleanSummary(analysis.summary) || fallback.summary
  return {
    summary,
    findings: normalizeList(analysis.findings, fallback.findings, 5).slice(0, 5),
    recommendations: normalizeList(analysis.recommendations, fallback.recommendations, 4).slice(0, 4),
  }
}

const parseAnalysisResponse = (text, region) => {
  const cleaned = stripJson(cleanModelText(text))
  let parsed
  try {
    const payload = JSON.parse(cleaned)
    parsed = {
      summary: payload.summary || '',
      findings: Array.isArray(payload.findings) ? payload.findings : [],
      recommendations: Array.isArray(payload.recommendations) ? payload.recommendations : []
    }
  } catch (err) {
    parsed = {
      summary: extractStringValue(cleaned, 'summary'),
      findings: extractStringArray(cleaned, 'findings'),
      recommendations: extractStringArray(cleaned, 'recommendations')
    }
  }

  return enforceAnalysisShape(parsed, region)
}

export const generateRootCauseAnalysis = async (region) => {
  const apiKey = import.meta.env.VITE_HUGGINGFACE_API_KEY
  if (!apiKey) {
    throw new Error('Hugging Face API key is missing. Add VITE_HUGGINGFACE_API_KEY to .env.local')
  }

  const model = import.meta.env.VITE_HUGGINGFACE_MODEL || 'openai/gpt-oss-120b:fastest'
  const url = 'https://router.huggingface.co/v1/chat/completions'

  const body = {
    model,
    messages: [
      {
        role: 'system',
        content: 'You are an operations analyst who evaluates appraiser performance in a mortgage appraisal workflow.'
      },
      {
        role: 'user',
        content: createPrompt(region)
      }
    ],
    temperature: 0.2,
    max_tokens: 800,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify(body)
  })

  let data
  try {
    data = await response.json()
  } catch (err) {
    const text = await response.text()
    throw new Error(`Hugging Face response parse error: ${text}`)
  }

  if (!response.ok) {
    const message = data?.error?.message || data?.error || JSON.stringify(data)
    throw new Error(`Hugging Face request failed (${response.status}): ${message}`)
  }

  const text = data.choices?.[0]?.message?.content || data.choices?.[0]?.text || ''
  return parseAnalysisResponse(text, region)
}
