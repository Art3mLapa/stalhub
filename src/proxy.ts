import { type NextRequest, NextResponse } from 'next/server'
import createMiddleware from 'next-intl/middleware'
import { LOCALE } from '@/types/item.type'

const intlMiddleware = createMiddleware({
	locales: LOCALE,
	defaultLocale: 'ru',
})

export function proxy(req: NextRequest) {
	const { pathname } = req.nextUrl

	const requestHeaders = new Headers(req.headers)
	requestHeaders.set('X-Path', pathname)

	if (process.env.NODE_ENV === 'production') {
		const allowedPaths = [
			'/indev',
			'/_next',
			'/favicon.ico',
			'/models/stalki.glb',
			'/api/invite',
			'/images',
			'/svg',
		]

		if (allowedPaths.some((p) => pathname.startsWith(p))) {
			const intlResponse = intlMiddleware(req)

			if (intlResponse) {
				intlResponse.headers.forEach((value, key) => {
					requestHeaders.set(key, value)
				})
			}

			return NextResponse.next({
				request: {
					headers: requestHeaders,
				},
			})
		}

		const inviteKey = req.cookies.get('inviteAccess')?.value
		const validKeys = process.env.INVITE_KEYS?.split(',') || []

		if (inviteKey && validKeys.includes(inviteKey)) {
			const intlResponse = intlMiddleware(req)

			if (intlResponse) {
				intlResponse.headers.forEach((value, key) => {
					requestHeaders.set(key, value)
				})
			}

			return NextResponse.next({
				request: {
					headers: requestHeaders,
				},
			})
		}

		const intlResponse = intlMiddleware(req)

		if (intlResponse) {
			intlResponse.headers.forEach((value, key) => {
				requestHeaders.set(key, value)
			})
		}

		return NextResponse.rewrite(new URL('/indev', req.url), {
			request: {
				headers: requestHeaders,
			},
		})
	}

	const intlResponse = intlMiddleware(req)

	if (intlResponse) {
		intlResponse.headers.forEach((value, key) => {
			requestHeaders.set(key, value)
		})
	}

	return NextResponse.next({
		request: {
			headers: requestHeaders,
		},
	})
}
