// chart
import { Chart, ChartEvent, ChartOptions } from 'chart.js';

// local
import { ChartPoint } from '../../../../utility/models';
import { TimeHelper } from '../../../../utility/time_helper';
import { setLastEvent } from './chart_shared';

export interface ChartOptionProps {
    gridLinesColor: string;
    chartScale: number;
}

export const getChartOption = (
    props: ChartOptionProps
): ChartOptions<'line'> => {
    return {
        responsive: true,
        layout: {
            padding: 0,
        },
        scales: {
            y: {
                type: 'time',
                time: {
                    unit: 'minute',
                },
                grid: {
                    drawOnChartArea: true,
                    drawTicks: false,
                    color: props.gridLinesColor,
                },
                title: {
                    display: false,
                },
                ticks: {
                    display: false,
                    padding: 0,
                    autoSkipPadding: 0,
                    autoSkip: true,
                },
            },
            x: {
                type: 'linear',
                beginAtZero: true,
                min: 0,
                max: 100,
                grid: {
                    drawOnChartArea: true,
                    drawTicks: false,
                    color: props.gridLinesColor,
                },
                title: {
                    display: false,
                },
                ticks: {
                    display: false,
                    padding: 0,
                },
            },
        },
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                mode: 'index',
                callbacks: {
                    title: (tooltipeItems) => {
                        const data = tooltipeItems[0].raw as ChartPoint;
                        return `Time: ${TimeHelper.showTime(data.y)}`;
                    },
                    label: (tooltipItem) => {
                        const label = tooltipItem.dataset.label;
                        return `${label} : ${(
                            tooltipItem.raw as ChartPoint
                        ).x.toFixed(2)}`;
                    },
                    afterLabel: (_tooltipItem) => {
                        return '';
                    },
                },
            },
            streaming: {
                duration: props.chartScale,
                // frameRate: 30,
            },
        },
        animation: {
            duration: 0,
        },
        events: ['mouseleave', 'mousemove'],
        onHover: (event: ChartEvent, chartElement) => {
            const chart: Chart = (event as any).chart;
            setLastEvent(event);
            /* emtpy */
        },
    };
};
