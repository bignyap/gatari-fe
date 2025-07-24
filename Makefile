# Package manager (npm or yarn)
PKG_MANAGER := npm

# Commands
INSTALL     := $(PKG_MANAGER) install
START       := $(PKG_MANAGER) start
BUILD       := $(PKG_MANAGER) run build
TEST        := $(PKG_MANAGER) test --watchAll=false
LINT        := $(PKG_MANAGER) run lint
FORMAT      := $(PKG_MANAGER) run format
CLEAN_CMD   := rm -rf node_modules dist build

# Docker config
IMAGE_NAME      := my-react-app
CONTAINER_NAME  := my-react-app-container
PORT            := 3000

# Main targets
.PHONY: all install start build test lint format clean \
        build-container start-container stop-container \
        docker-rebuild scan build-prod

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
	$(CLEAN_CMD)

# Docker targets
build-container:
	docker build -t $(IMAGE_NAME) .

start-container:
	docker run --rm -d -p $(PORT):80 --name $(CONTAINER_NAME) $(IMAGE_NAME)

stop-container:
	docker stop $(CONTAINER_NAME) || true

docker-rebuild: clean build build-container

# Optional scan with Trivy
scan:
	trivy image $(IMAGE_NAME)

# Build with custom env (e.g. for CI/CD)
build-prod:
	REACT_APP_ENV=production $(BUILD)