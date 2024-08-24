import { ThemeType } from './types';

export class ThemeHelper {
    static changeTheme(type: ThemeType) {
        window.localStorage.setItem('theme', type);
    }

    static getTheme(): ThemeType {
        const theme = localStorage.getItem('theme') as ThemeType;
        if (theme === null) {
            this.changeTheme('dark');
        }
        return localStorage.getItem('theme') as ThemeType;
    }
}
