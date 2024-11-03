'use client';
import {useEffect, useState} from 'react'
import {
    Box,
    Button,
    Container,
    Heading,
    HStack,
    Select,
    Text,
    VStack
} from '@chakra-ui/react'
import {useSearchParams} from "next/navigation";

interface KeyboardLayout {
    type: 'simple' | 'composite';
    letters: string[] | [string[], string[], string[]];
}

interface Language {
    code: string;
    name: string;
    keyboard: KeyboardLayout;
}

interface KoreanSyllable {
    choseong: string;
    jungseong: string;
    jongseong: string;
    isComplete: boolean;
}

const LANGUAGES: Language[] = [
    {
        code: 'en-US',
        name: 'English',
        keyboard: {
            type: 'simple',
            letters: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
        }
    },
    {
        code: 'ko-KR',
        name: '한국어',
        keyboard: {
            type: 'composite',
            letters: [
                // Consonants
                'ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ'.split(''),
                // Vowels
                'ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ'.split(''),
                // Final consonants?
                'ㄱㄲㄳㄴㄵㄶㄷㄹㄺㄻㄼㄽㄾㄿㅀㅁㅂㅄㅅㅆㅇㅈㅊㅋㅌㅍㅎ'.split('')
            ]
        }
    }
]

export default function Home() {
    const searchParams = useSearchParams()
    const code = searchParams?.get('lang');
    const language = LANGUAGES.find(l => l.code === code) ?? LANGUAGES[0];
    const [currentWord, setCurrentWord] = useState('')
    const [selectedLanguage, setSelectedLanguage] = useState<Language>(language)
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
    const [currentVoice, setCurrentVoice] = useState<SpeechSynthesisVoice | null>(null)
    const [koreanSyllable, setKoreanSyllable] = useState<KoreanSyllable>({
        choseong: '',
        jungseong: '',
        jongseong: '',
        isComplete: false
    });

    useEffect(() => {
        const loadVoices = () => {
            const availableVoices = window.speechSynthesis.getVoices()
            setVoices(availableVoices)

            const defaultVoice = availableVoices.find(
                voice => voice.lang.includes(selectedLanguage.code)
            )
            if (defaultVoice) {
                setCurrentVoice(defaultVoice);
            }
        }

        loadVoices()
        window.speechSynthesis.onvoiceschanged = loadVoices

        return () => {
            window.speechSynthesis.cancel()
        }
    }, [])

    useEffect(() => {
        const matchingVoice = voices.find(
            voice => voice.lang.includes(selectedLanguage.code)
        )
        if (matchingVoice) {
            setCurrentVoice(matchingVoice)
        }
    }, [selectedLanguage, voices])

    const speak = (text: string) => {
        if (!text) return

        window.speechSynthesis.cancel()
        const utterance = new SpeechSynthesisUtterance(text)

        if (currentVoice) {
            utterance.voice = currentVoice
        }
        utterance.lang = selectedLanguage.code
        utterance.rate = 0.8
        utterance.pitch = 1.0
        utterance.volume = 1.0

        window.speechSynthesis.speak(utterance)
    }

    const composeHangulSyllable = (cho: string, jung: string, jong: string = ''): string => {
        const HANGUL_BASE = 0xAC00
        const JUNGSEONG_COUNT = 21
        const JONGSEONG_COUNT = 28

        const CHOSEONG_MAP: { [key: string]: number } = {
            'ㄱ': 0, 'ㄲ': 1, 'ㄴ': 2, 'ㄷ': 3, 'ㄸ': 4,
            'ㄹ': 5, 'ㅁ': 6, 'ㅂ': 7, 'ㅃ': 8, 'ㅅ': 9,
            'ㅆ': 10, 'ㅇ': 11, 'ㅈ': 12, 'ㅉ': 13, 'ㅊ': 14,
            'ㅋ': 15, 'ㅌ': 16, 'ㅍ': 17, 'ㅎ': 18
        }

        const JUNGSEONG_MAP: { [key: string]: number } = {
            'ㅏ': 0, 'ㅐ': 1, 'ㅑ': 2, 'ㅒ': 3, 'ㅓ': 4,
            'ㅔ': 5, 'ㅕ': 6, 'ㅖ': 7, 'ㅗ': 8, 'ㅘ': 9,
            'ㅙ': 10, 'ㅚ': 11, 'ㅛ': 12, 'ㅜ': 13, 'ㅝ': 14,
            'ㅞ': 15, 'ㅟ': 16, 'ㅠ': 17, 'ㅡ': 18, 'ㅢ': 19,
            'ㅣ': 20
        }

        const JONGSEONG_MAP: { [key: string]: number } = {
            '': 0, 'ㄱ': 1, 'ㄲ': 2, 'ㄳ': 3, 'ㄴ': 4,
            'ㄵ': 5, 'ㄶ': 6, 'ㄷ': 7, 'ㄹ': 8, 'ㄺ': 9,
            'ㄻ': 10, 'ㄼ': 11, 'ㄽ': 12, 'ㄾ': 13, 'ㄿ': 14,
            'ㅀ': 15, 'ㅁ': 16, 'ㅂ': 17, 'ㅄ': 18, 'ㅅ': 19,
            'ㅆ': 20, 'ㅇ': 21, 'ㅈ': 22, 'ㅊ': 23, 'ㅋ': 24,
            'ㅌ': 25, 'ㅍ': 26, 'ㅎ': 27
        }

        const choIndex = CHOSEONG_MAP[cho]
        const jungIndex = JUNGSEONG_MAP[jung]
        const jongIndex = jong ? (JONGSEONG_MAP[jong] || 0) : 0

        if (typeof choIndex !== 'number' || typeof jungIndex !== 'number') {
            return ''
        }

        return String.fromCharCode(
            HANGUL_BASE + (choIndex * JUNGSEONG_COUNT + jungIndex) * JONGSEONG_COUNT + jongIndex
        )
    }

    const handleLetterClick = (letter: string) => {
        if (selectedLanguage.keyboard.type === 'simple') {
            setCurrentWord(prev => prev + letter)
            speak(letter)
            return
        }

        const isConsonant = /[ㄱ-ㅎ]/.test(letter)
        const isVowel = /[ㅏ-ㅣ]/.test(letter)

        if (isConsonant) {
            if (!koreanSyllable.choseong) {
                /**
                 * new syllable
                 */
                setKoreanSyllable(prev => ({
                    ...prev,
                    choseong: letter,
                    isComplete: false
                }))
            } else if (koreanSyllable.jungseong && !koreanSyllable.jongseong) {

                setKoreanSyllable(prev => ({
                    ...prev,
                    jongseong: letter,
                    isComplete: true
                }))
            }
        } else if (isVowel && koreanSyllable.choseong && !koreanSyllable.jungseong) {
            /**
             * add vowel to current consonant?
             */
            setKoreanSyllable(prev => ({
                ...prev,
                jungseong: letter,
                isComplete: !koreanSyllable.jongseong
            }))
        }
        speak(letter)
    }

    useEffect(() => {
        if (koreanSyllable.isComplete) {
            const composed = composeHangulSyllable(
                koreanSyllable.choseong,
                koreanSyllable.jungseong,
                koreanSyllable.jongseong
            )
            if (composed) {
                setCurrentWord(prev => prev + composed)
                setKoreanSyllable({
                    choseong: '',
                    jungseong: '',
                    jongseong: '',
                    isComplete: false
                })
            }
        }
    }, [koreanSyllable])

    const handleLanguageChange = (langCode: string) => {
        const newLang = LANGUAGES.find(lang => lang.code === langCode) || LANGUAGES[0]
        setSelectedLanguage(newLang)
        setCurrentWord('')
        setKoreanSyllable({
            choseong: '',
            jungseong: '',
            jongseong: '',
            isComplete: false
        })
    }
    return (
        <Container maxW="container.md" py={8}>
            <VStack spacing={8}>
                <Heading>Speak and Spell</Heading>

                <Select
                    value={selectedLanguage.code}
                    onChange={(e) => handleLanguageChange(e.target.value)}
                    width="200px"
                >
                    {LANGUAGES.map((lang) => (
                        <option key={lang.code} value={lang.code}>
                            {lang.name}
                        </option>
                    ))}
                </Select>

                <Box
                    w="100%"
                    h="100px"
                    borderWidth={2}
                    borderRadius="lg"
                    p={4}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    bg="gray.50"
                >
                    <Text
                        fontSize="3xl"
                        fontWeight="bold"
                        fontFamily={selectedLanguage.code === 'ko-KR' ? 'sans-serif' : 'inherit'}
                    >
                        {currentWord || `Type something in ${selectedLanguage.name}!`}
                    </Text>
                </Box>

                <HStack spacing={4}>
                    <Button
                        colorScheme="green"
                        onClick={() => speak(currentWord)}
                        isDisabled={!currentWord}
                    >
                        Speak Word
                    </Button>
                    <Button
                        colorScheme="red"
                        onClick={() => setCurrentWord('')}
                        isDisabled={!currentWord}
                    >
                        Clear
                    </Button>
                    <Button
                        onClick={() => setCurrentWord(prev => prev.slice(0, -1))}
                        isDisabled={!currentWord}
                    >
                        Backspace
                    </Button>
                </HStack>

                <Box width="100%">
                    {selectedLanguage.keyboard.type === 'simple' ? (
                        // English keyboard
                        <VStack spacing={4}>
                            <HStack spacing={2} wrap="wrap" justify="center">
                                {(selectedLanguage.keyboard.letters as string[]).map((letter) => (
                                    <Button
                                        key={letter}
                                        onClick={() => handleLetterClick(letter)}
                                        size="lg"
                                        colorScheme="blue"
                                        w="50px"
                                        h="50px"
                                    >
                                        {letter}
                                    </Button>
                                ))}
                            </HStack>
                        </VStack>
                    ) : (
                        // Korean keyboard
                        <VStack spacing={6}>
                            <Box width="100%">
                                <Text mb={2} fontWeight="bold">자음 (Consonants)</Text>
                                <HStack spacing={2} wrap="wrap" justify="center">
                                    {(selectedLanguage.keyboard.letters as [string[], string[], string[]])[0].map((letter) => (
                                        <Button
                                            key={letter}
                                            onClick={() => handleLetterClick(letter)}
                                            size="lg"
                                            colorScheme="blue"
                                            w="50px"
                                            h="50px"
                                        >
                                            {letter}
                                        </Button>
                                    ))}
                                </HStack>
                            </Box>

                            <Box width="100%">
                                <Text mb={2} fontWeight="bold">모음 (Vowels)</Text>
                                <HStack spacing={2} wrap="wrap" justify="center">
                                    {(selectedLanguage.keyboard.letters as [string[], string[], string[]])[1].map((letter) => (
                                        <Button
                                            key={letter}
                                            onClick={() => handleLetterClick(letter)}
                                            size="lg"
                                            colorScheme="green"
                                            w="50px"
                                            h="50px"
                                        >
                                            {letter}
                                        </Button>
                                    ))}
                                </HStack>
                            </Box>

                            <Box width="100%">
                                <Text mb={2} fontWeight="bold">받침 (Final Consonants)</Text>
                                <HStack spacing={2} wrap="wrap" justify="center">
                                    {(selectedLanguage.keyboard.letters as [string[], string[], string[]])[2].map((letter) => (
                                        <Button
                                            key={letter}
                                            onClick={() => handleLetterClick(letter)}
                                            size="lg"
                                            colorScheme="purple"
                                            w="50px"
                                            h="50px"
                                        >
                                            {letter}
                                        </Button>
                                    ))}
                                </HStack>
                            </Box>
                        </VStack>
                    )}
                </Box>
            </VStack>
        </Container>
    )
}
