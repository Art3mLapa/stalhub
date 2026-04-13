import { apiClient } from '@/app/api/interceptors/root.interceptor'
import type { AuctionParams } from '@/types/api.type'
import type { LotsHistoryResponse, LotsResponse } from '@/types/item.type'

export interface AuctionServiceParams extends AuctionParams {
	region?: string
}

class AuctionService {
	async getLots({
		id,
		limit = 10,
		additional = true,
		region = 'RU',
	}: AuctionServiceParams): Promise<LotsResponse> {
		const { data } = await apiClient.get<LotsResponse>(
			`/api/auction/${region}/${id}/lots`,
			{
				params: { limit, additional },
			}
		)
		return data
	}

	async getHistory({
		id,
		limit = 10,
		additional = true,
		region = 'RU',
	}: AuctionServiceParams): Promise<LotsHistoryResponse> {
		const { data } = await apiClient.get<LotsHistoryResponse>(
			`/api/auction/${region}/${id}/history`,
			{
				params: { limit, additional },
			}
		)
		return data
	}
}

export const auctionService = new AuctionService()
