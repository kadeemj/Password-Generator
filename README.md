# Password Generator

A local-first password and passphrase generator. Everything runs in your browser — nothing is stored or sent anywhere.

**Stack:** Vite · React 19 · TypeScript · Web Crypto

## Features

- Cryptographically secure passwords via `crypto.getRandomValues` (no `Math.random`)
- Length control (8–64) with uppercase, lowercase, numbers, and symbols
- Option to exclude ambiguous characters (`0`, `O`, `I`, `l`, `1`)
- Passphrase mode using the [EFF large wordlist](https://www.eff.org/dice) (7776 words, 5–10 words)
- Entropy-based strength meter (Weak → Excellent)
- One-click copy with confirmation
- Self-hosted fonts — no third-party network requests at runtime

## Quick start

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

```bash
npm run build    # production build → dist/
npm run preview  # preview the production build
```

## Privacy & security notes

- **Client-side only.** Generation uses the Web Crypto API in your browser. Passwords and passphrases are not uploaded, logged, or stored by this app.
- **No third-party calls.** Fonts ship with the app (`@fontsource/*`). There is no analytics, auth, or backend.
- **Strength is an estimate.** The meter reports approximate ideal entropy (`length × log2(charset)` or `words × log2(7776)`). It does not model dictionary attacks on short random passwords, clipboard malware, or site-specific password rules.
- **Clipboard.** “Copy” writes to the system clipboard via the Clipboard API. Clear the clipboard after use if you share a machine.
- **Shoulder surfing.** Generated secrets are shown on screen so you can inspect them. Generate privately when needed.
- **Passphrase defaults.** Five words ≈ 65 bits; six words (default) ≈ 78 bits; seven+ for higher assurance when stakes are high.

## License

MIT

EFF wordlist: [Creative Commons Attribution](https://www.eff.org/copyright)
