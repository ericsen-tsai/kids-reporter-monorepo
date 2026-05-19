ARG NODE_VERSION=20.19.5

FROM node:${NODE_VERSION} AS build

RUN corepack enable && corepack prepare yarn@4.9.4 --activate

WORKDIR /monorepo

COPY package.json yarn.lock .yarnrc.yml ./
COPY packages/api-gateway/package.json packages/api-gateway/
COPY packages/logger/package.json packages/logger/

RUN YARN_ENABLE_SCRIPTS=0 yarn workspaces focus @kids-reporter/api-gateway --all

COPY packages/api-gateway packages/api-gateway
COPY packages/logger packages/logger

RUN yarn workspace @kids-reporter/logger build \
  && yarn workspace @kids-reporter/api-gateway run build \
  && SKIP_POSTINSTALL=true YARN_ENABLE_SCRIPTS=0 yarn workspaces focus @kids-reporter/api-gateway --production

FROM node:${NODE_VERSION}

WORKDIR /monorepo/packages/api-gateway

ENV NODE_ENV=production

COPY --from=build /monorepo/package.json /monorepo/package.json
COPY --from=build /monorepo/node_modules /monorepo/node_modules
COPY --from=build /monorepo/packages/api-gateway/package.json ./package.json
COPY --from=build /monorepo/packages/api-gateway/dist ./dist
COPY --from=build /monorepo/packages/logger /monorepo/packages/logger

CMD ["node", "dist/server.js"]
