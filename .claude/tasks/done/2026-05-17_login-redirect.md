# Task: login-redirect

**Plan:** [[settings-login-design-overrides]]
**Created:** 2026-05-17
**Status:** in_progress

## Objective

Prevent authenticated users from landing on /login. Add a Server Component layout that reads the JWT cookie and redirects to /admin or /controller.

## Files Involved

- app/login/layout.jsx (NEW)
