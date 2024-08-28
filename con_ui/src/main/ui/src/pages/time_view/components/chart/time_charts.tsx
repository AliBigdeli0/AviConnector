// icons

// atlassian
import React, { useEffect, useRef } from 'react';
import { Box, xcss } from '@atlaskit/primitives';
import { colors } from '@atlaskit/theme';

// chart
import { Chart, registerables } from 'chart.js';
import 'chartjs-adapter-date-fns';
import 'chartjs-plugin-streaming';
import ChartStreaming from 'chartjs-plugin-streaming';

// local
import { BaseLayoutProps } from '../../base_layout_props';
import { NumHelper } from '../../../../utility/number_helper';
import { getChartOption } from './chart_options';
import { chartPlugins } from './chart_plugins';
import { getChartLines } from './chart_lines';

// props
export interface TimeChartProp extends BaseLayoutProps {}

const sizeOfArray = 600;
const chartScale = 3600_000;

// TimeChart
export const TimeChart = (props: TimeChartProp) => {
    const canvasChartRef = useRef<HTMLCanvasElement>(null);
    const gridLinesColor = '#9FADBC1F';
    const textColor = colors.DN400;
    const textFontSize = 12;

    // effects
    useEffect(() => {
        const ctx = canvasChartRef.current?.getContext('2d');
        if (ctx) {
            Chart.register(...registerables);
            Chart.register(ChartStreaming);
            const chart = new Chart(ctx, {
                type: 'line',
                data: getChartLines({}),
                options: getChartOption({ chartScale, gridLinesColor }),
                plugins: chartPlugins({ textColor, textFontSize }),
            });

            chart.data.datasets[0].data = NumHelper.generateRandomPoints(
                sizeOfArray
            ) as any;
            chart.data.datasets[1].data = NumHelper.generateRandomPoints(
                sizeOfArray
            ) as any;
            chart.update();

            const counter: number[] = new Array(2).fill(0);
            const randValues: number[] = new Array(2).fill(0);
            const timerID = setInterval(() => {
                chart.data.datasets.forEach((item, index) => {
                    const dataList = item.data;

                    if (counter[index]++ > 100) {
                        randValues[index] = NumHelper.getRandomInRange(0, 100);
                        counter[index] = 0;
                    }
                    if (dataList.length > sizeOfArray) {
                        dataList.pop();
                    }

                    dataList.unshift({ y: Date.now(), x: randValues[index] });
                });
                chart.update();
            }, 1000);

            return () => {
                clearInterval(timerID);
            };
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
