'use client'

import { Icon } from '@iconify/react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { Card } from '@/components/ui/Card'
import { Tabs } from '@/components/ui/Tabs'
import { getLocale } from '@/lib/getLocale'
import { itemsQueries } from '@/queries/calcs/items.queries'
import { useBuildStore } from '@/stores/useBuild.store'
import type { Art } from '@/types/build.type'
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
import { computeArtifactStatsFromParsed } from '@/utils/computeArtifactStats'
import { messageToString } from '@/utils/itemUtils'
import { parseItemStats } from '@/utils/parseArtifact'

type BuildStats = Record<string, number>

const HIDDEN_KEYS = new Set([
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

function isNumericEl(el: InfoElement): el is NumericElement {
	return el.type === 'numeric'
}

function isRangeEl(el: InfoElement): el is NumericRangeElement {
	return el.type === 'range'
}

function isNumericVariantsEl(el: InfoElement): el is NumericVariantsElement {
	return el.type === 'numericVariants'
}

function getElementKey(el: InfoElement): string | null {
	if ('name' in el && el.name?.type === 'translation') {
		return el.name.key
	}
	return null
}

function getItemKeys(item: Item): Set<string> {
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

function getNumericValue(
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

function getDisplayName(item: Item, key: string, locale: Locale): string {
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

function computeArtifactStats(
	art: Art,
	items: Item[],
	locale: Locale
): BuildStats {
	const item = items.find((i) => i.id === art.itemId)
	if (!item) return {}

	const parsed = parseItemStats(item, locale)
	const stats = computeArtifactStatsFromParsed(art, parsed, art.selectedStats)

	const result: BuildStats = {}

	for (const [key, stat] of Object.entries(stats)) {
		const cleanKey = key.startsWith('add:') ? key.slice(4) : key
		result[cleanKey] = (result[cleanKey] ?? 0) + stat.final
	}

	return result
}

function roundNumber(num: number): number {
	return Math.round(num * 100) / 100
}

export default function StatsTabs() {
	const build = useBuildStore((s) => s.build)

	const locale = getLocale()

	const armorsQuery = useSuspenseQuery(itemsQueries.get({ type: 'armor' }))
	const containersQuery = useSuspenseQuery(
		itemsQueries.get({ type: 'containers' })
	)
	const artefactsQuery = useSuspenseQuery(
		itemsQueries.get({ type: 'artefact' })
	)
	const consumablesQuery = useSuspenseQuery(
		itemsQueries.get({ type: 'consumables' })
	)

	const armors = armorsQuery.data ?? []
	const containers = containersQuery.data ?? []
	const artefacts = artefactsQuery.data ?? []
	const consumables = consumablesQuery.data ?? []

	const allItems = useMemo(
		() => [...armors, ...containers, ...artefacts, ...consumables],
		[armors, containers, artefacts, consumables]
	)

	const allStatKeys = useMemo(() => {
		const keys = new Set<string>()

		if (build.armor?.id) {
			const armorItem = armors.find((a) => a.id === build.armor?.id)
			if (armorItem) {
				getItemKeys(armorItem).forEach((k) => keys.add(k))
			}
		}

		if (build.container?.id) {
			const containerItem = containers.find(
				(c) => c.id === build.container?.id
			)
			if (containerItem) {
				getItemKeys(containerItem).forEach((k) => keys.add(k))
			}
		}

		for (const art of build.arts) {
			const artItem = artefacts.find((a) => a.id === art.itemId)
			if (artItem) {
				getItemKeys(artItem).forEach((k) => keys.add(k))
			}
		}

		for (const boostId of Object.values(build.boost).filter(Boolean)) {
			const boostItem = consumables.find((c) => c.id === boostId)
			if (boostItem) {
				getItemKeys(boostItem).forEach((k) => keys.add(k))
			}
		}

		return Array.from(keys)
			.filter((k) => !HIDDEN_KEYS.has(k))
			.sort()
	}, [build, armors, containers, artefacts, consumables])

	const displayNamesMap = useMemo(() => {
		const map: Record<string, string> = {}
		for (const key of allStatKeys) {
			const itemWithKey = allItems.find((item) => {
				return getItemKeys(item).has(key)
			})
			if (itemWithKey) {
				map[key] = getDisplayName(itemWithKey, key, locale)
			}
		}
		return map
	}, [allItems, allStatKeys, locale])

	const stats = useMemo<BuildStats>(() => {
		const result: BuildStats = {}

		const containerForBonus = containers.find(
			(c) => c.id === build.container?.id
		)
		const effectiveness = containerForBonus
			? getNumericValue(
					containerForBonus,
					'stalker.tooltip.backpack.stat_name.effectiveness',
					locale
				) / 100
			: 1
		const innerProtection = containerForBonus
			? getNumericValue(
					containerForBonus,
					'stalker.tooltip.backpack.stat_name.inner_protection',
					locale
				) / 100
			: 0

		const armorItem = armors.find((a) => a.id === build.armor?.id)
		if (armorItem && build.armor) {
			const level = build.armor.level ?? 0
			for (const key of allStatKeys) {
				const val = getNumericValue(armorItem, key, locale, level)
				if (val !== 0) {
					result[key] = (result[key] ?? 0) + val
				}
			}
		}

		const containerItem = containers.find(
			(c) => c.id === build.container?.id
		)
		if (containerItem) {
			for (const key of allStatKeys) {
				const val = getNumericValue(containerItem, key, locale)
				if (val !== 0) {
					result[key] = (result[key] ?? 0) + val
				}
			}
		}

		for (const art of build.arts) {
			const artStats = computeArtifactStats(art, artefacts, locale)
			for (const [key, val] of Object.entries(artStats)) {
				if (val !== 0) {
					result[key] = (result[key] ?? 0) + val
				}
			}
		}

		for (const key of Object.keys(result)) {
			const isAccumulation = key.includes('accumulation')
			const currentVal = result[key] ?? 0

			if (isAccumulation) {
				if (currentVal > 0) {
					result[key] = currentVal * (1 - innerProtection)
				}
			} else {
				if (currentVal > 0) {
					result[key] = currentVal * effectiveness
				}
			}
		}

		for (const boostId of Object.values(build.boost).filter(Boolean)) {
			const boostItem = consumables.find((c) => c.id === boostId)
			if (boostItem) {
				for (const key of allStatKeys) {
					const val = getNumericValue(boostItem, key, locale)
					if (val !== 0) {
						result[key] = (result[key] ?? 0) + val
					}
				}
			}
		}

		return result
	}, [build, armors, containers, artefacts, consumables, allStatKeys, locale])

	const prime = Number(
		((100 +
			(stats['stalker.artefact_properties.factor.bullet_dmg_factor'] ??
				0)) *
			((stats['stalker.artefact_properties.factor.health_bonus'] ?? 0) +
				100)) /
			100
	).toFixed(2)

	const hps = (
		((stats['stalker.artefact_properties.factor.artefakt_heal'] ?? 0) +
			(stats['stalker.artefact_properties.factor.healing_efficiency'] ??
				0) +
			((stats['stalker.artefact_properties.factor.regeneration_bonus'] ??
				0) +
				2.5) /
				5) *
		(1 +
			(stats['stalker.artefact_properties.factor.health_bonus'] ?? 0) /
				100)
	).toFixed(2)

	const containerStats = useMemo<BuildStats>(() => {
		const result: BuildStats = {}

		const containerItem = containers.find(
			(c) => c.id === build.container?.id
		)
		if (!containerItem) return result

		const effectiveness =
			getNumericValue(
				containerItem,
				'stalker.tooltip.backpack.stat_name.effectiveness',
				locale
			) / 100
		const innerProtection =
			getNumericValue(
				containerItem,
				'stalker.tooltip.backpack.stat_name.inner_protection',
				locale
			) / 100

		for (const key of allStatKeys) {
			const val = getNumericValue(containerItem, key, locale)
			if (val !== 0) {
				result[key] = val
			}
		}

		for (const art of build.arts) {
			const artStats = computeArtifactStats(art, artefacts, locale)
			for (const [key, val] of Object.entries(artStats)) {
				if (val !== 0) {
					result[key] = (result[key] ?? 0) + val
				}
			}
		}

		for (const key of Object.keys(result)) {
			const isAccumulation = key.includes('accumulation')
			const currentVal = result[key] ?? 0

			if (isAccumulation) {
				if (currentVal > 0) {
					result[key] = currentVal * (1 - innerProtection)
				}
			} else {
				if (currentVal > 0) {
					result[key] = currentVal * effectiveness
				}
			}
		}

		return result
	}, [build, containers, artefacts, allStatKeys, locale])

	const sortedStats = useMemo(() => {
		return Object.entries(stats)
			.filter(([, val]) => val !== 0)
			.sort(([keyA], [keyB]) => {
				const nameA = displayNamesMap[keyA] ?? keyA
				const nameB = displayNamesMap[keyB] ?? keyB
				return nameA.localeCompare(nameB)
			})
	}, [stats, displayNamesMap])

	const sortedContainerStats = useMemo(() => {
		return Object.entries(containerStats)
			.filter(([, val]) => val !== 0)
			.sort(([keyA], [keyB]) => {
				const nameA = displayNamesMap[keyA] ?? keyA
				const nameB = displayNamesMap[keyB] ?? keyB
				return nameA.localeCompare(nameB)
			})
	}, [containerStats, displayNamesMap])

	return (
		<Tabs.Root className="w-full" defaultValue="statsAll">
			<Tabs.List className="grid w-full grid-cols-2">
				<Tabs.Trigger value="statsAll">
					<Icon className="text-lg" icon="lucide:bar-chart-3" />
					Общее
				</Tabs.Trigger>
				<Tabs.Trigger value="statsCont">
					<Icon className="text-lg" icon="lucide:box" />
					Контейнер
				</Tabs.Trigger>
			</Tabs.List>
			<Tabs.Content value="statsAll">
				<Card.Root>
					<Card.Content className="flex flex-col gap-2 text-sm">
						<p className="flex justify-between">
							<span>Приведёнка</span>
							<span className="text-yellow-400">{prime}</span>
						</p>
						<p className="flex justify-between">
							<span>Реген</span>
							<span className="text-yellow-400">{hps}%</span>
						</p>
						<div className="border-neutral-700 border-t pt-2">
							{Object.keys(stats).length === 0 ? (
								<p className="text-neutral-500">Нет статов</p>
							) : (
								sortedStats.map(([key, val]) => {
									const isAccumulation =
										key.includes('accumulation')
									const valueColor = isAccumulation
										? val <= 0
											? '#53C353'
											: '#C15252'
										: val >= 0
											? '#53C353'
											: '#C15252'
									return (
										<p
											className="flex justify-between"
											key={key}
										>
											<span>
												{displayNamesMap[key] ?? key}
											</span>
											<span
												className="font-medium"
												style={{ color: valueColor }}
											>
												{val >= 0 ? '+' : ''}
												{roundNumber(val)}
											</span>
										</p>
									)
								})
							)}
						</div>
					</Card.Content>
				</Card.Root>
			</Tabs.Content>
			<Tabs.Content value="statsCont">
				<Card.Root>
					<Card.Content className="flex flex-col gap-2 text-sm">
						{!build.container ? (
							<p className="text-neutral-500">
								Контейнер не выбран
							</p>
						) : Object.keys(containerStats).length === 0 ? (
							<p className="text-neutral-500">Нет статов</p>
						) : (
							sortedContainerStats.map(([key, val]) => {
								const isAccumulation =
									key.includes('accumulation')
								const valueColor = isAccumulation
									? val <= 0
										? '#53C353'
										: '#C15252'
									: val >= 0
										? '#53C353'
										: '#C15252'
								return (
									<p
										className="flex justify-between"
										key={key}
									>
										<span>
											{displayNamesMap[key] ?? key}
										</span>
										<span
											className="font-medium"
											style={{ color: valueColor }}
										>
											{val >= 0 ? '+' : ''}
											{roundNumber(val)}
										</span>
									</p>
								)
							})
						)}
					</Card.Content>
				</Card.Root>
			</Tabs.Content>
		</Tabs.Root>
	)
}
