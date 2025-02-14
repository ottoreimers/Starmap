import React, { useRef, useEffect } from 'react';
import { shaderMaterial } from '@react-three/drei';
import { extend } from '@react-three/fiber';
import * as THREE from 'three';

const AtmosphereShaderMaterial = shaderMaterial(
	{
		color: new THREE.Color(),
		coefficient: 0.8,
		power: 2.0,
	},
	// Vertex Shader
	`
	varying vec3 vNormal;
	varying vec3 vToCamera;

	void main() {
        vNormal = normalize(normalMatrix * normal);
        vec4 worldPos = modelMatrix * vec4(position, 1.0);
        vToCamera = normalize(cameraPosition - worldPos.xyz);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
	`,
	// Fragment Shader
	`
	uniform vec3 color;
	uniform float coefficient;
	uniform float power;

	varying vec3 vNormal;
	varying vec3 vToCamera;

	void main() {
        float intensity = coefficient * pow(1.0 - dot(vNormal, vToCamera), power);
        gl_FragColor = vec4(color, intensity);
    }
`
);


extend({ AtmosphereShaderMaterial });

const PlanetAtmosphere = ({ position, size, color }) => {
	return (
		<mesh position={position}>
			<sphereGeometry args={[size * 1.01, 32, 32]} />
			<atmosphereShaderMaterial
				transparent
				color={new THREE.Color(color)}
				coefficient={1.0}
				power={5}
			/>
		</mesh>
	);
};

export default PlanetAtmosphere;
