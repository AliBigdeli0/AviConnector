// icons
import SettingsIcon from '@atlaskit/icon/glyph/settings';

// React
import React, { useEffect, useRef, useState } from 'react';

// atlassian
import { Box, Stack, xcss } from '@atlaskit/primitives';
import { colors } from '@atlaskit/theme';
import { IconButton } from '@atlaskit/button/new';
import { token } from '@atlaskit/tokens';

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
import { getChartDataReceiver } from './chart_data';
import { ChartDataType } from '../../../../utility/models';
import { TimeChartType } from '../../../../utility/types';
import { ChartSettings } from './chart_settings';

// props
export interface TimeChartProp extends BaseLayoutProps {}

const chartScale = 3600_000;

// TimeChart
export const TimeChart = (props: TimeChartProp) => {
    const [openSettings, setOpenSettings] = useState(false);

    const canvasChartRef = useRef<HTMLCanvasElement>(null);
    const gridLinesColor = '#9FADBC1F';
    const textColor = colors.DN400;
    const tooltipLineHoverColor = textColor;
    const borderColor = textColor;
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
                plugins: chartPlugins({
                    textColor,
                    textFontSize,
                    tooltipLineHoverColor,
                }),
            });

            const timerID = getChartDataReceiver(
                { chart, refreshRate: 1000 },
                ChartDataType.Fake
            ).startTimer();

            return () => {
                clearInterval(timerID);
            };
        }
    }, []);

    const settingsItems = () => {
        return (
            <Box
                xcss={xcss({
                    position: 'absolute',
                    right: '0',

                    zIndex: 'layer',
                })}>
                <IconButton
                    appearance="subtle"
                    icon={SettingsIcon}
                    label=""
                    onClick={() => {
                        setOpenSettings(true);
                    }}></IconButton>

                <ChartSettings
                    open={openSettings}
                    setOpen={setOpenSettings}
                    {...props}
                />
            </Box>
        );
    };

    const numericPart = () => {
        return (
            <Box
                xcss={xcss({
                    width: '100%',
                    height: '20%',
                    borderColor: 'color.border.accent.gray',
                    borderWidth: '1px',
                    borderStyle: 'solid',

                    position: 'relative',
                    borderBottomWidth: '0px',
                })}>
                <Box
                    xcss={xcss({
                        backgroundColor: 'color.background.neutral',
                        margin: 'space.050',
                        height: '100%',

                        overflow: 'hidden',
                    })}>
                    {settingsItems()}
                    <Box xcss={xcss({})}>Numerics1</Box>
                    <Box xcss={xcss({})}>Numerics1</Box>
                    <Box xcss={xcss({})}>Numerics1</Box>
                    <Box xcss={xcss({})}>Numerics1</Box>
                    <Box xcss={xcss({})}>Numerics1</Box>
                    <Box xcss={xcss({})}>Numerics1</Box>
                    <Box xcss={xcss({})}>Numerics1</Box>
                    <Box xcss={xcss({})}>Numerics1</Box>
                </Box>
            </Box>
        );
    };

    // return
    return (
        <>
            {numericPart()}
            <Box
                xcss={xcss({
                    width: '100%',
                    height: '80%',
                    padding: 'space.0',

                    overflow: 'hidden',

                    borderColor: 'color.border.accent.gray',
                    borderWidth: '1px',
                    borderStyle: 'solid',

                    borderTopWidth: '0px',
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
