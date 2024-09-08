// icons
import CheckIcon from '@atlaskit/icon/glyph/check';

// react
import React, { Fragment, useEffect, useRef } from 'react';
import { css, jsx } from '@emotion/react';

// atlassian
import Drawer from '@atlaskit/drawer';
import { token } from '@atlaskit/tokens';
import Tabs, { Tab, TabList, TabPanel } from '@atlaskit/tabs';
import { Stack, Box, xcss, Inline, Grid, Text } from '@atlaskit/primitives';
import Button from '@atlaskit/button/new';

// local
import { TimeChartProp } from './time_charts';
import { ColorBoxChangeEvent, ReactSetter } from '../../../../utility/types';
import { ColorBox } from '../../../common/colorbox';

// interface

export interface ChartSettingsProps extends TimeChartProp {
    open: boolean;
    setOpen: ReactSetter<boolean>;

    stringsColor: string;
    handleStringsColor: ColorBoxChangeEvent;
}

//
export const ChartSettings = (props: ChartSettingsProps) => {
    const wrapperStyles: React.CSSProperties = {
        position: 'relative',
    };

    const contentStyles: React.CSSProperties = {
        padding: token('space.100', '8px'),
    };

    const headerStyles: React.CSSProperties = {
        padding: token('space.100', '8px'),
        position: 'sticky',
        backgroundColor: token('utility.elevation.surface.current', '#FFFFFF'),
        borderBlockEnd: `1px solid ${token('color.border', '#CCCCCC')}`,
        boxShadow: token(
            'elevation.shadow.overflow',
            '0px 0px 8px rgba(9, 30, 66, 0.16)'
        ),
        insetBlockStart: 0,
        insetInlineEnd: 0,
        insetInlineStart: 0,
    };

    const others = () => {
        return (
            <Stack xcss={xcss({ width: '100%', paddingTop: 'space.100' })}>
                <Grid xcss={xcss({ paddingBottom: 'space.050' })}>
                    <Grid templateColumns="1fr 3fr">
                        <Box
                            xcss={xcss({
                                alignContent: 'center',
                                verticalAlign: 'center',
                                alignItems: 'center',
                            })}>
                            <Text align="center">Strings Color</Text>
                        </Box>
                        <ColorBox
                            current={props.stringsColor}
                            handleCurrentChange={props.handleStringsColor}
                        />{' '}
                    </Grid>
                </Grid>
            </Stack>
        );
    };

    const tabs = () => {
        return (
            <Tabs id="chart_settings_id">
                <TabList>
                    <Tab>Lines</Tab>
                    <Tab>Parameters</Tab>
                    <Tab>Others</Tab>
                </TabList>

                <TabPanel>lines</TabPanel>
                <TabPanel>parameters</TabPanel>
                <TabPanel>{others()}</TabPanel>
            </Tabs>
        );
    };

    return (
        <Fragment>
            <Drawer
                onClose={() => props.setOpen(false)}
                isOpen={props.open}
                width="wide">
                <div style={wrapperStyles}>
                    <div style={headerStyles}>
                        <h1>Chart Settings</h1>
                    </div>
                    <div style={contentStyles}>{tabs()}</div>
                </div>
            </Drawer>
        </Fragment>
    );
};
