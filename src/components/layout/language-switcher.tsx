import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Languages } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function LanguageSwitcher() {
  const { i18n } = useTranslation()

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'sk', name: 'Slovenčina', flag: '🇸🇰' },
  ]

  const currentLanguage = languages.find((lang) => lang.code === i18n.language) || languages[0]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2 px-2 text-xs font-bold uppercase tracking-wider">
          <Languages className="h-4 w-4" />
          {currentLanguage.code}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="glass-panel">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            className="gap-2 cursor-pointer"
            onClick={() => i18n.changeLanguage(lang.code)}
          >
            <span>{lang.flag}</span>
            <span>{lang.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
