import type { InfoColor, ItemName } from './item.type'

export enum Regions {
	RU = 'RU',
	EU = 'EU',
	NA = 'NA',
	SEA = 'SEA',
	NEA = 'NEA',
}

export interface AuctionParams {
	id: string
	limit?: number
	additional?: boolean
}
export interface ItemListing {
	data: string
	icon: string
	name: ItemName
	color: InfoColor
}
