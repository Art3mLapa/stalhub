import axios from 'axios'

import type { BuildStatsParams, BuildStatsResponse } from '@/types/build.type'

class BuildService {
	async get({ type }: BuildStatsParams) {
		const { data } = await axios.get<BuildStatsResponse>(
			`https://raw.githubusercontent.com/oarer/sc-db/refs/heads/main/merged/listing/${type}.json`
		)
		return data
	}
}

export const buildService = new BuildService()
