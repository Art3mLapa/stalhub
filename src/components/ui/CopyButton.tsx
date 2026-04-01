'use client'

import { Icon } from '@iconify/react'
import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { cn } from '@/lib/cn'

interface CopyButtonProps {
	text: string
	className?: string
}

export function CopyButton({ text, className }: CopyButtonProps) {
	const [copied, setCopied] = useState(false)

	const handleCopy = async () => {
		if (copied) return
		await navigator.clipboard.writeText(text)
		setCopied(true)
		setTimeout(() => setCopied(false), 2000)
	}

	return (
		<motion.button
			aria-label={copied ? 'Copied!' : 'Copy to clipboard'}
			className={cn(
				'relative inline-flex cursor-pointer items-center gap-2 rounded-lg bg-background p-4 shadow-sm ring-2 ring-border/60 transition-colors hover:bg-background focus-visible:outline-none',
				copied &&
					'bg-green-500/10 text-green-600 ring-green-500/40 hover:bg-green-500/15 hover:text-green-600 dark:text-green-400',
				className
			)}
			onClick={handleCopy}
			whileTap={{ scale: 0.95 }}
		>
			<AnimatePresence initial={false} mode="wait">
				{copied ? (
					<motion.span
						animate={{ opacity: 1, scale: 1, rotate: 0 }}
						className="absolute inset-0 flex items-center justify-center"
						exit={{ opacity: 0, scale: 0.5, rotate: 10 }}
						initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
						key="check"
						transition={{ duration: 0.15, ease: 'easeOut' }}
					>
						<Icon
							className="size-4 stroke-[2.5]"
							icon="lucide:check"
						/>
					</motion.span>
				) : (
					<motion.span
						animate={{ opacity: 1, scale: 1 }}
						className="absolute inset-0 flex items-center justify-center"
						exit={{ opacity: 0, scale: 0.5 }}
						initial={{ opacity: 0, scale: 0.5 }}
						key="copy"
						transition={{ duration: 0.15, ease: 'easeOut' }}
					>
						<Icon className="size-4" icon="lucide:copy" />
					</motion.span>
				)}
			</AnimatePresence>
		</motion.button>
	)
}
