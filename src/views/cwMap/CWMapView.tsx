'use client'

import dynamic from 'next/dynamic'

const CWMapEditor = dynamic(() => import('./CWMapEditor'), {
	ssr: false,
	loading: () => (
		<div className="flex h-[70vh] items-center justify-center text-neutral-500">
			Загрузка редактора...
		</div>
	),
})

export default function CWMapView() {
	return (
		<main className="flex min-h-screen flex-col pt-28">
			<CWMapEditor />
		</main>
	)
}
