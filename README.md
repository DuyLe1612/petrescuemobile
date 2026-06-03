# petrescuemobile

## Project Overview

Mobile app for pet rescue with social feed, map-based discovery, and real-time chat. The app follows Clean Architecture and targets Expo Go for fast dev and Dev Client for native modules.

### Feature Scope

- Social media: posts, reactions, comments, user profiles.
- Map: shelter/rescue locations, pet listings by area, geofilters.
- Realtime chat: 1:1 chat, notifications, typing/presence, message read state.
- Realtime updates: live feed updates and chat message streaming.

## Architecture

- Expo Router (file-based routing) under `app/`
- Clean Architecture folder layout under `src/`:
  - `src/presentation`: UI/theme/hooks/components
  - `src/domain`: domain models & rules (base)
  - `src/application`: use-cases (base)
  - `src/infrastructure`: external integrations (base)
  - `src/libs`: shared utilities (base)

## Tech Stack

- Expo + React Native + TypeScript (strict)
- Expo Router for navigation
- NativeWind (TailwindCSS) for styling + `global.css`
- Gluestack UI components
- react-native-reanimated

## Getting Started

### Installation

Install the project dependencies using npm:

```bash
npm install
```

### Running the Project

Start the Expo development server in **Expo Go** mode:

```bash
npx expo start --go
```

#### Platform-specific instructions:
- **Android Dev**: Press `a` in the terminal to open the app on an Android emulator or a connected device. Make sure to run `adb reverse` if your local API server needs to be accessible from the device:
  ```bash
  adb reverse tcp:8081 tcp:8081
  ```
- **iOS Dev**: Scan the QR code printed in the terminal using the iOS Camera app to open the project in Expo Go.

For running the app in a **Dev Client** (which includes native modules):
```bash
npx expo run:android
```

## API Client

- Regenerate the OpenAPI client after backend spec changes:
  - `npm run api:generate`
- Orval reads from `https://pet-rescue-api-0uhx.onrender.com/api-docs` by default through `orval.config.cjs`.

## Coding Rules

- Keep `app/` for routing only. UI logic belongs in `src/presentation`.
- Domain is framework-agnostic: only types/entities/interfaces, no API code.
- Application use-cases orchestrate only, no side effects or HTTP.
- Infrastructure owns HTTP, storage, and platform-specific code.
- DTO naming: `*RequestDto`, `*ResponseDto` in `src/application/dto/**`.
- API client DTOs: `Api*Request`, `Api*Response` in `src/infrastructure/api/**`.
- Repository interface returns domain entities; repository implementations map API DTOs -> domain.
- One source of truth for each DTO type; avoid duplicates with inconsistent names.
- Store tokens in `src/infrastructure/storage/` and never access storage directly in UI.

See `ARCHITECTURE.md` for a compact checklist and conventions.

## API Contract Convention

- Domain: `LoginRequest`, `AuthResponse` in `src/domain/entities/auth.ts`.
- Application DTOs: `LoginRequestDto`, `AuthResponseDto` in `src/application/dto/auth/`.
- API DTOs: `ApiLoginRequest`, `ApiLoginResponse`, `ApiUser` in `src/infrastructure/api/auth/`.
- Repository maps API DTOs -> domain entities (no direct API DTO usage in domain/application).

## Session Flow

- On app start: load tokens, validate, and redirect to `(tabs)` or `login`.
- If access token expired: call refresh endpoint once, then retry pending request.
- If refresh fails: clear storage and redirect to `login`.
- Keep the session bootstrap in `app/_layout.tsx` with a thin hook from `src/presentation`.
