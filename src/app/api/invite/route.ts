import { type NextRequest, NextResponse } from 'next/server'

// Инвайт в нави

const validKeys = process.env.INVITE_KEYS?.split(',') || []

export async function POST(req: NextRequest) {
	const { key } = await req.json()
	if (!key || !validKeys.includes(key)) {
		return NextResponse.json({ valid: false }, { status: 400 })
	}

	const res = NextResponse.json({ valid: true })
	res.cookies.set('inviteAccess', key, {
		path: '/',
		maxAge: 60 * 60 * 24 * 30,
	})
	return res
}
