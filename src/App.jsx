import React, { useState, useRef, useEffect } from 'react'
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { Float, OrbitControls, Text } from '@react-three/drei'
import { TextureLoader } from 'three'
import confetti from 'canvas-confetti'

// Floating Eid message overlay (HTML on top of canvas)
const EidMessage = ({ visible }) => {
  if (!visible) return null
  return (
    <div style={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -60%)',
      zIndex: 10,
      pointerEvents: 'none',
      textAlign: 'center',
      animation: 'floatUp 0.6s ease-out forwards',
    }}>
      <div style={{
        background: 'linear-gradient(135deg, rgba(212,175,55,0.15), rgba(255,215,0,0.25))',
        border: '2px solid rgba(212,175,55,0.7)',
        borderRadius: '20px',
        padding: '28px 48px',
        backdropFilter: 'blur(12px)',
        boxShadow: '0 0 60px rgba(212,175,55,0.4), 0 20px 40px rgba(0,0,0,0.4)',
      }}>
        <div style={{
          fontSize: '18px',
          letterSpacing: '6px',
          color: '#c9a227',
          fontFamily: '"Georgia", serif',
          marginBottom: '8px',
          textTransform: 'uppercase',
        }}>✦ ✦ ✦</div>
        <div style={{
          fontSize: '52px',
          fontFamily: '"Georgia", "Times New Roman", serif',
          fontWeight: 'bold',
          background: 'linear-gradient(135deg, #f5d060, #d4af37, #ffe07a)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          lineHeight: 1.2,
          marginBottom: '10px',
          textShadow: 'none',
        }}>Eid Mubarak!</div>
        <div style={{
          fontSize: '16px',
          color: 'rgba(255,220,100,0.85)',
          fontFamily: '"Georgia", serif',
          fontStyle: 'italic',
          letterSpacing: '2px',
        }}>تقبّل الله منّا ومنكم</div>
        <div style={{
          fontSize: '18px',
          letterSpacing: '6px',
          color: '#c9a227',
          fontFamily: '"Georgia", serif',
          marginTop: '8px',
        }}>✦ ✦ ✦</div>
      </div>
    </div>
  )
}

const RotatingCube = ({ onCubeClick }) => {
  const meshRef = useRef()

  // Load all 6 textures — one per face
  const textures = useLoader(TextureLoader, [
    '/assets/eid1.jpeg',
    '/assets/eid2.jpg',
    '/assets/eid3.jpg',
    '/assets/eid4.jpg',
    '/assets/eid5.jpg',
    '/assets/eid6.jpg',
  ])

  // Full 360° rotation on both axes so every face is seen
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.55  // continuous Y spin (left/right faces)
      meshRef.current.rotation.x += delta * 0.25  // continuous X spin (top/bottom faces)
    }
  })

  const handleClick = (e) => {
    e.stopPropagation()
    onCubeClick()
  }

  return (
    <mesh
      ref={meshRef}
      onClick={handleClick}
      scale={1.8}
    >
      <boxGeometry args={[0.6, 0.6, 0.6]} />
      {textures.map((tex, i) => (
        <meshStandardMaterial
          key={i}
          attach={`material-${i}`}
          map={tex}
          roughness={0.3}
          metalness={0.1}
        />
      ))}
    </mesh>
  )
}

export default function App() {
  const [showMessage, setShowMessage] = useState(false)

  const fireConfetti = () => {
    // Burst from center
    confetti({
      particleCount: 120,
      spread: 90,
      origin: { x: 0.5, y: 0.4 },
      colors: ['#d4af37', '#ffe07a', '#f5d060', '#ffffff', '#c0392b', '#27ae60'],
      scalar: 1.2,
    })
    // Left burst
    setTimeout(() => confetti({
      particleCount: 60,
      angle: 60,
      spread: 55,
      origin: { x: 0.1, y: 0.5 },
      colors: ['#d4af37', '#ffe07a', '#fff'],
    }), 150)
    // Right burst
    setTimeout(() => confetti({
      particleCount: 60,
      angle: 120,
      spread: 55,
      origin: { x: 0.9, y: 0.5 },
      colors: ['#d4af37', '#ffe07a', '#fff'],
    }), 300)
  }

  const handleCubeClick = () => {
    setShowMessage(true)
    fireConfetti()
    // Auto-hide after 4 seconds
    setTimeout(() => setShowMessage(false), 4000)
  }

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      {/* Starry background */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at center, #fffdd0 0%, #f5f0e8 100%)',        zIndex: 0,
      }} />

      {/* Decorative crescent & stars */}
      <div style={{
        position: 'absolute', top: 32, right: 48, zIndex: 2,
        fontSize: '48px', opacity: 0.6,
        filter: 'drop-shadow(0 0 12px rgba(212,175,55,0.8))',
        animation: 'pulse 3s ease-in-out infinite',
      }}>☽</div>
      <div style={{
        position: 'absolute', top: 24, left: 48, zIndex: 2,
        fontSize: '18px', color: 'rgba(228, 182, 30, 0.7)',
        letterSpacing: '32px',
        animation: 'twinkle 2.5s ease-in-out infinite',
      }}>★ ★ ★</div>

      {/* Title */}
      <div style={{
        position: 'absolute', top: 32, left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 2, textAlign: 'center',
      }}>
        <div style={{
          fontFamily: '"Georgia", serif',
          fontSize: '18px',
          letterSpacing: '8px',
          color: 'rgba(228, 182, 30, 0.7)',
          textTransform: 'uppercase',
        }}>Click the cube to celebrate</div>
      </div>

      {/* 3D Canvas */}
      <Canvas
        style={{ position: 'absolute', inset: 0, zIndex: 1 }}
        camera={{ position: [0, 0.5, 4], fov: 50 }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} />
        <directionalLight position={[-3, -2, -3]} intensity={0.4} color="#d4af37" />
        <RotatingCube onCubeClick={handleCubeClick} />
        {/* OrbitControls disabled auto-rotate so our useFrame drives it */}
        <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
      </Canvas>

      {/* Floating Eid message */}
      <EidMessage visible={showMessage} />

      <style>{`
        @keyframes floatUp {
          from { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
          to   { opacity: 1; transform: translate(-50%, -60%) scale(1); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50%       { opacity: 0.9; }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; letter-spacing: 32px; }
          50%       { opacity: 0.8; letter-spacing: 36px; }
        }
      `}</style>
    </div>
  )
}