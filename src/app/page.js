'use client'
import App from './App'
//
//  Routing
//
import { useRouter } from 'next/navigation'
export default function Home() {
  const router = useRouter()
  router?.push('/Splash')
  return <App />
}
