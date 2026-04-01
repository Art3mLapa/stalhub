import { WikiSidebar } from '@/components/wiki/sidebar'
import { getWikiSections } from '@/lib/wiki/utils'

//! TODO update metadata
export const metadata = {
	title: 'Википедия · StalHub',
	description: 'Documentation and knowledge base',
}

export default async function WikiLayout({
	children,
}: {
	children: React.ReactNode
}) {
	const sections = await getWikiSections()

	return (
		<div className="flex min-h-screen pt-30">
			<WikiSidebar sections={sections} />
			<main className="flex-1 overflow-auto">{children}</main>
		</div>
	)
}
