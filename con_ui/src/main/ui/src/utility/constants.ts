//

import { EmptyErrorType } from '../types/error';

//
export class Constant {
    static get FiveMinutes(): number {
        return 300_000;
    }

    static get ActivityCode(): string {
        return '0107';
    }

    static get MenuSize(): number {
        return 42;
    }

    static get MenuSizePixcel(): string {
        return `${this.MenuSize}px`;
    }

    static get Version() {
        return '0.1.0';
    }

    static get AppName() {
        return 'Well Monitor';
    }

    static get EmptyError(): EmptyErrorType {
        return '';
    }
}
