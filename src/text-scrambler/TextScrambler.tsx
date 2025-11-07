import styles from './TextScrambler.module.css'
import { useTextScrambler } from './useTextScrambler'

export function TextScrambler() {
  const {
    file,
    originalText,
    scrambledText,
    error,
    fileInputRef,
    handleFileChange,
    handleScramble,
    handleDownload,
  } = useTextScrambler()
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    handleScramble()
  }

  return (
    <section className={styles.textScrambler}>
      <h2 id="scrambler-heading">Zadanie 1</h2>
      <p id="scrambler-desc" className={styles.description}>
        Wybierz plik tekstowy, aby przestawić szyk wyrazów w każdym zdaniu.
      </p>
      <form
        aria-labelledby="scrambler-heading"
        aria-describedby="scrambler-desc"
        onSubmit={handleSubmit}
        noValidate
      >
        <div className={styles.fileInputContainer}>
          <label htmlFor="file-input" className={styles.fileLabel}>
            Wybierz plik tekstowy (.txt)
          </label>
          <input
            ref={fileInputRef}
            id="file-input"
            type="file"
            accept=".txt,text/plain"
            aria-describedby="file-status"
            onChange={handleFileChange}
            className={styles.fileInput}
          />
          {file && (
            <div id="file-status" className={styles.fileInfo} role="status" aria-live="polite">
              Wczytano: <strong>{file.name}</strong> ({(file.size / 1024).toFixed(2)} KB)
            </div>
          )}
        </div>

        {error && (
          <div
            className={styles.errorMessage}
            role="alert"
            aria-live="assertive"
            id="scrambler-error"
          >
            {error}
          </div>
        )}

        <div className={styles.buttonGroup}>
          <button
            disabled={!originalText}
            className={`${styles.button} ${styles.buttonPrimary}`}
            aria-disabled={!originalText}
          >
            Przestaw szyk
          </button>

          {scrambledText && (
            <button
              type="button"
              onClick={handleDownload}
              className={`${styles.button} ${styles.buttonSecondary}`}
            >
              Pobierz wynik
            </button>
          )}
        </div>

        {originalText && (
          <div className={styles.textPreview} aria-live="polite">
            <div className={styles.previewSection}>
              <h3>Oryginalny tekst:</h3>
              <pre className={styles.textContent}>{originalText}</pre>
            </div>
            {scrambledText && (
              <div className={styles.previewSection}>
                <h3>Przetworzony tekst:</h3>
                <pre className={styles.textContent}>{scrambledText}</pre>
              </div>
            )}
          </div>
        )}
      </form>
    </section>
  )
}
