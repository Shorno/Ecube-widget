# Todo: fix-animation-timing

**Task:** [[2026-04-25_fix-animation-timing]]
**Plan:** [[multi-tenant-platform]]

## Steps

- [x] WidgetStage.jsx — add onReady callback prop, call it when ready flips true
- [x] after-match-score/page.jsx — add stageReady state, pass onReady, gate useGSAP
- [x] after-match-score-group/page.jsx — same
- [x] head-to-head/page.jsx — same
- [x] MVPPage.jsx — accept stageReady prop, gate useGSAP on it
- [x] mvp-match/page.jsx — add stageReady state, pass onReady + stageReady to MVPPage
- [x] mvp-group/page.jsx — same
