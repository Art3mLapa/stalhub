import Image from 'next/image'
import { useTranslation } from 'react-i18next'
import type { WikiAuthor } from '@/types/wiki.type'
import { Card } from '../ui/Card'
import { CLink } from '../ui/Link'

export function Authors({ authors }: { authors: WikiAuthor[] }) {
	const { t } = useTranslation()
	if (!authors?.length) return null

	return (
		<Card.Root className="gap-0 px-4 py-2">
			<Card.Header>
				<Card.Title className="text-md">
					{t('wiki.page.authors')}
				</Card.Title>
			</Card.Header>
			<Card.Content className="flex flex-col">
				{authors.map((author) => {
					const hasLink = author.github || author.profileUrl
					const href = author.github
						? `https://github.com/${author.github}`
						: author.profileUrl

					const content = (
						<>
							{author.avatarUrl && (
								<Image
									alt={author.name}
									className="rounded-full"
									height={28}
									src={author.avatarUrl}
									width={28}
								/>
							)}
							<p>{author.name}</p>
						</>
					)

					return hasLink && href ? (
						<CLink
							className="flex items-center justify-start gap-2 px-0 py-1 font-semibold text-sm"
							href={href}
							key={author.github || author.name}
							variant={'none'}
						>
							{content}
						</CLink>
					) : (
						<div
							className="flex items-center gap-2"
							key={author.github || author.name}
						>
							{content}
						</div>
					)
				})}
			</Card.Content>
		</Card.Root>
	)
}
