window.__ModuleLoader__.load({
  id: 'dsh-welcome',
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
    const greeting = (t, key, name) => name ? t(key).replace('{name}', name) : t(key + '.plain');
    // The headline and Preview badge are hidden only while this component is mounted.
    // These selectors follow the Harness 0.2.2 hero markup and may need updating after a redesign.
    const css = `
      [data-conversation-content] [class*="fishHitbox"]:has([data-dsh-welcome]) { display: contents; }
      [data-conversation-content] [class*="fishHitbox"]:has([data-dsh-welcome]) + [class*="titleGroup"] { display: none; }
      [data-dsh-welcome] { text-align: center; white-space: normal; overflow-wrap: anywhere; }
    `;
    return {
      inject: ['slots', 'locale', 'connection'],
      apply(ctx) {
        // The name lives in the Host config; it is read once per page and shared by every mount.
        let loaded;
        const loadName = () => loaded ??= ctx.connection.rpc.call('/api', 'dsh-welcome/config', {})
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
      },
    };
  },
});
