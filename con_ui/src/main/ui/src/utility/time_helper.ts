export class TimeHelper {
    static async delay(mili: number) {
        return new Promise((resolve) => {
            setTimeout(resolve, mili);
        });
    }
}
