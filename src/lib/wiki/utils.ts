import fs from 'fs'
import matter from 'gray-matter'
import path from 'path'
import { cache } from 'react'
import type {
	TOCItem,
	WikiAuthor,
	WikiMetadata,
	WikiPage,
	WikiSection,
} from '@/types/wiki.type'

const WIKI_DIR = path.join(process.cwd(), 'wiki')

export const getWikiSections = cache(function getWikiSections(): WikiSection[] {
	if (!fs.existsSync(WIKI_DIR)) {
		return []
	}

	const sections: WikiSection[] = []
	const entries = fs.readdirSync(WIKI_DIR, { withFileTypes: true })

	for (const entry of entries) {
		if (entry.isDirectory()) {
			const sectionPath = path.join(WIKI_DIR, entry.name)
			const indexPath = path.join(sectionPath, '_index.mdx')

			let sectionTitle = entry.name
				.replace(/-/g, ' ')
				.replace(/^\d+-/, '')
				.replace(/\b\w/g, (c) => c.toUpperCase())
			let order = 0
			let description = ''

			if (fs.existsSync(indexPath)) {
				const content = fs.readFileSync(indexPath, 'utf-8')
				const { data } = matter(content)
				if (data.title) sectionTitle = data.title
				if (data.order !== undefined) order = data.order
				if (data.description) description = data.description
			}

			const pages = getWikiPagesFromDir(sectionPath, entry.name)

			sections.push({
				title: sectionTitle,
				slug: entry.name,
				pages,
				order,
				description,
			})
		}
	}

	const rootPages = getWikiPagesFromDir(WIKI_DIR, '')
	if (rootPages.length > 0) {
		sections.unshift({
			title: 'Overview',
			slug: '',
			pages: rootPages,
			order: -1,
		})
	}

	return sections.sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
})

function getWikiPagesFromDir(dir: string, sectionSlug: string): WikiPage[] {
	const pages: WikiPage[] = []
	const files = fs.readdirSync(dir)

	for (const file of files) {
		if (file.endsWith('.mdx') && !file.startsWith('_')) {
			const filePath = path.join(dir, file)
			const stat = fs.statSync(filePath)

			if (stat.isFile()) {
				const content = fs.readFileSync(filePath, 'utf-8')
				const { data, content: mdxContent } = matter(content)
				const slug = file.replace('.mdx', '')
				const fullSlug = sectionSlug ? `${sectionSlug}/${slug}` : slug

				pages.push({
					slug: fullSlug,
					metadata: data as WikiMetadata,
					content: mdxContent,
				})
			}
		}
	}

	return pages.sort(
		(a, b) => (a.metadata.order ?? 0) - (b.metadata.order ?? 0)
	)
}

export const getWikiPage = cache(function getWikiPage(
	slug: string
): WikiPage | null {
	const slugParts = slug.split('/')
	let filePath: string

	if (slugParts.length === 1) {
		const categoryPath = path.join(WIKI_DIR, slug, '_index.mdx')
		if (fs.existsSync(categoryPath)) {
			const content = fs.readFileSync(categoryPath, 'utf-8')
			const { data, content: mdxContent } = matter(content)
			return {
				slug,
				metadata: data as WikiMetadata,
				content: mdxContent,
				isCategory: true,
			}
		}
		filePath = path.join(WIKI_DIR, `${slug}.mdx`)
	} else {
		filePath = path.join(
			WIKI_DIR,
			...slugParts.slice(0, -1),
			`${slugParts.at(-1)}.mdx`
		)
	}

	if (!fs.existsSync(filePath)) {
		return null
	}

	const content = fs.readFileSync(filePath, 'utf-8')
	const { data, content: mdxContent } = matter(content)

	return {
		slug,
		metadata: data as WikiMetadata,
		content: mdxContent,
	}
})

export function getSectionBySlug(slug: string): WikiSection | null {
	const sections = getWikiSections()
	return sections.find((s: WikiSection) => s.slug === slug) || null
}

export const extractTOC = cache(function extractTOC(
	content: string
): TOCItem[] {
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
})

export function getAllWikiSlugs(): string[] {
	const sections = getWikiSections()
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
