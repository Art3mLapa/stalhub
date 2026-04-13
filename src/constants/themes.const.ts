export interface Theme {
	name: string
	title: string
	iconName: string
}

export const themes: Theme[] = [
	{ name: 'system', title: 'Системная', iconName: 'lucide:laptop-minimal' },
	{ name: 'dark', title: 'Тёмная', iconName: 'lucide:moon-star' },
	{ name: 'light', title: 'Светлая', iconName: 'lucide:sun' },
]
