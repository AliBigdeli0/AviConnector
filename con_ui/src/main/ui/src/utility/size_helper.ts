import { WinSize } from '../models/winsize';

export class SizeHelper {
    static getElementSize(elementId: string): WinSize | undefined {
        const element = document.getElementById(elementId);
        if (element !== null)
            return {
                width: element.offsetWidth,
                height: element.offsetHeight,
            };
        return undefined;
    }
}
