# Contributing to AutoOps AI

Welcome to the AutoOps AI elite development team. This project is built for performance, reliability, and top-tier user experience.

## Developer Philosophy

1.  **Type Safety**: TypeScript is non-negotiable. Avoid `any` at all costs.
2.  **Performance**: Mobile-first PWA must be snappy. Optimize renders and use Jotai for granular state.
3.  **Aesthetics**: Follow the cyber-radial design system. Use `glass-panel` and `neon-border` utilities for consistency.
4.  **Testing**: New features require at least a smoke test.

## Getting Started

1.  **Clone and Setup**:
    ```bash
    make setup
    ```
2.  **Development**:
    ```bash
    make dev
    ```
3.  **Code Standards**:
    - We use Conventional Commits. Hooks will enforce this.
    - Run `make lint` before pushing.
    - Prettier will format on save/commit.

## Architecture Overview

- **`src/app`**: Routing, providers, and global styles.
- **`src/api`**: All backend/mock communication logic.
- **`src/components`**: UI components organized by domain.
- **`src/lib`**: Shared logic, security, and the Action Graph engine.
- **`src/store`**: Zustand and Jotai state management.

## Deployment

PWA builds are generated via `make build`. Ensure offline assets are properly cached in `vite.config.ts`.
