'use client'

import { unbounded } from '@/app/fonts'

export default function InDevNav() {
	return (
		<header
			className={`fixed top-0 isolate z-99 w-full items-center bg-linear-to-r from-amber-300 to-amber-500 text-neutral-700 backdrop-blur-sm transition-colors duration-500 dark:text-neutral-950`}
		>
			<nav className="mx-auto xl:max-w-360">
				<h1 className={`${unbounded.className} text-center text-2xl`}>
					Сайт находится в разработке и не отображает итоговый продукт
				</h1>
			</nav>
		</header>
	)
}
