FROM node:20.19.5-slim

RUN corepack enable && corepack prepare yarn@4.9.4 --activate

## Install system dependencies, `gcsfuse` in particular.
RUN set -e; \
    apt-get update -y && apt-get install -y --no-install-recommends \
    build-essential \
    ca-certificates \
    curl \
    wget \
    gnupg2 \
    tini \
    openssl \
    lsb-release; \
    gcsFuseRepo=gcsfuse-`lsb_release -c -s`; \
    echo "deb http://packages.cloud.google.com/apt $gcsFuseRepo main" | \
    tee /etc/apt/sources.list.d/gcsfuse.list; \
    curl https://packages.cloud.google.com/apt/doc/apt-key.gpg | \
    apt-key add -; \
    wget https://github.com/GoogleCloudPlatform/gcsfuse/releases/download/v1.2.0/gcsfuse_1.2.0_amd64.deb -O gcsfuse.deb && apt-get install -y --no-install-recommends ./gcsfuse.deb && rm -f ./gcsfuse.deb \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

ENV APP_DIR=/monorepo/packages/cms
ENV MNT_DIR=/monorepo/packages/cms/gcs
ENV HOST=0.0.0.0
ENV PORT=3000

WORKDIR /monorepo

COPY package.json yarn.lock .yarnrc.yml babel.config.cjs ./
COPY packages/cms/package.json packages/cms/
COPY packages/core/package.json packages/core/
COPY packages/draft-editor/package.json packages/draft-editor/
COPY packages/draft-renderer/package.json packages/draft-renderer/
COPY packages/logger/package.json packages/logger/

COPY packages/cms packages/cms
COPY packages/core packages/core
COPY packages/draft-editor packages/draft-editor
COPY packages/draft-renderer packages/draft-renderer
COPY packages/logger packages/logger

RUN SKIP_POSTINSTALL=true yarn workspaces focus @kids-reporter/cms --all

RUN yarn workspace @kids-reporter/logger build \
  && yarn workspace @kids-reporter/cms-core build \
  && yarn workspace @kids-reporter/draft-editor build \
  && yarn workspace @kids-reporter/draft-renderer build \
  && yarn workspace @kids-reporter/cms exec patch-package \
  && yarn workspace @kids-reporter/cms exec keystone build --no-ui \
  && yarn workspace @kids-reporter/cms run build

RUN yarn cache clean

RUN chmod +x packages/cms/run.sh

WORKDIR /monorepo/packages/cms

EXPOSE 3000

ENTRYPOINT ["/usr/bin/tini", "--"]

CMD ["/monorepo/packages/cms/run.sh"]
