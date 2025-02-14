"use client"
import React, { useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import './PlanetField.css'

import Sun from '../Sun/Sun';
import OrbitPath from '../OrbitPath/OrbitPath';
import PlanetPoint from '../PlanetPoint/PlanetPoint';

const PlanetField = () => {
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
			return [distance * 6, 0, 0];
		} else {
			return [distance * 3, 0, 0];
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
					<PlanetPoint
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
				<div className='infoCard'
					style={{
					}}>
					<h3>{selectedPlanet.name}</h3>
					<p>Type: {selectedPlanet.type}</p>
					<p>Distance: {selectedPlanet.distance} AU</p>
					<p>Size: {selectedPlanet.size} km</p>
					<p>Orbital Period: {selectedPlanet.orbital_period} days</p>
					<p>Temperature: {selectedPlanet.temperature}°C</p>
					<p>{selectedPlanet.description}</p>
				</div>
			)}
		</div>
	);
}

export default PlanetField;
