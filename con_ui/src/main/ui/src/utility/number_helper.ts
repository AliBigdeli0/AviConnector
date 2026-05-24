import { ChartPoint } from '../models/chart/chart_point';

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

    static generateUUID(): string {
        const template = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
        const randomChar = (char: string): string => {
            const random = Math.floor(Math.random() * 16);
            if (char === 'x') {
                return random.toString(16);
            } else if (char === 'y') {
                return ((random % 4) + 8).toString(16);
            }
            return char;
        };

        return template
            .split('')
            .map((char) => randomChar(char))
            .join('');
    }
}
