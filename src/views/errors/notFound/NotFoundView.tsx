'use client'

import Image from 'next/image'
import ErrorContent from './components/ErrorContent'
import SupportText from './components/Support'

type NotFoundProps = {
	path: string
}

export default function NotFoundView({ path }: NotFoundProps) {
	return (
		<div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 pt-12">
			<div className="grid items-center gap-16 md:flex">
				<ErrorContent />
				<Image
					alt="not found"
					height={400}
					quality={95}
					src="/images/errors/404.png"
					width={400}
				/>
			</div>
			<div className="flex flex-col items-center gap-2">
				<SupportText path={path} />
			</div>
		</div>
	)
}
