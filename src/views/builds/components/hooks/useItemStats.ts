'use client'

import type {
	AddStatBlock,
	ElementListBlock,
	InfoElement,
	Item,
	Locale,
	NumericElement,
	NumericRangeElement,
	NumericVariantsElement,
} from '@/types/item.type'
import { messageToString } from '@/utils/itemUtils'

export const HIDDEN_STAT_KEYS = new Set([
	'core.tooltip.info.weight',
	'core.tooltip.info.durability',
	'core.tooltip.info.max_durability',
	'stalker.tooltip.artefact.not_probed',
	'stalker.tooltip.artefact.info.freshness',
	'stalker.tooltip.artefact.info.durability',
	'stalker.tooltip.artefact.info.max_durability',
	'stalker.lore.armor_artefact.info.compatible_backpacks',
	'general.armor.compatibility.backpacks.superheavy',
	'stalker.lore.armor_artefact.info.compatible_containers',
	'general.armor.compatibility.containers.bulky',
	'item.att.temp_model_armor.additional_stats_tip',
	'core.tooltip.stat_name.damage_type.direct',
	'stalker.tooltip.medicine.info.toxicity',
	'stalker.tooltip.medicine.info.duration',
	'stalker.tooltip.medicine.info.priority',
	'stalker.tooltip.backpack.stat_name.inner_protection',
	'stalker.tooltip.backpack.stat_name.effectiveness',
	'stalker.tooltip.backpack.info.size',
])

export function isNumericEl(el: InfoElement): el is NumericElement {
	return el.type === 'numeric'
}

export function isRangeEl(el: InfoElement): el is NumericRangeElement {
	return el.type === 'range'
}

export function isNumericVariantsEl(
	el: InfoElement
): el is NumericVariantsElement {
	return el.type === 'numericVariants'
}

export function getElementKey(el: InfoElement): string | null {
	if ('name' in el && el.name?.type === 'translation') {
		return el.name.key
	}
	return null
}

export function getItemKeys(item: Item): Set<string> {
	const keys = new Set<string>()
	if (!item.infoBlocks) return keys

	for (const block of item.infoBlocks) {
		if (block.type !== 'list' && block.type !== 'addStat') continue
		const elements = (block as ElementListBlock | AddStatBlock).elements
		if (!Array.isArray(elements)) continue

		for (const el of elements) {
			if (!el) continue
			const key = getElementKey(el)
			if (key) keys.add(key)
		}
	}
	return keys
}

export function getNumericValue(
	item: Item,
	key: string,
	locale: Locale,
	numericVariants: number = 0
): number {
	if (!item.infoBlocks) return 0

	for (const block of item.infoBlocks) {
		if (block.type !== 'list' && block.type !== 'addStat') continue
		const elements = (block as ElementListBlock | AddStatBlock).elements
		if (!Array.isArray(elements)) continue

		for (const el of elements) {
			if (!el) continue

			const elKey = getElementKey(el)
			if (elKey !== key) continue

			if (isNumericEl(el)) {
				return Number(el.value ?? 0)
			}

			if (isRangeEl(el)) {
				const v0 = Number(el.min ?? 0)
				const v100 = Number(el.max ?? 0)

				const percent = numericVariants / 15
				return v0 + (v100 - v0) * percent
			}

			if (isNumericVariantsEl(el)) {
				const values = el.value ?? []
				const index = Math.min(
					Math.max(numericVariants, 0),
					values.length - 1
				)
				return Number(values[index] ?? 0)
			}
		}
	}

	return 0
}

export function getDisplayName(
	item: Item,
	key: string,
	locale: Locale
): string {
	if (!item.infoBlocks) return key

	for (const block of item.infoBlocks) {
		if (block.type !== 'list' && block.type !== 'addStat') continue
		const elements = (block as ElementListBlock | AddStatBlock).elements
		if (!Array.isArray(elements)) continue

		for (const el of elements) {
			if (!el) continue

			const elKey = getElementKey(el)
			if (elKey !== key) continue

			if ('name' in el) {
				return messageToString(el.name, locale)
			}
		}
	}

	return key
}
