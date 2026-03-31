import { Icon } from '@iconify/react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { lazy } from 'react'
import remarkGfm from 'remark-gfm'
import { useMDXComponents } from '@/components/wiki/mdx-components'
import { formatDate } from '@/lib/date'
import {
	extractTOC,
	getAllWikiSlugs,
	getSectionBySlug,
	getWikiPage,
	resolveWikiAuthors,
} from '@/lib/wiki/utils'

const LazyTOC = lazy(() =>
	import('@/components/wiki/toc').then((m) => ({ default: m.TOC }))
)

interface PageProps {
	params: Promise<{ slug: string[] }>
}

export async function generateStaticParams() {
	const slugs = getAllWikiSlugs()
	return slugs.map((slug) => ({
		slug: slug.split('/'),
	}))
}

export async function generateMetadata({
	params,
}: PageProps): Promise<Metadata> {
	const { slug } = await params
	const slugPath = slug.join('/')
	const page = getWikiPage(slugPath)

	if (!page) {
		return { title: 'Not Found' }
	}

	return {
		title: `${page.metadata.title} · StalHub`,
		description: page.metadata.description,
		authors: page.metadata.authors?.map((a) => ({
			name: a.name,
			url: `https://github.com/${a}`,
		})),
		openGraph: {
			title: `${page.metadata.title} · StalHub`,
			description: page.metadata.description,
			type: 'article',
			publishedTime: page.metadata.createdAt,
			modifiedTime: page.metadata.updatedAt,
			authors: page.metadata.authors
				?.map((a) => a.profileUrl)
				.filter((url): url is string => !!url),
			tags: page.metadata.tags,
			images: [
				{
					url: page.metadata.banner ?? '',
					alt: page.metadata.title,
				},
			],
		},
	}
}

export default async function WikiPageContent({ params }: PageProps) {
	const { slug } = await params
	const slugPath = slug.join('/')
	const page = getWikiPage(slugPath)

	if (!page) {
		notFound()
	}

	const authors = await resolveWikiAuthors(page.metadata.authors ?? [])

	const components = useMDXComponents()

	if (page.isCategory) {
		const section = getSectionBySlug(slugPath)

		return (
			<div className="flex max-w-5xl flex-col gap-4 p-8">
				<header className="flex flex-col gap-2 border-border/70 border-b pb-2">
					<h1 className="font-bold text-4xl tracking-tight">
						{page.metadata.title}
					</h1>

					{page.metadata.description && (
						<p className="font-semibold text-foreground text-lg">
							{page.metadata.description}
						</p>
					)}
				</header>

				{page.content.trim() && (
					<div className="prose prose-neutral dark:prose-invert mb-8 max-w-none">
						<MDXRemote
							components={components}
							options={{
								mdxOptions: {
									remarkPlugins: [remarkGfm],
								},
							}}
							source={page.content}
						/>
					</div>
				)}

				{section && section.pages.length > 0 && (
					<div className="flex flex-col gap-4">
						{/* TODO i18n */}
						<h1 className="font-semibold text-xl">
							Страницы в этой секции
						</h1>
						<div className="grid gap-3">
							{section.pages.map((p) => (
								<Link
									className="group flex items-center gap-4 rounded-lg border-2 border-border/50 bg-background p-4 transition-colors hover:bg-accent/70"
									href={`/wiki/${p.slug}`}
									key={p.slug}
								>
									<Icon
										className="h-5 w-5 text-muted-foreground"
										icon="lucide:file-text"
									/>
									<div className="min-w-0 flex-1">
										<h1 className="font-bold transition-colors group-hover:text-primary">
											{p.metadata.title ||
												p.slug.split('/').pop()}
										</h1>
										{p.metadata.description && (
											<p className="font-semibold text-foreground text-sm">
												{p.metadata.description}
											</p>
										)}
									</div>
									<Icon
										className="text-lg transition-all group-hover:translate-x-1 group-hover:text-border"
										icon="lucide:arrow-right"
									/>
								</Link>
							))}
						</div>
					</div>
				)}
			</div>
		)
	}

	const tocItems = extractTOC(page.content)

	return (
		<div className="grid grid-cols-1 gap-8 lg:grid-cols-[75%_25%]">
			<article className="max-w-4xl flex-1 p-8">
				<header className="mb-8 flex flex-col gap-4 border-border-secondary border-b pb-6">
					<h1 className="font-bold text-4xl">
						{page.metadata.title}
					</h1>

					{page.metadata.description && (
						<p className="font-semibold text-foreground text-sm">
							{page.metadata.description}
						</p>
					)}

					<div className="flex flex-wrap items-center gap-6 font-semibold text-sm">
						{page.metadata.createdAt && (
							<div className="flex items-center gap-2">
								<Icon
									className="text-lg"
									icon="lucide:calendar"
								/>
								<span>
									{formatDate(
										page.metadata.createdAt,
										'date'
									)}
								</span>
							</div>
						)}

						{/* TODO мб выпиливать буду */}
						{page.metadata.updatedAt &&
							page.metadata.updatedAt !==
								page.metadata.createdAt && (
								<div className="flex items-center gap-1">
									<span>Обновлено:</span>
									<span>
										{formatDate(
											page.metadata.updatedAt,
											'date'
										)}
									</span>
								</div>
							)}
					</div>

					{/* {page.metadata.tags && page.metadata.tags.length > 0 && (
						<div className="flex items-center gap-2">
							<Icon className="text-lg" icon="lucide:icon" />
							<div className="flex flex-wrap gap-2">
								{page.metadata.tags.map((tag) => (
									<span
										className="rounded-full bg-background px-2 py-0.5 font-semibold text-text-accent text-xs"
										key={tag}
									>
										{tag}
									</span>
								))}
							</div>
						</div>
					)} */}
				</header>

				<div className="prose prose-neutral dark:prose-invert max-w-none contain-content">
					<MDXRemote
						components={components}
						options={{
							mdxOptions: {
								remarkPlugins: [remarkGfm],
							},
						}}
						source={page.content}
					/>
				</div>
			</article>

			{tocItems.length > 0 && (
				<aside className="hidden w-64 xl:block">
					<div className="sticky top-0 p-6">
						<LazyTOC
							authors={authors}
							items={tocItems}
							slug={page.slug}
						/>
					</div>
				</aside>
			)}
		</div>
	)
}
