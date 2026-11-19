import Schema from '@deepseek-ai/schemastery';

export { name, inject, apply } from './host.js';

// .volatile() is what lets the Plugins page edit a field and apply it without a restart.
// It exists from schemastery 3.18.3; an older host keeps the value static instead of failing to load.
const live = schema => typeof schema.volatile === 'function' ? schema.volatile() : schema;

export const Config = Schema.object({
  name: live(Schema.string().default('').description('Name used in the greeting. Leave empty for greetings without a name.')),
});
