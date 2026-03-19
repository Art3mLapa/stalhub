import { Icon } from '@iconify/react'
import type { InputHTMLAttributes } from 'react'
import { useId, useRef, useState } from 'react'
import { twMerge } from 'tailwind-merge'

type Props = InputHTMLAttributes<HTMLInputElement> & {
	label?: string
}

export default function Input({
	className,
	type = 'text',
	value,
	onChange,
	step,
	min,
	max,
	id: propId,
	placeholder: propPlaceholder,
	label,
	...rest
}: Props) {
	const [showPassword, setShowPassword] = useState(false)
	const inputRef = useRef<HTMLInputElement | null>(null)
	const reactId = useId()
	const id = propId ?? `floating_${reactId}`

	const togglePassword = () => setShowPassword((s) => !s)

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (type !== 'number') {
			onChange?.(e)
			return
		}

		const val = e.target.value

		if (val === '') {
			onChange?.(e)
			return
		}

		let num = Number(val)
		if (Number.isNaN(num)) return

		if (min !== undefined) num = Math.max(num, Number(min))
		if (max !== undefined) num = Math.min(num, Number(max))

		const syntheticEvent = {
			...e,
			target: { ...e.target, value: String(num) },
		} as React.ChangeEvent<HTMLInputElement>

		onChange?.(syntheticEvent)
	}

	const handleStep = (direction: 'up' | 'down') => {
		if (!inputRef.current) return
		if (direction === 'up') inputRef.current.stepUp()
		else inputRef.current.stepDown()

		onChange?.({
			target: inputRef.current,
		} as React.ChangeEvent<HTMLInputElement>)
	}

	const computedPlaceholder = propPlaceholder ?? (label ? ' ' : undefined)

	return (
		<div className="relative">
			<input
				{...rest}
				className={twMerge(
					`peer w-full rounded-lg bg-background px-2 py-2! font-semibold text-neutral-900 outline-none ring-2 ring-border-secondary transition-all duration-500 ease-in-out placeholder:text-neutral-500 disabled:cursor-not-allowed disabled:opacity-50 dark:text-neutral-100 dark:placeholder:text-neutral-400`,
					className
				)}
				id={id}
				max={max}
				min={min}
				onChange={handleChange}
				placeholder={computedPlaceholder}
				ref={inputRef}
				step={step}
				type={type === 'password' && showPassword ? 'text' : type}
				value={value}
			/>

			{label && (
				<label
					className="pointer-events-none absolute start-1 top-2 z-10 origin-left -translate-y-2 scale-75 transform px-2 font-semibold text-neutral-400 text-sm duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-placeholder-shown:text-neutral-400 peer-focus:top-2 peer-focus:-translate-y-2.5 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-neutral-400"
					htmlFor={id}
				>
					{label}
				</label>
			)}

			{type === 'number' && (
				<div className="absolute top-1/2 right-2 flex -translate-y-1/2 flex-col">
					<button
						aria-label="increase"
						className="flex cursor-pointer items-center justify-center text-neutral-500 duration-500 hover:text-black dark:text-neutral-400 dark:hover:text-white"
						onClick={() => handleStep('up')}
						type="button"
					>
						<Icon className="text-md" icon="lucide:chevron-up" />
					</button>
					<button
						aria-label="decrease"
						className="flex cursor-pointer items-center justify-center text-neutral-500 duration-500 hover:text-black dark:text-neutral-400 dark:hover:text-white"
						onClick={() => handleStep('down')}
						type="button"
					>
						<Icon className="text-md" icon="lucide:chevron-down" />
					</button>
				</div>
			)}

			{type === 'password' && (
				<button
					className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-neutral-500 hover:text-black dark:text-neutral-300 dark:hover:text-white"
					onClick={togglePassword}
					type="button"
				>
					<div className="relative h-5 w-5">
						<Icon
							className={`absolute inset-0 text-xl transition-opacity duration-300 ease-in-out ${
								showPassword ? 'opacity-0' : 'opacity-100'
							}`}
							icon="lucide:eye"
						/>
						<Icon
							className={`absolute inset-0 text-xl transition-opacity duration-300 ease-in-out ${
								showPassword ? 'opacity-100' : 'opacity-0'
							}`}
							icon="lucide:eye-off"
						/>
					</div>
				</button>
			)}
		</div>
	)
}
