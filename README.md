# NepalCode Hub

NepalCode Hub is a browser-based GitHub repository studio. It lets you search for and explore GitHub repositories, inspect their files and README, preview HTML, and ask Gemini to explain or generate code. The app is a static HTML, CSS, and JavaScript project; it does not have a separate backend.

> **3D Viewing Note:** Standard GitHub Markdown renders static text and links, whereas browsers that support inline HTML/CSS/JS can render the interactive **3D Viewing Stage** below. You can also open the standalone 3D preview snippet inside any HTML previewer or `index.html` / `m.html`.

## Interactive 3D Viewing Stage

<details open>
<summary><strong>Click to toggle / view the 3D Repository Stage</strong></summary>

<div style="margin: 16px 0; padding: 20px; border-radius: 14px; background: radial-gradient(circle at top, #1e293b, #090d16 75%); color: #f8fafc; font-family: system-ui, -apple-system, sans-serif; overflow: hidden; border: 1px solid #334155;">
  <div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 10px; margin-bottom: 14px;">
    <div>
      <div style="font-size: 16px; font-weight: 700; letter-spacing: 0.4px;">NepalCode Hub — 3D Studio Deck</div>
      <div style="font-size: 12px; color: #94a3b8;">Drag or use the controls to tilt, spin, and inspect layers in 3D space</div>
    </div>
    <div style="display: flex; flex-wrap: wrap; gap: 8px;">
      <button type="button" onclick="window.__nch3d && window.__nch3d.nudge(-25, 20)" style="padding: 6px 10px; border-radius: 8px; border: 1px solid #475569; background: #1e293b; color: #f8fafc; cursor: pointer; font-size: 12px;">Tilt Left</button>
      <button type="button" onclick="window.__nch3d && window.__nch3d.nudge(25, -20)" style="padding: 6px 10px; border-radius: 8px; border: 1px solid #475569; background: #1e293b; color: #f8fafc; cursor: pointer; font-size: 12px;">Tilt Right</button>
      <button type="button" onclick="window.__nch3d && window.__nch3d.toggleSpin()" style="padding: 6px 10px; border-radius: 8px; border: 1px solid #38bdf8; background: #0f172a; color: #7dd3fc; cursor: pointer; font-size: 12px;">Auto-Orbit</button>
      <button type="button" onclick="window.__nch3d && window.__nch3d.reset()" style="padding: 6px 10px; border-radius: 8px; border: 1px solid #475569; background: #1e293b; color: #f8fafc; cursor: pointer; font-size: 12px;">Reset View</button>
    </div>
  </div>

  <div id="nch-3d-viewport" style="height: 290px; display: flex; align-items: center; justify-content: center; perspective: 950px; cursor: grab; user-select: none; touch-action: none;">
    <div id="nch-3d-scene" style="position: relative; width: 240px; height: 165px; transform-style: preserve-3d; transform: rotateX(18deg) rotateY(-24deg); transition: transform 0.12s ease-out;">
      <!-- Back / Architecture Layer -->
      <div style="position: absolute; inset: 0; border-radius: 14px; background: rgba(30, 41, 59, 0.88); border: 1px solid rgba(148, 163, 184, 0.35); transform: translateZ(-48px); padding: 14px; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 18px 40px rgba(0,0,0,0.45);">
        <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #94a3b8;">Layer 01 • Static Core</span>
        <div style="font-size: 13px; color: #e2e8f0;">HTML • CSS • JS • No Backend</div>
        <span style="font-size: 11px; color: #64748b;">Vercel Rewrite Ready</span>
      </div>

      <!-- Middle / Files & Preview Layer -->
      <div style="position: absolute; inset: 0; border-radius: 14px; background: rgba(15, 23, 42, 0.92); border: 1px solid rgba(56, 189, 248, 0.45); transform: translateZ(0px); padding: 14px; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 18px 40px rgba(0,0,0,0.5);">
        <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #38bdf8;">Layer 02 • Repo Explorer</span>
        <div style="font-size: 14px; font-weight: 600; color: #f8fafc;">index.html &amp; m.html</div>
        <span style="font-size: 11px; color: #bae6fd;">Sandboxed HTML Preview</span>
      </div>

      <!-- Front / Gemini & Keys Layer -->
      <div style="position: absolute; inset: 0; border-radius: 14px; background: linear-gradient(135deg, rgba(14, 165, 233, 0.25), rgba(99, 102, 241, 0.25)); backdrop-filter: blur(6px); border: 1px solid rgba(125, 211, 252, 0.65); transform: translateZ(48px); padding: 14px; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 22px 45px rgba(2, 132, 199, 0.25);">
        <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #e0f2fe;">Layer 03 • Gemini Studio</span>
        <div style="font-size: 14px; font-weight: 700; color: #ffffff;">Explain • Generate • Save</div>
        <span style="font-size: 11px; color: #e0f2fe;">Client-Side localStorage</span>
      </div>
    </div>
  </div>

  <div id="nch-3d-readout" style="margin-top: 10px; font-size: 12px; color: #94a3b8; display: flex; justify-content: space-between; flex-wrap: wrap; gap: 8px;">
    <span>Orientation: X <strong id="nch-rx">18°</strong> · Y <strong id="nch-ry">-24°</strong></span>
    <span>Tip: Drag directly on the 3D card stack</span>
  </div>
</div>

<script>
(function () {
  const viewport = document.getElementById('nch-3d-viewport');
  const scene = document.getElementById('nch-3d-scene');
  const rxEl = document.getElementById('nch-rx');
  const ryEl = document.getElementById('nch-ry');
  if (!viewport || !scene) return;

  let rotX = 18;
  let rotY = -24;
  let dragging = false;
  let lastX = 0;
  let lastY = 0;
  let autoSpin = false;
  let rafId = null;

  function render() {
    scene.style.transform = `rotateX(${rotX.toFixed(1)}deg) rotateY(${rotY.toFixed(1)}deg)`;
    if (rxEl) rxEl.textContent = `${Math.round(rotX)}°`;
    if (ryEl) ryEl.textContent = `${Math.round(rotY)}°`;
  }

  function step() {
    if (autoSpin && !dragging) {
      rotY += 0.65;
      render();
    }
    rafId = requestAnimationFrame(step);
  }

  viewport.addEventListener('pointerdown', (e) => {
    dragging = true;
    lastX = e.clientX;
    lastY = e.clientY;
    viewport.style.cursor = 'grabbing';
  });

  window.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;
    lastX = e.clientX;
    lastY = e.clientY;
    rotY += dx * 0.45;
    rotX -= dy * 0.45;
    rotX = Math.max(-75, Math.min(75, rotX));
    render();
  });

  window.addEventListener('pointerup', () => {
    if (!dragging) return;
    dragging = false;
    viewport.style.cursor = 'grab';
  });

  window.__nch3d = {
    nudge(dy, dx) {
      rotY += dy;
      rotX = Math.max(-75, Math.min(75, rotX + dx));
      render();
    },
    toggleSpin() {
      autoSpin = !autoSpin;
    },
    reset() {
      autoSpin = false;
      rotX = 18;
      rotY = -24;
      render();
    }
  };

  render();
  step();
})();
</script>

</details>

## What it can do

- Search GitHub repositories or open one directly with an `owner/repository` name.
- Browse repository files, read README content, and inspect source code.
- Copy or download the selected file and save repositories or code snippets in the browser.
- Ask Gemini to explain repository code or generate code, with an option to include repository context.
- Preview HTML in a sandboxed iframe.

## Source files

- `index.html` — main application UI and client-side JavaScript.
- `m.html` — alternate copy of the app page.
- `package.json` — project metadata and local development commands.
- `vercel.json` — routes requests on Vercel to `index.html`.
- `LICENSE` — MIT license terms.

## Run locally

Requirements: Python 3. From the repository directory, run:

```bash
npm run dev
```

Then open `http://localhost:8080`. This command serves the static files; there is no dependency installation or compilation step. You can also run `python3 -m http.server 8080` directly.

## API access and keys

Repository search and browsing use the GitHub REST API. Public repositories can be explored without a token, subject to GitHub's unauthenticated rate limits. In the app, open **API & Prompt** to add an optional GitHub personal access token if you need a higher API rate limit. Grant only the permissions you need and never commit a token to the repository.

A Gemini API key is required for Gemini generation. Add it in **API & Prompt**; the app calls Google's Gemini API from your browser. The app saves the GitHub token, Gemini key, and prompt in that browser's `localStorage`. This is convenient for local use, but `localStorage` is not a secure secrets vault. Do not enter sensitive keys on a shared or untrusted device, and remove or revoke a key when it is no longer needed. Do not publish a shared API key in the app or source code.

## Deployment

The project includes a Vercel rewrite configuration for serving `index.html`. No deployment URL is defined in this repository; use the URL provided by your own Vercel deployment, if you deploy it. Since API requests and key storage happen client-side, each user should provide their own Gemini key.
