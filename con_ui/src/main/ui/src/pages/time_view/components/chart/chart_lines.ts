// atlassian
import { colors } from '@atlaskit/theme';

// chart
import { ChartData } from 'chart.js';

// local

//
export interface ChartLinesOption {}

//
export const getChartLines = (props: ChartLinesOption): ChartData<'line'> => {
    return {
        labels: [],
        datasets: [
            {
                label: 'Parameter 1',
                data: [],
                fill: false,
                backgroundColor: colors.R500,
                borderColor: colors.R500,
                pointRadius: 1,
                tension: 0.1,
            },
            {
                label: 'Parameter 2',
                data: [],
                fill: false,
                backgroundColor: colors.G500,
                borderColor: colors.G500,
                pointRadius: 1,
                tension: 0.1,
            },
        ],
    };
};
