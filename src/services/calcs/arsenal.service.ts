import { apiClient } from '@/app/api/interceptors/root.interceptor'
import type { ArsenalResponse } from '@/types/arsenal.type'

class ArsenalService {
	async get() {
		const { data } = await apiClient.get<ArsenalResponse>(`/api/arsenal`)
		return data
	}
}

export const arsenalService = new ArsenalService()
