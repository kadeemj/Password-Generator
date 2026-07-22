# Password Generator

A soft, local-first password and passphrase generator. Everything runs in your browser — nothing is stored or sent anywhere.

**Live stack:** Vite · React 19 · TypeScript · Web Crypto

## Features

- Cryptographically secure passwords via `crypto.getRandomValues` (no `Math.random`)
- Length control (8–64) with uppercase, lowercase, numbers, and symbols
- Option to exclude ambiguous characters (`0`, `O`, `I`, `l`, `1`)
- Passphrase mode with a built-in word list (4–8 words)
- Entropy-based strength meter (Weak → Excellent)
- One-click copy with confirmation

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

## Privacy

Generation is entirely client-side. Passwords and passphrases never leave your device.

## License

MIT
