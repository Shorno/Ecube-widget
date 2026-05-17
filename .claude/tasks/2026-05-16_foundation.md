# Task: Foundation
**Plan:** [[auth-system]]
**Created:** 2026-05-16
**Status:** completed — 2026-05-16

## Objective
Install auth packages, rebuild the User model with the new schema, write self-contained auth utilities (JWT, password hashing, session reading), and produce a seed script that creates the admin user. Also initialise shadcn/ui so all future UI tasks can use its components.

## Files Involved
- `package.json` — add bcryptjs, jose, nanoid
- `lib/db/models/User.js` — full replacement with new schema
- `lib/auth/jwt.js` — new: signToken / verifyToken (jose)
- `lib/auth/password.js` — new: hashPassword / verifyPassword (bcryptjs)
- `lib/auth/session.js` — new: getSession / requireSession / requireAdmin (reads JWT cookie)
- `scripts/seed-admin.js` — new: seeds adm@efn.io admin user
- `.env` — add JWT_SECRET
- `components/ui/` — shadcn init populates this
- `app/globals.css` — shadcn init may append CSS vars
- `tailwind.config.js` / `jsconfig.json` — shadcn init may update
