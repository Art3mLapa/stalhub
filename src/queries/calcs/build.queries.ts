import { queryOptions } from '@tanstack/react-query'

import { buildService } from '@/services/calcs/build.service'
import type { BuildStatsParams, BuildStatsResponse } from '@/types/build.type'
import type { Item } from '@/types/item.type'

class BuildQueries {
	get({ type }: BuildStatsParams) {
		return queryOptions<BuildStatsResponse, Error, Item[]>({
			queryKey: ['build', type],
			queryFn: () => buildService.get({ type }),
			select: (data) => Object.values(data),
			placeholderData: undefined,
			staleTime: 1000 * 60 * 120,
		})
	}
}

export const buildQueries = new BuildQueries()
