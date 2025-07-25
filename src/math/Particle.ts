import { row, squeeze } from 'mathjs';
import { Vector3 } from 'three';
import { integrateRK4 } from './integrate';

const G = 20;

const clamp = (x: number, min: number, max: number) =>
    Math.max(min, Math.min(x, max));

export class Particle {
    acceleration = new Vector3(0, 0, 0);

    constructor(
        public position: Vector3,
        public velocity: Vector3,
        public mass: number,
        private stationary = false,
    ) {}

    applyForce(F: Vector3) {
        if (!this.stationary) {
            this.acceleration.add(F.divideScalar(this.mass));
        }
    }

    attract(other: Particle) {
        const force = this.position.clone().sub(other.position);
        const strength =
            (G * (this.mass * other.mass)) / clamp(force.lengthSq(), 10, 1000);
        force.setLength(strength);
        other.applyForce(force);
    }

    update(dt: number) {
        const res = integrateRK4(
            0,
            dt,
            dt,
            [
                this.position.x,
                this.position.y,
                this.position.z,
                this.velocity.x,
                this.velocity.y,
                this.velocity.z,
                this.acceleration.x,
                this.acceleration.y,
                this.acceleration.z,
            ],
            (_t, Y) => [
                Y.get([0, 3]),
                Y.get([0, 4]),
                Y.get([0, 5]),
                Y.get([0, 6]),
                Y.get([0, 7]),
                Y.get([0, 8]),
                0,
                0,
                0,
            ],
        );

        [
            this.position.x,
            this.position.y,
            this.position.z,
            this.velocity.x,
            this.velocity.y,
            this.velocity.z,
            this.acceleration.x,
            this.acceleration.y,
            this.acceleration.z,
        ] = squeeze(row(res, 1).toArray()) as number[];

        this.acceleration.set(0, 0, 0);
    }

    get x(): number {
        return this.position.x;
    }

    get y(): number {
        return this.position.x;
    }

    get z(): number {
        return this.position.z;
    }
}
