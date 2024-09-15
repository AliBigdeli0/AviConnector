import { Chart, ScatterDataPoint } from 'chart.js';

export type TimeChartType = Chart<
    'line',
    (number | ScatterDataPoint | null)[],
    unknown
>;
