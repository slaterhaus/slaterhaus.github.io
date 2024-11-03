// components/LanguageSelector.tsx
import { Select } from '@chakra-ui/react'

interface Language {
    code: string
    name: string
}

const languages: Language[] = [
    { code: 'en-US', name: 'English' },
    { code: 'ko-KR', name: '한국어' },
    { code: 'es-ES', name: 'Español' },
    { code: 'fr-FR', name: 'Français' },
    { code: 'de-DE', name: 'Deutsch' }
]

interface LanguageSelectorProps {
    selectedLanguage: string
    onChange: (language: string) => void
}

export function LanguageSelector({ selectedLanguage, onChange }: LanguageSelectorProps) {
    return (
        <Select
            value={selectedLanguage}
            onChange={(e) => onChange(e.target.value)}
            width="200px"
        >
            {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                    {lang.name}
                </option>
            ))}
        </Select>
    )
}
