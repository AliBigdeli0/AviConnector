import { ParameterUIBaseData } from './parameter-ui-base-data';

export interface ComponentParameters<T extends ParameterUIBaseData> {
    max: number;
    id: string;
    elements: T[];
}
