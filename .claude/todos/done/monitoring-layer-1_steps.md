# Todo: Monitoring Layer 1

**Task:** [[2026-05-17_monitoring-layer-1]]
**Plan:** [[design-system-and-monitoring]]

## Steps

- [ ] Create lib/metrics/store.js — ring buffer (1000 entries), record() and getSummary() functions
- [ ] Create instrumentation.js at project root — wrap fetch/Next.js server to time API routes
- [ ] Create app/api/admin/metrics/route.js — returns grouped summary (route, method, count, p50, p95, last seen)
- [ ] Create app/admin/\_components/MetricsPanel.jsx — client component polling /api/admin/metrics
- [ ] Add MetricsPanel to app/admin/page.jsx below DesignsPanel
- [ ] Mark task completed
