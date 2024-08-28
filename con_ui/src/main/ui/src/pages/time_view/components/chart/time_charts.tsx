// icons

// atlassian
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Box, xcss } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';
import { colors } from '@atlaskit/theme';

// chart
import {
    Chart,
    ChartData,
    ChartOptions,
    registerables,
    ChartType,
    Plugin,
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import 'chartjs-plugin-streaming';
import ChartStreaming from 'chartjs-plugin-streaming';

// local
import { BaseLayoutProps } from '../../base_layout_props';
import { NumHelper } from '../../../../utility/number_helper';
import { ColorHelper } from '../../../../utility/color_helper';

// props
export interface TimeChartProp extends BaseLayoutProps {}

const sizeOfArray = 3600;
const chartScale = 3600_000;

// TimeChart
export const TimeChart = (props: TimeChartProp) => {
    const canvasChartRef = useRef<HTMLCanvasElement>(null);
    const gridLinesColor = '#9FADBC1F';
    const textColor = colors.DN400;
    const textFontSize = 12;

    // effects
    const tickLables = (chart: Chart) => {
        const ctx = chart.ctx;
        const xScale = chart.scales.x;
        const yScale = chart.scales.y;

        ctx.save();
        ctx.fillStyle = textColor;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.font = `${textFontSize}px Arial`;

        yScale.ticks.forEach((tick, index) => {
            if ((index < 3 && index !== 0) || (index >= 3 && index % 3 !== 0))
                return;
            const x = xScale.getPixelForValue(xScale.min);
            const y = yScale.getPixelForTick(index);

            const date = new Date(tick.value);
            const label = `${date.getHours().toString().padStart(2, '0')}:${date
                .getMinutes()
                .toString()
                .padStart(2, '0')}`;

            if (length === undefined) return;
            ctx.fillText(label, x, y - 10);
        });

        ctx.restore();
    };

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
                type: 'realtime',
                time: {
                    unit: 'minute',
                },
                realtime: {
                    duration: chartScale,
                    refresh: 1000,
                    delay: 1000,
                },
                grid: {
                    drawOnChartArea: true,
                    drawTicks: false,
                    color: gridLinesColor,
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
                    color: gridLinesColor,
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
            streaming: {
                duration: chartScale,
                frameRate: 30,
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
            Chart.register(ChartStreaming);
            const chart = new Chart(ctx, {
                type: 'line',
                data: lines,
                options: chartOptions,
                plugins: [
                    {
                        id: 'timeLablePlugin',
                        beforeDraw: tickLables,
                    },
                ],
            });

            const now = Date.now();

            let randValue = NumHelper.getRandomInRange(0, 100);
            const dataList = Array.from({ length: sizeOfArray + 1 }, (_, i) => {
                if (i % 50 === 0)
                    randValue = NumHelper.getRandomInRange(0, 100);
                return {
                    y: new Date(now - i * 1000),
                    x: randValue,
                } as any;
            });

            chart.data.datasets[0].data = dataList;
            chart.update();
            let counter = 0;
            setInterval(() => {
                if (counter++ > 100) {
                    randValue = NumHelper.getRandomInRange(0, 100);
                    counter = 0;
                }
                const newPoint = {
                    y: Date.now(),
                    x: randValue,
                };
                if (dataList.length > sizeOfArray) {
                    dataList.pop();
                }
                dataList.unshift(newPoint);
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
                    paddingBottom: 'space.0',
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
                    padding: 'space.0',

                    overflow: 'hidden',
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
