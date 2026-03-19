import {
	dehydrate,
	HydrationBoundary,
	QueryClient,
} from '@tanstack/react-query'

import { itemsQueries } from '@/queries/calcs/items.queries'
import { BuildsView } from '@/views/builds'

export default async function BuildsPage() {
	const queryClient = new QueryClient()

	await queryClient.prefetchQuery(itemsQueries.get({ type: 'armor' }))
	await queryClient.prefetchQuery(itemsQueries.get({ type: 'containers' }))

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<BuildsView />
		</HydrationBoundary>
	)
}
