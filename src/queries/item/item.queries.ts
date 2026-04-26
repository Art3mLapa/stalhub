import { queryOptions } from '@tanstack/react-query'

import { itemService } from '@/services/item/item.service'
import type { BarterResponse } from '@/types/barter.type'
import type { Item } from '@/types/item.type'

class ItemQueries {
	byGithubUrl(githubUrl: string) {
		return queryOptions<Item>({
			queryKey: ['item', githubUrl],
			queryFn: () => itemService.getByGithubUrl(githubUrl),
			placeholderData: undefined,
			staleTime: 1000 * 60 * 5,
		})
	}

	barter(id: string) {
		return queryOptions<BarterResponse>({
			queryKey: ['item', id],
			queryFn: () => itemService.getBarter(id),
			placeholderData: undefined,
			staleTime: 1000 * 60 * 5,
		})
	}
}

export const itemQueries = new ItemQueries()
