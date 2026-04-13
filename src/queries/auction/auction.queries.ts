import { queryOptions } from '@tanstack/react-query'

import { auctionService } from '@/services/auction/auction.service'
import type { AuctionParams } from '@/types/api.type'
import type { LotsHistoryResponse, LotsResponse } from '@/types/item.type'

class AuctionQueries {
	lots({
		id,
		limit,
		additional,
		region,
	}: AuctionParams & { region?: string }) {
		return queryOptions<LotsResponse>({
			queryKey: ['auction', 'lots', id, limit, additional, region],
			queryFn: () =>
				auctionService.getLots({ id, limit, additional, region }),
			placeholderData: undefined,
			staleTime: 1000 * 60,
		})
	}

	history({
		id,
		limit,
		additional,
		region,
	}: AuctionParams & { region?: string }) {
		return queryOptions<LotsHistoryResponse>({
			queryKey: ['auction', 'history', id, limit, additional, region],
			queryFn: () =>
				auctionService.getHistory({ id, limit, additional, region }),
			placeholderData: undefined,
			staleTime: 1000 * 60,
		})
	}
}

export const auctionQueries = new AuctionQueries()
