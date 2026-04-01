import fs from 'fs/promises'
import matter from 'gray-matter'
import path from 'path'
import type {
	TOCItem,
	WikiAuthor,
	WikiMetadata,
	WikiPage,
	WikiSection,
} from '@/types/wiki.type'

const WIKI_DIR = path.join(process.cwd(), 'wiki')

type CachedSection = WikiSection & { _cachedAt: number }
type CachedPage = {
	metadata: WikiMetadata
	content?: string
	_cachedAt: number
}

const sectionCache = new Map<string, CachedSection>()
const pageCache = new Map<string, CachedPage>()
const CACHE_TTL = 60_000

function isCacheValid(cachedAt: number): boolean {
	return Date.now() - cachedAt < CACHE_TTL
}

async function readPageMeta(
	filePath: string,
	slug: string
): Promise<WikiPage | null> {
	const cached = pageCache.get(slug)
	if (cached && isCacheValid(cached._cachedAt)) {
		return { slug, metadata: cached.metadata, content: cached.content }
	}

	try {
		const content = await fs.readFile(filePath, 'utf-8')
		const { data } = matter(content)
		const page: WikiPage = { slug, metadata: data as WikiMetadata }

		pageCache.set(slug, {
			metadata: data as WikiMetadata,
			content: undefined,
			_cachedAt: Date.now(),
		})

		return page
	} catch {
		return null
	}
}

async function readFullPage(
	filePath: string,
	slug: string
): Promise<WikiPage | null> {
	const cached = pageCache.get(slug)

	if (
		cached &&
		cached.content !== undefined &&
		isCacheValid(cached._cachedAt)
	) {
		return { slug, metadata: cached.metadata, content: cached.content }
	}

	try {
		const content = await fs.readFile(filePath, 'utf-8')
		const { data, content: mdxContent } = matter(content)

		pageCache.set(slug, {
			metadata: data as WikiMetadata,
			content: mdxContent,
			_cachedAt: Date.now(),
		})

		return { slug, metadata: data as WikiMetadata, content: mdxContent }
	} catch {
		return null
	}
}

async function getWikiPagesFromDir(
	dir: string,
	sectionSlug: string
): Promise<WikiPage[]> {
	const pages: WikiPage[] = []

	try {
		const files = await fs.readdir(dir)

		await Promise.all(
			files.map(async (file) => {
				if (file.endsWith('.mdx') && !file.startsWith('_')) {
					const filePath = path.join(dir, file)
					const slug = file.replace('.mdx', '')
					const fullSlug = sectionSlug
						? `${sectionSlug}/${slug}`
						: slug

					const page = await readPageMeta(filePath, fullSlug)
					if (page) pages.push(page)
				}
			})
		)
	} catch {
		return []
	}

	return pages.sort(
		(a, b) => (a.metadata.order ?? 0) - (b.metadata.order ?? 0)
	)
}

export async function getWikiSections(): Promise<WikiSection[]> {
	const cached = sectionCache.get('all')
	if (cached && isCacheValid(cached._cachedAt)) {
		return [cached]
	}

	const sections: WikiSection[] = []

	try {
		const entries = await fs.readdir(WIKI_DIR, { withFileTypes: true })

		const sectionResults = await Promise.all(
			entries
				.filter((entry) => entry.isDirectory())
				.map(async (entry) => {
					const sectionPath = path.join(WIKI_DIR, entry.name)
					const indexPath = path.join(sectionPath, '_index.mdx')

					let sectionTitle = entry.name
						.replace(/-/g, ' ')
						.replace(/^\d+-/, '')
						.replace(/\b\w/g, (c) => c.toUpperCase())
					let order = 0
					let description = ''

					try {
						const content = await fs.readFile(indexPath, 'utf-8')
						const { data } = matter(content)
						if (data.title) sectionTitle = data.title
						if (data.order !== undefined) order = data.order
						if (data.description) description = data.description
					} catch {
						// no _index.mdx
					}

					const pages = await getWikiPagesFromDir(
						sectionPath,
						entry.name
					)

					return {
						title: sectionTitle,
						slug: entry.name,
						pages,
						order,
						description,
					} as WikiSection
				})
		)

		sections.push(...sectionResults)
	} catch {
		return []
	}

	const rootPages = await getWikiPagesFromDir(WIKI_DIR, '')
	if (rootPages.length > 0) {
		sections.unshift({
			title: 'Overview',
			slug: '',
			pages: rootPages,
			order: -1,
		})
	}

	sections.sort((a, b) => (a.order ?? 0) - (b.order ?? 0))

	sectionCache.set('all', {
		...sections[0],
		_cachedAt: Date.now(),
	})

	return sections
}

export async function getWikiPage(slug: string): Promise<WikiPage | null> {
	if (slug.includes('/')) {
		const slugParts = slug.split('/')
		const filePath = path.join(
			WIKI_DIR,
			...slugParts.slice(0, -1),
			`${slugParts.at(-1)}.mdx`
		)
		return readFullPage(filePath, slug)
	}

	const categoryPath = path.join(WIKI_DIR, slug, '_index.mdx')
	const hasCategory = await fs
		.access(categoryPath)
		.then(() => true)
		.catch(() => false)

	if (hasCategory) {
		const page = await readFullPage(categoryPath, slug)
		if (page) return { ...page, isCategory: true }
	}

	const filePath = path.join(WIKI_DIR, `${slug}.mdx`)
	return readFullPage(filePath, slug)
}

export async function getSectionBySlug(
	slug: string
): Promise<WikiSection | null> {
	const sections = await getWikiSections()
	return sections.find((s) => s.slug === slug) || null
}

export function extractTOC(content: string): TOCItem[] {
	const headingRegex = /^(#{2,4})\s+(.+)$/gm
	const items: TOCItem[] = []
	let match

	while ((match = headingRegex.exec(content)) !== null) {
		const level = match[1].length
		const title = match[2].trim()
		const id = title
			.toLowerCase()
			.normalize('NFD')
			.replace(/[\p{M}]/gu, '')
			.replace(/[^\p{L}\p{N}\s-]/gu, '')
			.replace(/\s+/g, '-')

		items.push({ id, title, level })
	}

	return items
}

export async function getAllWikiSlugs(): Promise<string[]> {
	const sections = await getWikiSections()
	const slugs: string[] = []

	for (const section of sections) {
		if (section.slug) {
			slugs.push(section.slug)
		}

		for (const page of section.pages) {
			slugs.push(page.slug)
		}
	}

	return slugs
}

type RawWikiAuthor = {
	github?: string
	name?: string
	avatarUrl?: string
	profileUrl?: string
}

export async function resolveWikiAuthors(
	input?: unknown
): Promise<WikiAuthor[]> {
	if (!input) return []

	let authors: RawWikiAuthor[] = []

	if (Array.isArray(input)) {
		authors = input.map((a) =>
			typeof a === 'string' ? { github: a } : (a as RawWikiAuthor)
		)
	} else if (typeof input === 'string') {
		authors = [{ github: input }]
	} else if (typeof input === 'object' && input !== null) {
		authors = [input as RawWikiAuthor]
	}

	return Promise.all(
		authors.map(async (author) => {
			if (author.github) {
				const res = await fetch(
					`https://api.github.com/users/${author.github}`,
					{
						headers: {
							Accept: 'application/vnd.github+json',
						},
						next: { revalidate: 86400 },
					}
				)

				if (res.ok) {
					const user = await res.json()
					return {
						github: author.github,
						name:
							author.name ??
							user.name ??
							user.login ??
							author.github,
						avatarUrl: author.avatarUrl ?? user.avatar_url,
						profileUrl: author.profileUrl ?? user.html_url,
					}
				}
			}

			return {
				github: author.github,
				name: author.name ?? author.github ?? 'Unknown',
				avatarUrl: author.avatarUrl,
				profileUrl: author.profileUrl,
			}
		})
	)
}
