import { Suspense } from 'react';
import { Html } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Loader } from './components/Loader';
import { Scene } from './components/Scene';

export const App = () => (
    <Canvas
        camera={{
            position: [0, 22, 66],
            fov: 70,
            near: 0.1,
            far: 10000,
        }}
    >
        <Suspense
            fallback={
                <Html center>
                    <Loader />
                </Html>
            }
        >
            <Scene />
        </Suspense>
    </Canvas>
);
