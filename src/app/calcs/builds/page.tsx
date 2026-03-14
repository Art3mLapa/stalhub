'use client'

import { Icon } from '@iconify/react'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { unbounded } from '@/app/fonts'
import { Button } from '@/components/ui/Button'
import DropdownMenu from '@/components/ui/DropDown'
import Input from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { buildQueries } from '@/queries/calcs/build.queries'
import { useBuildStore } from '@/stores/useBuild.store'
import { percentButtons, potentialButtons } from '@/types/build.type'
import type { DropdownItem } from '@/types/ui/dropdown.type'
import Scene from './model/Scene'
import StatsTabs from './StatsTabs'

function BuildSelector() {
	const {
		savedBuilds,
		loadBuild,
		deleteBuild,
		resetBuild,
		build,
		defaults,
		saveBuild,
	} = useBuildStore()

	const hasChanges =
		build.arts.length > 0 ||
		Object.values(build.boost).some((v) => v !== null) ||
		build.armor !== null ||
		build.container !== null ||
		defaults.art.percent !== 85 ||
		defaults.art.potential !== 0 ||
		defaults.armor.level !== 0

	const handleSelect = (key: string) => {
		if (key === 'new') {
			if (hasChanges) {
				saveBuild('Новая сборка')
			}
			resetBuild()
		} else {
			loadBuild(key)
		}
	}

	const items: DropdownItem[] = [
		...savedBuilds.map((saved) => ({
			key: saved.id,
			content: (
				<div
					className="flex w-full items-center justify-between"
					onClick={() => handleSelect(saved.id)}
				>
					<p className="truncate font-semibold">{saved.name}</p>

					<Button
						className="rounded p-1 ring-transparent"
						onClick={(e) => {
							e.stopPropagation()
							deleteBuild(saved.id)
						}}
						variant={'danger'}
					>
						<Icon className="size-4" icon="lucide:trash-2" />
					</Button>
				</div>
			),
		})),

		...(savedBuilds.length
			? [
					{
						key: 'divider',
						divider: true,
						content: null,
					},
				]
			: []),

		{
			key: 'new',
			content: (
				<div
					className="flex w-full items-center gap-2"
					onClick={() => handleSelect('new')}
				>
					<Icon className="size-4" icon="lucide:plus" />
					<p className="font-semibold">Новая сборка</p>
				</div>
			),
		},
	]

	return (
		<DropdownMenu
			blur={false}
			className="font-semibold text-[15px]"
			icon="lucide:package"
			items={items}
			placement="bottom-start"
			title="Сборки"
			variant={'secondary'}
		/>
	)
}

export default function BuildsPage() {
	const {
		defaults,
		savedBuilds,
		currentBuildId,
		setDefaults,
		resetBuild,
		updateBuild,
		exportBuild,
		importBuild,
		build,
	} = useBuildStore()

	const [showRenameModal, setShowRenameModal] = useState(false)
	const [buildName, setBuildName] = useState('')
	const [showDefaults, setShowDefaults] = useState(false)
	const [shareCopied, setShareCopied] = useState(false)
	const [imported, setImported] = useState(false)

	const currentBuild = savedBuilds.find((b) => b.id === currentBuildId)

	const armorsQuery = useQuery(buildQueries.get({ type: 'armor' }))
	const containersQuery = useQuery(buildQueries.get({ type: 'containers' }))

	const armors = armorsQuery.data ?? []
	const containers = containersQuery.data ?? []

	const armorItem = armors.find((a) => a.id === build.armor?.id)
	const containerItem = containers.find((c) => c.id === build.container?.id)

	const armorModelQuery = useQuery({
		queryKey: ['item-model', 'armor', build.armor?.id],
		queryFn: async () => {
			if (!build.armor?.id || !armorItem?.category) return null
			const res = await fetch(
				`https://raw.githubusercontent.com/oarer/sc-db/refs/heads/main/merged/items/${armorItem.category}/${build.armor.id}.json`
			)
			if (!res.ok) return null
			return res.json()
		},
		enabled: !!armorItem?.category && !!build.armor?.id,
	})

	const containerModelQuery = useQuery({
		queryKey: ['item-model', 'container', build.container?.id],
		queryFn: async () => {
			if (!build.container?.id || !containerItem?.category) return null
			const res = await fetch(
				`https://raw.githubusercontent.com/oarer/sc-db/refs/heads/main/merged/items/${containerItem.category}/${build.container.id}.json`
			)
			if (!res.ok) return null
			return res.json()
		},
		enabled: !!containerItem?.category && !!build.container?.id,
	})

	const armorModel = armorModelQuery.data?.model
	const containerModel = containerModelQuery.data?.model


	useEffect(() => {
		if (imported) return
		const params = new URLSearchParams(window.location.search)
		const shareCode = params.get('share')
		if (shareCode) {
			setTimeout(() => {
				importBuild(shareCode).then((success) => {
					if (success) {
						setImported(true)
						window.history.replaceState({}, '', '/calcs/builds')
					}
				})
			}, 100)
		}
	}, [importBuild, imported])

	const handleRename = () => {
		if (!buildName.trim() || !currentBuildId) return
		updateBuild(currentBuildId, { name: buildName.trim() })
		setBuildName('')
		setShowRenameModal(false)
	}

	return (
		<main className="mx-auto max-w-360 space-y-6 px-4 pt-42 pb-12 sm:px-6 md:px-8">
			<div className="grid grid-cols-1 gap-8 lg:grid-cols-[28%_60%]">
				<div className="flex flex-col gap-4">
					<div className="flex flex-col gap-2">
						<h1
							className={`${unbounded.className} text-3xl text-red-500`}
						>
							|{' '}
							{currentBuild ? currentBuild.name : 'Новая сборка'}
						</h1>

						<div className="flex flex-wrap items-center justify-between gap-2">
							<BuildSelector />

							<div className="flex gap-2">
								{currentBuild && (
									<Modal.Root
										onOpenChange={(open) => {
											setShowRenameModal(open)
											if (open)
												setBuildName(currentBuild.name)
										}}
										open={showRenameModal}
									>
										<Modal.Trigger
											asChild
											className="flex gap-2"
										>
											<Button
												className="flex gap-2 rounded-lg p-2"
												variant={'secondary'}
											>
												<Icon
													className="text-xl"
													icon="lucide:pencil"
												/>
											</Button>
										</Modal.Trigger>
										<Modal.Content>
											<Modal.Header>
												<Modal.Title>
													Переименовать сборку
												</Modal.Title>
											</Modal.Header>
											<Modal.Body>
												<Input
													label="Название сборки"
													onChange={(
														e: React.ChangeEvent<HTMLInputElement>
													) =>
														setBuildName(
															e.target.value
														)
													}
													value={buildName}
												/>
											</Modal.Body>
											<Modal.Footer>
												<Modal.Close>
													Отмена
												</Modal.Close>
												<Modal.Action
													disabled={!buildName.trim()}
													onClick={handleRename}
												>
													Сохранить
												</Modal.Action>
											</Modal.Footer>
										</Modal.Content>
									</Modal.Root>
								)}

								<Button
									className="flex gap-2 rounded-lg p-2"
									onClick={async () => {
										const name =
											currentBuild?.name || 'Новая сборка'
										const encoded = await exportBuild(name)
										if (encoded) {
											const url = `${window.location.origin}/calcs/builds?share=${encodeURIComponent(encoded)}`
											navigator.clipboard.writeText(url)
											setShareCopied(true)
											setTimeout(
												() => setShareCopied(false),
												2000
											)
										}
									}}
									variant={
										shareCopied ? 'primary' : 'secondary'
									}
								>
									<Icon
										className="text-xl"
										icon={
											shareCopied
												? 'lucide:check'
												: 'lucide:share'
										}
									/>
								</Button>
								<Button
									className="flex gap-2 rounded-lg p-2"
									onClick={() =>
										setShowDefaults(!showDefaults)
									}
									variant={'secondary'}
								>
									<Icon
										className="text-xl"
										icon="lucide:settings"
									/>
								</Button>
								<Button
									className="flex gap-2 rounded-lg p-2 ring-transparent"
									onClick={resetBuild}
									variant={'danger'}
								>
									<Icon
										className="text-xl"
										icon="lucide:rotate-ccw"
									/>
								</Button>
							</div>
						</div>

						{/* TODO dropdown */}
						{showDefaults && (
							<div className="rounded-lg border border-border/50 bg-background/50 p-3">
								<p className="mb-2 font-semibold text-sm">
									Дефолтные настройки артефактов
								</p>
								<div className="mb-3 flex flex-col gap-1">
									<p className="text-neutral-400 text-xs">
										Процент
									</p>
									<div className="flex flex-wrap gap-1">
										{percentButtons.map((p) => (
											<button
												className={`w-fit min-w-8 cursor-pointer rounded-md px-2 py-0.5 text-xs ring-2 ${p.color} ${
													defaults.art.percent ===
													p.value
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
									<p className="text-neutral-400 text-xs">
										Потенциал
									</p>
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
						)}
					</div>

					<StatsTabs />
				</div>
				<div className="flex min-h-180 w-full items-center justify-center">
					<Scene
						armor={{
							glb: armorModel?.model
								? `https://cdn.stalhub.tech/${armorModel.model}`
								: 'https://cdn.stalhub.tech/models/armor/hound/hound.glb',
							textures: {
								diff: armorModel?.diff
									? `https://cdn.stalhub.tech/${armorModel.diff}`
									: 'https://cdn.stalhub.tech/models/armor/hound/hound_diff.dds',
								emi: armorModel?.emi
									? `https://cdn.stalhub.tech/${armorModel.emi}`
									: '/textures/armor_emi.png',
								nrm: armorModel?.nrm
									? `https://cdn.stalhub.tech/${armorModel.nrm}`
									: 'https://cdn.stalhub.tech/models/armor/hound/hound_nrm.dds',
							},
						}}
						cont={{
							glb: containerModel?.model
								? `https://cdn.stalhub.tech/${containerModel.model}`
								: 'https://cdn.stalhub.tech/models/backpacks/cont_bear/bear6.glb',
							textures: {
								diff: containerModel?.diff
									? `https://cdn.stalhub.tech/${containerModel.diff}`
									: 'https://cdn.stalhub.tech/models/backpacks/cont_bear/bear6_diff.dds',
								emi: containerModel?.emi
									? `https://cdn.stalhub.tech/${containerModel.emi}`
									: undefined,
								nrm: containerModel?.nrm
									? `https://cdn.stalhub.tech/${containerModel.nrm}`
									: undefined,
							},
						}}
					/>
				</div>
			</div>
		</main>
	)
}
