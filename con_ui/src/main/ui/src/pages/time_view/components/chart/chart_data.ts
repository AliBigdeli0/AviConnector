// Chart
import { Chart, ScatterDataPoint } from 'chart.js';

// Local
import {
    ChartData,
    ChartDataType,
    ChartPoint,
} from '../../../../utility/models';
import { NumHelper } from '../../../../utility/number_helper';
import { TimeChartType } from '../../../../utility/types';

// interfaces

export interface ChartDataProps {
    chart: TimeChartType;
    refreshRate: number;
}

const sizeOfArray = 600;

const fakeChartGenerator = (props: ChartDataProps): ChartData => {
    const chart = props.chart;
    const parametersNum = chart.data.datasets?.length;

    const chartData: ChartData = {
        startTimer: (): any => {
            const counter: number[] = new Array(parametersNum).fill(0);
            const randValues: number[] = new Array(parametersNum).fill(0);

            chart.data.datasets?.forEach((dataset) => {
                dataset.data = NumHelper.generateRandomPoints(
                    sizeOfArray
                ) as any;
            });

            chart.update();
            const timerId = setInterval(() => {
                chart.data.datasets?.forEach((dataset, index) => {
                    const dataList: ChartPoint[] = dataset.data as any;

                    if (counter[index]++ > 100) {
                        randValues[index] = NumHelper.getRandomInRange(0, 100);
                        counter[index] = 0;
                    }

                    if (dataList.length > sizeOfArray) {
                        dataList.pop();
                    }

                    dataList.unshift({
                        y: new Date(Date.now()),
                        x: randValues[index],
                    });
                });
                chart.update();
            }, props.refreshRate);
            return timerId;
        },
    };
    return chartData;
};

export const getChartData = (props: ChartDataProps, type: ChartDataType) => {
    switch (type) {
        case ChartDataType.Fake:
            return fakeChartGenerator(props);
        default:
            throw new Error('error in get chart data');
    }
};
