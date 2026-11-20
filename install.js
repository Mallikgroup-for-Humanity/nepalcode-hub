(() => {
  let installPrompt = null;
  const button = document.getElementById('installAppBtn');
  const help = document.getElementById('installHelp');
  const closeHelp = document.getElementById('closeInstallHelpBtn');
  const standalone = window.matchMedia('(display-mode: standalone)');

  function updateInstalledState() {
    if (standalone.matches || window.navigator.standalone) {
      button.hidden = true;
      help.classList.add('hidden');
    }
  }

  window.addEventListener('beforeinstallprompt', event => {
    event.preventDefault();
    installPrompt = event;
  });

  button.addEventListener('click', async () => {
    if (!installPrompt) {
      help.classList.remove('hidden');
      return;
    }

    const prompt = installPrompt;
    installPrompt = null;
    try {
      await prompt.prompt();
    } catch (error) {
      console.error('Unable to open the installation prompt:', error);
      help.classList.remove('hidden');
    }
  });

  closeHelp.addEventListener('click', () => help.classList.add('hidden'));
  window.addEventListener('appinstalled', () => {
    installPrompt = null;
    button.hidden = true;
    help.classList.add('hidden');
  });
  standalone.addEventListener('change', updateInstalledState);
  updateInstalledState();
})();
