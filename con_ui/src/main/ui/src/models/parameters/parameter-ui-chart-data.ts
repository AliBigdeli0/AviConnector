import { ParameterUIBaseData } from './parameter-ui-base-data';

export interface ParameterUIChartData extends ParameterUIBaseData {
    color: string;
    min: number;
    max: number;
}
