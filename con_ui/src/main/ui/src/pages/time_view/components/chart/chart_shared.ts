import { ChartEvent } from 'chart.js';

// local
import { ChartLastEventPoint } from '../../../../utility/models';

let chartLastEvent: ChartLastEventPoint = {
    x: null,
    y: null,
};

export const getLastEvent = (): ChartLastEventPoint => {
    return chartLastEvent;
};

export const setLastEvent = (event: ChartEvent) => {
    chartLastEvent = {
        x: event.x,
        y: event.y,
    };
};
