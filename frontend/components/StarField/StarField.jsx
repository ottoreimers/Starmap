"use client"
import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import './StarField.css'

const StarPoint = ({ position, color, name }) => {
	return (
		<mesh position={position}>
			<pointLight color={color} />
			<mesh>
				<octahedronGeometry args={[0.1]} />
				<meshStandardMaterial color={color} />
			</mesh>
		</mesh>
	);
};

const StarField = () => {
	const [stars, setStars] = React.useState([]);

	useEffect(() => {
		fetch('https://localhost:8000/api/stars/')
			.then((response) => response.json())
			.then((data) => setStars(data));
	}, []);

	const convertToCartesian = (ra, dec, distance) => {
		const phi = (90 - dec) * (Math.PI / 180);
		const theta = ra * (Math.PI / 180);
		const x = distance * Math.sin(phi) * Math.cos(theta);
		const y = distance * Math.cos(phi) * Math.sin(theta);
		const z = distance * Math.cos(phi);
		return [x, y, z];
	}

	return (
		<div className='container'>
			<Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
				<OrbitControls />
				<ambientLight intensity={0.5} />
				{stars.map((star, index) => {
					const position = convertToCartesian(star.ra, star.dec, star.distance);
					return (
						<StarPoint
							key={index}
							position={position}
							color={star.color}
							name={star.name}
						/>
					)
				})}
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
