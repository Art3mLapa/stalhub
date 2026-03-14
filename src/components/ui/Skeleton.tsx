import { cn } from '@/lib/cn'

function Skeleton({ className, ...props }: React.ComponentProps<'div'>) {
	return (
		<div
			className={cn('animate-pulse rounded-xl bg-background', className)}
			{...props}
		/>
	)
}

export { Skeleton }
