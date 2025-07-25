import React, { useRef } from 'react';
import { Instance, PositionMesh } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { Euler, Quaternion, Vector3 } from 'three';
import type { Particle } from '~/math/Particle';

interface PaperPlaneInstanceProps {
    particlesRef: React.RefObject<Particle[]>;
    index: number;
}

export const PaperPlaneInstance: React.FC<PaperPlaneInstanceProps> = ({
    index,
    particlesRef,
}) => {
    const ref = useRef<PositionMesh>(null);

    useFrame(() => {
        const particle = particlesRef.current[index];

        ref.current?.position.copy(particle.position);
        ref.current?.rotation.copy(
            new Euler().setFromQuaternion(
                new Quaternion().setFromUnitVectors(
                    new Vector3(0, 0, 1),
                    particle.velocity.clone().normalize(),
                ),
            ),
        );
    });

    return (
        <Instance
            scale={0.3}
            ref={ref}
        />
    );
};
