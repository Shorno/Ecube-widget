# Todo: Foundation
**Task:** [[2026-05-16_foundation]]
**Plan:** [[auth-system]]

## Steps

- [x] Install packages: bcryptjs, jose, nanoid
- [x] Initialise shadcn/ui (npx shadcn@latest init)
- [x] Install first shadcn components: button, input, label, card, badge, table, dialog, dropdown-menu, separator, sonner
- [x] Rebuild `lib/db/models/User.js` — new schema
- [x] Write `lib/auth/jwt.js` — signToken / verifyToken (jose)
- [x] Write `lib/auth/password.js` — hashPassword / verifyPassword (bcryptjs)
- [x] Write `lib/auth/session.js` — getSession / requireSession / requireAdmin
- [x] Add JWT_SECRET to .env
- [x] Write `scripts/seed-admin.js` — seeds adm@efn.io admin ✓
