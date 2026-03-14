export type ParsedItem = {
	statRanges: Record<string, { v0: number; v100: number; color: string }>
	baseStats: Record<string, number>
	addStats: Record<string, { v0: number; v100: number; color: string }>
	displayNames: Record<string, string>
	localizedToKey: Record<string, string>
}

export type StatBreakdown = {
	key: string
	V: number
	P: number
	R: number
	X_before_potential: number
	potentialK: number
	X_after_potential: number
	addFromSelected: number
	final: number
	color?: string
	addColor?: string
}
