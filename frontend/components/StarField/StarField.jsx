"use client"
import React, { useState, useEffect, use } from 'react';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, Html } from '@react-three/drei';
import './StarField.css'

const StarPoint = ({ planet, position, selectedPlanet, setSelectedPlanet }) => {

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
			<meshStandardMaterial
				color={planet.color}
				emissive={planet.color}
				emissiveIntensity={0.5}
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
				color="#880808"
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
			<mesh position={[0, 0, 0]}>
				<sphereGeometry args={[2 * 1.2, 32, 32]} />
				<meshStandardMaterial
					color="#FDB813"
					emissive="#FF8F00"
					emissiveIntensity={1}
					transparent={true}
					opacity={0.3}
				/>
			</mesh>
			<pointLight
				color="#ffcc00"
				intensity={2}
				distance={100}
			/>
			<pointLight
				color="#fdb813"
				intensity={1.5}
				distance={100}
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
		console.log('Planets:', planets);
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
			<Canvas camera={{ position: [0, 5, 15], fov: 60 }}>
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
