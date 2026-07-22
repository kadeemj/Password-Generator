const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const LOWER = 'abcdefghijklmnopqrstuvwxyz'
const NUMBERS = '0123456789'
const SYMBOLS = '!@#$%^&*()-_=+[]{}|;:,.<>?'
const AMBIGUOUS = new Set(['0', 'O', 'I', 'l', '1'])

export type CharsetOptions = {
  uppercase: boolean
  lowercase: boolean
  numbers: boolean
  symbols: boolean
  excludeAmbiguous: boolean
}

export function buildCharset(options: CharsetOptions): string {
  let pool = ''
  if (options.uppercase) pool += UPPER
  if (options.lowercase) pool += LOWER
  if (options.numbers) pool += NUMBERS
  if (options.symbols) pool += SYMBOLS

  if (options.excludeAmbiguous) {
    pool = [...pool].filter((c) => !AMBIGUOUS.has(c)).join('')
  }

  return pool
}

/** Unbiased index in [0, max) via rejection sampling. */
export function randomIndex(max: number): number {
  if (max <= 0) throw new Error('max must be positive')
  const limit = Math.floor(0x100000000 / max) * max
  const buf = new Uint32Array(1)
  let x: number
  do {
    crypto.getRandomValues(buf)
    x = buf[0]!
  } while (x >= limit)
  return x % max
}

export function generatePassword(length: number, options: CharsetOptions): string {
  const charset = buildCharset(options)
  if (!charset) {
    throw new Error('Select at least one character set')
  }
  if (length < 1) {
    throw new Error('Length must be at least 1')
  }

  const chars = [...charset]
  const result: string[] = []

  // Guarantee at least one char from each enabled set when length allows
  const required: string[] = []
  const pushRequired = (set: string) => {
    let filtered = set
    if (options.excludeAmbiguous) {
      filtered = [...set].filter((c) => !AMBIGUOUS.has(c)).join('')
    }
    if (filtered.length > 0) {
      required.push(filtered[randomIndex(filtered.length)]!)
    }
  }

  if (options.uppercase) pushRequired(UPPER)
  if (options.lowercase) pushRequired(LOWER)
  if (options.numbers) pushRequired(NUMBERS)
  if (options.symbols) pushRequired(SYMBOLS)

  const guaranteed = required.slice(0, Math.min(required.length, length))
  for (const c of guaranteed) result.push(c)

  while (result.length < length) {
    result.push(chars[randomIndex(chars.length)]!)
  }

  // Fisher–Yates shuffle with CSPRNG
  for (let i = result.length - 1; i > 0; i--) {
    const j = randomIndex(i + 1)
    ;[result[i], result[j]] = [result[j]!, result[i]!]
  }

  return result.join('')
}
