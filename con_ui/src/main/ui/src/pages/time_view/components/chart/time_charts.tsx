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
import { getChartOption } from './chart_options';
import { chartPlugins } from './chart_plugins';
import { getChartLines } from './chart_lines';
import { getChartData } from './chart_data';
import { ChartDataType } from '../../../../utility/models';
import { TimeChartType } from '../../../../utility/types';

// props
export interface TimeChartProp extends BaseLayoutProps {}

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
            const chart: TimeChartType = new Chart(ctx, {
                type: 'line',
                data: getChartLines({}),
                options: getChartOption({ chartScale, gridLinesColor }),
                plugins: chartPlugins({ textColor, textFontSize }),
            });

            const timerID = getChartData(
                { chart, refreshRate: 1000 },
                ChartDataType.Fake
            ).startTimer();

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
