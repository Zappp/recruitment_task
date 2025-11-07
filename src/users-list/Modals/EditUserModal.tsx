import { useState, useEffect, useRef } from 'react'
import { ZodError } from 'zod'
import type { User } from '../useUsersList'
import { editUserSchema } from '../editUser.shema'
import styles from '../UserList.module.css'
import { formErrorMessages } from '../../utils/constants'

interface EditUserModalProps {
  user: User
  loading: boolean
  onClose: () => void
  onSave: (data: User) => Promise<void>
}

export function EditUserModal({ user, loading, onClose, onSave }: EditUserModalProps) {
  const [error, setError] = useState<string | null>(null)
  const modalRef = useRef<HTMLDivElement>(null)
  const firstInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    firstInputRef.current?.focus()
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)

    const form = e.currentTarget
    const formData = new FormData(form)

    const data = {
      id: user.id,
      name: String(formData.get('name') || '').trim(),
      email: String(formData.get('email') || '').trim(),
      gender: formData.get('gender') as 'male' | 'female',
      status: formData.get('status') as 'active' | 'inactive',
    }

    try {
      const parsed = await editUserSchema.parseAsync(data)
      await onSave(parsed as User)
    } catch (err) {
      if (err instanceof ZodError) {
        setError(err.issues[0]?.message ?? formErrorMessages.EMAIL_INVALID)
        return
      }
      setError(formErrorMessages.EMAIL_INVALID)
    }
  }

  return (
    <div
      className={styles.userlistModalOverlay}
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-user-title"
      onClick={(e) => {
        if (e.target === e.currentTarget && !loading) {
          onClose()
        }
      }}
    >
      <div className={styles.userlistModal} ref={modalRef}>
        <h3 id="edit-user-title">Edytuj użytkownika</h3>

        <form onSubmit={handleSubmit} noValidate>
          <label htmlFor="edit-name">
            Imię i nazwisko:
            <input
              id="edit-name"
              ref={firstInputRef}
              name="name"
              defaultValue={user.name}
              required
              minLength={1}
              maxLength={100}
              aria-required="true"
            />
          </label>

          <label htmlFor="edit-email">
            Email:
            <input
              id="edit-email"
              name="email"
              type="email"
              defaultValue={user.email}
              required
              aria-required="true"
            />
          </label>

          <label htmlFor="edit-gender">
            Płeć:
            <select
              id="edit-gender"
              name="gender"
              defaultValue={user.gender}
              required
              aria-required="true"
            >
              <option value="male">Mężczyzna</option>
              <option value="female">Kobieta</option>
            </select>
          </label>

          <label htmlFor="edit-status">
            Status:
            <select
              id="edit-status"
              name="status"
              defaultValue={user.status}
              required
              aria-required="true"
            >
              <option value="active">Aktywny</option>
              <option value="inactive">Nieaktywny</option>
            </select>
          </label>

          {error && (
            <div className={styles.userlistFieldError} role="alert" aria-live="assertive">
              {error}
            </div>
          )}

          <div className={styles.userlistModalActions}>
            <button type="submit" disabled={loading} aria-busy={loading}>
              {loading ? 'Zapisuję...' : 'Zapisz'}
            </button>
            <button type="button" onClick={onClose} disabled={loading}>
              Anuluj
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
