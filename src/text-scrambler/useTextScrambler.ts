import { useState, useRef, type ChangeEvent } from 'react'
import { ZodError } from 'zod'
import { scrambleText } from '../utils'
import { textFileSchema } from './textScrambler.schema'
import { formErrorMessages } from '../utils/constants'

export const useTextScrambler = () => {
  const [file, setFile] = useState<File | null>(null)
  const [originalText, setOriginalText] = useState<string>('')
  const [scrambledText, setScrambledText] = useState<string>('')
  const [error, setError] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    setError('')
    setOriginalText('')
    setScrambledText('')

    const selectedFile = event.target.files?.[0]
    if (!selectedFile) return

    try {
      const { file } = await textFileSchema.parseAsync({ file: selectedFile })
      setFile(file)
      const text = await file.text()
      setOriginalText(text)
    } catch (err) {
      if (err instanceof ZodError) {
        setError(err.issues[0]?.message || formErrorMessages.INVALID_FILE_FORMAT)
      } else {
        setError(formErrorMessages.FILE_LOAD_ERROR)
      }
      setFile(null)
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleScramble = () => {
    if (!originalText) {
      setError(formErrorMessages.FILE_NOT_LOADED)
      return
    }
    setError('')
    const scrambled = scrambleText(originalText)
    setScrambledText(scrambled)
  }

  const handleDownload = () => {
    if (!scrambledText) return

    const blob = new Blob([scrambledText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = file ? `scrambled_${file.name}` : 'scrambled_text.txt'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return {
    file,
    originalText,
    scrambledText,
    error,
    fileInputRef,
    handleFileChange,
    handleScramble,
    handleDownload,
    setError,
  }
}
