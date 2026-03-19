'use client'
// тут крч полигон, говно кода больше чем в калькуляторе сборок

import GlobalErrorView from '@/views/errors/globalError/GlobalErrorView'

export default function Page() {
	return <GlobalErrorView errorId="test" reset={() => null} />
}
