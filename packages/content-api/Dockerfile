ARG NODE_VERSION=20.19.5

FROM node:${NODE_VERSION} AS build

RUN apt-get update -y \
  && apt-get install -y --no-install-recommends make \
  && rm -rf /var/lib/apt/lists/*

RUN corepack enable && corepack prepare yarn@4.9.4 --activate

WORKDIR /monorepo

COPY package.json yarn.lock .yarnrc.yml ./
COPY packages/content-api/package.json packages/content-api/
COPY packages/api-types/package.json packages/api-types/
COPY packages/db/package.json packages/db/
COPY packages/logger/package.json packages/logger/

COPY packages/cms/schema.prisma packages/cms/schema.prisma
COPY packages/content-api packages/content-api
COPY packages/api-types packages/api-types
COPY packages/db packages/db
COPY packages/logger packages/logger

RUN SKIP_POSTINSTALL=true YARN_ENABLE_SCRIPTS=0 yarn workspaces focus @kids-reporter/content-api --all

RUN yarn workspace @kids-reporter/logger build \
  && yarn workspace @kids-reporter/api-types build \
  && yarn workspace @kids-reporter/db build \
  && yarn workspace @kids-reporter/content-api run build

FROM node:${NODE_VERSION}

RUN corepack enable && corepack prepare yarn@4.9.4 --activate

WORKDIR /monorepo/packages/content-api

ENV NODE_ENV=production

COPY --from=build /monorepo/package.json /monorepo/package.json
COPY --from=build /monorepo/node_modules /monorepo/node_modules
COPY --from=build /monorepo/packages/content-api/package.json ./package.json
COPY --from=build /monorepo/packages/content-api/dist ./dist
COPY --from=build /monorepo/packages/api-types /monorepo/packages/api-types
COPY --from=build /monorepo/packages/db /monorepo/packages/db
COPY --from=build /monorepo/packages/logger /monorepo/packages/logger

CMD ["node", "dist/server.js"]
