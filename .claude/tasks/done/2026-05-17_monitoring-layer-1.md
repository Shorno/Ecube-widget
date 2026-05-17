# Task: Monitoring Layer 1
**Plan:** [[design-system-and-monitoring]]
**Created:** 2026-05-17
**Status:** completed 2026-05-17

## Objective
Instrument every API route with timing data. Store last 1000 requests in an in-memory ring
buffer. Expose /api/admin/metrics with grouping by route. Add a metrics table to the admin
dashboard showing p50/p95/count per endpoint.

## Files Involved
- instrumentation.js — new file (Next.js instrumentation hook)
- lib/metrics/store.js — new file (ring buffer)
- app/api/admin/metrics/route.js — new file
- app/admin/_components/MetricsPanel.jsx — new file
- app/admin/page.jsx — import MetricsPanel
