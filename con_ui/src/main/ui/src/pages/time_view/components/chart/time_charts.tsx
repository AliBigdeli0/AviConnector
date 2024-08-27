// icons

// atlassian
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Box, xcss } from '@atlaskit/primitives';

// chart
import { Chart, ChartData, ChartOptions, registerables } from 'chart.js';
import 'chartjs-adapter-date-fns';

// local
import { BaseLayoutProps } from '../../base_layout_props';
import { token } from '@atlaskit/tokens';

// props
export interface TimeChartProp extends BaseLayoutProps {}

function getRandomInRange(min: number, max: number): number {
    return Math.random() * (max - min) + min;
}

const sizeOfArray = 120;

// TimeChart
export const TimeChart = (props: TimeChartProp) => {
    const canvasChartRef = useRef<HTMLCanvasElement>(null);
    const backgrounColor = token('color.background.neutral');

    // effects

    const lines: ChartData<'line'> = {
        labels: [],
        datasets: [
            {
                data: [],
                fill: false,
                backgroundColor: 'red',
                borderColor: 'red',
                pointRadius: 1,
                tension: 0.1,
            },
        ],
    };

    const chartOptions: ChartOptions<'line'> = {
        responsive: true,
        layout: {
            padding: 0,
        },
        scales: {
            y: {
                type: 'time',
                time: {
                    unit: 'second',
                },
                grid: {
                    drawOnChartArea: true,
                    drawTicks: false,
                },
                title: {
                    display: false,
                },
                ticks: {
                    display: false,
                    stepSize: 9,
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
                enabled: false,
            },
        },
        animation: {
            duration: 0,
        },
    };

    useEffect(() => {
        const ctx = canvasChartRef.current?.getContext('2d');
        if (ctx) {
            Chart.register(...registerables);
            const chart = new Chart(ctx, {
                type: 'line',
                data: lines,
                options: chartOptions,
            });

            const now = Date.now();

            const dataList = Array.from(
                { length: sizeOfArray + 1 },
                (_, i) =>
                    ({
                        y: new Date(now - i * 1000),
                        x: getRandomInRange(0, 100),
                    } as any)
            );

            chart.data.datasets[0].data = dataList;
            chart.update();
            setInterval(() => {
                const newPoint = {
                    y: Date.now(),
                    x: getRandomInRange(0, 100),
                };
                dataList.unshift(newPoint);
                if (dataList.length > sizeOfArray) {
                    dataList.pop();
                }
                chart.update();
            }, 1000);
        }
    }, []);

    // return
    return (
        <>
            <Box
                xcss={xcss({
                    width: '100%',
                    height: '20%',
                    paddingLeft: 'space.050',
                    paddingRight: 'space.050',
                })}>
                <Box
                    xcss={xcss({
                        height: '100%',
                        backgroundColor: 'color.background.neutral',
                    })}>
                    numeric
                </Box>
            </Box>
            <Box
                xcss={xcss({
                    width: '100%',
                    height: '80%',
                    // backgroundColor: 'color.background.accent.blue.bolder',
                    padding: 'space.0',
                })}>
                <canvas
                    ref={canvasChartRef}
                    style={{
                        width: '100%',
                        height: '100%',
                        padding: 0,
                        margin: 0,
                    }}
                />
            </Box>
        </>
    );
};
