import { type NextRequest, NextResponse } from 'next/server'

export function proxy(req: NextRequest) {
	if (process.env.NODE_ENV === 'production') {
		const { pathname } = req.nextUrl

		const allowedPaths = ['/indev', '/_next', '/favicon.ico', '/models/stalki.glb', '/api/invite']
		if (allowedPaths.some((p) => pathname.startsWith(p))) {
			return NextResponse.next()
		}

		const inviteKey = req.cookies.get('inviteKey')?.value
		const validKeys = process.env.INVITE_KEYS?.split(',') || []

		if (inviteKey && validKeys.includes(inviteKey)) {
			return NextResponse.next()
		}

		return NextResponse.rewrite(new URL('/indev', req.url))
	}

	return NextResponse.next()
}
