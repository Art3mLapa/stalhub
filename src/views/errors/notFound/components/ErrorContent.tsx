import { Icon } from '@iconify/react'
import { useRouter } from 'next/navigation'
import { unbounded } from '@/app/fonts'
import { Button } from '@/components/ui/Button'

export default function ErrorContent() {
	const router = useRouter()

	return (
		<div className="flex max-w-md flex-col gap-2">
			<h1 className={`${unbounded.className} font-semibold text-4xl`}>
				Упсс...
			</h1>

			<p
				className={`${unbounded.className} font-semibold text-2xl dark:text-neutral-100/90`}
			>
				Страница не найдена
			</p>
			<Button
				className="gap-4"
				onClick={() => router.push('/')}
				variant={'outline'}
			>
				<Icon icon="lucide:home" />
				<p>На главную</p>
			</Button>
		</div>
	)
}
