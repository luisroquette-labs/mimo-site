import type { FC, ReactNode } from 'react'

import { useEffect, useRef } from 'react'

import * as THREE from 'three'

// Range pré-configurado de quanto o Mimo gira seguindo o cursor (radianos).
const MAX_YAW = 0.6
const MAX_PITCH = 0.34

const C = {
    body: 0x5fcbe6,
    bodyShade: 0x36a3ce,
    bodyDeep: 0x2b82b0,
    belly: 0xf6eccf,
    cheek: 0xf0a0c0,
    bean: 0xf4d06b,
    ink: 0x15121a,
    ears: [0x4f93d8, 0x7b56c6, 0xb057bd, 0xd873a0, 0xef9f4f, 0xf4d86b]
}

export const MimoThree: FC = (): ReactNode => {
    const wrapRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        const wrap = wrapRef.current

        if (!wrap) return

        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

        const scene = new THREE.Scene()
        const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100)

        camera.position.set(0, -0.05, 7.2)

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })

        renderer.setClearColor(0x000000, 0)
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        wrap.appendChild(renderer.domElement)

        renderer.domElement.style.display = 'block'
        renderer.domElement.style.width = '100%'
        renderer.domElement.style.height = '100%'
        renderer.domElement.style.cursor = 'crosshair'

        scene.add(new THREE.AmbientLight(0xffffff, 0.85))

        const key = new THREE.DirectionalLight(0xffffff, 1.1)

        key.position.set(2.5, 3.5, 4)
        scene.add(key)

        const fill = new THREE.DirectionalLight(0xbfe6f2, 0.5)

        fill.position.set(-3, 1, 2)
        scene.add(fill)

        const mimo = new THREE.Group()

        scene.add(mimo)

        const mat = (color: number, rough = 0.55): THREE.MeshStandardMaterial =>
            new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: 0 })

        const bodyMat = mat(C.body)
        const shadeMat = mat(C.bodyShade)

        const add = (
            geo: THREE.BufferGeometry,
            material: THREE.Material,
            pos: [number, number, number],
            scale?: [number, number, number],
            rot?: [number, number, number]
        ): THREE.Mesh => {
            const m = new THREE.Mesh(geo, material)

            m.position.set(pos[0], pos[1], pos[2])

            if (scale) m.scale.set(scale[0], scale[1], scale[2])
            if (rot) m.rotation.set(rot[0], rot[1], rot[2])

            mimo.add(m)

            return m
        }

        // corpo + cabeça (massa redonda chibi)
        add(new THREE.SphereGeometry(1.12, 40, 32), bodyMat, [0, 0, 0], [1, 0.98, 0.95])

        // barriga creme
        add(new THREE.SphereGeometry(0.5, 28, 22), mat(C.belly, 0.75), [0, -0.34, 0.68], [1, 1.05, 0.46])

        // crista de espinhos (mais alta e visível no topo)
        const crest: Array<[number, number, number, number]> = [
            [-0.44, 1.02, -0.12, 0.56],
            [-0.15, 1.16, -0.18, 0.66],
            [0.17, 1.1, -0.16, 0.6],
            [0.46, 0.98, -0.1, 0.5]
        ]

        for (const [x, y, z, h] of crest) {
            add(new THREE.ConeGeometry(0.17, h, 14), shadeMat, [x, y, z], undefined, [-0.4, 0, x * 0.5])
        }

        // orelhas caídas em arco-íris (chain de esferas)
        const buildEar = (side: number): void => {
            const steps: Array<[number, number, number]> = [
                [1.0, 0.22, 0.0],
                [1.12, -0.1, -0.02],
                [1.14, -0.42, -0.04],
                [1.08, -0.72, -0.05],
                [0.98, -0.98, -0.05],
                [0.9, -1.2, -0.05]
            ]

            steps.forEach(([x, y, z], i) => {
                const r = 0.26 - i * 0.025

                add(
                    new THREE.SphereGeometry(r, 18, 14),
                    mat(C.ears[i], 0.5),
                    [x * side, y, z],
                    [0.8, 1, 0.55]
                )
            })
        }

        buildEar(-1)
        buildEar(1)

        // bochechas
        add(new THREE.SphereGeometry(0.2, 18, 14), mat(C.cheek, 0.7), [-0.6, -0.05, 0.84], [1, 0.82, 0.4])
        add(new THREE.SphereGeometry(0.2, 18, 14), mat(C.cheek, 0.7), [0.6, -0.05, 0.84], [1, 0.82, 0.4])

        // olhos fechados felizes (arco pra cima ∩) via torus parcial
        const inkMat = mat(C.ink, 0.4)
        const eyeGeo = new THREE.TorusGeometry(0.17, 0.035, 10, 20, Math.PI)
        const eyeL = add(eyeGeo, inkMat, [-0.4, 0.18, 0.98])
        const eyeR = add(eyeGeo, inkMat, [0.4, 0.18, 0.98])

        eyeL.rotation.z = Math.PI
        eyeR.rotation.z = Math.PI

        // narizinho + sorriso
        add(new THREE.SphereGeometry(0.06, 12, 10), mat(C.bodyDeep), [0, 0.0, 1.08])
        const smile = add(new THREE.TorusGeometry(0.12, 0.03, 10, 20, Math.PI), inkMat, [0, -0.16, 1.0])

        smile.rotation.z = 0

        // bracinhos
        add(new THREE.SphereGeometry(0.3, 18, 14), bodyMat, [-1.0, -0.5, 0.2], [0.8, 1, 0.8])
        add(new THREE.SphereGeometry(0.3, 18, 14), bodyMat, [1.0, -0.5, 0.2], [0.8, 1, 0.8])

        // pés + coxinhas douradas
        const beanMat = mat(C.bean, 0.6)

        for (const s of [-1, 1]) {
            add(new THREE.SphereGeometry(0.34, 20, 16), bodyMat, [0.42 * s, -1.02, 0.35], [1, 0.7, 1])
            add(new THREE.SphereGeometry(0.07, 10, 8), beanMat, [0.42 * s, -1.08, 0.66])
            add(new THREE.SphereGeometry(0.05, 10, 8), beanMat, [0.28 * s, -1.05, 0.62])
            add(new THREE.SphereGeometry(0.05, 10, 8), beanMat, [0.56 * s, -1.05, 0.62])
        }

        // rabinho com ponta amarela
        add(new THREE.SphereGeometry(0.22, 16, 12), bodyMat, [0.0, -0.85, -0.95], [1, 0.9, 1])
        add(new THREE.SphereGeometry(0.1, 12, 10), mat(C.ears[5], 0.5), [0.0, -0.62, -1.08])

        // ---- interação ----
        let targetYaw = 0
        let targetPitch = 0
        let frame = 0
        const start = performance.now()

        const onMove = (event: PointerEvent): void => {
            const nx = (event.clientX / window.innerWidth) * 2 - 1
            const ny = (event.clientY / window.innerHeight) * 2 - 1

            targetYaw = nx * MAX_YAW
            targetPitch = ny * MAX_PITCH
        }

        window.addEventListener('pointermove', onMove)

        const resize = (): void => {
            const w = wrap.clientWidth || 1
            const h = wrap.clientHeight || 1

            renderer.setSize(w, h, false)
            camera.aspect = w / h
            camera.updateProjectionMatrix()
        }

        resize()

        const ro = new ResizeObserver(resize)

        ro.observe(wrap)

        let visible = true
        const io = new IntersectionObserver(
            (entries) => entries.forEach((e) => {
                visible = e.isIntersecting
            }),
            { threshold: 0.02 }
        )

        io.observe(wrap)

        const loop = (): void => {
            frame = requestAnimationFrame(loop)

            if (!visible || document.hidden) return

            const t = (performance.now() - start) / 1000

            // respiração + bob sutil
            const breathe = reduced ? 0 : Math.sin(t * 1.6) * 0.02

            mimo.position.y = reduced ? 0 : Math.sin(t * 1.2) * 0.05
            mimo.scale.setScalar(1 + breathe)

            // segue o cursor, com leve balanço idle, dentro do range
            const idleYaw = reduced ? 0 : Math.sin(t * 0.6) * 0.06
            const ty = targetYaw + idleYaw
            const tp = targetPitch

            mimo.rotation.y += (ty - mimo.rotation.y) * 0.07
            mimo.rotation.x += (tp - mimo.rotation.x) * 0.07

            renderer.render(scene, camera)
        }

        frame = requestAnimationFrame(loop)

        return () => {
            cancelAnimationFrame(frame)
            window.removeEventListener('pointermove', onMove)
            ro.disconnect()
            io.disconnect()
            renderer.dispose()
            scene.traverse((obj) => {
                const m = obj as THREE.Mesh

                if (m.geometry) m.geometry.dispose()
            })

            if (renderer.domElement.parentNode === wrap) wrap.removeChild(renderer.domElement)
        }
    }, [])

    return <div ref={wrapRef} className='h-full w-full' aria-label='Mimo 3D que segue o cursor' role='img' />
}
