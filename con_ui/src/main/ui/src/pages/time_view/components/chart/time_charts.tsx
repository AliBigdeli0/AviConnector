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
import * as ChartPlugins from './chart_plugins';
import { getChartLines, updateChartLines } from './chart_lines';
import { getChartDataReceiver } from './chart_data';
import { ChartSettings } from './chart_settings';
import { ChartDataType } from '../../../../models/chart/chart_datatype';
import { ParameterData } from '../../../../models/parameters/parameter_data';
import { UnitStaticCategories } from '../../../../models/units/unit-static-category';
import { ColorBoxChangeEvent } from '../../../../types/colorbox';
import { TimeChartType } from '../../../../types/time-chart-type';
import { NumHelper } from '../../../../utility/number_helper';
import { ChartComponentParameters } from '../../../../models/parameters/chart-component-parameter';

// props
export interface TimeChartProp extends BaseLayoutProps {
    parameters: ParameterData | undefined;
    units: UnitStaticCategories[] | undefined;

    settings_id: string;
}

const chartScale = 3600_000;

let timerID: string | undefined = undefined;

let chart: TimeChartType | undefined = undefined;

// TimeChart
export const TimeChart = (props: TimeChartProp) => {
    const [openSettings, setOpenSettings] = useState(false);

    const canvasChartRef = useRef<HTMLCanvasElement>(null);
    const gridLinesColor = '#9FADBC1F';
    const [textColor, setTextColor] = useState(colors.DN400);
    const tooltipLineHoverColor = textColor;
    const textFontSize = 12;

    const [components, setComponents] = useState<ChartComponentParameters>({
        max: 8,
        id: props.settings_id + '_components',
        elements: [
            {
                id: NumHelper.generateUUID(),
                showName: 'Weight On Bit',
                dbCode: '0111',
                unitCategoryID: 3,
                unitID: 2,
                unitDefaultID: 2,
                color: 'red',
                max: 100,
                min: 1,
                stroke: 1,
            },
            {
                id: NumHelper.generateUUID(),
                showName: 'Hook Position',
                dbCode: '0112',
                unitCategoryID: 2,
                unitID: 3,
                unitDefaultID: 1,
                color: 'blue',
                max: 500,
                min: 100,
                stroke: 1,
            },
        ],
    });

    // effects
    useEffect(() => {
        destroyChart();

        chart = createChart();

        if (chart === undefined) return;

        timerID = getChartDataReceiver(
            { chart, refreshRate: 1000 },
            ChartDataType.Fake
        ).startTimer();

        return () => {
            clearInterval(timerID);
        };
    }, []);

    useEffect(() => {
        if (chart === undefined) return;

        updateChartLines({
            chart,
            components,
        });

        if (timerID !== undefined) clearInterval(timerID);

        timerID = getChartDataReceiver(
            { chart, refreshRate: 1000 },
            ChartDataType.Fake
        ).startTimer();

        return () => {
            clearInterval(timerID);
        };
    }, [props.updateLayout]);

    const handleTextColor: ColorBoxChangeEvent = (color) => {
        setTextColor(color);
        ChartPlugins.updateTextColor(color);
    };

    const destroyChart = () => {
        chart?.destroy();
        chart = undefined;
    };

    const createChart = (): TimeChartType | undefined => {
        const ctx = canvasChartRef.current?.getContext('2d');
        if (ctx) {
            Chart.register(...registerables);
            Chart.register(ChartStreaming);

            ChartPlugins.updateTextColor(textColor);
            ChartPlugins.updateTextFontSize(textFontSize);
            ChartPlugins.updateTooltipeLineHoverColor(tooltipLineHoverColor);

            const c: TimeChartType = new Chart(ctx, {
                type: 'line',
                data: getChartLines({ components, chart: undefined }),
                options: getChartOption({ chartScale, gridLinesColor }),
                plugins: ChartPlugins.createPlugins(),
            });
            return c;
        }
        return undefined;
    };

    const settingsItems = () => {
        return (
            <Box
                xcss={xcss({
                    position: 'absolute',
                    right: '0',

                    zIndex: 'layer',
                })}>
                <IconButton
                    id={props.settings_id}
                    appearance="subtle"
                    icon={SettingsIcon}
                    label=""
                    onClick={() => {
                        setOpenSettings(true);
                    }}></IconButton>

                <ChartSettings
                    open={openSettings}
                    setOpen={setOpenSettings}
                    stringsColor={textColor}
                    handleStringsColor={handleTextColor}
                    components={components}
                    setComponents={setComponents}
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
