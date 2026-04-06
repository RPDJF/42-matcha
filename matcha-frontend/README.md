# 🧩 Matcha Frontend

> Frontend for the 42 Matcha project — a 42 school project.

This repository contains the Angular frontend. The instructions below explain the project layout and available scripts.

## Quick Start

- **Install deps:** `npm install`
- **Dev server:** `npm run start:dev` (defaults to `http://localhost:4200`)
- **Production serve (local):** `npm run start`
- **Build:** `npm run build` → outputs into `dist/`
- **Tests:** `npm run test`

## Project Info

- **Framework:** `Angular` (v21.x)
- **Package manager:** npm (see `package.json`)
- **Styling:** `Tailwind CSS` + utility classes

## Directory Structure

Top-level files/folders you care about:

- `angular.json`: Angular workspace configuration.
- `package.json`: NPM scripts & dependencies.
- `scripts/`: helper scripts used at build time (`buildIcons.ts`, `translate.ts`).
- `src/` — main frontend source:
  - `src/index.html` — main HTML entry.
  - `src/main.ts` — Angular bootstrap.
  - `src/styles.css` — global styles (Tailwind entry).
  - `src/app/` — application sources:
    - `app.component.*` — root component files.
    - `app.routes.ts` — routing configuration.
    - `components/` — reusable UI components (icons, layout, spinner, sidemenu, notification list, etc.).
    - `core/` — app core logic, services, stores (e.g. `stores/i18n`).
    - `directives/` — custom directives.
    - `helpers/` — mocks and small helpers.
    - `modals/` — modal components.
    - `pages/` — route pages: `authentification`, `discover`, `notifications`, etc.
  - `src/assets/` — static assets:
    - `assets/i18n/` — many locale JSON files used by the app (translations).
    - `assets/images/` — icons and images.

## Important files

- `environments/environment.ts` and `environments/environment.dev.ts` — environment-specific settings (API URLs, flags).
- `tailwind.config.js` and `postcss` setup — Tailwind tooling.

## NPM Scripts

- `npm run ng` : helper wrapper for the Angular CLI.
- `npm run start` : `ng serve --configuration production` — serve with production configuration.
- `npm run start:dev` : `ng serve --configuration=development` — development server.
- `npm run build` : `ng build` — produce a production build.
- `npm run build:translations` : `node scripts/translate.ts` — build translations.
- `npm run build:icons` : `node scripts/buildIcons.ts` — generate icon assets.
- `npm run watch` : `ng build --watch --configuration development` — watch build.
- `npm run test` : `ng test` — run unit tests (Jest setup present).
- `npm run format` : `prettier --write "src/**/*.{ts,html,css,scss}"` — format code.
- `npm run format:check` : `prettier --check "src/**/*.{ts,html,css,scss}"` — check formatting.

## Icons

This project uses normalized icons. For any icons you add in `src/assets/images/icons`, don't forget to run

```bash
npm run build:icons
```

It will update icon types in `src/app/components/icon/icon.generated.types.ts`

### Icon Gallery

Icon gallery is automaticall generated from the build script

[Icon Gallery](src/app/components/icon/README.md)

## Auto translations

This project includes an automated translation pipeline that uses **LibreTranslate** to generate missing i18n keys. It automatically scans your HTML templates (i18n pipes) and TypeScript files (`translate()` calls) to identify keys that are missing from your language files.

### Prerequisites

- **Docker**: The script automatically manages a LibreTranslate container.
- **Source Language**: The script is configured to use **French** as the source language for all translations.

### How to use

To scan the project for new strings and translate them into all supported languages, run:

```bash
npm run build:translations
```

### Features

- **Tag Protection**: Handles complex markups like `{#link}text{/link}` and curly brace variables `{variable}` by masking them as HTML spans during translation. This prevents the engine from breaking the code structure.
- **Incremental Updates**: Only missing keys are sent to the API. Existing translations in your `src/assets/i18n/*.json` files are preserved.
- **Automatic Sorting**: Newly generated JSON files are automatically sorted alphabetically by key to maintain a clean git history.
- **Docker Integration**: Automatically detects if `sudo` is required and handles the lifecycle (start/stop) of the `libretranslate` container.

### Supported Languages

The tool currently supports over 40 languages, including English, Spanish, German, Japanese, Chinese, and more. To add a new language, simply add it to the `supportedLanguages` map in the translation script.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
