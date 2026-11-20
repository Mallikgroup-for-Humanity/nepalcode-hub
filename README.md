# NepalCode Hub

NepalCode Hub is a browser-based GitHub repository studio. It lets you search for and explore GitHub repositories, inspect their files and README, preview HTML, and ask Gemini to explain or generate code. The app is a static HTML, CSS, and JavaScript project; it does not have a separate backend.

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

Then open [http://localhost:8080](http://localhost:8080). This command serves the static files; there is no dependency installation or compilation step. You can also run `python3 -m http.server 8080` directly.

## API access and keys

Repository search and browsing use the GitHub REST API. Public repositories can be explored without a token, subject to GitHub's unauthenticated rate limits. In the app, open **API & Prompt** to add an optional GitHub personal access token if you need a higher API rate limit. Grant only the permissions you need and never commit a token to the repository.

A Gemini API key is required for Gemini generation. Add it in **API & Prompt**; the app calls Google's Gemini API from your browser. The app saves the GitHub token, Gemini key, and prompt in that browser's `localStorage`. This is convenient for local use, but `localStorage` is not a secure secrets vault. Do not enter sensitive keys on a shared or untrusted device, and remove or revoke a key when it is no longer needed. Do not publish a shared API key in the app or source code.

## Deployment

The project includes a Vercel rewrite configuration for serving `index.html`. No deployment URL is defined in this repository; use the URL provided by your own Vercel deployment, if you deploy it. Since API requests and key storage happen client-side, each user should provide their own Gemini key.

## License

This project is released under the [MIT License](LICENSE). Copyright (c) 2026 Niraj Mallik (`@nirajmallikhub`).