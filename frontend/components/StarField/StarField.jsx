"use client"
import React, { useState, useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, Html } from '@react-three/drei';
import './StarField.css'

const StarPoint = ({ planet, position, selectedPlanet, setSelectedPlanet }) => {

	const scene = useThree((state) => state.scene);

	const baseSize = 0.1;
	const scaleFactor = 0.00001;
	const size = baseSize + (planet.size * scaleFactor);

	const handleClick = (e) => {
		e.stopPropagation();
		setSelectedPlanet(planet === selectedPlanet ? null : planet);
	}

	return (
		<mesh
			position={position}
			onClick={handleClick}
		>
			<sphereGeometry args={[size, 32, 32]} />
			<meshPhysicalMaterial
				color={planet.color}
				metalness={0.1}
				roughness={0.7}
				clearcoat={0.1}
				clearcoatRoughness={0.4}
				reflectivity={0.5}
			/>
			{selectedPlanet === planet && (
				<Html distanceFactor={10}>
					<div style={{
						background: 'rgba(0,0,0,0.8)',
						padding: '10px',
						borderRadius: '5px',
						color: 'white',
						width: '200px'
					}}>
						<h3>{planet.name}</h3>
						<p>Type: {planet.type}</p>
						<p>Distance: {planet.distance} AU</p>
						<p>Size: {planet.size} km</p>
						<p>Orbital Period: {planet.orbital_period} days</p>
						<p>Temperature: {planet.temperature}°C</p>
					</div>
				</Html>
			)}
		</mesh>
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
				camera={{ position: [0, 5, 15], fov: 60 }}
				shadows
				gl={{
					physicallyCorrectLights: true,
					exposure: 0.5,
					toneMappingExposure: 1,
				}}
			>
				<OrbitControls />
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
		</div>
	);
}

export default StarField;
