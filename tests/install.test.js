const assert = require('node:assert/strict');
const fs = require('node:fs');
const test = require('node:test');
const vm = require('node:vm');

const script = fs.readFileSync('install.js', 'utf8');

function setup({ installed = false, ios = false } = {}) {
  const listeners = {};
  const button = { hidden: false, addEventListener: (type, fn) => { button[type] = fn; } };
  const classes = new Set(['hidden']);
  const help = { classList: { add: value => classes.add(value), remove: value => classes.delete(value) } };
  const close = { addEventListener: (type, fn) => { close[type] = fn; } };
  const media = { matches: installed, addEventListener: (type, fn) => { media[type] = fn; } };
  const elements = { installAppBtn: button, installHelp: help, closeInstallHelpBtn: close };
  const window = {
    navigator: { standalone: ios },
    matchMedia: () => media,
    addEventListener: (type, fn) => { listeners[type] = fn; }
  };
  vm.runInNewContext(script, { window, document: { getElementById: id => elements[id] }, console });
  return { button, classes, close, listeners, media };
}

test('shows and closes manual installation instructions when no prompt is available', async () => {
  const { button, classes, close } = setup();
  await button.click();
  assert.equal(classes.has('hidden'), false);
  close.click();
  assert.equal(classes.has('hidden'), true);
});

test('uses the browser install prompt and hides the button after installation', async () => {
  const { button, classes, listeners } = setup();
  let prevented = false;
  let prompted = 0;
  listeners.beforeinstallprompt({
    preventDefault() { prevented = true; },
    async prompt() { prompted++; }
  });
  await button.click();
  assert.equal(prevented, true);
  assert.equal(prompted, 1);
  await button.click();
  assert.equal(classes.has('hidden'), false);
  listeners.appinstalled();
  assert.equal(button.hidden, true);
  assert.equal(classes.has('hidden'), true);
});

test('hides installation controls when already installed', () => {
  assert.equal(setup({ installed: true }).button.hidden, true);
  assert.equal(setup({ ios: true }).button.hidden, true);
  const { button, media } = setup();
  media.matches = true;
  media.change();
  assert.equal(button.hidden, true);
});
