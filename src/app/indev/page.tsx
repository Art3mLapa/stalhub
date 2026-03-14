'use client'

import axios from 'axios'
import Cookies from 'js-cookie'
import { type SyntheticEvent, useCallback, useEffect, useState } from 'react'
import { Button } from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import CLink from '@/components/ui/Link'
import { unbounded } from '../fonts'
import Model from './model'

export default function Page() {
	const [inviteKey, setInviteKey] = useState('')
	const [error, setError] = useState('')
	const [hasAccess, setHasAccess] = useState(false)
	const [loading, setLoading] = useState(false)

	useEffect(() => {
		if (Cookies.get('inviteAccess')) setHasAccess(true)
	}, [])

	const handleSubmit = useCallback(
		async (e: SyntheticEvent<HTMLFormElement>) => {
			e.preventDefault()
			setLoading(true)
			setError('')

			try {
				const res = await axios.post(
					'/api/invite',
					{ key: inviteKey },
					{ withCredentials: true }
				)

				if (res.status === 200) {
					setHasAccess(true)
				}
			} catch (err: unknown) {
				if (axios.isAxiosError(err)) {
					if (err.response?.status === 400) setError('Неверный ключ')
					else setError('Ошибка сети')
				} else {
					setError('Произошла неизвестная ошибка')
				}
			} finally {
				setLoading(false)
			}
		},
		[inviteKey]
	)

	if (hasAccess) {
		return (
			<main className="mx-auto flex max-w-6xl flex-col items-center gap-10 px-4 pt-12 xl:flex-row">
				<div className="flex flex-col items-center gap-4 text-center xl:text-left">
					<h1 className={`${unbounded.className} text-4xl`}>
						Доступ разрешён!
					</h1>
					<CLink
						className="bg-background px-4 py-2 ring-2 ring-border/40"
						href="/"
					>
						На главную
					</CLink>
				</div>

				<div className="flex h-[50vh] w-full flex-1 justify-center sm:h-[60vh] lg:block xl:h-[80vh]">
					<Model />
				</div>
			</main>
		)
	}

	return (
		<main className="mx-auto flex max-w-6xl flex-col items-center gap-10 px-4 pt-40 md:pt-12 xl:flex-row">
			<div className="flex flex-col gap-4 text-center xl:text-left">
				<h1 className={`${unbounded.className} text-4xl`}>
					Сайт в разработке
				</h1>

				<form
					className="flex w-full flex-col items-center gap-2"
					onSubmit={handleSubmit}
				>
					<Input
						className="min-w-80"
						onChange={(e) => setInviteKey(e.target.value)}
						placeholder="Введите ключ приглашения"
						type="text"
						value={inviteKey}
					/>
					<Button loading={loading} type="submit" variant={'outline'}>
						{loading ? 'Проверка...' : 'Войти'}
					</Button>
					{error && <p className="mt-2 text-red-500">{error}</p>}
				</form>
			</div>

			<div className="flex h-[50vh] w-full flex-1 justify-center sm:h-[60vh] lg:block xl:h-[80vh]">
				<Model />
			</div>
		</main>
	)
}
