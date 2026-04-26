import type { VariantProps } from 'class-variance-authority'
import type { badgeVariants } from '@/components/ui/Badge'
import { PlayerRole } from './player.type'

export type RoleMeta = {
	title: string
	variant: VariantProps<typeof badgeVariants>['variant']
	icon: string
}

export const ROLE_META: Record<PlayerRole, RoleMeta> = {
	[PlayerRole.EXBO]: {
		title: 'player.note.exbo',
		variant: 'exbo',
		icon: 'lucide:shield-check',
	},
	[PlayerRole.SCAMMER]: {
		title: 'player.note.scammer',
		variant: 'danger',
		icon: 'lucide:ban',
	},
	[PlayerRole.MEDIA]: {
		title: 'player.note.media',
		variant: 'media',
		icon: 'lucide:radio',
	},
	[PlayerRole.STALHUB]: {
		title: 'player.note.stalhub',
		variant: 'stalhub',
		icon: 'lucide:shield-half',
	},
}
