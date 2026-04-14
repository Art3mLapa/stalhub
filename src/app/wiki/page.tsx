import { Icon } from '@iconify/react'
import { getTranslations } from 'next-intl/server'

import { Card } from '@/components/ui/Card'
import { formatDate } from '@/lib/date'
import { getWikiSections } from '@/lib/wiki/utils'
import { mono } from '../fonts'

export default async function WikiPage() {
	const t = await getTranslations()
	const sections = await getWikiSections()

	const totalPages = sections.reduce(
		(acc, section) => acc + section.pages.length,
		0
	)

	const recentPages = sections
		.flatMap((section) => section.pages)
		.filter((page) => page.metadata.updatedAt || page.metadata.createdAt)
		.sort((a, b) => {
			const dateA = new Date(
				a.metadata.updatedAt || a.metadata.createdAt || 0
			)
			const dateB = new Date(
				b.metadata.updatedAt || b.metadata.createdAt || 0
			)
			return dateB.getTime() - dateA.getTime()
		})
		.slice(0, 5)

	return (
		<div className="flex max-w-5xl flex-col gap-4 p-8">
			<div className="flex flex-col gap-2">
				<h1 className="font-bold text-4xl tracking-tight">
					{t('wiki.title')}
				</h1>
				<p className="font-semibold text-foreground text-md">
					{t('wiki.description')}
				</p>
			</div>

			<div className="grid grid-cols-2 gap-4">
				<p className="font-semibold">
					{t('wiki.total_pages')}{' '}
					<span className={mono.className}>{totalPages}</span>
				</p>
			</div>

			{recentPages.length > 0 && (
				<div className="flex flex-col gap-4">
					<h2 className="flex items-center gap-2 font-semibold text-2xl">
						<Icon className="h-5 w-5" icon="lucide:clock" />
						{t('wiki.recently_updated')}
					</h2>

					<div className="flex flex-col gap-4">
						{recentPages.map((page) => (
							<Card.Link
								className="max-w-200"
								href={`/wiki/${page.slug}`}
								key={page.slug}
							>
								<div className="flex items-center justify-between">
									<div className="flex flex-col gap-0 font-semibold">
										<p>{page.metadata.title}</p>
										{page.metadata.description && (
											<p className="text-sm text-text-accent">
												{page.metadata.description}
											</p>
										)}
									</div>
									<p className="font-semibold text-xs">
										{formatDate(
											page.metadata.updatedAt ||
												page.metadata.createdAt ||
												'',
											'date'
										)}
									</p>
								</div>
							</Card.Link>
						))}
					</div>
				</div>
			)}
		</div>
	)
}
