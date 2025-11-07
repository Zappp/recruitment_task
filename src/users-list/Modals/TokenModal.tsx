import { useState, useEffect, useRef } from 'react'
import { setAccessToken } from '../../utils'
import { apiEndpoints } from '../../utils/constants'
import styles from '../UserList.module.css'

interface TokenModalProps {
  loading: boolean
  onSave: () => void
  onClose: () => void
}

export function TokenModal({ loading, onClose, onSave }: TokenModalProps) {
  const [tokenInput, setTokenInput] = useState('')
  const trimmed = tokenInput.trim()
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !loading) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [loading, onClose])

  const handleSaveToken = () => {
    if (!trimmed) return
    setAccessToken(trimmed)
    onSave()
  }

  return (
    <div
      className={styles.userlistModalOverlay}
      role="dialog"
      aria-modal="true"
      aria-labelledby="token-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget && !loading) {
          onClose()
        }
      }}
    >
      <div className={styles.userlistModal}>
        <h3 id="token-modal-title">Token dostępu</h3>
        <p>
          Podaj swój token dostępu. Możesz go uzyskać na stronie{' '}
          <a href={apiEndpoints.accessToken} target="_blank" rel="noopener noreferrer">
            {apiEndpoints.accessToken}
          </a>
          .
        </p>

        <label htmlFor="token-input">
          Token dostępu:
          <input
            id="token-input"
            ref={inputRef}
            value={tokenInput}
            onChange={(e) => setTokenInput(e.target.value)}
            placeholder="Wklej token dostępu"
            disabled={loading}
            aria-required="true"
          />
        </label>

        <div className={styles.userlistModalActions}>
          <button
            type="button"
            onClick={handleSaveToken}
            disabled={loading || !trimmed}
            aria-busy={loading}
          >
            Zapisz token
          </button>
          <button type="button" onClick={onClose} disabled={loading}>
            Anuluj
          </button>
        </div>
      </div>
    </div>
  )
}
