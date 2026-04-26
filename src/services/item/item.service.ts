import axios from 'axios'
import { apiClient } from '@/app/api/interceptors/root.interceptor'
import type { BarterResponse } from '@/types/barter.type'
import type { Item } from '@/types/item.type'

const GITHUB_BASE =
	'https://raw.githubusercontent.com/oarer/sc-db/refs/heads/main/merged/items/'

class ItemService {
	async getByGithubUrl(githubUrl: string) {
		const { data } = await axios.get<Item>(`${GITHUB_BASE}${githubUrl}`)
		return data
	}

	async getBarter(id: string) {
		const { data } = await apiClient.get<BarterResponse>(
			`/api/barter/${id}`
		)
		return data
	}
}

export const itemService = new ItemService()
