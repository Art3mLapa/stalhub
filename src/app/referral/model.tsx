'use client'

import { Html, OrbitControls, useGLTF } from '@react-three/drei'

import { Canvas, useLoader } from '@react-three/fiber'
import { Suspense, useEffect, useRef } from 'react'
import * as THREE from 'three'
import {
	DDSLoader,
	type OrbitControls as OrbitControlsImpl,
} from 'three-stdlib'

import { Skeleton } from '@/components/ui/Skeleton'

function Loader() {
	return (
		<Html center>
			<Skeleton className="h-[50vh] max-h-105 w-[60vw] max-w-[320px]" />
		</Html>
	)
}

function ModelControls() {
	const gltf = useGLTF('/models/shark/shark.glb')
	const scene = gltf.scene

	const modelRef = useRef<THREE.Object3D | null>(null)
	const controlsRef = useRef<OrbitControlsImpl | null>(null)

	const diff = useLoader(DDSLoader, '/models/shark/shark_diff.dds')
	const nrm = useLoader(DDSLoader, '/models/shark/shark_nrm.dds')

	useEffect(() => {
		scene.traverse((child) => {
			if ((child as THREE.Mesh).isMesh) {
				const mesh = child as THREE.Mesh

				if (mesh.name === 'acc1_mount' || mesh.name === 'ring') return

				if (mesh.material instanceof THREE.MeshStandardMaterial) {
					mesh.material.map = diff
					mesh.material.normalMap = nrm
					mesh.material.needsUpdate = true
				}
			}
		})
	}, [scene, diff, nrm])

	scene.traverse((child) => {
		console.log(child.name)
	})

	return (
		<>
			<primitive object={scene} ref={modelRef} rotation={[0, 0, 0]} />
			<OrbitControls
				enableDamping
				enablePan={false}
				maxDistance={8}
				minDistance={2}
				ref={controlsRef}
				target={[-2.5, 0, 0]}
			/>
		</>
	)
}

export default function CharmModel() {
	return (
		<Canvas camera={{ fov: 50, position: [-4, 5.8, 1.3] }}>
			<ambientLight intensity={2} />
			<directionalLight intensity={2} position={[2, 2, 2]} />
			<directionalLight intensity={1} position={[0, -2, 0]} />

			<Suspense fallback={<Loader />}>
				<ModelControls />
			</Suspense>
		</Canvas>
	)
}
