import {
	dehydrate,
	HydrationBoundary,
	QueryClient,
} from '@tanstack/react-query'

import { arsenalQueries } from '@/queries/calcs/arsenal.queries'
import { ArsenalView } from '@/views/arsenal/ArsenalView'

export default async function ArsenalPage() {
	const queryClient = new QueryClient()

	queryClient.prefetchQuery(arsenalQueries.get())

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<ArsenalView />
		</HydrationBoundary>
	)
}
