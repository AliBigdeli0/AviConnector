import { ChartPoint } from './models';

export class NumHelper {
    static getRandomInRange(min: number, max: number): number {
        return Math.random() * (max - min) + min;
    }

    static generateRandomPoints(length: number): ChartPoint[] {
        const now = Date.now();
        let randValue = NumHelper.getRandomInRange(0, 100);
        return Array.from({ length: length + 1 }, (_, i) => {
            if (i % 50 === 0) randValue = NumHelper.getRandomInRange(0, 100);
            return {
                y: new Date(now - i * 1000),
                x: randValue,
            };
        });
    }
}
