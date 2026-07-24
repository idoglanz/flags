# 🌍 Flags of the World · דגלי העולם

A tiny, colorful web app for kids to learn country flags in **English + Hebrew**.

- **Learn mode** — flashcards: big flag, English + Hebrew names, tap a name to hear it read aloud, Back / Mix / Next.
- **Play mode** — guess-the-flag quiz with 4 choices, score, streak, and confetti. 🎉

## Run it

Just open `index.html` in a browser. Or serve it locally:

```bash
python3 -m http.server 8777 --directory .
```

Then visit http://localhost:8777.

## How it works (no API keys, no backend)

- **Country names** come from the browser's built-in `Intl.DisplayNames` — both English and Hebrew, always in sync, offline.
- **Flags** come from [flagcdn.com](https://flagcdn.com) (free, no key) by ISO-2 code.
- **Read-aloud** uses the browser's built-in `speechSynthesis`. English works everywhere; a Hebrew voice (`he-IL`) is present on macOS/iOS and Chrome, and the app falls back gracefully if it's missing.

## Add or remove countries

Edit the `CODES` array near the top of the `<script>` in `index.html` — just ISO 3166-1 alpha-2 codes (e.g. `"FR"`, `"JP"`). Names and flags are derived automatically.

## Deploy

Hosted on **GitHub Pages** (deploy-from-branch: `main` / root) at **https://flags.zizitripo.com**.
The `CNAME` file pins the custom domain. Any push to `main` redeploys automatically.
