'use client'

import dynamic from 'next/dynamic'

const LightningMap = dynamic(() => import('./components/LightningMap'), {
  ssr: false,
})

export default function Home() {
  return <LightningMap />
}
