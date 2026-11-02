This is a React Native CLI (bare workflow) mobile app, not an Expo app. Prioritize mobile-first patterns, performance, and iOS/Android compatibility. The previous Expo version lives on the `expo` branch.

## Commands

```bash
npm install                 # install dependencies
cd ios && pod install       # after adding/removing native dependencies (or: npm run pods)
npx react-native start      # start Metro
npm run ios                 # build and run on the iOS simulator
npm run android             # build and run on an Android emulator or device
npm run lint                # eslint (includes prettier rules)
npm run typecheck           # tsc --noEmit
npm test                    # jest
```

Run lint, typecheck and tests before declaring any task done.

## Structure

- `src/screens/` — one file per screen. Keep them thin; logic lives in hooks.
- `src/navigation/` — React Navigation (native stack + bottom tabs) and typed route params (`types.ts`).
- `src/features/<feature>/` — `api`, `hooks`, `components` and helpers for a feature (`anime`, `schedule`, `watchlist`).
- `src/components/ui/` — shared building blocks (button, chip, rating, icon...).
- `src/lib/navigation.ts` — `openAnime` / `openGenre`, usable outside components via the navigation ref.
- Import with the `@/` alias (`@/` → `src/`, `@/assets` → `assets/`), configured in `babel.config.js` and `tsconfig.json`.

## Rules

- `ios/` and `android/` are committed and edited directly. After changing native dependencies run `pod install` in `ios/`.
- Native libraries need a rebuild (`npm run ios` / `npm run android`); Metro reload is not enough.
- Icons are inline SVG paths in `src/components/ui/icon.tsx` (no icon font). Add a path there to add an icon.
- Show scores only through `<Rating />` so unrated titles render consistently.
- Match the Prettier config (`.prettierrc.js`); `npm run lint` enforces it.
