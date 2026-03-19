import { Icon } from '@iconify/react'
import { unbounded } from '@/app/fonts'
import { Button } from '@/components/ui/Button'

type ErrorContentProps = {
	reset: () => void
}

export default function ErrorContent({ reset }: ErrorContentProps) {
	return (
		<div className="flex max-w-md flex-col gap-2">
			<h1 className={`${unbounded.className} font-semibold text-4xl`}>
				Упсс...
			</h1>
			<p
				className={`${unbounded.className} font-semibold text-2xl dark:text-neutral-100/90`}
			>
				Произошла клиентская ошибка
			</p>
			<Button className="gap-2" onClick={reset} variant="outline">
				<Icon icon="lucide:rotate-ccw" />
				<span>Попробовать снова</span>
			</Button>
		</div>
	)
}
