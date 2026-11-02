# AnimeNest

AnimeNest is a cross-platform mobile app (iOS, Android, web) for discovering anime. It uses the [AniList](https://anilist.co) API to browse anime lists and view anime details, and lets you build your own watch list.

Built with [Expo](https://expo.dev), React Native and [Expo Router](https://docs.expo.dev/router/introduction).

## Features

- Browse anime lists powered by the [AniList GraphQL API](https://docs.anilist.co/)
- View detailed information for each anime
- Create and manage a personal watch list

- **Bundle / package ID:** `com.smp.animenest`
- **URL scheme:** `animenest://`
- **Expo SDK:** 58

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the dev server

   ```bash
   npx expo start
   ```

## Run on a device or simulator

The native `ios/` and `android/` folders are generated (Continuous Native Generation) and gitignored. Don't edit them by hand; configure native behavior in `app.json` and config plugins.

| Command | What it does |
| --- | --- |
| `npm run ios` | Build and run on the iOS simulator |
| `npm run android` | Build and run on an Android emulator or device |
| `npm run web` | Start the web version |
| `npm run lint` | Lint the project |
| `npx tsc --noEmit` | Typecheck |

To regenerate the native projects after changing `app.json`, icons or plugins:

```bash
npx expo prebuild --clean
```

## Project structure

```
src/
  app/          Routes (file-based routing; _layout.tsx defines navigators)
  components/   Shared UI components
  constants/    Theme and other constants
  hooks/        Custom hooks
assets/images/  App icon, adaptive icon, splash and favicon
```

Keep non-route code outside `src/app/`.

## Building and releasing

Builds and updates are handled with [EAS](https://docs.expo.dev/eas/):

```bash
npx eas-cli@latest build
npx eas-cli@latest submit
npx eas-cli@latest update
```

## Learn more

- [Expo documentation](https://docs.expo.dev/)
- [Expo Router](https://docs.expo.dev/router/introduction)
- [Development builds](https://docs.expo.dev/develop/development-builds/introduction/)
