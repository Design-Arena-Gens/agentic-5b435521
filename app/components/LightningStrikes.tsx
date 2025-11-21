'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface Strike {
  lat: number
  lon: number
  id: string
  timestamp: number
}

interface LightningStrikesProps {
  strikes: Strike[]
}

function latLonToVector3(lat: number, lon: number, radius: number) {
  const phi = (90 - lat) * (Math.PI / 180)
  const theta = (lon + 180) * (Math.PI / 180)

  const x = -(radius * Math.sin(phi) * Math.cos(theta))
  const z = radius * Math.sin(phi) * Math.sin(theta)
  const y = radius * Math.cos(phi)

  return new THREE.Vector3(x, y, z)
}

function LightningStrike({ strike }: { strike: Strike }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const age = useRef(0)

  useFrame((state, delta) => {
    age.current += delta

    if (meshRef.current) {
      // Fade out over time
      const opacity = Math.max(0, 1 - age.current / 2)
      const scale = 1 + age.current * 0.5

      meshRef.current.scale.setScalar(scale)

      if (meshRef.current.material instanceof THREE.MeshBasicMaterial) {
        meshRef.current.material.opacity = opacity
      }
    }
  })

  const position = useMemo(
    () => latLonToVector3(strike.lat, strike.lon, 1.02),
    [strike.lat, strike.lon]
  )

  return (
    <>
      {/* Lightning bolt effect */}
      <mesh ref={meshRef} position={position}>
        <sphereGeometry args={[0.015, 8, 8]} />
        <meshBasicMaterial color="#ffeb3b" transparent />
      </mesh>

      {/* Lightning flash glow */}
      <pointLight
        position={position}
        color="#ffeb3b"
        intensity={2}
        distance={0.5}
        decay={2}
      />

      {/* Lightning beam from space */}
      <mesh position={position}>
        <cylinderGeometry args={[0.002, 0.002, 2, 8]} />
        <meshBasicMaterial color="#fff9c4" transparent opacity={0.6} />
      </mesh>
    </>
  )
}

export default function LightningStrikes({ strikes }: LightningStrikesProps) {
  return (
    <group>
      {strikes.map(strike => (
        <LightningStrike key={strike.id} strike={strike} />
      ))}
    </group>
  )
}
