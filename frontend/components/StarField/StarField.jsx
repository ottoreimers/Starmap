"use client"
import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { TextureLoader } from 'three';
import { useThree, useLoader, useFrame } from '@react-three/fiber';
import gsap from 'gsap';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, Html } from '@react-three/drei';
import './StarField.css'

const StarPoint = ({ planet, position, selectedPlanet, setSelectedPlanet }) => {

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

const OrbitPath = ({ distance }) => {

	const scaleDistance = distance < 2 ? distance * 4 : distance * 2;

	return (
		<mesh rotation={[Math.PI / 2, 0, 0]}>
			<ringGeometry args={[scaleDistance, scaleDistance + 0.1, 64]} />
			<meshBasicMaterial
				color="#00fdff"
				transparent={true}
				opacity={0.5}
				side={THREE.DoubleSide}
			/>
		</mesh>
	);
}

const Sun = () => {
	return (
		<group>
			<mesh position={[0, 0, 0]}>
				<sphereGeometry args={[2, 32, 32]} />
				<meshStandardMaterial
					color="#ffcc00"
					emissive="#ffcc00"
					emissiveIntensity={4}
				/>
			</mesh>
			<directionalLight
				color="#ffffff"
				intensity={5}
				position={[-5, 0, 0]}
				target-position={[5, 0, 0]}
				casrShadow
			/>
			<pointLight
				color="#FDB813"
				intensity={2}
				position={[0, 0, 0]}
				distance={100}
				decay={2}
			/>
		</group>
	);
}

const StarField = () => {
	const [planets, setPlanets] = useState([]);
	const [selectedPlanet, setSelectedPlanet] = useState(null);

	useEffect(() => {
		fetch('http://localhost:8000/api/planets/')
			.then((response) => response.json())
			.then((data) => setPlanets(data))
			.catch((error) => console.error('Error:', error));
	}, []);

	const getPosition = (distance) => {
		if (distance < 2) {
			return [distance * 4, 0, 0];
		} else {
			return [distance * 2, 0, 0];
		}
	}

	return (
		<div className='container'>
			<Canvas
				camera={{
					position: [0, 20, 50],
					fov: 60,
					near: 0.1,
					far: 1000
				}}
				shadows
				gl={{
					physicallyCorrectLights: true,
					exposure: 0.5,
					toneMappingExposure: 1,
				}}
			>
				<OrbitControls
					maxDistance={100}
					minDistance={1}
					enablePan
					maxPolarAngle={Math.PI}
				/>
				<ambientLight intensity={0.5} />
				<Sun />
				{planets.map((planet, index) => (
					<OrbitPath key={`orbit-${index}`} distance={planet.distance} />
				))}
				{planets.map((planet, index) => (
					<StarPoint
						key={index}
						planet={planet}
						position={getPosition(planet.distance)}
						selectedPlanet={selectedPlanet}
						setSelectedPlanet={setSelectedPlanet}
					/>
				))}
				<Stars
					radius={100}
					depth={50}
					count={5000}
					factor={4}
					saturation={0}
					fade
				/>
			</Canvas>
			{selectedPlanet && (
				<div style={{
					position: 'fixed',
					bottom: '20px',
					right: '20px',
					background: 'rgba(0,0,0,0.8)',
					padding: '10px',
					borderRadius: '5px',
					color: 'white',
					width: '200px',
					zIndex: 9,
				}}>
					<h3>{selectedPlanet.name}</h3>
					<p>Type: {selectedPlanet.type}</p>
					<p>Distance: {selectedPlanet.distance} AU</p>
					<p>Size: {selectedPlanet.size} km</p>
					<p>Orbital Period: {selectedPlanet.orbital_period} days</p>
					<p>Temperature: {selectedPlanet.temperature}°C</p>
				</div>
			)}
		</div>
	);
}

export default StarField;
