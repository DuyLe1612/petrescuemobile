# Minimal Architecture Checklist

This file documents a compact, practical architecture checklist tailored for a small mobile team using Expo, TypeScript, and React Native.

Core principles

- Keep it simple: Presentation → Application (UseCases) → Domain → Infrastructure.
- Domain contains only types/entities and repository ports (no framework imports).
- UseCases are thin: orchestration + validation only.
- Repositories implement API contracts and perform mapping from API DTOs → Domain.

DTO rules (minimal)

- Domain DTOs: business types used across UseCases and UI.
- App DTOs: UI ↔ UseCase payloads (optional thin wrappers).
- API DTOs: transport contracts; mapped inside repositories.

Auth & Session (required)

- Token storage: use `expo-secure-store` on native, `localStorage` fallback on web.
- Bootstrap on app start: try refresh if no access token and register a refresh handler with the HTTP client.
- HTTP client: centralize error mapping, 401 handler that performs single in-flight refresh and retries original request.
- On refresh failure: clear session and redirect to login.

Native modules and Expo

- Avoid native-only modules for Expo Go compatibility. If required, document and gate behind a Dev Client/EAS Build.

Error handling & retries

- Retry only idempotent calls (GET) automatically; for 401 use refresh+retry flow.
- Map HTTP errors to an `ApiError` shape consumed by UI.

Testing & CI

- Unit test UseCases and mapping functions.
- Add a lightweight integration test for the refresh-on-401 flow (mock HTTP).
- CI runs: `lint`, `typecheck`, `test`.

Developer ergonomics

- Keep DI explicit and small (feature modules exporting `useCase` and `repository` instances).
- Document per-feature README (purpose, env vars, native requirements).

When to expand

- Introduce heavier mapping layers only when mappings proliferate across many endpoints.
- Add more infrastructure abstraction only when it reduces duplication or improves testability.

Reference: keep this file small and review at major refactors.
