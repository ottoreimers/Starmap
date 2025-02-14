import React, { useRef } from 'react';
import * as THREE from 'three';
import { TextureLoader } from 'three';
import { useThree, useLoader, useFrame } from '@react-three/fiber';
import gsap from 'gsap';
import './PlanetPoint.css';


const PlanetPoint = ({ planet, position, selectedPlanet, setSelectedPlanet }) => {

	const { camera } = useThree();

	const baseSize = 0.1;
	const scaleFactor = 0.00001;
	const size = baseSize + (planet.size * scaleFactor);

	const meshRef = useRef();

	const hasTexture = ['earth', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune'].includes(planet.name.toLowerCase());
	const texture = hasTexture ? useLoader(TextureLoader, `/textures/${planet.name.toLowerCase()}.jpg`) : null;

	const hasRing = planet.name.toLowerCase() === 'saturn';
	const ringTexture = useLoader(TextureLoader, '/textures/saturn_ring_alpha.png');

	useFrame(() => {
		if (meshRef.current) {
			const rotationPeriods = {
				'mercury': 58.6,
				'venus': 243,
				'earth': 1,
				'mars': 1.03,
				'jupiter': 0.41,
				'saturn': 0.45,
				'uranus': 0.72,
				'neptune': 0.67,
				'pluto': 6.39
			};

			const period = rotationPeriods[planet.name.toLowerCase()] || 1;
			const rotationSpeed = 0.001 * (1 / period);
			meshRef.current.rotation.y += rotationSpeed;
		}

		if (selectedPlanet === planet) {
			camera.lookAt(position[0], position[1], position[2]);
		}
	});

	const handleClick = (e) => {
		e.stopPropagation();
		const wasSelected = selectedPlanet === planet;
		setSelectedPlanet(wasSelected ? null : planet);

		if (!wasSelected) {
			gsap.to(camera.position, {
				duration: 1,
				x: position[0],
				y: 1,
				z: 5,
				onUpdate: () => {
					camera.lookAt(
						position[0], position[1], position[2]
					)
				}
			});
		} else {
			gsap.to(camera.position, {
				duration: 1,
				x: 20,
				y: 15,
				z: 30,
				onUpdate: () => {
					camera.lookAt(
						20, 0, 0
					)
				}
			});
		}
	}

	return (
		<group>
			<mesh
				ref={meshRef}
				position={position}
				onClick={handleClick}
				resiveShadow
			>
				<sphereGeometry args={[size, 32, 32]} />
				<meshPhysicalMaterial
					{...(texture ? { map: texture } : { color: planet.color })}
					metalness={0.1}
					roughness={0.7}
					clearcoat={0.1}
					clearcoatRoughness={0.4}
					reflectivity={0.5}
				/>
			</mesh>
			{hasRing && (
				<mesh position={position} rotation={[Math.PI / 2.8, 0, 0]}>
					<ringGeometry args={[size * 1.4, size * 2.2, 64]} />
					<meshStandardMaterial
						// map={ringTexture}
						color="#d6c9ac"
						side={THREE.DoubleSide}
						transparent={true}
						opacity={0.9}
					/>
				</mesh>
			)}
		</group>
	);
}

export default PlanetPoint;
