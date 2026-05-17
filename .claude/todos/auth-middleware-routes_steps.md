# Todo: Auth Middleware + Routes
**Task:** [[2026-05-16_auth-middleware-routes]]
**Plan:** [[auth-system]]

## Steps
- [x] Write `middleware.js` — jose JWT verify; /controller + /settings → session; /admin/* → admin role
- [x] Write `app/api/auth/login/route.js` — bcrypt verify → JWT cookie
- [x] Write `app/api/auth/logout/route.js` — clear cookie
- [x] Write `app/api/auth/me/route.js` — return session payload
- [x] Update `app/page.jsx` — session-based redirect
