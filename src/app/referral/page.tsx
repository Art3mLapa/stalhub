'use client'

import { Icon } from '@iconify/react'
import { Card } from '@/components/ui/Card'
import { CopyButton } from '@/components/ui/CopyButton'
import GradientText from '@/components/ui/GradientText'
import CLink from '@/components/ui/Link'
import { unbounded } from '../fonts'
import CharmModel from './model'

// ! TODO move to const
type Links = {
	url: string
	icon: string
	iconColor: string
}

const SOCIAL_LINKS: Links[] = [
	{
		url: 'https://www.youtube.com/c/NikitaShark',
		icon: 'lucide:youtube',
		iconColor: '#ff0000',
	},
	{
		url: 'https://www.twitch.tv/nsh4rk',
		icon: 'lucide:twitch',
		iconColor: '#9146ff',
	},
	{
		url: 'https://t.me/crazynshark',
		icon: 'mingcute:telegram-line',
		iconColor: '#1899cb',
	},
	{
		url: 'https://boosty.to/nsharkk',
		icon: 'simple-icons:boosty',
		iconColor: '#ff662c',
	},
]

export default function ReferralPage() {
	return (
		<section className="mx-auto flex max-w-6xl flex-col gap-12 px-4 pt-40 pb-20">
			<h1
				className={`${unbounded.className} bg-linear-to-r from-sky-600 to-sky-400 bg-clip-text text-center font-bold text-3xl text-transparent tracking-tight md:text-5xl dark:from-sky-400 dark:to-sky-200`}
			>
				Вводи промокод и <br />
				получай награды на старте
			</h1>

			<div className="mx-auto flex items-center gap-4">
				<GradientText
					animationSpeed={2}
					className={`${unbounded.className} text-3xl`}
					colors={['#94cceb', '#0081b9']}
					yoyo={false}
				>
					NSH4RKSC26
				</GradientText>
				<CopyButton text="Hello, World!" />
			</div>

			<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
				<div className="flex flex-col gap-3">
					<h2
						className={`${unbounded.className} font-bold text-sm uppercase tracking-widest`}
					>
						Награды за промокод
					</h2>
					<div className="grid grid-cols-3 grid-rows-3 gap-4">
						<Card.Root className="row-span-2 justify-between">
							<Card.Content>Пикча</Card.Content>
							<Card.Footer>Аврора</Card.Footer>
						</Card.Root>
						<Card.Root>
							<Card.Content>Пикча</Card.Content>
							<Card.Footer>ТТ</Card.Footer>
						</Card.Root>
						<Card.Root className="col-start-2 row-start-2">
							<Card.Content>Пикча</Card.Content>
							<Card.Footer>Охотничий нож (ахуеть)</Card.Footer>
						</Card.Root>
						<Card.Root className="col-start-3 row-start-1">
							<Card.Content>Пикча</Card.Content>
							<Card.Footer>Аврора</Card.Footer>
						</Card.Root>
						<Card.Root className="col-start-3">
							<Card.Content>Пикча</Card.Content>
							<Card.Footer>Аврора</Card.Footer>
						</Card.Root>
						<Card.Root className="row-start-3">
							<Card.Content>Пикча</Card.Content>
							<Card.Footer>Аврора</Card.Footer>
						</Card.Root>
						<Card.Root className="row-start-3">
							<Card.Content>Пикча</Card.Content>
							<Card.Footer>Аврора</Card.Footer>
						</Card.Root>
						<Card.Root className="row-start-3">
							<Card.Content>Пикча</Card.Content>
							<Card.Footer>Аврора</Card.Footer>
						</Card.Root>
					</div>
				</div>

				<div className="flex flex-col gap-3">
					<h2
						className={`${unbounded.className} font-bold text-muted-foreground text-sm uppercase tracking-widest`}
					>
						Уникальный брелок
					</h2>
					<div className='flex h-[50vh] w-full flex-1 justify-center sm:h-[60vh] lg:block xl:h-[80vh]"'>
						<CharmModel />
					</div>
				</div>
			</div>

			<div className="flex flex-col items-center gap-4">
				<p
					className={`${unbounded.className} font-bold text-md uppercase tracking-widest`}
				>
					Соц сети
				</p>
				<div className="flex items-center gap-3">
					{SOCIAL_LINKS.map((link) => (
						<CLink
							className="p-2"
							externalIcon={false}
							href={link.url}
							key={link.url}
						>
							<Icon
								className="text-2xl transition-colors hover:text-(--icon-color)"
								icon={link.icon}
								style={
									{
										'--icon-color': link.iconColor,
									} as React.CSSProperties
								}
							/>
						</CLink>
					))}
				</div>
			</div>
		</section>
	)
}
