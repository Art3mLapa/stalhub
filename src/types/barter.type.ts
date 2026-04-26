import type { Message, MessageTranslation } from './item.type'

export type BarterResponse = {
	settlement_required_level: string
	settlement_titles: Message
	used_in: UsedInItem[]
	recipes: BarterRecipeResult[]
}

export type BarterRequiredItem = {
	item: string
	amount: number
}

export type BarterOffer = {
	currency: string
	cost: number
	requiredItems: BarterRequiredItem[]
}

export type BarterRecipe = {
	settlementRequiredLevel: number
	item: string
	offers: BarterOffer[]
}

export type SettlementTitle = {
	type: string
	key: string
	args: Record<string, never>
	lines: MessageTranslation['lines']
}

export type BarterEntry = {
	settlementTitle: SettlementTitle
	recipes: BarterRecipe[]
}

export type ListingItem = {
	data: string
	icon: string
	name: Message
	color: string
}

export type UsedInItem = {
	item_id: string
	icon: string
	lines: Message
}

export type BarterItemResult = {
	amount: number
	lines: Message
	icon: string
}

export type BarterRecipeResult = {
	money: string
	items: BarterItemResult[]
}
