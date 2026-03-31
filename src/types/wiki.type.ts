export type WikiAuthor = {
	github?: string
	name: string
	avatarUrl?: string
	profileUrl?: string
}

export interface WikiMetadata {
	title: string
	description?: string
	authors?: WikiAuthor[]
	createdAt?: string
	updatedAt?: string
	tags?: string[]
	order?: number
	banner?: string
}

export interface WikiPage {
	slug: string
	metadata: WikiMetadata
	content: string
	isCategory?: boolean
}

export interface WikiSection {
	title: string
	slug: string
	pages: WikiPage[]
	order?: number
	description?: string
}

export interface TOCItem {
	id: string
	title: string
	level: number
}
