// react
import React, { Fragment, useEffect, useRef, useState } from 'react';

// atlassian
import Drawer from '@atlaskit/drawer';
import { token } from '@atlaskit/tokens';
import Tabs, { Tab, TabList, TabPanel } from '@atlaskit/tabs';
import { Stack, Box, xcss, Inline, Grid, Text } from '@atlaskit/primitives';

// local
import { TimeChartProp } from './time_charts';
import { ColorBox } from '../../../common/colorbox';
import { ColorHelper } from '../../../../utility/color_helper';
import { Parameters } from '../../../common/parameters';
import { ParameterData } from '../../../../models/parameters/parameter_data';
import { UnitStaticCategories } from '../../../../models/units/unit-static-category';
import { ColorBoxChangeEvent } from '../../../../types/colorbox';
import { ReactSetter } from '../../../../types/setter';
import { ChartComponentParameters } from '../../../../models/parameters/chart-component-parameter';
import { NumHelper } from '../../../../utility/number_helper';
import { ParameterHelper } from '../../../../utility/parameter-helper';

// interface

export interface ChartSettingsProps extends TimeChartProp {
    open: boolean;
    setOpen: ReactSetter<boolean>;

    stringsColor: string;
    handleStringsColor: ColorBoxChangeEvent;

    parameters: ParameterData | undefined;

    units: UnitStaticCategories[] | undefined;
}

//
export const ChartSettings = (props: ChartSettingsProps) => {
    const components: ChartComponentParameters = {
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
    };

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

    const parameters = () => {
        return (
            <Parameters
                components={components}
                parameters={props.parameters}
                units={props.units}
                defaultComponent={ParameterHelper.getDefaultChartParameter()}
            />
        );
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
                            colors={ColorHelper.getAllColors()}
                        />
                    </Grid>
                </Grid>
            </Stack>
        );
    };

    const tabs = () => {
        return (
            <Tabs id="chart_settings_id">
                <TabList>
                    <Tab>Parameters</Tab>
                    <Tab>Others</Tab>
                </TabList>

                <TabPanel>{parameters()}</TabPanel>
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
