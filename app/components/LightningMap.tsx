'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'
import { Suspense, useState, useEffect } from 'react'
import Globe from './Globe'
import LightningStrikes from './LightningStrikes'

export default function LightningMap() {
  const [strikes, setStrikes] = useState<Array<{ lat: number; lon: number; id: string; timestamp: number }>>([])
  const [strikeCount, setStrikeCount] = useState(0)

  useEffect(() => {
    // Simulate real-time lightning strikes
    const interval = setInterval(() => {
      // Generate 1-5 random lightning strikes
      const numStrikes = Math.floor(Math.random() * 5) + 1
      const newStrikes = Array.from({ length: numStrikes }, () => ({
        lat: (Math.random() - 0.5) * 180,
        lon: (Math.random() - 0.5) * 360,
        id: Math.random().toString(36).substr(2, 9),
        timestamp: Date.now(),
      }))

      setStrikes(prev => {
        // Keep only strikes from last 10 seconds
        const cutoff = Date.now() - 10000
        const filtered = prev.filter(s => s.timestamp > cutoff)
        return [...filtered, ...newStrikes]
      })

      setStrikeCount(prev => prev + numStrikes)
    }, 800) // New strikes every 800ms

    return () => clearInterval(interval)
  }, [])

  return (
    <>
      <div className="info">
        <h1>⚡ Real-Time Lightning Map</h1>
        <p>Simulated lightning strikes around the globe</p>
        <p>Drag to rotate • Scroll to zoom</p>
      </div>

      <div className="stats">
        <div className="count">{strikeCount}</div>
        <div>Total Strikes</div>
      </div>

      <Canvas
        camera={{ position: [0, 0, 3], fov: 45 }}
        style={{ background: '#000' }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.3} />
          <pointLight position={[10, 10, 10]} intensity={1} />

          <Stars
            radius={300}
            depth={50}
            count={5000}
            factor={4}
            saturation={0}
            fade
            speed={1}
          />

          <Globe />
          <LightningStrikes strikes={strikes} />

          <OrbitControls
            enablePan={false}
            minDistance={2}
            maxDistance={8}
            rotateSpeed={0.5}
          />
        </Suspense>
      </Canvas>
    </>
  )
}
