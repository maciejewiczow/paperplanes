/* eslint-disable @typescript-eslint/no-explicit-any */
import { add, index, type Matrix, multiply, range, row, zeros } from 'mathjs';

export const integrateRK4 = (
    t0: number,
    dt: number,
    tend: number,
    Y0: number[],
    equation: (t: number, Y: Matrix) => number[],
): Matrix => {
    const N = Math.floor((tend - t0) / dt) + 1;

    if (N < 2) {
        throw new Error('The time interval is defined incorrectly');
    }

    const rank = Y0.length;

    const result = zeros(N, rank) as Matrix;
    result.subset(index(0, range(0, rank)), Y0);

    for (let i = 1, t = t0; i < N; i++, t += dt) {
        const currentRow = row(result, i - 1);

        const k1 = multiply(equation(t, currentRow), dt) as number[];
        const k2 = multiply(
            equation(t + 0.5 * dt, add(currentRow, multiply(k1 as any, 0.5))),
            dt,
        ) as number[];
        const k3 = multiply(
            equation(t + 0.5 * dt, add(currentRow, multiply(k2 as any, 0.5))),
            dt,
        ) as number[];
        const k4 = multiply(
            equation(t + dt, add(currentRow, multiply(k3 as any, 1))),
            dt,
        ) as number[];

        for (let j = 0; j < rank; j++) {
            result.set(
                [i, j],
                result.get([i - 1, j]) +
                    (k1[j] + 2 * k2[j] + 2 * k3[j] + k4[j]) / 6,
            );
        }
    }

    return result;
};
