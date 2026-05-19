ARG NODE_VERSION=20.19.5

FROM node:${NODE_VERSION} AS build

ARG DEPLOYMENT_ID
ARG USE_CONTENT_API

RUN corepack enable && corepack prepare yarn@4.9.4 --activate

WORKDIR /monorepo

COPY package.json yarn.lock .yarnrc.yml babel.config.cjs ./
COPY packages/frontend/package.json packages/frontend/
COPY packages/logger/package.json packages/logger/
COPY packages/routing-ui/package.json packages/routing-ui/
COPY packages/api-types/package.json packages/api-types/
COPY packages/draft-renderer/package.json packages/draft-renderer/

COPY packages/frontend packages/frontend
COPY packages/logger packages/logger
COPY packages/routing-ui packages/routing-ui
COPY packages/api-types packages/api-types
COPY packages/draft-renderer packages/draft-renderer

RUN SKIP_POSTINSTALL=true yarn workspaces focus @kids-reporter/frontend --all

RUN yarn workspace @kids-reporter/logger build \
  && yarn workspace @kids-reporter/api-types build \
  && yarn workspace @kids-reporter/routing-ui build \
  && yarn workspace @kids-reporter/draft-renderer build \
  && DEPLOYMENT_ID=${DEPLOYMENT_ID} NEXT_PUBLIC_USE_CONTENT_API=${USE_CONTENT_API} \
    yarn workspace @kids-reporter/frontend run build:cloudbuild

FROM node:${NODE_VERSION}

RUN corepack enable && corepack prepare yarn@4.9.4 --activate

WORKDIR /app

ENV NODE_ENV=production

COPY --from=build /monorepo/packages/frontend/public ./public
COPY --from=build /monorepo/packages/frontend/.next/standalone ./
COPY --from=build /monorepo/packages/frontend/.next/static ./.next/static

CMD ["node", "server.js"]
