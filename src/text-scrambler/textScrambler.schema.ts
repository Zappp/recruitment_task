import { z } from 'zod'
import { formErrorMessages } from '../utils/constants'

export const textFileSchema = z.object({
  file: z
    .instanceof(File)
    .refine((file) => file.type === 'text/plain', {
      message: formErrorMessages.INVALID_FILE_FORMAT,
    })
    .refine((file) => file.size <= 1 * 1024 * 1024, {
      message: formErrorMessages.FILE_IS_TOO_LARGE,
    }),
})
