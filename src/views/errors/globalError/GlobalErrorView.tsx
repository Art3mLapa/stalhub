import Image from 'next/image'
import ErrorContent from './components/ErrorContent'
import SupportText from './components/Support'

type GlobalErrorProps = {
	errorId: string | null
	reset: () => void
}

export default function GlobalErrorView({ errorId, reset }: GlobalErrorProps) {
	return (
		<html>
			<body className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 pt-12">
				<div className="grid items-center gap-16 md:flex">
					<ErrorContent reset={reset} />
					<Image
						alt="client error"
						height={400}
						quality={95}
						src="/images/errors/client.png"
						width={400}
					/>
				</div>
				<div className="flex flex-col items-center gap-2">
					<SupportText errorId={errorId} />
				</div>
			</body>
		</html>
	)
}
