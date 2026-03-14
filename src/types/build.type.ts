import type { ArtQuality, Item } from './item.type'

export type BuildStatsParams = {
	type: 'artefact' | 'armor' | 'containers' | 'consumables'
}

export type BuildStatsResponse = Record<string, Item>

export type Art = {
	instanceId: string
	itemId: string
	percent: number
	potential: number
	selectedStats: (string | null)[]
	qualityClass: ArtQuality
}

export type Armor = {
	id: string
	level: number
}

export type Container = {
	id: string
	slots: (string | null)[]
}

export enum BoostCategory {
	LONG_TIME_MEDICINE = 'item.effects.effect_type.long_time_medicine',
	MOBILITY = 'item.effects.effect_type.mobility',
	SHORT_TIME_MEDICINE = 'item.effects.effect_type.short_time_medicine',
	ANTIRAD = 'item.effects.effect_type.antirad',
	TEMPERATURE_PROTECTION = 'item.effects.effect_type.temperature_protection',
	BANDAGE = 'item.effects.effect_type.bandage',
	PROTECTION = 'item.effects.effect_type.protection',
	BIO_PROTECTION = 'item.effects.effect_type.bio_protection',
	HEALING = 'item.effects.effect_type.healing',
	RAD_PROTECTION = 'item.effects.effect_type.rad_protection',
	PSI = 'item.effects.effect_type.psi',
	PSI_PROTECTION = 'item.effects.effect_type.psi_protection',
}

export const BoostButtons: Record<BoostCategory, string> = {
	[BoostCategory.LONG_TIME_MEDICINE]: 'lucide:heart-pulse',
	[BoostCategory.MOBILITY]: 'lucide:move',
	[BoostCategory.SHORT_TIME_MEDICINE]: 'lucide:pill',
	[BoostCategory.ANTIRAD]: 'lucide:radiation',
	[BoostCategory.TEMPERATURE_PROTECTION]: 'lucide:thermometer',
	[BoostCategory.BANDAGE]: 'lucide:bandage',
	[BoostCategory.PROTECTION]: 'lucide:shield',
	[BoostCategory.BIO_PROTECTION]: 'lucide:shield-plus',
	[BoostCategory.HEALING]: 'lucide:sparkles',
	[BoostCategory.RAD_PROTECTION]: 'lucide:shield-alert',
	[BoostCategory.PSI]: 'lucide:brain',
	[BoostCategory.PSI_PROTECTION]: 'lucide:brain-circuit',
}

export type Boost = {
	id: string
	category: string
}

export type Build = {
	arts: Art[]
	boost: Record<BoostCategory, string | null>
	armor: Armor | null
	container?: Container | null
}

export type BuildDefaults = {
	art: {
		percent: number
		potential: number
	}
	armor: {
		level: number
	}
}

export type ModalManagerProps = {
	type: 'armor' | 'cont'
	clickType: 'LMB' | 'RMB'
	onClose: () => void
}

export type ModalProps = {
	onClose: () => void
}

export const percentButtons = [
	{
		value: 100,
		color: 'ring-neutral-600 bg-neutral-800 hover:bg-neutral-700 active:bg-neutral-600',
	},
	{
		value: 115,
		color: 'ring-[#9DEB9D60] bg-[#9DEB9D20] hover:bg-[#9DEB9D40] active:bg-[#9DEB9D60]',
	},
	{
		value: 130,
		color: 'ring-[#9F9FED60] bg-[#9F9FED20] hover:bg-[#9F9FED40] active:bg-[#9F9FED60]',
	},
	{
		value: 145,
		color: 'ring-[#BF5BAD60] bg-[#BF5BAD20] hover:bg-[#BF5BAD40] active:bg-[#BF5BAD60]',
	},
	{
		value: 160,
		color: 'ring-[#EA9D9E60] bg-[#EA9D9E20] hover:bg-[#EA9D9E40] active:bg-[#EA9D9E60]',
	},
	{
		value: 175,
		color: 'ring-[#FFD70060] bg-[#FFD70020] hover:bg-[#FFD70040] active:bg-[#FFD70060]',
	},
]

export const potentialButtons = [0, 5, 10, 15] as const
