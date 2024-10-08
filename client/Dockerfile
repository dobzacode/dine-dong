ARG BUN_VERSION=1.1.1
FROM oven/bun:${BUN_VERSION}-slim AS base

WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED="1" \
    NODE_ENV="production"

FROM base AS build

RUN --mount=type=cache,id=cache,target=/var/cache/apt \
    --mount=type=cache,id=lib,target=/var/lib/apt \
    apt-get update -qq && \
    apt-get install --no-install-recommends -y build-essential ca-certificates curl pkg-config python-is-python3

COPY --link bun.lockb package.json ./
RUN --mount=type=cache,id=bun,target=/root/.bun \
    bun install --frozen-lockfile


COPY --link . .

RUN mkdir -p /app/.next/cache

RUN --mount=type=cache,id=nextjs,target=/app/.next/cache \
    bun run build

FROM base AS run

COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static

ENV PORT=80
EXPOSE 80

CMD ["bun", "run", "server.js"]