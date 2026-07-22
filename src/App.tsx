import { useCallback, useEffect, useId, useMemo, useState } from 'react'
import './App.css'
import {
  generatePassword,
  type CharsetOptions,
} from './lib/generate'
import { generatePassphrase } from './lib/passphrase'
import {
  estimatePassphraseStrength,
  estimatePasswordStrength,
} from './lib/strength'

type Mode = 'password' | 'passphrase'

const DEFAULT_OPTIONS: CharsetOptions = {
  uppercase: true,
  lowercase: true,
  numbers: true,
  symbols: true,
  excludeAmbiguous: false,
}

function App() {
  const passwordId = useId()
  const lengthId = useId()
  const strengthId = useId()

  const [mode, setMode] = useState<Mode>('password')
  const [length, setLength] = useState(16)
  const [wordCount, setWordCount] = useState(6)
  const [options, setOptions] = useState<CharsetOptions>(DEFAULT_OPTIONS)
  const [value, setValue] = useState('')
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const hasCharset =
    options.uppercase || options.lowercase || options.numbers || options.symbols

  const strength = useMemo(() => {
    if (mode === 'passphrase') {
      return estimatePassphraseStrength(wordCount)
    }
    return estimatePasswordStrength(length, options)
  }, [mode, length, wordCount, options])

  const regenerate = useCallback(() => {
    try {
      setError(null)
      if (mode === 'passphrase') {
        setValue(generatePassphrase(wordCount))
      } else {
        if (!hasCharset) {
          setError('Select at least one character set')
          return
        }
        setValue(generatePassword(length, options))
      }
      setCopied(false)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not generate')
    }
  }, [mode, length, wordCount, options, hasCharset])

  useEffect(() => {
    regenerate()
  }, [regenerate])

  useEffect(() => {
    if (!copied) return
    const t = window.setTimeout(() => setCopied(false), 1600)
    return () => window.clearTimeout(t)
  }, [copied])

  const copy = async () => {
    if (!value) return
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
    } catch {
      setError('Clipboard permission denied')
    }
  }

  const toggleOption = (key: keyof CharsetOptions) => {
    setOptions((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <div className="app">
      <main className="shell">
        <h1 className="brand">Password Generator</h1>
        <p className="tagline">
          Strong secrets, generated locally. Nothing leaves your browser.
        </p>

        <div className="panel">
          <div className="output">
            <label className="sr-only" htmlFor={passwordId}>
              Generated {mode === 'password' ? 'password' : 'passphrase'}
            </label>
            <input
              id={passwordId}
              className="password-field"
              type="text"
              readOnly
              value={value}
              spellCheck={false}
              aria-describedby={strengthId}
            />
            <div className="actions">
              <button type="button" className="btn btn-primary" onClick={regenerate}>
                Generate
              </button>
              <button
                type="button"
                className={`btn btn-secondary${copied ? ' is-copied' : ''}`}
                onClick={copy}
                disabled={!value}
                aria-live="polite"
              >
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>

          <div className="strength" id={strengthId}>
            <div className="strength-header">
              <span className="strength-label">Strength</span>
              <span className="strength-value" data-level={strength.level}>
                {strength.label}
                <span className="sr-only">
                  {`, about ${Math.round(strength.bits)} bits of entropy`}
                </span>
              </span>
            </div>
            <div
              className="meter"
              role="meter"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(strength.score)}
              aria-label={`Password strength: ${strength.label}`}
            >
              <div
                className="meter-fill"
                data-level={strength.level}
                style={{ ['--score' as string]: `${strength.score}%` }}
              />
            </div>
          </div>

          <div className="controls">
            <div className="mode-toggle" role="group" aria-label="Generation mode">
              <button
                type="button"
                className="mode-btn"
                aria-pressed={mode === 'password'}
                onClick={() => setMode('password')}
              >
                Password
              </button>
              <button
                type="button"
                className="mode-btn"
                aria-pressed={mode === 'passphrase'}
                onClick={() => setMode('passphrase')}
              >
                Passphrase
              </button>
            </div>

            {mode === 'password' ? (
              <>
                <div className="field">
                  <div className="field-header">
                    <label className="field-label" htmlFor={lengthId}>
                      Length
                    </label>
                    <span className="field-value">{length}</span>
                  </div>
                  <input
                    id={lengthId}
                    className="slider"
                    type="range"
                    min={8}
                    max={64}
                    value={length}
                    onChange={(e) => setLength(Number(e.target.value))}
                    style={{
                      ['--fill' as string]: `${((length - 8) / (64 - 8)) * 100}%`,
                    }}
                  />
                </div>

                <fieldset className="checks">
                  <legend className="sr-only">Character sets</legend>
                  <label className="check">
                    <input
                      type="checkbox"
                      checked={options.uppercase}
                      onChange={() => toggleOption('uppercase')}
                    />
                    Uppercase
                  </label>
                  <label className="check">
                    <input
                      type="checkbox"
                      checked={options.lowercase}
                      onChange={() => toggleOption('lowercase')}
                    />
                    Lowercase
                  </label>
                  <label className="check">
                    <input
                      type="checkbox"
                      checked={options.numbers}
                      onChange={() => toggleOption('numbers')}
                    />
                    Numbers
                  </label>
                  <label className="check">
                    <input
                      type="checkbox"
                      checked={options.symbols}
                      onChange={() => toggleOption('symbols')}
                    />
                    Symbols
                  </label>
                  <label className="check check-full">
                    <input
                      type="checkbox"
                      checked={options.excludeAmbiguous}
                      onChange={() => toggleOption('excludeAmbiguous')}
                    />
                    Exclude ambiguous (0 O I l 1)
                  </label>
                </fieldset>
                {!hasCharset && (
                  <p className="hint" role="alert">
                    Select at least one character set.
                  </p>
                )}
              </>
            ) : (
              <div className="field">
                <div className="field-header">
                  <label className="field-label" htmlFor={lengthId}>
                    Words
                  </label>
                  <span className="field-value">{wordCount}</span>
                </div>
                <input
                  id={lengthId}
                  className="slider"
                  type="range"
                  min={4}
                  max={8}
                  value={wordCount}
                  onChange={(e) => setWordCount(Number(e.target.value))}
                  style={{
                    ['--fill' as string]: `${((wordCount - 4) / (8 - 4)) * 100}%`,
                  }}
                />
              </div>
            )}

            {error && (
              <p className="hint" role="alert">
                {error}
              </p>
            )}
          </div>
        </div>

        <p className="footer-note">Uses Web Crypto. Nothing is stored or sent.</p>
      </main>
    </div>
  )
}

export default App
