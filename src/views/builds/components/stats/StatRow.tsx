'use client'

import { roundNumber } from '../hooks/useBuildStats'

interface StatRowProps {
	name: string
	value: number
}

export function StatRow({ name, value }: StatRowProps) {
	const isAccumulation = name.includes('accumulation')
	const valueColor = isAccumulation
		? value <= 0
			? '#53C353'
			: '#C15252'
		: value >= 0
			? '#53C353'
			: '#C15252'

	return (
		<p className="flex justify-between">
			<span>{name}</span>
			<span className="font-medium" style={{ color: valueColor }}>
				{value >= 0 ? '+' : ''}
				{roundNumber(value)}
			</span>
		</p>
	)
}
