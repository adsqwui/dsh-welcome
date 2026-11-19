# Contributing

Thanks for wanting to help. New languages, nicer greetings, bug fixes and docs are all welcome.

## Setup

```bash
git clone https://github.com/adsqwui/dsh-welcome.git
cd dsh-welcome
npm test
```

There is nothing to install. Node 22 or newer is required.

To try a change in DSH, install the folder through **Plugins → Add plugin** with its absolute path. DSH links to the folder, so after an edit you only need to restart Desktop.

## Adding a language

1. In `client.js`, add a block to `dictionaries` with all five greetings, each in a named form with `{name}` and a `.plain` form without it.
2. Add the twelve settings strings for the same language to `settings`, in the same order as the other languages.
3. Add the language code to the list in `tests/welcome.test.js` and run `npm test`. It fails if a key is missing.

Greetings should sound natural to a native speaker and stay short enough for one line.

## Pull requests

- One topic per PR, with a short description.
- `npm test` must pass; CI runs it on Node 22 and 24 on Linux and macOS.
- Keep `client.js` a single self-contained file: the DSH module loader runs it as one script.
- No runtime dependencies.
- Update the README when user-visible behaviour changes.

## Reporting a bug

Use the bug report form. Include your DSH version, the interface language and a screenshot of the blank chat screen if the layout looks wrong.
