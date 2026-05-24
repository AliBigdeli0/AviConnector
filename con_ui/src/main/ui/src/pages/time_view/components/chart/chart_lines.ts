// atlassian
import { colors } from '@atlaskit/theme';

// chart
import { Chart, ChartData, ChartDataset } from 'chart.js';

// local
import { ChartComponentParameters } from '../../../../models/parameters/chart-component-parameter';

//
export interface ChartLinesOption {
    components: ChartComponentParameters;
    chart: Chart | undefined;
}

//
export const updateChartLines = (props: ChartLinesOption) => {
    if (props.chart === undefined)
        throw new Error(
            'to update chart lines, the chart object should not be empty!'
        );
    props.chart.data.datasets = componentsToDatasets(props.components);
};

export const getChartLines = (props: ChartLinesOption): ChartData<'line'> => {
    return {
        labels: [],
        datasets: componentsToDatasets(props.components),
    };
};

const componentsToDatasets = (
    components: ChartComponentParameters
): ChartDataset<'line'>[] => {
    return components.elements.map((element) => {
        return {
            label: element.showName,
            data: [],
            fill: false,
            backgroundColor: element.color,
            borderColor: element.color,
            tension: 0.1,
            borderWidth: element.stroke,
        };
    });
};
