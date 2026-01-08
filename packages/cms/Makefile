P := "\\033[32m[+]\\033[0m"

help:
	@echo "$(P) make build-deps - build core, draft-editor and draft-renderer"
	@echo "$(p) make postinstall - run after dependencies installation"

postinstall: build-deps
	@if [ "$(SKIP_PATCH_PACKAGE)" = "true" ]; then \
		echo "Patch package skipped."; \
	else \
		echo "$(P) patch package"; \
		yarn patch-package; \
	fi
	@yarn keystone build --no-ui;
	@if [ "$(SKIP_PATCH_PACKAGE)" = "true" ]; then \
		echo "Patch package skipped."; \
	else \
		echo "$(P) patch package"; \
		yarn patch-package; \
	fi

build-deps:
	@if [ "$(SKIP_BUILD_DEPS)" = "true" ]; then \
		echo "Build skipped."; \
	else \
		echo "$(P) build core, draft-editor and draft-renderer"; \
		cd ../core; make build; \
		cd ../draft-editor; make build; \
		cd ../draft-renderer; make build; \
	fi

.PHONY: build-deps
