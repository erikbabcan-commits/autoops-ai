import { z } from 'zod'

export const emailSchema = z
  .string()
  .email('Zadaj platný email. Robot má síce trpezlivosť, SMTP server už menej.')

export const loginSchema = z.object({
  email: emailSchema,
})

export type LoginInput = z.infer<typeof loginSchema>

export function sanitizePrompt(prompt: string) {
  return prompt
    .replace(/[<>]/g, '')
    .replace(/\b(api[_-]?key|secret|token|password)\b/gi, '[redacted]')
    .trim()
    .slice(0, 2000)
}

export function requiresHumanApproval(prompt: string) {
  return /refund|vráť|vratenie|dobropis|zľava|zlava|delete|vymaž|storno|cancel|angry|nahnevan/i.test(
    prompt,
  )
}
