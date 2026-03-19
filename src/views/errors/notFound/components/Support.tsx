import Link from 'next/link'
import { Skeleton } from '@/components/ui/Skeleton'

type SupportTextProps = {
	path: string | null
}

export default function SupportText({ path }: SupportTextProps) {
	return (
		<p className="text-center font-bold text-xs uppercase tracking-widest dark:text-neutral-400">
			Если вы считаете, что URL введён верно
			<br /> то обратитесь в{' '}
			<Link
				className="relative text-neutral-900 duration-300 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-sky-400 after:transition-all hover:text-sky-600 hover:after:w-full dark:text-neutral-200 dark:hover:text-sky-400"
				href="https://t.me/oarer_yml"
				rel="noopener noreferrer"
				target="_blank"
			>
				тех. поддержку
			</Link>
			<br /> При обращении укажите URL <br />
			{path ? (
				<button
					className="cursor-pointer text-neutral-300 uppercase tracking-widest"
					onClick={() => navigator.clipboard.writeText(path)}
				>
					URL: {path}
				</button>
			) : (
				<span className="inline-flex w-full justify-center">
					<Skeleton className="h-4 w-34" />
				</span>
			)}
		</p>
	)
}
