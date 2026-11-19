window.__ModuleLoader__.load({
  id: '@adsqwui/dsh-welcome',
  factory(require) {
    const React = require('react');
    const keys = ['hello', 'welcome', 'return', 'ready', 'good'];
    // Each key has a named form ({name} is replaced) and a plain form for when no name is set.
    const dictionaries = {
      ru: {
        hello: 'Приветствую, {name}', 'hello.plain': 'Приветствую',
        welcome: 'Рад тебя видеть, {name}', 'welcome.plain': 'Рад тебя видеть',
        return: 'С возвращением, {name}', 'return.plain': 'С возвращением',
        ready: 'Что создадим сегодня, {name}?', 'ready.plain': 'Что создадим сегодня?',
        good: 'Привет, {name}', 'good.plain': 'Привет',
      },
      en: {
        hello: 'Greetings, {name}', 'hello.plain': 'Greetings',
        welcome: 'Good to see you, {name}', 'welcome.plain': 'Good to see you',
        return: 'Welcome back, {name}', 'return.plain': 'Welcome back',
        ready: 'What shall we create today, {name}?', 'ready.plain': 'What shall we create today?',
        good: 'Hello, {name}', 'good.plain': 'Hello',
      },
      zh: {
        hello: '你好，{name}', 'hello.plain': '你好',
        welcome: '很高兴见到你，{name}', 'welcome.plain': '很高兴见到你',
        return: '欢迎回来，{name}', 'return.plain': '欢迎回来',
        ready: '今天我们来创造些什么，{name}？', 'ready.plain': '今天我们来创造些什么？',
        good: '嗨，{name}', 'good.plain': '嗨',
      },
      ja: {
        hello: 'こんにちは、{name}', 'hello.plain': 'こんにちは',
        welcome: '会えてうれしいです、{name}', 'welcome.plain': '会えてうれしいです',
        return: 'おかえりなさい、{name}', 'return.plain': 'おかえりなさい',
        ready: '今日は何を作りましょうか、{name}？', 'ready.plain': '今日は何を作りましょうか？',
        good: 'ようこそ、{name}', 'good.plain': 'ようこそ',
      },
      es: {
        hello: 'Saludos, {name}', 'hello.plain': 'Saludos',
        welcome: 'Qué gusto verte, {name}', 'welcome.plain': 'Qué gusto verte',
        return: 'Te damos la bienvenida de nuevo, {name}', 'return.plain': 'Te damos la bienvenida de nuevo',
        ready: '¿Qué creamos hoy, {name}?', 'ready.plain': '¿Qué creamos hoy?',
        good: 'Hola, {name}', 'good.plain': 'Hola',
      },
      fr: {
        hello: 'Bonjour, {name}', 'hello.plain': 'Bonjour',
        welcome: 'Ça fait plaisir de te voir, {name}', 'welcome.plain': 'Ça fait plaisir de te voir',
        return: 'Bon retour, {name}', 'return.plain': 'Bon retour',
        ready: 'Que créons-nous aujourd’hui, {name} ?', 'ready.plain': 'Que créons-nous aujourd’hui ?',
        good: 'Salut, {name}', 'good.plain': 'Salut',
      },
      de: {
        hello: 'Sei gegrüßt, {name}', 'hello.plain': 'Sei gegrüßt',
        welcome: 'Schön, dich zu sehen, {name}', 'welcome.plain': 'Schön, dich zu sehen',
        return: 'Willkommen zurück, {name}', 'return.plain': 'Willkommen zurück',
        ready: 'Was erschaffen wir heute, {name}?', 'ready.plain': 'Was erschaffen wir heute?',
        good: 'Hallo, {name}', 'good.plain': 'Hallo',
      },
      pt: {
        hello: 'Boas-vindas, {name}', 'hello.plain': 'Boas-vindas',
        welcome: 'Que bom ver você, {name}', 'welcome.plain': 'Que bom ver você',
        return: 'Que bom ter você de volta, {name}', 'return.plain': 'Que bom ter você de volta',
        ready: 'O que vamos criar hoje, {name}?', 'ready.plain': 'O que vamos criar hoje?',
        good: 'Olá, {name}', 'good.plain': 'Olá',
      },
    };
    // Copy for the settings card on the Plugins page; registered in the same namespace as the greetings.
    const settings = {
      ru: ['Имя в приветствии', 'Оставьте пустым, чтобы приветствовать без имени.', 'Например, Алекс', 'Не длиннее 40 символов', 'Так это будет выглядеть', 'Изменено', 'Сбросить', 'Настройки недоступны: DSH сейчас не отдаёт их этому окну.', 'Настройки этого профиля доступны только для чтения.', 'Не удалось сохранить. Попробуйте ещё раз.', 'Сохранить', 'Сохраняю…'],
      en: ['Name in the greeting', 'Leave empty to greet without a name.', 'For example, Alex', '40 characters at most', 'Preview', 'Changed', 'Reset', 'Settings are unavailable: DSH is not serving them to this window.', 'This profile’s settings are read-only.', 'Could not save. Try again.', 'Save', 'Saving…'],
      zh: ['问候中的名字', '留空则不带名字问候。', '例如 Alex', '最多 40 个字符', '预览', '已修改', '重置', '设置不可用：DSH 当前未向此窗口提供设置。', '此配置文件的设置为只读。', '保存失败，请重试。', '保存', '正在保存…'],
      ja: ['あいさつに使う名前', '空欄にすると名前なしであいさつします。', '例: Alex', '40 文字以内', 'プレビュー', '変更済み', 'リセット', '設定を利用できません。DSH がこのウィンドウに設定を提供していません。', 'このプロファイルの設定は読み取り専用です。', '保存できませんでした。もう一度お試しください。', '保存', '保存中…'],
      es: ['Nombre en el saludo', 'Déjalo vacío para saludar sin nombre.', 'Por ejemplo, Alex', '40 caracteres como máximo', 'Vista previa', 'Modificado', 'Restablecer', 'La configuración no está disponible: DSH no la está sirviendo a esta ventana.', 'La configuración de este perfil es de solo lectura.', 'No se pudo guardar. Inténtalo de nuevo.', 'Guardar', 'Guardando…'],
      fr: ['Nom dans le message d’accueil', 'Laissez vide pour un accueil sans nom.', 'Par exemple, Alex', '40 caractères maximum', 'Aperçu', 'Modifié', 'Réinitialiser', 'Réglages indisponibles : DSH ne les fournit pas à cette fenêtre.', 'Les réglages de ce profil sont en lecture seule.', 'Échec de l’enregistrement. Réessayez.', 'Enregistrer', 'Enregistrement…'],
      de: ['Name in der Begrüßung', 'Leer lassen für eine Begrüßung ohne Namen.', 'Zum Beispiel Alex', 'Höchstens 40 Zeichen', 'Vorschau', 'Geändert', 'Zurücksetzen', 'Einstellungen nicht verfügbar: DSH stellt sie diesem Fenster nicht bereit.', 'Die Einstellungen dieses Profils sind schreibgeschützt.', 'Speichern fehlgeschlagen. Bitte erneut versuchen.', 'Speichern', 'Wird gespeichert…'],
      pt: ['Nome na saudação', 'Deixe vazio para saudar sem nome.', 'Por exemplo, Alex', 'No máximo 40 caracteres', 'Prévia', 'Alterado', 'Redefinir', 'Configurações indisponíveis: o DSH não as está fornecendo a esta janela.', 'As configurações deste perfil são somente leitura.', 'Não foi possível salvar. Tente novamente.', 'Salvar', 'Salvando…'],
    };
    const settingsKeys = ['label', 'hint', 'placeholder', 'invalid', 'preview', 'overridden', 'reset', 'unavailable', 'readOnly', 'saveFailed', 'save', 'saving'];
    for (const [lang, copy] of Object.entries(settings)) {
      settingsKeys.forEach((key, index) => { dictionaries[lang]['settings.' + key] = copy[index]; });
    }
    const greeting = (t, key, name) => name ? t(key).replace('{name}', name) : t(key + '.plain');
    // Same cleaning as the Host, so the preview shows exactly what will be stored.
    const MAX_NAME = 40;
    const cleanName = text => String(text).replace(/[\x00-\x1f\x7f]/g, '').replace(/\s+/g, ' ').trim();
    const nameField = {
      field: 'name',
      format: value => typeof value === 'string' ? value : '',
      parse: text => {
        const value = cleanName(text);
        if (value === '') return { kind: 'clear' };
        return value.length > MAX_NAME ? undefined : { kind: 'set', value };
      },
    };
    let ui = null;
    try { ui = require('@deepseek-ai/dsh-client-ui-primitives'); } catch { ui = null; }
    // Host components may be forwardRef/memo objects, not functions.
    const component = value => typeof value === 'function' || (typeof value === 'object' && value !== null);
    const settingsSupported = Boolean(ui && typeof ui.SettingsFormModel === 'function'
      && component(ui.SettingsForm) && component(ui.SettingsValueField));

    function WelcomeSettings({ t, view, useWelcomeSettings, edit, resetField, save, discard }) {
      if (view === 'summary' || !useWelcomeSettings || !edit) return null;
      const state = useWelcomeSettings(snapshot => snapshot);
      const field = state.field;
      const preview = field.invalid ? '' : greeting(t, 'return', cleanName(field.text));
      return React.createElement(ui.SettingsForm, {
        labels: { unavailable: t('settings.unavailable'), readOnly: t('settings.readOnly'), saveFailed: t('settings.saveFailed'), save: t('settings.save'), saving: t('settings.saving') },
        state, onSave: save, onDiscard: discard,
      },
      React.createElement(ui.SettingsValueField, {
        id: 'dsh-welcome-name', label: t('settings.label'), hint: t('settings.hint'), placeholder: t('settings.placeholder'),
        text: field.text, overridden: field.overridden, invalid: field.invalid,
        overriddenLabel: t('settings.overridden'), resetLabel: t('settings.reset'), invalidLabel: t('settings.invalid'),
        disabled: !state.writable || state.saving,
        onEdit: text => edit('name', text), onReset: () => resetField('name'),
      }),
      preview ? React.createElement('p', { 'data-dsh-welcome-preview': '', style: { margin: '4px 0 0', fontSize: 13, opacity: 0.72 } }, `${t('settings.preview')}: ${preview}`) : null);
    }
    // The headline and Preview badge are hidden only while this component is mounted.
    // These selectors follow the Harness 0.2.2 hero markup and may need updating after a redesign.
    const css = `
      [data-conversation-content] [class*="headline"]:has([data-dsh-welcome]) { display: flex !important; }
      [data-conversation-content] [class*="fishHitbox"]:has([data-dsh-welcome]),
      [data-conversation-content] [class$="_fish"]:has([data-dsh-welcome]) { display: contents !important; }
      [data-conversation-content] [class*="fishHitbox"]:has([data-dsh-welcome]) + [class*="titleGroup"] { display: none; }
      [data-dsh-welcome] { display: inline !important; visibility: visible !important; text-align: center; white-space: normal; overflow-wrap: anywhere; }
    `;
    return {
      inject: ['slots', 'locale', 'connection'],
      apply(ctx) {
        // The name lives in the Host config and can change from the Plugins page, so every mount asks again.
        const loadName = () => ctx.connection.rpc.call('/api', 'dsh-welcome/config', {})
          .then(result => result?.ok && typeof result.value?.name === 'string' ? result.value.name : '', () => '');
        function Welcome({ t }) {
          const [key] = React.useState(() => keys[Math.floor(Math.random() * keys.length)]);
          const [name, setName] = React.useState(null);
          React.useEffect(() => {
            let live = true;
            loadName().then(value => { if (live) setName(value); });
            return () => { live = false; };
          }, []);
          // Render nothing until the name arrives so the greeting does not flash without it.
          if (name === null) return null;
          return React.createElement(React.Fragment, null,
            React.createElement('style', null, css),
            React.createElement('span', { 'data-dsh-welcome': '' }, greeting(t, key, name)));
        }
        ctx.effect(() => ctx.locale.register('dsh-welcome', dictionaries));
        ctx.slots.inject('conversation.hero.brand.mark', () => ctx.slots.register({
          name: 'conversation.hero.brand.mark', priority: -100, locale: 'dsh-welcome',
        }, Welcome));
        // The settings card is optional: without the settings service or these primitives the greeting still works.
        if (!settingsSupported || typeof ctx.inject !== 'function') return;
        ctx.inject(['slots', 'configForms'], scope => {
          try { registerSettings(scope); } catch (error) { console.warn('[dsh-welcome] settings card unavailable:', error); }
        });
        function registerSettings(scope) {
          const model = new ui.SettingsFormModel(scope.configForms.get('dsh-welcome'), [nameField]);
          scope.effect(() => () => model.dispose());
          const store = model.bind(() => ({ ...model.shell(), field: model.field('name') }));
          scope.effect(() => scope.configForms.whileServed(['dsh-welcome'], () => scope.slots.inject('plugins.bundle.config', () => scope.slots.register({
            name: 'plugins.bundle.config', key: '@adsqwui/dsh-welcome', locale: 'dsh-welcome',
            inject: () => ({ hooks: { welcomeSettings: store }, ...model.actions() }),
          }, WelcomeSettings))));
        }
      },
    };
  },
});
