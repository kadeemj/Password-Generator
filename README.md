# Password Generator

Local-first passwords and passphrases. Generation stays in your browser — nothing is stored or sent to a server.

**Stack:** Vite · React 19 · TypeScript · Web Crypto API

## Features

| Mode | Controls | Notes |
|------|----------|--------|
| **Password** | Length 8–64 · upper / lower / numbers / symbols · exclude ambiguous (`0 O I l 1`) | Unbiased CSPRNG sampling + Fisher–Yates shuffle; at least one character from each enabled set when length allows |
| **Passphrase** | 5–10 words (default 6) | [EFF large wordlist](https://www.eff.org/dice) (7,776 words ≈ 12.9 bits each) |

Also:

- Strength meter from estimated entropy (Weak → Excellent)
- One-click copy via the Clipboard API
- Self-hosted fonts (`@fontsource/*`) — no Google Fonts or analytics at runtime

## How randomness works

Passwords and passphrases use `crypto.getRandomValues`, not `Math.random`:

1. **Rejection sampling** for uniform indices (avoids modulo bias)
2. **Fisher–Yates** shuffle for password character order
3. Word picks are independent indices into the EFF list

## Quick start

```bash
npm install
npm run dev      # local dev server (usually http://localhost:5173)
npm run build    # production build → dist/
npm run preview  # serve the production build
npm run lint     # oxlint
```

## Privacy & security

- **Client-side only.** Secrets are never uploaded, logged, or persisted by this app.
- **No backend / third-party calls** for generation. Fonts ship with the build.
- **Strength is an estimate.** Ideal entropy only (`length × log₂(charset)` or `words × log₂(7776)`). It does not model site rules, reuse, or malware.
- **Clipboard.** Copy writes to the system clipboard; clear it on shared machines.
- **On-screen display.** Secrets are visible for inspection — generate somewhere private when that matters.

### Passphrase entropy (approx.)

| Words | Bits | Typical meter |
|------:|-----:|---------------|
| 5 | ~65 | Strong |
| 6 (default) | ~78 | Strong |
| 7 | ~90 | Excellent |
| 10 | ~129 | Excellent |

## Project layout

```
src/
  App.tsx              # UI
  lib/generate.ts      # password CSPRNG
  lib/passphrase.ts    # phrase generation
  lib/strength.ts      # entropy meter
  lib/wordlist.ts      # EFF large list
```

## License

MIT

EFF large wordlist © Electronic Frontier Foundation, licensed under [CC-BY](https://www.eff.org/copyright).

## Author

[Kadeem Jeffery](https://github.com/kadeemj) · kj@lavacrypt.com
