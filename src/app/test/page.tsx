'use client'

import { useSuspenseQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { itemQueries } from '@/queries/item/item.queries'

export default function Page() {
	const { data } = useSuspenseQuery(itemQueries.barter('j5l37'))

	useEffect(() => console.log(data))
	return <p>test</p>
}
