import React from 'react';
import './Sun.css';

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
				castShadow
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

export default Sun;
