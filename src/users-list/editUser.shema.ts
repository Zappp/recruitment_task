import z from 'zod'
import { formErrorMessages } from '../utils/constants'

export const editUserSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, formErrorMessages.NAME_REQUIRED).max(100),
  email: z.email(formErrorMessages.EMAIL_INVALID),
  gender: z.enum(['male', 'female']),
  status: z.enum(['active', 'inactive']),
})
