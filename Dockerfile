# syntax=docker/dockerfile:1

FROM node:22-alpine AS runtime

RUN apk add --no-cache libc6-compat

FROM runtime AS base

ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH

RUN corepack enable \
    && corepack prepare pnpm@11.7.0 --activate

WORKDIR /app

FROM base AS dependencies

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

FROM base AS builder

ENV NEXT_TELEMETRY_DISABLED=1
ENV NEXT_PUBLIC_API_BASE_URL=__COOLIFY_NEXT_PUBLIC_API_BASE_URL__
ENV NEXT_PUBLIC_DISABLE_WIDGET_PRELOAD=__COOLIFY_NEXT_PUBLIC_DISABLE_WIDGET_PRELOAD__
ENV NEXT_PUBLIC_HIDE_ON_IMAGE_ERROR=__COOLIFY_NEXT_PUBLIC_HIDE_ON_IMAGE_ERROR__
ENV NEXT_PUBLIC_PCOB_URL=__COOLIFY_NEXT_PUBLIC_PCOB_URL__

COPY --from=dependencies /app/node_modules ./node_modules
COPY . .
RUN pnpm run build

FROM runtime AS runner

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

WORKDIR /app

COPY --from=builder --chown=node:node /app/public ./public
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static
COPY --chown=node:node docker-runtime-env.mjs ./docker-runtime-env.mjs

USER node

EXPOSE 3000

ENTRYPOINT ["sh", "-c", "node docker-runtime-env.mjs && exec node server.js"]
