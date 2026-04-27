import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Combobox } from '@/components/ui/Combobox'
import { Divider } from '@/components/ui/Divider'
import { getLocale } from '@/lib/getLocale'
import type { BarterResponse } from '@/types/barter.type'
import { InfoColor, infoColorMap } from '@/types/item.type'
import { messageToString } from '@/utils/itemUtils'

type Props = {
	data?: BarterResponse
}

//! TODO add i18n, refactoring
export default function Barter({ data }: Props) {
	const locale = getLocale()
	const [selectedRecipe, setSelectedRecipe] = useState(0)

	if (!data) {
		return (
			<Card.Root className="p-4">
				<div className="text-neutral-500 text-sm">
					Нет данных для отображения
				</div>
			</Card.Root>
		)
	}

	const recipes = data.recipes ?? []
	const hasMultipleRecipes = recipes.length > 1

	return (
		<Card.Root className="space-y-6 p-4">
			<Card.Header className="flex gap-2">
				<Card.Title>
					Необходимый уровень базы: {data.settlement_required_level}
				</Card.Title>
				<Divider />
				<Card.Description className="flex flex-col justify-start gap-2">
					<h1 className={`font-semibold text-md`}>
						Базы для бартера:
					</h1>
					<div className="flex flex-wrap">
						{data.settlement_titles.map((title, index) => (
							<span
								className="flex items-center"
								key={`${title}-${index}`}
							>
								<p className="font-semibold text-text-accent/90">
									{messageToString(title, locale)}
								</p>
								{index !==
									data.settlement_titles.length - 1 && (
									<span className="mx-1">,</span>
								)}
							</span>
						))}
					</div>
				</Card.Description>
			</Card.Header>
			<Divider />
			<Card.Content>
				{data.recipes?.length > 0 && (
					<div className="space-y-4">
						{hasMultipleRecipes && (
							<div className="flex items-center gap-2">
								<div className="w-32">
									<Combobox
										onValueChange={(value) =>
											setSelectedRecipe(Number(value))
										}
										options={recipes.map((_, index) => ({
											label: `Рецепт ${index + 1}`,
											value: String(index),
										}))}
										placeholder="Рецепт"
										value={String(selectedRecipe)}
									/>
								</div>
							</div>
						)}
						{recipes.length > 0 && (
							<div
								key={`${recipes[selectedRecipe].money}-${selectedRecipe}`}
							>
								<div className="mb-4 flex items-center justify-between gap-3">
									<p className="font-semibold text-sm">
										Стоимость:{' '}
										{Number(
											recipes[selectedRecipe]?.money ?? 0
										).toLocaleString('en-US', {
											minimumFractionDigits: 0,
											maximumFractionDigits: 2,
										})}{' '}
										₽
									</p>
								</div>

								<div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-6">
									{recipes[selectedRecipe].items.map(
										(item, itemIndex) => (
											<Link
												className="flex flex-col items-center gap-3 rounded-xl border-2 border-border-secondary p-2"
												href={`/items${item.category}`}
												key={`${item.category}-${itemIndex}`}
											>
												<Image
													alt={messageToString(
														item.lines,
														locale
													)}
													height={52}
													src={`https://raw.githubusercontent.com/oarer/sc-db/refs/heads/main/merged/icons${item.category}.png`}
													width={52}
												/>
												<Divider />
												<p
													className="font-mono text-xs"
													style={{
														color:
															infoColorMap[
																item?.color as InfoColor
															] ||
															InfoColor.DEFAULT,
													}}
												>
													{item.amount}x
												</p>
											</Link>
										)
									)}
								</div>
							</div>
						)}
					</div>
				)}
				{data.used_in?.length > 0 && (
					<section>
						<h2 className="mb-3 font-semibold text-sm">
							Используется в
						</h2>

						<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
							{data.used_in.map((item) => (
								<Card.Link
									className="flex items-center gap-3 p-3"
									href={`/items${item.category}`}
									key={item.item_id}
								>
									<Image
										alt={messageToString(
											item.lines,
											locale
										)}
										height={32}
										src={`https://raw.githubusercontent.com/oarer/sc-db/refs/heads/main/merged/icons${item.category}.png`}
										width={32}
									/>

									<div className="min-w-0">
										<p
											className="truncate font-semibold text-sm"
											style={{
												color:
													infoColorMap[
														item?.color as InfoColor
													] || InfoColor.DEFAULT,
											}}
										>
											{messageToString(
												item.lines,
												locale
											)}
										</p>
									</div>
								</Card.Link>
							))}
						</div>
					</section>
				)}
			</Card.Content>
		</Card.Root>
	)
}
