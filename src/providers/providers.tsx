'use client'

import { type ReactNode, useEffect, useState } from 'react'
import { Toaster } from 'sonner'
import { UwuProvider } from '@/providers/uwuProvider'
import QueryProvider from './QueryProvider'

interface Props {
	children: ReactNode
}

export default function Providers({ children }: Props) {
	const [mounted, setMounted] = useState(false)

	useEffect(() => {
		setMounted(true)

		console.log(
			`%cЧувак, ты думал тут что-то будет?\n` +
				`%cДавай, закрывай девтулс и продолжай пользоваться сайтом`,
			'font-size: 1.5rem; color: #EA9D9E; font-weight: bold;',
			'font-size: 1.2rem; color: #4caf50; font-style: italic;'
		)
	}, [])

	if (!mounted) return null

	return (
		<QueryProvider>
			<UwuProvider>
				<Toaster position="bottom-right" />
				{children}
			</UwuProvider>
		</QueryProvider>
	)
}
