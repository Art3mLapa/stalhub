import {
	dehydrate,
	HydrationBoundary,
	QueryClient,
} from '@tanstack/react-query'

import { itemsQueries } from '@/queries/calcs/items.queries'
import { TTKView } from '@/views/ttk/TTKView'

export default async function TTKPage() {
	const queryClient = new QueryClient()

	await Promise.all([
		queryClient.prefetchQuery(itemsQueries.get({ type: 'weapons' })),
		queryClient.prefetchQuery(itemsQueries.get({ type: 'ammo' })),
		queryClient.prefetchQuery(itemsQueries.get({ type: 'plates' })),
		queryClient.prefetchQuery(itemsQueries.get({ type: 'armor' })),
		queryClient.prefetchQuery(itemsQueries.get({ type: 'containers' })),
		queryClient.prefetchQuery(itemsQueries.get({ type: 'artefact' })),
		queryClient.prefetchQuery(itemsQueries.get({ type: 'consumables' })),
	])

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<TTKView />
		</HydrationBoundary>
	)
}
