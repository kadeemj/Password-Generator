import { buildCharset, type CharsetOptions } from './generate'
import { WORDLIST } from './wordlist'

export type StrengthLevel = 'weak' | 'fair' | 'strong' | 'excellent'

export type StrengthResult = {
  bits: number
  level: StrengthLevel
  label: string
  score: number // 0–100 for meter width
}

/**
 * Map ideal entropy (bits) to a UX level.
 * Thresholds align with common guidance:
 *   < 50  weak  |  50–63 fair  |  64–79 strong  |  ≥ 80 excellent
 * With the EFF long list: 5 words ≈ 65 bits (Strong), 6 ≈ 78 (Strong), 7 ≈ 90 (Excellent).
 */
function levelFromBits(bits: number): StrengthResult {
  if (bits < 50) {
    return { bits, level: 'weak', label: 'Weak', score: Math.max(12, (bits / 50) * 25) }
  }
  if (bits < 64) {
    return { bits, level: 'fair', label: 'Fair', score: 25 + ((bits - 50) / 14) * 25 }
  }
  if (bits < 80) {
    return { bits, level: 'strong', label: 'Strong', score: 50 + ((bits - 64) / 16) * 25 }
  }
  const excess = Math.min(bits - 80, 48)
  return {
    bits,
    level: 'excellent',
    label: 'Excellent',
    score: 75 + (excess / 48) * 25,
  }
}

export function estimatePasswordStrength(
  length: number,
  options: CharsetOptions,
): StrengthResult {
  const pool = buildCharset(options).length
  if (pool === 0 || length === 0) {
    return { bits: 0, level: 'weak', label: 'Weak', score: 0 }
  }
  const bits = length * Math.log2(pool)
  return levelFromBits(bits)
}

export function estimatePassphraseStrength(wordCount: number): StrengthResult {
  const bits = wordCount * Math.log2(WORDLIST.length)
  return levelFromBits(bits)
}
