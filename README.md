# petrescuemobile

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
