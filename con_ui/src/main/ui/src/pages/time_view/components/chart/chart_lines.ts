// atlassian
import { colors } from '@atlaskit/theme';

// chart
import { ChartData } from 'chart.js';

// local
import { ChartComponentParameters } from '../../../../models/parameters/chart-component-parameter';

//
export interface ChartLinesOption {
    components: ChartComponentParameters;
}

//
export const getChartLines = (props: ChartLinesOption): ChartData<'line'> => {
    return {
        labels: [],
        datasets: props.components.elements.map((element) => {
            return {
                label: element.showName,
                data: [],
                fill: false,
                backgroundColor: element.color,
                borderColor: element.color,
                tension: 0.1,
                pointRadius: element.stroke,
            };
        }),
    };
};
