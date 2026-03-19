import axios from 'axios'

import type { BuildStatsParams, ItemsResponse } from '@/types/build.type'

class ItemsService {
	async get({ type }: BuildStatsParams) {
		const { data } = await axios.get<ItemsResponse>(
			`https://raw.githubusercontent.com/oarer/sc-db/refs/heads/main/merged/listing/${type}.json`
		)
		return data
	}
}

export const itemsService = new ItemsService()
