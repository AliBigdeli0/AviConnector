export class ColorHelper {
    static convertFromCssVars(varName: string): string {
        const style = getComputedStyle(document.body);
        const match = varName.match(/var\(([^)]+)\)/);
        if (match) {
            const colorName = match[1];
            return style.getPropertyValue(colorName).trim();
        } else {
            console.log('correct form of color should be like: var(something)');
            return '';
        }
    }
}
