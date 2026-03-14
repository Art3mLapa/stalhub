'use client'

import { Icon } from '@iconify/react'
import Image from 'next/image'
import { inter } from '@/app/fonts'
import type { Art } from '@/types/build.type'
import type { Item, Locale } from '@/types/item.type'
import { InfoColor, infoColorMap } from '@/types/item.type'
import { messageToString } from '@/utils/itemUtils'
import { Button } from '../ui/Button'

type ArtifactSlotsProps = {
	slots: (string | null)[]
	arts: Art[]
	items: Item[]
	locale: Locale
	selectedSlot: number
	onSelectSlot: (index: number) => void
	onCreateContainer: () => void
	onRemove?: (instanceId: string) => void
	onCopyMode?: () => void
	onCancelCopyMode?: () => void
	copyMode?: boolean
}

export function ArtifactSlots({
	slots,
	arts,
	items,
	locale,
	selectedSlot,
	onSelectSlot,
	onCreateContainer,
	onRemove,
	onCopyMode,
	onCancelCopyMode,
	copyMode,
}: ArtifactSlotsProps) {
	if (!slots || slots.length === 0) {
		return (
			<div className="flex items-center gap-2">
				<p className="text-neutral-400 text-sm">Контейнер не найден</p>
				<button
					className="rounded bg-amber-600/10 px-2 py-1 text-xs hover:bg-amber-600/20"
					onClick={onCreateContainer}
					type="button"
				>
					Создать контейнер (6)
				</button>
			</div>
		)
	}

	return (
		<div className="z-1 flex w-full justify-between">
			{slots.map((_, i) => {
				const instanceId = slots[i]
				const art = instanceId
					? (arts.find((a) => a.instanceId === instanceId) ?? null)
					: null
				const item = art
					? (items.find((it) => it.id === art.itemId) ?? null)
					: null

				const isSelected = selectedSlot === i
				const qualityClass = art?.qualityClass
				const colorHex =
					qualityClass !== undefined
						? infoColorMap[qualityClass]
						: InfoColor.DEFAULT

				return (
					<div className="relative" key={i}>
						<button
							className={`flex h-22 w-22 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-border/40 bg-background/25 p-1 backdrop-blur-sm transition-colors ${
								isSelected
									? copyMode
										? 'border-blue-500 ring-2 ring-blue-500/50'
										: 'border-border/80'
									: copyMode && slots[i]
										? 'border-blue-500/50 hover:border-blue-500'
										: 'hover:border-border/60'
							}`}
							onClick={() => onSelectSlot(i)}
						>
							{item ? (
								<div className="flex flex-col items-center">
									<Image
										alt={messageToString(item.name, locale)}
										height={44}
										src={`https://raw.githubusercontent.com/oarer/sc-db/refs/heads/main/merged/icons/${item.category}/${item.id}.png`}
										width={44}
									/>
									<div className="flex flex-col items-center">
										<p
											className="max-w-16 truncate text-center font-semibold text-xs transition-colors"
											style={{ color: colorHex }}
										>
											{messageToString(item.name, locale)}
										</p>
										{art?.potential !== 0 && (
											<span
												className={`${inter.className} font-semibold text-xs transition-colors`}
												style={{ color: colorHex }}
											>
												+{art?.potential}
											</span>
										)}
									</div>
								</div>
							) : (
								<div className="flex flex-col items-center">
									<Icon
										className="text-2xl text-neutral-500"
										icon="lucide:circle-question-mark"
									/>
								</div>
							)}
						</button>

						{item && (
							<>
								<div className="absolute top-1 left-1">
									<Button
										className="rounded-full p-1 text-white"
										onClick={(e) => {
											e.stopPropagation()
											onSelectSlot(i)
											onCopyMode?.()
										}}
										title="Копировать"
										type="button"
										variant={'ghost'}
									>
										<Icon
											className="size-4"
											icon="lucide:copy"
										/>
									</Button>
								</div>
								<div className="absolute top-1 right-1">
									<Button
										className="rounded-full p-1 text-white ring-transparent"
										onClick={(e) => {
											e.stopPropagation()
											onRemove?.(instanceId!)
										}}
										title="Удалить"
										type="button"
										variant={'danger'}
									>
										<Icon
											className="size-4"
											icon="lucide:trash-2"
										/>
									</Button>
								</div>
							</>
						)}
					</div>
				)
			})}
		</div>
	)
}
