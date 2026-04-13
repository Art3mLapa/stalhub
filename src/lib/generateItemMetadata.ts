import type { ItemListing } from '@/types/api.type'
import type { Locale } from '@/types/item.type'

type ItemData = {
	name: string
	description: string
	icon: string
}

export async function generateItemMetadata(
	slug: string | string[],
	locale: Locale
): Promise<ItemData | null> {
	const githubUrl = Array.isArray(slug)
		? `/items/${slug.join('/')}.json`
		: `/items/${slug}.json`

	const res = await fetch(
		'https://raw.githubusercontent.com/oarer/sc-db/refs/heads/main/merged/listing.json',
		{ next: { revalidate: 60 } }
	)
	const listing: ItemListing[] = await res.json()

	const item = listing.find((i) => i.data === githubUrl)
	if (!item || !item.name || !item.icon) return null

	const name = item.name[locale] || item.name.en || item.name.ru
	if (!name) return null

	const descriptions: Record<Locale, string> = {
		ru: `Информация о предмете ${name}: описание, характеристики, аукцион`,
		en: `Information about item ${name}: description, stats, auction`,
		es: `Información sobre el objeto ${name}: descripción, características, subasta`,
		fr: `Informations sur l'objet ${name} : description, caractéristiques, enchères`,
		ko: `${name} 아이템 정보: 설명, 특징, 경매`,
	}
	const description = descriptions[locale] || descriptions.ru

	return { name, description, icon: item.icon }
}
