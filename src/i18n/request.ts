import { cookies } from 'next/headers'
import { getRequestConfig } from 'next-intl/server'
import { defaultLocale, type Locale } from './settings'

async function getLocaleFromCookie(): Promise<Locale | undefined> {
	const cookieStore = await cookies()
	const match = cookieStore.get('lang')?.value

	if (
		match === 'ru' ||
		match === 'en' ||
		match === 'es' ||
		match === 'fr' ||
		match === 'ko'
	) {
		return match
	}

	return undefined
}

export default getRequestConfig(async () => {
	const locale = (await getLocaleFromCookie()) ?? defaultLocale

	return {
		locale,
		messages: (await import(`@/locales/${locale}.json`)).default,
	}
})
