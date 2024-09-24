// icons
import SettingsIcon from '@atlaskit/icon/glyph/settings';
import ArrowUpCircleIcon from '@atlaskit/icon/glyph/arrow-up-circle';
import ArrowDownCircleIcon from '@atlaskit/icon/glyph/arrow-down-circle';

// React
import React, { useCallback, useEffect, useRef, useState } from 'react';

// atlassian
import { Box, Flex, Inline, Stack, xcss, Text } from '@atlaskit/primitives';
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

// TimeChart
export const TimeChart = (props: TimeChartProp) => {
    const [openSettings, setOpenSettings] = useState(false);

    const canvasChartRef = useRef<HTMLCanvasElement>(null);
    const gridLinesColor = '#9FADBC1F';
    const [textColor, setTextColor] = useState(colors.DN400);
    const tooltipLineHoverColor = textColor;
    const textFontSize = 12;
    const [chart, setChart] = useState<TimeChartType | undefined>(undefined);
    const [timerID, setTimerID] = useState<string | undefined>(undefined);
    const [showSettingsIcon, setShowSettings] = useState(false);

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

        setChart(createChart());
    }, []);

    useEffect(() => {
        if (chart === undefined) return;

        if (timerID !== undefined) clearInterval(timerID);

        setTimerID(
            getChartDataReceiver(
                { chart, refreshRate: 1000 },
                ChartDataType.Fake
            ).startTimer()
        );
    }, [chart]);

    useEffect(() => {
        return () => {
            clearInterval(timerID);
        };
    }, [timerID]);

    useEffect(() => {
        if (chart === undefined) return;

        updateChartLines({
            chart,
            components,
        });

        setTimerID(
            getChartDataReceiver(
                { chart, refreshRate: 1000 },
                ChartDataType.Fake
            ).startTimer()
        );
    }, [props.updateLayout]);

    const handleTextColor: ColorBoxChangeEvent = (color) => {
        setTextColor(color);
        ChartPlugins.updateTextColor(color);
    };

    const destroyChart = () => {
        chart?.destroy();
        setChart(undefined);
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
        if (showSettingsIcon)
            return (
                <Flex
                    xcss={xcss({
                        right: '0',
                        alignItems: 'end',
                        zIndex: 'layer',
                        position: 'absolute',
                    })}>
                    <IconButton
                        id={props.settings_id}
                        appearance="primary"
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
                </Flex>
            );
        return <></>;
    };

    const numericPart = () => {
        return (
            <Box
                as="div"
                xcss={xcss({
                    display: 'block',
                    position: 'relative',
                    overflowY: 'auto',
                })}>
                {settingsItems()}
                {components.elements.map((c) => {
                    return (
                        <Inline
                            alignInline="center"
                            alignBlock="center"
                            xcss={xcss({
                                borderBottomColor: c.color,
                                borderBottomWidth: '3px',
                                borderBottomStyle: 'solid',

                                width: '100%',
                                padding: 'space.025',
                            })}>
                            <Flex
                                justifyContent="start"
                                xcss={xcss({
                                    flex: '0 1 20%',
                                })}>
                                <ArrowDownCircleIcon label="" />
                                <Box xcss={xcss({ margin: 'space.025' })}>
                                    {c.min}
                                </Box>
                            </Flex>
                            <Flex
                                justifyContent="center"
                                xcss={xcss({
                                    flex: '0 1 60%',
                                })}>
                                <Box xcss={xcss({ margin: 'space.025' })}>
                                    {c.showName}
                                </Box>
                            </Flex>
                            <Flex
                                justifyContent="end"
                                xcss={xcss({
                                    flex: '0 1 20%',
                                })}>
                                <Box xcss={xcss({ margin: 'space.025' })}>
                                    {c.max}
                                </Box>
                                <ArrowUpCircleIcon label="" />
                            </Flex>
                        </Inline>
                    );
                })}
            </Box>
        );
    };

    // return
    return (
        <Stack
            xcss={xcss({
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
            })}>
            <Box
                onMouseEnter={(e) => {
                    setShowSettings(true);
                }}
                onMouseLeave={(e) => {
                    setShowSettings(false);
                }}
                as="div"
                xcss={xcss({
                    width: '100%',

                    borderColor: 'color.border.accent.gray',
                    borderWidth: '1px',
                    borderStyle: 'solid',

                    borderBottomWidth: '0px',

                    height: '200px',
                    position: 'relative',
                    overflowY: 'auto',
                })}>
                {numericPart()}
            </Box>
            <Box
                xcss={xcss({
                    width: '100%',
                    flex: '1',
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
        </Stack>
    );
};
