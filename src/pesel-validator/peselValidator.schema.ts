import { z } from 'zod'
import { validatePesel } from '../utils'
import { formErrorMessages } from '../utils/constants'

export const peselSchema = z.string().refine(validatePesel, {
  message: formErrorMessages.INVALID_PESEL,
})
