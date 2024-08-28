export class TimeHelper {
    static async delay(mili: number) {
        return new Promise((resolve) => {
            setTimeout(resolve, mili);
        });
    }

    static showTime(date: Date): string {
        return `${date.getHours().toString().padStart(2, '0')}:${date
            .getMinutes()
            .toString()
            .padStart(2, '0')}`;
    }
}
