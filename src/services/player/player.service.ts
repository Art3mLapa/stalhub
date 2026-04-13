import { apiClient } from '@/app/api/interceptors/root.interceptor'
import type { PlayerInfo, PlayerParams } from '@/types/player.type'

class PlayerService {
	async get({ region, character }: PlayerParams): Promise<PlayerInfo> {
		const { data } = await apiClient.get<PlayerInfo>(
			`/api/player/${region}/${character}/profile`
		)
		return data
	}
}

export const playerService = new PlayerService()
