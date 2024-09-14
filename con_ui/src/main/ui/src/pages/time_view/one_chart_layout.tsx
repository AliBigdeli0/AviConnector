// icons

// react elements
import React from 'react';

// atlassian
import { Grid, Stack } from '@atlaskit/primitives';
import { Box, Inline, Text, xcss } from '@atlaskit/primitives';

// internal
import { BaseLayoutProps } from './base_layout_props';
import { TimeChart } from './components/chart/time_charts';
import { ParameterData } from '../../utility/models';

// props
export interface OneChartLayoutProps extends BaseLayoutProps {
    parameters: ParameterData | undefined;
}

//
export const OneChartLayout = (props: OneChartLayoutProps) => {
    const scrollView = () => {
        return (
            <Box
                xcss={xcss({
                    backgroundColor: 'color.background.accent.blue.bolder',
                    width: '100%',
                    height: '100%',
                })}></Box>
        );
    };

    const numberView = () => {
        return (
            <Box
                xcss={xcss({
                    backgroundColor: 'color.background.accent.red.bolder',
                    width: '100%',
                    height: '100%',
                })}>
                <Box
                    xcss={xcss({
                        backgroundColor:
                            'color.background.accent.red.bolder.hovered',
                        width: '100%',
                        height: '15%',
                    })}>
                    three big numbers
                </Box>
                <Box
                    xcss={xcss({
                        backgroundColor: 'color.background.accent.red.subtle',
                        width: '100%',
                        height: '15%',
                    })}></Box>
                <Box
                    xcss={xcss({
                        backgroundColor: 'color.background.accent.blue.subtler',
                        width: '100%',
                        height: '15%',
                    })}>
                    part 3
                </Box>
                <Box
                    xcss={xcss({
                        backgroundColor: 'color.background.accent.blue.bolder',
                        width: '100%',
                        height: '15%',
                    })}>
                    part 4
                </Box>
                <Box
                    xcss={xcss({
                        backgroundColor:
                            'color.background.accent.blue.subtle.hovered',
                        width: '100%',
                        height: '15%',
                    })}>
                    part 5
                </Box>
                <Box
                    xcss={xcss({
                        backgroundColor: 'color.background.accent.green.bolder',
                        width: '100%',
                        height: '25%',
                    })}>
                    part 6
                </Box>
            </Box>
        );
    };

    const chartView = () => {
        return (
            <Box
                xcss={xcss({
                    width: '100%',
                    height: '100%',
                    padding: 'space.025',
                })}>
                <TimeChart {...props} />
            </Box>
        );
    };

    return (
        <Grid
            id="main_one_chart_layout"
            gap="space.0"
            alignItems="center"
            xcss={xcss({
                height: '100%',
            })}>
            <Grid
                templateColumns="1fr 1fr 10px"
                gap="space.025"
                xcss={xcss({
                    height: '100%',
                })}>
                {chartView()}
                {numberView()}
                {scrollView()}
            </Grid>
        </Grid>
    );
};
