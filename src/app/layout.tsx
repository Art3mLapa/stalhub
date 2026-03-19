import type { Metadata } from 'next'
import { Suspense } from 'react'

import '@/shared/styles/index.css'
import { ThemeProvider } from 'next-themes'
import { raleway } from '@/app/fonts'
import Providers from '@/providers/providers'
import { GridBackgroundWithBeams } from '@/shared/Background'
import Footer from '@/shared/layouts/Footer'
import InDevNav from '@/shared/layouts/nav/InDevNav'
import Nav from '@/shared/layouts/nav/Nav'

//! TODO добить банер, дополнить OG, добавить лого
export const metadata: Metadata = {
	title: 'StalHub',
	description: 'TODO',
	openGraph: {
		type: 'website',
		title: 'StalHub',
		description: 'TODO',
		url: 'https://stalhub.tech',
		siteName: 'StalHub',
	},
}

export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html className="dark" lang="en" suppressHydrationWarning>
			<body
				className={`${raleway.className} bg-neutral-100 transition-colors duration-500 ease-in-out dark:bg-neutral-950`}
			>
				<GridBackgroundWithBeams
					cellSize={20}
					cols={100}
					glowIntensity={1.5}
					lineWidth={2}
					maxBeams={4}
					rows={100}
				/>
				<Suspense fallback={<div />}>
					<ThemeProvider
						attribute="class"
						disableTransitionOnChange
						enableSystem
					>
						<Providers>
							<InDevNav />
							<Nav />
							{children}
						</Providers>
						<Footer />
					</ThemeProvider>
				</Suspense>
			</body>
		</html>
	)
}
