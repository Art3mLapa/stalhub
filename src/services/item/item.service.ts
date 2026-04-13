import axios from 'axios'
import type { Item } from '@/types/item.type'

const GITHUB_BASE =
	'https://raw.githubusercontent.com/oarer/sc-db/refs/heads/main/merged/items/'

class ItemService {
	async getByGithubUrl(githubUrl: string) {
		const { data } = await axios.get<Item>(`${GITHUB_BASE}${githubUrl}`)
		return data
	}
}

export const itemService = new ItemService()
