.PHONY: dev build lint typecheck test clean setup install

# Default target
all: dev

# Install dependencies
install:
	npm install

# Run development server
dev:
	npm run dev

# Build for production
build:
	npm run build

# Run linter
lint:
	npm run lint

# Run type checker
typecheck:
	npm run typecheck

# Run unit tests
test:
	npm run test:run

# Run E2E tests
test-e2e:
	npm run test:e2e

# Docker commands
docker-build:
	docker build -t autoops-ai .

docker-run:
	docker run -p 8080:80 autoops-ai

# Clean build artifacts
clean:
	rm -rf dist
	rm -rf .vite
	rm -rf coverage
	rm -rf playwright-report
	rm -rf test-results

# Full project setup
setup: install
	cp -n .env.example .env.local || true
	npx husky init
	@echo "Project is ready for elite development."
