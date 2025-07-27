# Package manager (npm or yarn)
PKG_MANAGER := npm

# Commands
INSTALL     := $(PKG_MANAGER) install
START       := $(PKG_MANAGER) start
BUILD       := $(PKG_MANAGER) run build
TEST        := $(PKG_MANAGER) test --watchAll=false
LINT        := $(PKG_MANAGER) run lint
FORMAT      := $(PKG_MANAGER) run format
CLEAN_CMD   := rm -rf node_modules dist build || true

# Docker config
IMAGE_NAME       := gatari-fe
CONTAINER_NAME   := gatari-fe-container
PORT             := 3000
DOCKER_NAMESPACE ?= yourdockerhubuser
PLATFORMS        := linux/amd64,linux/arm64
GIT_HASH         := $(shell git rev-parse --short HEAD)
GIT_TAG          := $(shell git describe --tags --exact-match 2>/dev/null)
CONTAINER_TAG    := $(if $(GIT_TAG),$(GIT_TAG),$(GIT_HASH))
CONTAINER_IMAGE  := $(DOCKER_NAMESPACE)/$(IMAGE_NAME):$(CONTAINER_TAG)
CONTAINER_IMAGE_LATEST := $(DOCKER_NAMESPACE)/$(IMAGE_NAME):latest

.PHONY: all install start build test lint format clean \
        build-container start-container stop-container \
        docker-rebuild scan build-prod docker-push

all: install build

install:
	$(INSTALL)

start:
	$(START)

build:
	$(BUILD)

test:
	$(TEST)

lint:
	$(LINT)

format:
	$(FORMAT)

clean:
	echo "🧹 Cleaning node_modules and build artifacts..."
	$(CLEAN_CMD)

# Local-only Docker targets
build-container:
	docker build -t $(IMAGE_NAME) .

start-container:
	docker run --rm -d -p $(PORT):80 --name $(CONTAINER_NAME) $(IMAGE_NAME)

stop-container:
	docker stop $(CONTAINER_NAME)

docker-rebuild: clean build build-container

# Optional security scan with Trivy
scan:
	trivy image $(IMAGE_NAME)

# Production React build
build-prod:
	REACT_APP_ENV=production $(BUILD)

# Multi-platform Docker build (for CI/CD)
docker-push:
	echo "📦 Building Docker image: $(CONTAINER_IMAGE)"
	docker buildx build \
		--platform=$(PLATFORMS) \
		--build-arg BINARY_NAME=$(IMAGE_NAME) \
		-t $(CONTAINER_IMAGE) \
		-t $(CONTAINER_IMAGE_LATEST) \
		$(if $(DOCKER_NAMESPACE),--push,--load) .