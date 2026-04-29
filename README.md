# AutoOps AI ⚡️

[![Elite Developer Project](https://img.shields.io/badge/Status-Developer%20Elite-blueviolet?style=for-the-badge)](https://github.com/erikbabcan/autoops-ai)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![Vitest](https://img.shields.io/badge/Tests-Vitest-yellow?style=for-the-badge&logo=vitest)](https://vitest.dev/)

Autonomous Operations Agent PWA for small e-shops and SMBs. Built as a high-performance **Vite + React Router v7** application.

## 🚀 Elite Stack & Tooling

- **Core**: React 19 + TypeScript + Vite 6
- **Routing**: React Router v7 (App Router-style)
- **UI/UX**: Tailwind CSS + shadcn/ui + Framer Motion (Cyber-radial Design)
- **State**: TanStack Query v5 + Zustand + Jotai
- **Reliability**: Vitest + React Testing Library + Zod
- **Workflow**: Husky + lint-staged + Commitlint (Conventional Commits)
- **DX**: Makefile shortcuts for rapid development

## 🛠 Project setup

This project uses a `Makefile` to streamline the development experience.

```bash
# Full setup (install, hooks, env)
make setup

# Start development server
make dev

# Run tests
make test

# Lint and format
make lint
```

## 📂 Folder structure

```txt
src/
├── app/          # Routing, Providers, Globals
├── components/   # UI & Domain components
├── lib/          # Action Graph engine & Shared logic
├── hooks/        # Custom React hooks
├── store/        # State management (Zustand/Jotai)
├── api/          # Data fetching & Mock layer
├── test/         # Test setup & global mocks
└── assets/       # Static assets
```

## 🏗 Architecture Notes

### Auth
`src/api/auth.ts` abstracts Supabase magic-link auth with a local mock provider.

### Action Graph
The graph builder is dependency-light, using native drag/drop and a custom engine in `src/lib/action-graph`.

### PWA & Offline
Configured via `vite.config.ts` for 7-day runtime caching and app-shell fallback.

## 📜 Contributing
Please refer to [CONTRIBUTING.md](./CONTRIBUTING.md) for architectural guidelines and coding standards.

## ⚖️ License
This project is licensed under the [MIT License](./LICENSE).

## Suggested next production steps

1. Add a backend API boundary for integration secrets and OAuth token storage.
2. Add row-level authorization for workspaces and users.
3. Replace mock action execution with an audited queue, for example Temporal, Trigger.dev, BullMQ, or cloud-native workflows.
4. Add signed webhook ingestion for Shopify/WooCommerce/Gmail events.
5. Add OpenTelemetry traces for every autonomous action.
6. Require human approval for refunds, accounting mutations, negative sentiment complaints and low-confidence replies.
