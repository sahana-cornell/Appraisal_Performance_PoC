# Appraisal Pattern Detection Dashboard

A proof-of-concept for monitoring appraisal workflow health across regional markets, detecting operational degradation, surfacing actionable alerts, and generating AI-assisted root cause analysis.

## Overview

Appraisal operations teams manage orders across a distributed network of appraisers and appraisal management partners. This PoC demonstrates how an operations team could identify when a market is starting to degrade, understand the likely drivers, and take action before delays become systemic.

The dashboard focuses on four questions:

1. **Where is performance changing?** Regional heat map and computed health scores.
2. **What changed?** KPI trends for turnaround, aging, response lag, capacity, availability, reassignment, on-time completion, and revision rate.
3. **Why is it happening?** AI-assisted root cause analysis using the selected region and appraiser metrics.
4. **What should ops do?** Generated alerts, recommended actions, and appraiser scorecards.

## Scope

This is a frontend PoC using realistic synthetic appraisal workflow data. It is designed to validate the product and operating model, not to replace production appraisal systems.

### Included

- Geographic regional health heat map
- Computed health scores and trailing 14-day score trends
- KPI dashboard with market-level performance metrics
- Market Signal panel summarizing operational exposure and next-best action
- Rule-generated alert feed with suggested escalation actions
- Appraiser scorecards with network and tenure-adjusted benchmarks
- Live AI root cause analysis through Hugging Face

### Out of Scope

- Real order data
- Backend APIs, database, authentication, or persistence
- Email/Slack/Teams alert delivery
- Production audit trail
- Production-grade secret handling

## Design Decisions

### Synthetic Data

All regional metrics, appraiser scorecards, and order patterns are synthesized in the frontend. In production, these structures would be replaced by appraisal workflow events from order management systems.

### Deterministic Detection Before AI

The AI does not decide whether a region is unhealthy. The app first computes health scores and alerts using deterministic rules. The AI panel then explains likely root causes and recommended actions using the selected region's metrics.

### Frontend-Only Deployment

The app is intentionally deployable as a static frontend. This keeps the PoC easy to review, share, and iterate on.

> Note: because this is frontend-only, the Hugging Face API key is exposed to the browser when deployed. Use a limited demo token only. A production implementation should proxy AI calls through a backend service.

## Tech Stack

- **Vite**: build tooling and development server
- **React**: UI framework
- **Tailwind CSS**: styling
- **Recharts**: KPI trend visualization
- **Leaflet / React Leaflet**: geographic visualization dependencies
- **Hugging Face Router API**: AI root cause analysis

## Project Structure

```text
/appraisal-performance-dashboard
├── README.md
├── package.json
├── vite.config.js
├── index.html
├── src/
│   ├── App.jsx
│   ├── main.jsx
│   ├── index.css
│   ├── data/
│   │   ├── regions.js        # regional metrics, scoring, baselines
│   │   ├── vendors.js        # synthesized appraiser scorecards
│   │   └── alerts.js         # generated alert rules
│   ├── components/
│   │   ├── Dashboard.jsx
│   │   ├── HeatMap.jsx
│   │   ├── KPIPanel.jsx
│   │   ├── PatternInsights.jsx
│   │   ├── RootCauseAnalysis.jsx
│   │   ├── AlertsFeed.jsx
│   │   ├── VendorScorecard.jsx
│   │   └── RegionDetails.jsx
│   └── utils/
│       └── huggingface.js
```

## Detection Logic

### Health Score

Each region receives a computed score from 0-100 based on weighted appraisal workflow metrics:

- Appraisal turnaround time
- Orders aging beyond SLA
- Appraiser response lag
- Appraiser availability
- Reassignment rate
- On-time completion
- Capacity utilization
- Revision rate
- Trend direction

The heat map uses these thresholds:

- **Healthy**: 85+
- **Neutral**: 70-84
- **Warning**: 45-69
- **Critical**: below 45

### Adaptive Baselines

The PoC computes a recent-history baseline for each region. This allows the dashboard to identify when a market is worsening relative to its own recent norm, not only against static enterprise thresholds.

Examples:

- Turnaround vs recent regional baseline
- Aging exposure vs recent regional baseline
- Response lag vs recent regional baseline
- Capacity utilization vs recent regional baseline

### Alert Rules

Alerts are generated when high-signal operating conditions are detected:

- Capacity utilization above threshold
- Appraisal turnaround above target or worsening quickly
- Orders aging beyond SLA or rising against baseline
- Appraiser response lag above target or rising against baseline
- Reassignment rate above target
- Revision rate above target
- Single-appraiser concentration risk
- Healthy reference market detection

For readability, the PoC limits the visible alert feed to the most important alerts per market.

### Tenure-Adjusted Appraiser Benchmarking

Appraiser scorecards compare each appraiser against both network averages and tenure-adjusted expectations:

- **Ramp-up baseline**: under 2 years
- **Developing baseline**: 2-4 years
- **Established baseline**: 4+ years

This avoids unfairly judging newer appraisers against mature-provider expectations while still identifying early operational risk.

## AI Root Cause Analysis

The AI panel sends the selected region's synthesized performance data to Hugging Face and requests a structured response:

- **Summary**
- **Findings**
- **Recommended Actions**

The app normalizes the response so the UI always displays those three sections, even if the model returns imperfect JSON.

## Setup

### Prerequisites

- Node.js 18+
- npm
- Hugging Face API token

### Environment Variables

Create `.env.local` in the project root:

```text
VITE_HUGGINGFACE_API_KEY=hf-your-key-here
```

Optional:

```text
VITE_HUGGINGFACE_MODEL=openai/gpt-oss-120b:fastest
```

### Install And Run

```bash
npm install
npm run dev
```

Open:

```text
http://localhost:5173
```

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Suggested Review Flow

1. Start on the heat map and compare healthy, warning, and critical markets.
2. Select Houston or Chicago to review degraded-market KPIs.
3. Review the Market Signal to see exposure, capacity pressure, aged orders, and recommended action.
4. Open Alerts & Actions to see generated operational alerts.
5. Open Appraiser Scorecards to compare individual appraisers against benchmarks.
6. Run AI Root Cause Analysis for a degraded region.

## Production Path

To evolve this PoC into a production system:

1. **Ingest appraisal workflow events**: assigned, accepted, declined, inspected, submitted, revised, completed, reassigned.
2. **Aggregate regional and appraiser KPIs**: market trends, baselines, SLA risk, capacity, quality, and response lag.
3. **Run alert detection**: threshold rules, adaptive baselines, anomaly detection, and concentration risk.
4. **Route alerts to ops**: Slack/Teams/email, queue assignment, escalation policy, and SLA timers.
5. **Persist alert workflow state**: status, owner, notes, resolution actions, and audit trail.
6. **Secure AI calls**: move Hugging Face/OpenAI requests behind a backend service.
7. **Add governance**: model prompt versioning, output logging, and human review for recommendations.

## Deployment

This app can be deployed as a static Vite site. Recommended path:

1. Push the repo to GitHub.
2. Import the repo into Vercel.
3. Add `VITE_HUGGINGFACE_API_KEY` in Vercel environment variables.
4. Use:

```text
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

## Notes

- Data is synthetic and intended for concept validation.
- The alerting logic is deterministic and inspectable.
- The AI layer explains root cause; it does not own detection.
- The frontend-only architecture is intentional for PoC simplicity.
