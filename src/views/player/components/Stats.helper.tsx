import type { TFunction } from 'i18next'
import { useTranslation } from 'react-i18next'
import { Grid } from 'react-window'

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

const COLUMN_WIDTH = 200
const ROW_HEIGHT = 52
const VIRTUALIZE_THRESHOLD = 50

type CellProps = {
	locale: string
	stats: (Stat & { meta?: DBStats })[]
	columnCount: number
}

export function StatsSection({
	title,
	stats,
}: {
	title: StatCategory
	stats: (Stat & { meta?: DBStats })[]
}) {
	const locale = getLocale()
	const { t } = useTranslation()

	if (!stats || stats.length === 0) return null

	const shouldVirtualize = stats.length > VIRTUALIZE_THRESHOLD
	const columnCount = 3
	const rowCount = Math.ceil(stats.length / columnCount)

	const Cell = ({
		columnIndex,
		rowIndex,
		style,
	}: {
		ariaAttributes: { 'aria-colindex': number; role: 'gridcell' }
		columnIndex: number
		rowIndex: number
		style: React.CSSProperties
	}) => {
		const index = rowIndex * columnCount + columnIndex
		const stat = stats[index]

		if (!stat) return null

		return (
			<div className="space-y-1 p-2" style={style}>
				<p className="font-semibold text-md">
					{messageToString(stat.meta?.name, locale)}
				</p>
				<p className={`${montserrat.className} font-medium text-sm`}>
					{formatStatValue(stat, locale, t)}
				</p>
			</div>
		)
	}

	if (shouldVirtualize) {
		return (
			<div className="space-y-3">
				<div className="flex items-center gap-2">
					<h3 className="font-semibold text-lg">
						{t(`player.category.${title}`)}
					</h3>
				</div>
				<div className="pl-7">
					<Grid
						cellComponent={Cell}
						cellProps={{} as CellProps}
						columnCount={columnCount}
						columnWidth={COLUMN_WIDTH}
						rowCount={rowCount}
						rowHeight={ROW_HEIGHT}
						style={{ height: Math.min(rowCount * ROW_HEIGHT, 400) }}
					/>
				</div>
			</div>
		)
	}

	return (
		<div className="space-y-3">
			<div className="flex items-center gap-2">
				<h3 className="font-semibold text-lg">
					{t(`player.category.${title}`)}
				</h3>
			</div>

			<div className="grid grid-cols-1 gap-4 pl-7 md:grid-cols-2 lg:grid-cols-3">
				{stats.map((stat) => (
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
		</div>
	)
}
