P := "\\033[32m[+]\\033[0m"
ENV_FILE ?= .env.local
DOTENV_FLAGS ?=
DOTENV := yarn dotenv -e $(ENV_FILE) $(DOTENV_FLAGS) --

help:
	@echo "$(P) make build - Transpile typescript files"

build-dist:
	@echo "$(P) Transpile typescript files"
	@if [ ! -d dist ]; then \
		echo "$(P) dist/ missing, clearing incremental cache"; \
		rm -f tsconfig.tsbuildinfo; \
	fi
	yarn tsc

dev-server:
	@echo "$(P) Start dev server"
	@$(MAKE) build-dist && \
	if [ -f "$(ENV_FILE)" ]; then \
		NODE_ENV=development $(DOTENV) node dist/server; \
	else \
		echo "$(P) $(ENV_FILE) not found, starting without dotenv"; \
		NODE_ENV=development node dist/server; \
	fi

dev:
	yarn nodemon -e ts --exec make dev-server

start: build-dist
	@echo "$(P) Start production server"
	@if [ -f "$(ENV_FILE)" ]; then \
		NODE_ENV=production $(DOTENV) node dist/server; \
	else \
		echo "$(P) $(ENV_FILE) not found, starting without dotenv"; \
		NODE_ENV=production node dist/server; \
	fi

build: clean build-dist

lint:
	@echo "$(p) Start linting"
	yarn eslint src --fix

clean:
	@echo "$(P) Clean dist/"
	rm -rf dist/
	rm -f tsconfig.tsbuildinfo

.PHONY: build clean build-dist help dev-server dev start lint
