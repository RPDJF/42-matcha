# MatchaFrontend

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.2.3.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

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
