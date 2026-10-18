'use client'

import type { FC, ReactNode } from 'react'

import { useRef } from 'react'

import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, ContactShadows } from '@react-three/drei'
import * as THREE from 'three'

// Range pré-configurado do giro ao seguir o cursor.
const CFG = { yaw: 0.85, pitch: 0.4, moveX: 0.6, rotSpeed: 9, posSpeed: 4 }

const C = {
    body: '#5fcbe6',
    bodyShade: '#36a3ce',
    bodyDeep: '#2b82b0',
    belly: '#f6eccf',
    cheek: '#f0a0c0',
    bean: '#f4d06b',
    ink: '#15121a',
    ears: ['#4f93d8', '#7b56c6', '#b057bd', '#d873a0', '#ef9f4f', '#f4d86b']
}

const std = (color: string, roughness = 0.38): THREE.MeshStandardMaterial =>
    new THREE.MeshStandardMaterial({ color, roughness, metalness: 0.06, envMapIntensity: 0.9 })

const M = {
    body: std(C.body),
    shade: std(C.bodyShade),
    deep: std(C.bodyDeep, 0.5),
    belly: std(C.belly, 0.55),
    cheek: std(C.cheek, 0.6),
    bean: std(C.bean, 0.45),
    ink: new THREE.MeshStandardMaterial({ color: C.ink, roughness: 0.35 }),
    ears: C.ears.map((c) => std(c, 0.42))
}

const earSteps: Array<[number, number, number, number]> = [
    [1.0, 0.22, 0.0, 0.26],
    [1.12, -0.1, -0.02, 0.235],
    [1.14, -0.42, -0.04, 0.21],
    [1.08, -0.72, -0.05, 0.185],
    [0.98, -0.98, -0.05, 0.16],
    [0.9, -1.2, -0.05, 0.135]
]

const Ear: FC<{ side: number }> = ({ side }) => (
    <>
        {earSteps.map(([x, y, z, r], i) => (
            <mesh key={i} position={[x * side, y, z]} scale={[0.8, 1, 0.55]} material={M.ears[i]} castShadow>
                <sphereGeometry args={[r, 20, 16]} />
            </mesh>
        ))}
    </>
)

const happyEyeGeo = new THREE.TorusGeometry(0.16, 0.032, 12, 28, Math.PI)
const smileGeo = new THREE.TorusGeometry(0.12, 0.028, 12, 24, Math.PI)

const MimoModel: FC = (): ReactNode => {
    const group = useRef<THREE.Group>(null)

    useFrame((state, delta) => {
        const g = group.current

        if (!g) return

        const dt = Math.min(delta, 0.1)
        const px = state.pointer.x
        const py = state.pointer.y

        const targetY = px * CFG.yaw
        const targetX = -py * CFG.pitch
        const targetPosX = px * CFG.moveX

        g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, targetY, CFG.rotSpeed * dt)
        g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, targetX, CFG.rotSpeed * dt)
        g.position.x = THREE.MathUtils.lerp(g.position.x, targetPosX, CFG.posSpeed * dt)

        const t = state.clock.getElapsedTime()

        g.position.y = Math.sin(t * 1.3) * 0.05
    })

    return (
        <group ref={group}>
            {/* corpo + cabeça */}
            <mesh scale={[1, 0.97, 0.95]} material={M.body} castShadow receiveShadow>
                <sphereGeometry args={[1.08, 64, 48]} />
            </mesh>

            {/* barriga creme */}
            <mesh position={[0, -0.32, 0.66]} scale={[1, 1.05, 0.46]} material={M.belly} castShadow>
                <sphereGeometry args={[0.5, 48, 36]} />
            </mesh>

            {/* crista */}
            {([[-0.44, 1.0, -0.12, 0.56], [-0.15, 1.14, -0.18, 0.66], [0.17, 1.08, -0.16, 0.6], [0.46, 0.96, -0.1, 0.5]] as Array<[number, number, number, number]>).map(
                ([x, y, z, h], i) => (
                    <mesh key={i} position={[x, y, z]} rotation={[-0.4, 0, x * 0.5]} material={M.shade} castShadow>
                        <coneGeometry args={[0.17, h, 16]} />
                    </mesh>
                )
            )}

            <Ear side={-1} />
            <Ear side={1} />

            {/* bochechas */}
            <mesh position={[-0.6, -0.05, 0.82]} scale={[1, 0.82, 0.4]} material={M.cheek}>
                <sphereGeometry args={[0.2, 20, 16]} />
            </mesh>
            <mesh position={[0.6, -0.05, 0.82]} scale={[1, 0.82, 0.4]} material={M.cheek}>
                <sphereGeometry args={[0.2, 20, 16]} />
            </mesh>

            {/* olhos fechados felizes (∩) */}
            <mesh position={[-0.4, 0.16, 0.96]} rotation={[0, 0, Math.PI]} geometry={happyEyeGeo} material={M.ink} />
            <mesh position={[0.4, 0.16, 0.96]} rotation={[0, 0, Math.PI]} geometry={happyEyeGeo} material={M.ink} />

            {/* nariz + sorriso */}
            <mesh position={[0, 0.0, 1.06]} material={M.deep}>
                <sphereGeometry args={[0.06, 16, 12]} />
            </mesh>
            <mesh position={[0, -0.16, 0.98]} geometry={smileGeo} material={M.ink} />

            {/* bracinhos */}
            <mesh position={[-1.0, -0.5, 0.2]} scale={[0.8, 1, 0.8]} material={M.body} castShadow>
                <sphereGeometry args={[0.3, 24, 18]} />
            </mesh>
            <mesh position={[1.0, -0.5, 0.2]} scale={[0.8, 1, 0.8]} material={M.body} castShadow>
                <sphereGeometry args={[0.3, 24, 18]} />
            </mesh>

            {/* pés + coxinhas */}
            {[-1, 1].map((s) => (
                <group key={s}>
                    <mesh position={[0.42 * s, -1.0, 0.35]} scale={[1, 0.7, 1]} material={M.body} castShadow>
                        <sphereGeometry args={[0.34, 28, 20]} />
                    </mesh>
                    <mesh position={[0.42 * s, -1.06, 0.66]} material={M.bean}>
                        <sphereGeometry args={[0.07, 14, 12]} />
                    </mesh>
                    <mesh position={[0.28 * s, -1.03, 0.62]} material={M.bean}>
                        <sphereGeometry args={[0.05, 12, 10]} />
                    </mesh>
                    <mesh position={[0.56 * s, -1.03, 0.62]} material={M.bean}>
                        <sphereGeometry args={[0.05, 12, 10]} />
                    </mesh>
                </group>
            ))}

            {/* rabinho */}
            <mesh position={[0, -0.85, -0.95]} scale={[1, 0.9, 1]} material={M.body} castShadow>
                <sphereGeometry args={[0.22, 18, 14]} />
            </mesh>
            <mesh position={[0, -0.62, -1.08]} material={M.ears[5]}>
                <sphereGeometry args={[0.1, 14, 12]} />
            </mesh>
        </group>
    )
}

export const Mimo3D: FC = (): ReactNode => {
    return (
        <Canvas
            shadows
            camera={{ position: [0, 0.05, 6], fov: 36 }}
            gl={{ alpha: true, antialias: true }}
            style={{ cursor: 'crosshair' }}
        >
            <ambientLight intensity={0.7} />

            <directionalLight position={[3, 5, 4]} intensity={1.1} castShadow shadow-mapSize={[1024, 1024]} />
            <directionalLight position={[-4, 2, 2]} intensity={0.4} color='#bfe6f2' />

            <Environment preset='studio' environmentIntensity={0.8} />

            <ContactShadows position={[0, -1.45, 0]} opacity={0.4} scale={8} blur={2.6} far={3} color='#17150f' />

            <MimoModel />
        </Canvas>
    )
}
