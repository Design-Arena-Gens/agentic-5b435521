'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function Globe() {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.1
    }
  })

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1, 64, 64]} />
      <meshPhongMaterial
        color="#1a237e"
        emissive="#0d47a1"
        emissiveIntensity={0.2}
        shininess={30}
        wireframe={false}
        transparent
        opacity={0.9}
      />
      {/* Wireframe overlay */}
      <mesh>
        <sphereGeometry args={[1.01, 32, 32]} />
        <meshBasicMaterial
          color="#2196f3"
          wireframe
          transparent
          opacity={0.3}
        />
      </mesh>
    </mesh>
  )
}
