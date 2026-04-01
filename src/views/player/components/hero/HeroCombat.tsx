import type { Stat } from '@/types/player.type'
import { getStatValue } from '@/utils/player/StatParse'

export default function HeroCombat({ data }: { data: Stat[] }) {
	return (
		<div className="grid grid-cols-1 justify-between gap-4 sm:grid-cols-2">
			<div>
				<p>
					К/Д:{' '}
					{(
						Number(getStatValue(data, 'kil') ?? 0) /
						(Number(getStatValue(data, 'bul-dea') ?? 0) || 1)
					).toFixed(2)}
				</p>
				<div className="pl-4">
					<p>Убийства: {Number(getStatValue(data, 'kil') ?? 0)}</p>
					<p>Смертей: {Number(getStatValue(data, 'bul-dea') ?? 0)}</p>
				</div>
				<p>
					Максимальная серия Убийств:{' '}
					{Number(getStatValue(data, 'max-kil-ser') ?? 0)}
				</p>
			</div>

			<div>
				<p>
					Точность:{' '}
					{(
						(Number(getStatValue(data, 'sho-hit') ?? 0) /
							(Number(getStatValue(data, 'sho-fir') ?? 0) || 1)) *
						100
					).toFixed(0)}
					%
				</p>
				<div className="pl-4">
					<p>
						Выстрелов: {Number(getStatValue(data, 'sho-fir') ?? 0)}
					</p>
					<p>
						Попаданий: {Number(getStatValue(data, 'sho-hit') ?? 0)}
					</p>
				</div>
				<p>
					Точность в голову:{' '}
					{(
						(Number(getStatValue(data, 'sho-hea') ?? 0) /
							(Number(getStatValue(data, 'sho-hit') ?? 0) || 1)) *
						100
					).toFixed(0)}
					%
				</p>
			</div>
		</div>
	)
}
