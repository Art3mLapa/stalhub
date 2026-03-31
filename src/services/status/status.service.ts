import axios from 'axios'

import type { StatusResponse } from '@/types/status.type'

class StatusService {
	async get() {
		const { data } = await axios.get<StatusResponse>(`/api/status`)
		return data
	}
}

export const statusService = new StatusService()
