# Auto Clicker Auto Fill

Auto click, fill, submit with AutoClicker

Fill input field or click button or link anything anywhere. easy configure in few steps and work like PRO.

---

## Table of Contents

1. [Overview](#overview)
   - [acf-extension](#acf-extension)
   - [acf-i18n](#acf-i18n)
   - [acf-options-page](#acf-options-page)
2. [Changes](#changes)
3. [Running Tasks](#running-tasks)

---

## Overview

This project is divided into three main components, each serving a specific purpose.

### acf-extension

The `acf-extension` is a Chrome extension designed to [provide a short description of what the extension does].

### acf-i18n

The `acf-i18n` component is responsible for managing language translations. It ensures the project is accessible to users across different linguistic backgrounds.

### acf-options-page

The `acf-options-page` serves as the configuration page for your project. Users can customize settings and preferences through this interface.

---

## Changes

Before getting started, make sure to create a new `.env` file from the provided `.env.example` under the `acf-extension` and `acf-options-page` directories.

---

## Running Tasks

Follow these steps to set up and run the project:

1. Install dependencies:

   ```bash
   npm i
   ```

2. Install Nx globally:

   ```bash
   npm i nx --global
   ```

3. Serve the components:

   ```bash
   nx run-many -t serve
       - acf-extension
       - acf-options-page
       - acf-i18n
   ```

4. Run linting:

   ```bash
   nx run-many -t lint
   ```

5. Run testing:

   ```bash
   nx run-many -t test
   ```

6. Run Format:

   ```bash
   nx format:check
   ```

---

## Important Links

- [Docs](https://stable.getautoclicker.com/docs/3.x/getting-started/introduction/)
- [Examples](https://gist.github.com/dharmesh-hemaram)
- [Blog](https://blog.getautoclicker.com/)
- Variant
  - [Stable](https://stable.getautoclicker.com)
  - [Beta](https://beta.getautoclicker.com)
  - [Dev](https://dev.getautoclicker.com)
- [Google Group](https://groups.google.com/g/auto-clicker-autofill)
- [GitHub](https://github.com/Dhruv-Techapps)
- [Twitter](https://twitter.com/dharmeshhemaram)
- [Open Collective](https://opencollective.com/auto-clicker-autofill)
- [Discord](https://discord.gg/vmnNfWKqnR)
- [YouTube](https://www.youtube.com/@autoclickerautofill)
