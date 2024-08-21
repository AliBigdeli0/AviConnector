interface CookieItem {
    name: string;
    value: string;
}

export class CookieHelper {
    private static readAllCookies(): CookieItem[] {
        const cookies = document.cookie.split(';');
        const retItems: CookieItem[] = [];
        cookies.forEach((cookie) => {
            const [name, value] = cookie.split('=');
            retItems.push({
                name,
                value,
            });
        });
        return retItems;
    }

    private static readCookie(name: string): CookieItem {
        return this.readAllCookies().filter((c) => c.name === name)[0];
    }

    static get readApiAddress(): string {
        return this.readCookie('Med-Api-Address').value;
    }
}
