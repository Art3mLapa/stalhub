'use client'

import { useState } from 'react'
import { Combobox, type ComboboxOption } from '@/components/ui/Combobox'

export default function Page() {
	const [selectedLanguages, setSelectedLanguages] = useState<string[]>([])
	
	const languages: ComboboxOption[] = [
		{ value: 'ts', label: 'TypeScript' },
		{ value: 'js', label: 'JavaScript' },
		{ value: 'py', label: 'Python' },
		{ value: 'rs', label: 'Rust' },
	]

	return (
		<section className="mx-auto my-60 max-w-80 text-center font-semibold">
			А чё вы думали <br />
			не думайте
			<Combobox
				multiple
				onValuesChange={setSelectedLanguages}
				options={languages}
				values={selectedLanguages}
			/>
		</section>
	)
}
