import React from 'react';
import * as THREE from 'three';

const OrbitPath = ({ distance }) => {

	const scaleDistance = distance < 2 ? distance * 6 : distance * 3;

	return (
		<mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
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

export default OrbitPath;
