import { Chart, ScatterDataPoint } from 'chart.js';

export type TimeChartType = Chart<
    'line',
    (number | ScatterDataPoint | null)[],
    unknown
>;

export type ChartTimeScales =
    | 600_000
    | 1200_000
    | 1800_000
    | 3600_000
    | 7200_000
    | 10800_000;
