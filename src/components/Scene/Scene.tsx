import React, { useRef } from 'react';
import { Instances, OrbitControls, useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { random } from 'mathjs';
import { Euler, Vector3 } from 'three';
import planePath from '~/assets/plane.glb';
import { randomNormal } from '~/math/normalDistribution';
import { Particle } from '~/math/Particle';
import { PaperPlaneInstance } from '../PaperPlaneInstance';

const nPlanes = 500;
const initialSpeed = 30;

export const Scene: React.FC = () => {
    const particlesRef = useRef<Particle[]>([]);
    const {
        nodes: { Plane: planeNode },
        materials: { PlaneMaterial: planeMaterial },
    } = useGLTF(planePath);

    React.useEffect(() => {
        if (particlesRef.current.length === 0) {
            particlesRef.current = [
                ...Array.from({ length: nPlanes }).map(() => {
                    let pos = new Vector3(1, 0, 0)
                        .multiplyScalar(randomNormal(10, 8))
                        .applyEuler(new Euler(0, random(0, Math.PI * 2), 0))
                        .setY(randomNormal(0, 0.3));

                    pos = pos.setLength(pos.length() + 20);

                    const vel = pos
                        .clone()
                        .cross(new Vector3(0, 1, 0))
                        .setLength(initialSpeed);

                    return new Particle(pos, vel, 1);
                }),
                new Particle(new Vector3(), new Vector3(), 1000, true),
            ];
        }
    }, []);

    useFrame(() => {
        const particles = particlesRef.current;

        for (const a of particles) {
            for (const b of particles) {
                if (a !== b) {
                    a.attract(b);
                }
            }
        }

        for (const particle of particles) {
            particle.update(0.03);
        }
    });

    return (
        <>
            <mesh>
                <meshStandardMaterial color="black" />
                <sphereGeometry args={[10]} />
            </mesh>
            <Instances
                range={nPlanes}
                material={planeMaterial}
                // @ts-expect-error wrong type? idk
                geometry={planeNode.geometry}
            >
                {Array.from({ length: nPlanes }).map((_, i) => (
                    <PaperPlaneInstance
                        // eslint-disable-next-line react/no-array-index-key
                        key={i}
                        particlesRef={particlesRef}
                        index={i}
                    />
                ))}
            </Instances>
            <ambientLight intensity={2} />
            <OrbitControls />
        </>
    );
};
