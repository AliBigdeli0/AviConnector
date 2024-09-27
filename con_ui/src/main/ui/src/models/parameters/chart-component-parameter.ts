import { ChartTimeScales } from '../../types/time-chart-type';
import { ComponentParameters } from './component-parameters';
import { ParameterUIChartData } from './parameter-ui-chart-data';

export interface ChartComponentParameters
    extends ComponentParameters<ParameterUIChartData> {
    textColor: string;
    scale: ChartTimeScales;
}
