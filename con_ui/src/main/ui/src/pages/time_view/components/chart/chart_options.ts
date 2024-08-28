// chart
import { Chart, ChartEvent, ChartOptions } from 'chart.js';

// local
import { ChartPoint } from '../../../../utility/models';
import { TimeHelper } from '../../../../utility/time_helper';

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
                callbacks: {
                    title: (tooltipeItems) => {
                        const data = tooltipeItems[0].raw as ChartPoint;
                        return `Time: ${TimeHelper.showTime(data.y)}`;
                    },
                    label: (tooltipItem) => {
                        return `${(tooltipItem.raw as ChartPoint).x.toFixed(
                            2
                        )}`;
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
            if (event.y === null) return;

            chart.ctx.save();
            chart.ctx.beginPath();
            chart.ctx.moveTo(chart.chartArea.left, event.y);
            chart.ctx.lineTo(chart.chartArea.right, event.y);
            chart.ctx.lineWidth = 1;
            chart.ctx.strokeStyle = 'red';
            chart.ctx.stroke();
            chart.ctx.restore();
        },
    };
};
