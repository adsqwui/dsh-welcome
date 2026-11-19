# dsh-welcome

A DeepSeek Harness plugin that replaces the logo, headline and Preview badge on the blank chat screen with a random greeting. Set a name and the greeting uses it ("Welcome back, Alex"). Without one you get the plain version ("Welcome back").

Five greetings in eight interface languages: Russian, English, Chinese, Japanese, Spanish, French, German and Brazilian Portuguese. Other languages follow Harness's fallback chain. A greeting is picked when the screen mounts and stays the same while you type. Switching the interface language translates it in place.

It changes nothing else. Models, messages, credentials and session history are left alone.

## Install

```bash
git clone https://github.com/adsqwui/dsh-welcome.git
```

In DSH open **Plugin Manager**, install from the cloned folder and enable it.

## Set your name

Open **Plugins**, then the plugin's page. Type a name in **Name in the greeting**, check the preview under the field and press **Save**. The next time the blank chat screen opens it uses the new name; no restart needed. Clear the field and save to go back to greetings without a name. Names longer than 40 characters are refused, and extra spaces and control characters are dropped.

DSH stores the value in your profile's `cordis.patch.yml` (on macOS Desktop: `~/.dsh/profiles/desktop/cordis.patch.yml`), not in the plugin folder, so `git pull` never overwrites it. You can also set it there by hand:

```yaml
- id: dsh-welcome
  name: dsh-welcome
  config:
    name: Alex
```

The settings card uses the standard DSH settings form and needs DSH 0.2.2 or later. On a Host without it the greeting still works and reads the name from the profile.

## Compatibility

The plugin renders through the documented `conversation.hero.brand.mark` slot, so it keeps working across updates. The CSS that hides the stock headline matches the Harness 0.2.2 hero markup by class-name fragments. If a future redesign changes that markup, the greeting still shows, but the stock headline may show next to it until the selectors in `client.js` are updated.

## Tests

```bash
npm test
```

## License

MIT, see [LICENSE](LICENSE). The speech-bubble icon is original artwork made for this plugin.
