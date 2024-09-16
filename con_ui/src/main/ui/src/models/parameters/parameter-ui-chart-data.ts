import { ParameterUIBaseData } from './parameter-ui-base-data';

export interface ParameterUIChartData extends ParameterUIBaseData {
    color: string;
    min: number;
    max: number;
    stroke: 1 | 2 | 3 | 4 | 5;
}
