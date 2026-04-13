import { type NextRequest, NextResponse } from 'next/server'

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
			return NextResponse.next({
				request: {
					headers: requestHeaders,
				},
			})
		}

		const inviteKey = req.cookies.get('inviteAccess')?.value
		const validKeys = process.env.INVITE_KEYS?.split(',') || []

		if (inviteKey && validKeys.includes(inviteKey)) {
			return NextResponse.next({
				request: {
					headers: requestHeaders,
				},
			})
		}

		return NextResponse.rewrite(new URL('/indev', req.url), {
			request: {
				headers: requestHeaders,
			},
		})
	}

	return NextResponse.next({
		request: {
			headers: requestHeaders,
		},
	})
}
