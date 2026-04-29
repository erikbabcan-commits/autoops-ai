import { vi } from 'vitest'

// Mock Lucide Icons - prevents rendering full SVG paths in tests
vi.mock('lucide-react', async (importOriginal) => {
  const actual = await importOriginal<typeof import('lucide-react')>()
  return {
    ...actual,
  }
})

// Mock Framer Motion - reduces animation overhead in tests
vi.mock('framer-motion', () => ({
  motion: new Proxy({}, {
    get: (_target, prop) => {
      // Return a simple forwardRef component for any HTML tag
      return ({ children, ...props }: any) => {
        const Tag = prop as string
        return `<${Tag} ${JSON.stringify(props)}>${children}</${Tag}>`
      }
    },
  }),
  AnimatePresence: ({ children }: any) => children,
}))
