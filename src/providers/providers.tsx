'use client'

import i18n from 'i18next'

import { ThemeProvider } from 'next-themes'
import { type ReactNode, useEffect, useState } from 'react'
import { I18nextProvider, initReactI18next } from 'react-i18next'
import { Toaster } from 'sonner'
import { getLocale } from '@/lib/getLocale'
import en from '@/locales/en.json'
import es from '@/locales/es.json'
import fr from '@/locales/fr.json'
import ko from '@/locales/ko.json'
import ru from '@/locales/ru.json'
import { UwuProvider } from '@/providers/uwuProvider'
import QueryProvider from './QueryProvider'

interface Props {
	children: ReactNode
}

export default function Providers({ children }: Props) {
	const [mounted, setMounted] = useState(false)
	const [i18nReady, setI18nReady] = useState(false)

	useEffect(() => {
		setMounted(true)

		console.log(
			`%cЧувак, ты думал тут что-то будет?\n` +
				`%cДавай, закрывай девтулс и продолжай пользоваться сайтом`,
			'font-size: 1.5rem; color: #EA9D9E; font-weight: bold;',
			'font-size: 1.2rem; color: #4caf50; font-style: italic;'
		)

		const lang = getLocale()

		if (!i18n.isInitialized) {
			i18n.use(initReactI18next)
				.init({
					resources: {
						en: { translation: en },
						ru: { translation: ru },
						es: { translation: es },
						fr: { translation: fr },
						ko: { translation: ko },
					},
					lng: lang,
					fallbackLng: 'ru',
					interpolation: { escapeValue: false },
				})
				.then(() => setI18nReady(true))
		} else {
			setI18nReady(true)
		}
	}, [])

	if (!mounted || !i18nReady) return null

	return (
		<QueryProvider>
			<I18nextProvider i18n={i18n}>
				<ThemeProvider attribute="class" enableSystem>
					<UwuProvider>
						<Toaster position="bottom-right" />
						{children}
					</UwuProvider>
				</ThemeProvider>
			</I18nextProvider>
		</QueryProvider>
	)
}
