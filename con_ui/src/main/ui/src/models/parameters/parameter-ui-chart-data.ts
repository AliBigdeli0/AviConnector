import { StrokeType } from '../../types/parameter';
import { ParameterUIBaseData } from './parameter-ui-base-data';

export interface ParameterUIChartData extends ParameterUIBaseData {
    color: string;
    min: number;
    max: number;
    stroke: StrokeType;
}
