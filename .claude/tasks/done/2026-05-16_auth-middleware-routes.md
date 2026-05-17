# Task: Auth Middleware + Routes
**Plan:** [[auth-system]]
**Created:** 2026-05-16
**Status:** completed — 2026-05-16

## Objective
Create middleware.js that protects /controller, /settings, and /admin/* using jose JWT verification. Write login, logout, and me API routes. Update root page to redirect based on session.

## Files Involved
- `middleware.js` — new at project root
- `app/api/auth/login/route.js` — new
- `app/api/auth/logout/route.js` — new
- `app/api/auth/me/route.js` — new
- `app/page.jsx` — update: check session → redirect /admin or /controller or /login
