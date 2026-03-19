'use client'

import { useBuildStore } from '@/stores/useBuild.store'
import { percentButtons, potentialButtons } from '@/types/build.type'

export default function DefaultsSettings() {
	const { defaults, setDefaults } = useBuildStore()

	return (
		<div className="rounded-lg border border-border/50 bg-background/50 p-3">
			<p className="mb-2 font-semibold text-sm">
				Дефолтные настройки артефактов
			</p>
			<div className="mb-3 flex flex-col gap-1">
				<p className="text-neutral-400 text-xs">Процент</p>
				<div className="flex flex-wrap gap-1">
					{percentButtons.map((p) => (
						<button
							className={`w-fit min-w-8 cursor-pointer rounded-md px-2 py-0.5 text-xs ring-2 ${p.color} ${
								defaults.art.percent === p.value
									? 'ring-white'
									: 'ring-transparent'
							}`}
							key={p.value}
							onClick={() =>
								setDefaults({
									art: {
										...defaults.art,
										percent: p.value,
									},
								})
							}
						>
							{p.value}
						</button>
					))}
				</div>
			</div>
			<div className="flex flex-col gap-1">
				<p className="text-neutral-400 text-xs">Потенциал</p>
				<div className="flex flex-wrap gap-1">
					{potentialButtons.map((p) => (
						<button
							className={`w-fit min-w-8 cursor-pointer rounded-md bg-neutral-800 px-2 py-0.5 text-xs ring-2 ring-border/40 ${
								defaults.art.potential === p
									? 'ring-white'
									: 'ring-transparent'
							}`}
							key={p}
							onClick={() =>
								setDefaults({
									art: {
										...defaults.art,
										potential: p,
									},
								})
							}
						>
							{p}
						</button>
					))}
				</div>
			</div>
		</div>
	)
}
