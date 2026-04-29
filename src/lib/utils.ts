import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { formatDistanceToNow } from 'date-fns'
import { sk, enUS } from 'date-fns/locale'
import i18n from '@/lib/i18n'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number, currency = 'EUR', lang?: string) {
  const language = lang || (typeof i18n !== 'undefined' ? i18n.language : 'sk')
  const locale = language === 'sk' ? 'sk-SK' : 'en-US'
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatNumber(value: number, lang?: string) {
  const language = lang || (typeof i18n !== 'undefined' ? i18n.language : 'sk')
  const locale = language === 'sk' ? 'sk-SK' : 'en-US'
  return new Intl.NumberFormat(locale).format(value)
}

export function formatRelativeTime(value: string | Date, lang?: string) {
  const date = typeof value === 'string' ? new Date(value) : value
  const language = lang || (typeof i18n !== 'undefined' ? i18n.language : 'sk')
  const locale = language === 'sk' ? sk : enUS
  return formatDistanceToNow(date, { addSuffix: true, locale })
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

export function uid(prefix = 'id') {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return `${prefix}_${crypto.randomUUID()}`
  }
  return `${prefix}_${Math.random().toString(36).slice(2)}_${Date.now().toString(36)}`
}

export function safeJsonParse<T>(value: string | null, fallback: T): T {
  if (!value) return fallback
  try {
    return JSON.parse(value) as T
  } catch {
    return fallback
  }
}
