import Link from 'next/link'
import { Skeleton } from '@/components/ui/Skeleton'

type SupportTextProps = {
	errorId: string | null
}

export default function SupportText({ errorId }: SupportTextProps) {
	return (
		<p className="text-center font-bold text-xs uppercase tracking-widest dark:text-neutral-400">
			Если проблема остаётся, обратитесь в{' '}
			<Link
				className="relative text-neutral-900 duration-300 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-sky-400 after:transition-all hover:text-sky-600 hover:after:w-full dark:text-neutral-200 dark:hover:text-sky-400"
				href="https://t.me/oarer_yml"
				rel="noopener noreferrer"
				target="_blank"
			>
				тех. поддержку
			</Link>
			<br /> При обращении укажите error id <br />
			{errorId ? (
				<button
					className="cursor-pointer uppercase tracking-widest"
					onClick={() => navigator.clipboard.writeText(errorId)}
				>
					Error id: {errorId}
				</button>
			) : (
				<span className="inline-flex w-full justify-center">
					<Skeleton className="h-4 w-34" />
				</span>
			)}
		</p>
	)
}
