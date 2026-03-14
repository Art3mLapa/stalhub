'use client'

import { Icon } from '@iconify/react'
import Image from 'next/image'
import { useMemo } from 'react'
import { cn } from '@/lib/cn'
import {
	type FavoriteType,
	useFavoritesStore,
} from '@/stores/useFavorites.store'
import type { Item, Locale } from '@/types/item.type'
import { InfoColor, infoColorMap } from '@/types/item.type'
import { messageToString } from '@/utils/itemUtils'

type ItemsListProps = {
	items: Item[]
	locale: Locale
	onSelectItem?: (itemId: string) => void
	selectedItemId?: string | null
	className?: string
	favoriteType?: FavoriteType
	showFavorites?: boolean
}

const colorPriority: Record<InfoColor, number> = {
	[InfoColor.DEFAULT]: 0,

	[InfoColor.RANK_NEWBIE]: 1,
	[InfoColor.ART_QUALITY_COMMON]: 1,

	[InfoColor.RANK_STALKER]: 2,
	[InfoColor.ART_QUALITY_UNCOMMON]: 2,

	[InfoColor.RANK_VETERAN]: 3,
	[InfoColor.ART_QUALITY_SPECIAL]: 3,

	[InfoColor.RANK_MASTER]: 4,
	[InfoColor.ART_QUALITY_RARE]: 4,

	[InfoColor.RANK_LEGEND]: 5,
	[InfoColor.ART_QUALITY_EXCLUSIVE]: 5,

	[InfoColor.ART_QUALITY_LEGENDARY]: 6,
	[InfoColor.ART_QUALITY_UNIQUE]: 7,

	[InfoColor.QUEST_ITEM]: 8,
}

export function ItemsList({
	items,
	locale,
	onSelectItem,
	selectedItemId,
	className,
	favoriteType,
	showFavorites = true,
}: ItemsListProps) {
	const { isFavorite, toggleFavorite } = useFavoritesStore()

	const sortedItems = useMemo(() => {
		let sorted = [...items].sort((a, b) => {
			const aPriority = colorPriority[a.color as InfoColor] ?? 0
			const bPriority = colorPriority[b.color as InfoColor] ?? 0

			return bPriority - aPriority
		})

		if (showFavorites && favoriteType) {
			sorted = sorted.sort((a, b) => {
				const aFav = isFavorite(favoriteType, a.id)
				const bFav = isFavorite(favoriteType, b.id)
				if (aFav && !bFav) return -1
				if (!aFav && bFav) return 1
				return 0
			})
		}

		return sorted
	}, [items, showFavorites, favoriteType, isFavorite])

	return (
		<div
			className={cn(
				'mask-y-from-95% mask-y-to-100% flex max-h-130 max-w-70 flex-col gap-2 overflow-y-auto',
				className
			)}
		>
			{sortedItems.map((item) => {
				const isActive = selectedItemId === item.id
				const itemColor =
					infoColorMap[item.color as InfoColor] || InfoColor.DEFAULT
				const isFav = favoriteType
					? isFavorite(favoriteType, item.id)
					: false

				return (
					<div
						className="group relative m-1 flex cursor-pointer items-center gap-2 rounded-xl p-2 ring-2 transition-colors"
						key={item.id}
						onClick={() => onSelectItem?.(item.id)}
						style={
							{
								background: isActive
									? `${itemColor}40`
									: undefined,
								'--tw-ring-color': `${itemColor}80`,
							} as React.CSSProperties
						}
					>
						<button
							className="absolute -right-1 -top-1 hidden size-5 items-center justify-center rounded-full bg-neutral-800 p-0.5 group-hover:flex"
							onClick={(e) => {
								e.stopPropagation()
								if (favoriteType) {
									toggleFavorite(favoriteType, item.id)
								}
							}}
							type="button"
						>
							<Icon
								className={
									isFav
										? 'text-yellow-400'
										: 'text-neutral-500'
								}
								icon={
									isFav ? 'lucide:star-fill' : 'lucide:star'
								}
								width={14}
							/>
						</button>
						<Image
							alt={messageToString(item.name, locale)}
							className="h-8 w-8 object-contain"
							height={32}
							src={`https://raw.githubusercontent.com/oarer/sc-db/refs/heads/main/merged/icons/${item.category}/${item.id}.png`}
							width={32}
						/>

						<p
							className="truncate font-semibold"
							style={{ color: itemColor }}
						>
							{messageToString(item.name, locale)}
						</p>
					</div>
				)
			})}
		</div>
	)
}
