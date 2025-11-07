import React, { useState } from 'react'
import styles from './PeselValidator.module.css'
import { ZodError } from 'zod'
import { peselSchema } from './peselValidator.schema'
import { formErrorMessages } from '../utils/constants'

export function PeselValidator() {
  const [pesel, setPesel] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setPesel(value)
    setSuccess(false)
    try {
      await peselSchema.parseAsync(value)
      setError(null)
      setSuccess(true)
    } catch (err: unknown) {
      setSuccess(false)
      if (err instanceof ZodError)
        setError(err.issues[0]?.message || formErrorMessages.INVALID_PESEL)
      else setError(formErrorMessages.INVALID_PESEL)
    }
  }

  return (
    <section className={styles.peselValidator}>
      <h2 id="pesel-validate-heading">Zadanie 2</h2>
      <label htmlFor="pesel-input" className={styles.peselInputLabel}>
        Numer PESEL
      </label>
      <input
        id="pesel-input"
        value={pesel}
        type="text"
        maxLength={11}
        onChange={handleChange}
        placeholder="Wpisz numer PESEL"
        className={styles.peselInput}
        aria-invalid={!!error}
        aria-describedby={
          error ? 'pesel-error-message' : success ? 'pesel-success-message' : undefined
        }
        inputMode="numeric"
      />
      {error && (
        <div id="pesel-error-message" className={styles.peselErrorMessage} role="alert">
          {error}
        </div>
      )}
      {success && !error && (
        <div id="pesel-success-message" className={styles.peselSuccessMessage} role="alert">
          PESEL jest poprawny!
        </div>
      )}
    </section>
  )
}
