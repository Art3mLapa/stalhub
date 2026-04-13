import { headers } from 'next/headers'
import type { Locale } from '@/types/item.type'

export const getLocaleServer = async (): Promise<Locale> => {
	const headerList = await headers() // <- ОБЯЗАТЕЛЬНО await!

	// Сначала смотрим куку lang
	const langCookie = headerList
		.get('cookie')
		?.match(/(?:^|; )lang=([^;]*)/)?.[1]
	if (
		langCookie === 'ru' ||
		langCookie === 'en' ||
		langCookie === 'es' ||
		langCookie === 'fr' ||
		langCookie === 'ko'
	) {
		return langCookie
	}

	// Потом Accept-Language
	const acceptLang = headerList.get('accept-language') || 'ru'
	const locale = acceptLang.split(',')[0].split('-')[0]
	if (
		locale === 'ru' ||
		locale === 'en' ||
		locale === 'es' ||
		locale === 'fr' ||
		locale === 'ko'
	) {
		return locale
	}

	return 'ru'
}
