import { apiClient } from '@/app/api/interceptors/root.interceptor'
import type { PlayerParams, PlayerResponse } from '@/types/player.type'

class PlayerService {
	async get({ region, character }: PlayerParams): Promise<PlayerResponse> {
		const { data } = await apiClient.get<PlayerResponse>(
			`/api/player/${region}/${character}`
		)
		return data
	}
}

export const playerService = new PlayerService()
