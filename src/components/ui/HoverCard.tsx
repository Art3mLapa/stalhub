'use client'

import { AnimatePresence, type HTMLMotionProps, motion } from 'motion/react'
import type React from 'react'
import {
	createContext,
	forwardRef,
	useCallback,
	useContext,
	useEffect,
	useId,
	useRef,
	useState,
} from 'react'
import { cn } from '@/lib/cn'

type HoverCardContextValue = {
	open: boolean
	setOpen: (v: boolean) => void
}

const HoverCardContext = createContext<HoverCardContextValue | null>(null)

function useHoverCard() {
	const ctx = useContext(HoverCardContext)
	if (!ctx) {
		throw new Error(
			'HoverCard compound components must be used within <HoverCard.Root>'
		)
	}
	return ctx
}

type RootProps = React.HTMLAttributes<HTMLDivElement> & {
	defaultOpen?: boolean
	open?: boolean
	onOpenChange?: (open: boolean) => void
	openDelay?: number
	closeDelay?: number
}

export const HoverCardRoot = forwardRef<HTMLDivElement, RootProps>(
	function HoverCardRoot(
		{
			defaultOpen = false,
			open: controlledOpen,
			onOpenChange,
			openDelay = 200,
			closeDelay = 200,
			className,
			children,
			...props
		},
		ref
	) {
		const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen)
		const isControlled = controlledOpen !== undefined
		const open = isControlled ? controlledOpen : uncontrolledOpen

		const setOpen = useCallback(
			(v: boolean) => {
				if (!isControlled) setUncontrolledOpen(v)
				onOpenChange?.(v)
			},
			[isControlled, onOpenChange]
		)

		const openTimer = useRef<number | null>(null)
		const closeTimer = useRef<number | null>(null)

		const clearTimers = useCallback(() => {
			if (openTimer.current) clearTimeout(openTimer.current)
			if (closeTimer.current) clearTimeout(closeTimer.current)
		}, [])

		const handleEnter = () => {
			clearTimers()
			openTimer.current = window.setTimeout(() => {
				setOpen(true)
			}, openDelay)
		}

		const handleLeave = () => {
			clearTimers()
			closeTimer.current = window.setTimeout(() => {
				setOpen(false)
			}, closeDelay)
		}

		useEffect(() => {
			return () => clearTimers()
		}, [clearTimers])

		return (
			<HoverCardContext.Provider value={{ open, setOpen }}>
				<div
					className={cn('relative inline-block', className)}
					onMouseEnter={handleEnter}
					onMouseLeave={handleLeave}
					ref={ref}
					{...props}
				>
					{children}
				</div>
			</HoverCardContext.Provider>
		)
	}
)

type TriggerProps = React.HTMLAttributes<HTMLDivElement>

export const HoverCardTrigger = forwardRef<HTMLDivElement, TriggerProps>(
	function HoverCardTrigger({ className, ...props }, ref) {
		return (
			<div
				className={cn('inline-block', className)}
				data-slot="hover-card-trigger"
				ref={ref}
				{...props}
			/>
		)
	}
)

type Side = 'top' | 'bottom' | 'left' | 'right'
type Align = 'start' | 'center' | 'end'

type ContentProps = Omit<HTMLMotionProps<'div'>, 'ref'> & {
	side?: Side
	align?: Align
	sideOffset?: number
}

export const HoverCardContent = forwardRef<HTMLDivElement, ContentProps>(
	function HoverCardContent(
		{
			className,
			side = 'bottom',
			align = 'center',
			sideOffset = 8,
			children,
			...props
		},
		ref
	) {
		const { open } = useHoverCard()
		const id = useId()

		const axis = side === 'top' || side === 'bottom' ? 'y' : 'x'
		const sign = side === 'top' || side === 'left' ? 1 : -1

		const sideStyle: React.CSSProperties =
			side === 'bottom'
				? { top: `calc(100% + ${sideOffset}px)` }
				: side === 'top'
					? { bottom: `calc(100% + ${sideOffset}px)` }
					: side === 'right'
						? { left: `calc(100% + ${sideOffset}px)` }
						: { right: `calc(100% + ${sideOffset}px)` }

		const alignClass =
			side === 'top' || side === 'bottom'
				? align === 'start'
					? 'left-0'
					: align === 'end'
						? 'right-0'
						: 'left-1/2 -translate-x-1/2'
				: align === 'start'
					? 'top-0'
					: align === 'end'
						? 'bottom-0'
						: 'top-1/2 -translate-y-1/2'

		return (
			<AnimatePresence>
				{open && (
					<motion.div
						animate={{ opacity: 1, scale: 1, [axis]: 0 }}
						className={cn(
							'absolute z-50',
							alignClass,
							'w-64 rounded-lg border-2 border-border/60 bg-background p-4 shadow-md',
							className
						)}
						exit={{
							opacity: 0,
							scale: 0.95,
							[axis]: 4 * sign,
							pointerEvents: 'none',
						}}
						id={`hover-card-content-${id}`}
						initial={{ opacity: 0, scale: 0.95, [axis]: 4 * sign }}
						ref={ref}
						role="dialog"
						style={sideStyle}
						transition={{
							type: 'spring',
							stiffness: 500,
							damping: 30,
							mass: 0.8,
						}}
						{...props}
					>
						{children}
					</motion.div>
				)}
			</AnimatePresence>
		)
	}
)

export const HoverCard = {
	Root: HoverCardRoot,
	Trigger: HoverCardTrigger,
	Content: HoverCardContent,
}
