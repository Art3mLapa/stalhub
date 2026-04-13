'use client'

import { useVirtualizer } from '@tanstack/react-virtual'
import type { TFunction } from 'i18next'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'

import { montserrat } from '@/app/fonts'
import { getLocale } from '@/lib/getLocale'
import type { DBStats, Stat, StatCategory } from '@/types/player.type'
import { decimalConfig } from '@/types/player.type'
import { messageToString } from '@/utils/itemUtils'
import { DB_STATS_BY_ID } from '@/utils/player/StatParse'

export function groupPlayerStats(stats: Stat[]) {
	const result: Record<string, (Stat & { meta?: DBStats })[]> = {}

	for (const stat of stats) {
		const meta = DB_STATS_BY_ID[stat.id]
		const category = meta?.category ?? 'NONE'

		if (!result[category]) {
			result[category] = []
		}

		result[category].push({ ...stat, meta })
	}

	return result
}

function formatStatValue(stat: Stat, locale: string, t: TFunction) {
	const { value, type, id } = stat

	switch (type) {
		case 'INTEGER':
			return Number(value).toLocaleString(locale)

		case 'DECIMAL': {
			const config = decimalConfig[id] ?? {
				divisor: 100000,
				precision: 2,
				unit: 'km',
			}

			const decimalValue = Number(value) / config.divisor
			const formatted = decimalValue.toFixed(config.precision)

			return config.unit
				? `${formatted} ${t(`unit.${config.unit}`)}`
				: formatted
		}

		case 'DURATION':
			return (Number(value) / (1000 * 60 * 60)).toFixed(0)

		case 'DATE':
			return value instanceof Date
				? value.toLocaleDateString(locale)
				: new Date(value).toLocaleDateString(locale)

		default:
			return String(value)
	}
}

const ROW_HEIGHT = 52
const COLUMN_COUNT = 3

type StatsSectionProps = {
	title: StatCategory
	stats: (Stat & { meta?: DBStats })[]
}

export function StatsSection({ title, stats }: StatsSectionProps) {
	const parentRef = useRef<HTMLDivElement>(null)
	const locale = getLocale()
	const { t } = useTranslation()

	const safeStats = stats ?? []
	const shouldVirtualize = safeStats.length > 50
	const rowCount = Math.ceil(safeStats.length / COLUMN_COUNT)

	const virtualizer = useVirtualizer({
		count: rowCount,
		getScrollElement: () => parentRef.current,
		estimateSize: () => ROW_HEIGHT,
		overscan: 5,
	})

	if (safeStats.length === 0) return null

	const getCell = (rowIndex: number, columnIndex: number) => {
		const index = rowIndex * COLUMN_COUNT + columnIndex
		return safeStats[index]
	}

	return (
		<div className="space-y-3">
			<div className="flex items-center gap-2">
				<h3 className="font-semibold text-lg">
					{t(`player.category.${title}`)}
				</h3>
			</div>

			{shouldVirtualize ? (
				<div className="h-100 overflow-auto pl-7" ref={parentRef}>
					<div
						style={{
							height: virtualizer.getTotalSize(),
							position: 'relative',
							width: '100%',
						}}
					>
						{virtualizer.getVirtualItems().map((virtualRow) => {
							const rowIndex = virtualRow.index

							return (
								<div
									key={virtualRow.key}
									style={{
										position: 'absolute',
										top: 0,
										left: 0,
										width: '100%',
										height: ROW_HEIGHT,
										transform: `translateY(${virtualRow.start}px)`,
										display: 'grid',
										gridTemplateColumns: `repeat(${COLUMN_COUNT}, 200px)`,
									}}
								>
									{Array.from({ length: COLUMN_COUNT }).map(
										(_, columnIndex) => {
											const stat = getCell(
												rowIndex,
												columnIndex
											)
											if (!stat) return null

											return (
												<div
													className="space-y-1 p-2"
													key={stat.id}
												>
													<p className="font-semibold text-md">
														{messageToString(
															stat.meta?.name,
															locale
														)}
													</p>
													<p
														className={`${montserrat.className} font-medium text-sm`}
													>
														{formatStatValue(
															stat,
															locale,
															t
														)}
													</p>
												</div>
											)
										}
									)}
								</div>
							)
						})}
					</div>
				</div>
			) : (
				<div className="grid grid-cols-1 gap-4 pl-7 md:grid-cols-2 lg:grid-cols-3">
					{safeStats.map((stat) => (
						<div className="space-y-1" key={stat.id}>
							<p className="font-semibold text-md">
								{messageToString(stat.meta?.name, locale)}
							</p>
							<p
								className={`${montserrat.className} font-medium text-sm`}
							>
								{formatStatValue(stat, locale, t)}
							</p>
						</div>
					))}
				</div>
			)}
		</div>
	)
}
