import { randomIndex } from './generate'
import { WORDLIST } from './wordlist'

export function generatePassphrase(wordCount: number): string {
  if (wordCount < 1) {
    throw new Error('Word count must be at least 1')
  }

  const words: string[] = []
  for (let i = 0; i < wordCount; i++) {
    words.push(WORDLIST[randomIndex(WORDLIST.length)]!)
  }
  return words.join('-')
}
