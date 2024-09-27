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
import { ParameterHelper } from '../../../../utility/parameter-helper';

// interface

export interface ChartSettingsProps extends TimeChartProp {
    open: boolean;
    setOpen: ReactSetter<boolean>;

    handleTextColor: ColorBoxChangeEvent;

    components: ChartComponentParameters;
    setComponents: ReactSetter<ChartComponentParameters>;

    parameters: ParameterData | undefined;

    units: UnitStaticCategories[] | undefined;
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

    const parameters = () => {
        return (
            <Parameters
                components={props.components}
                parameters={props.parameters}
                units={props.units}
                defaultComponent={ParameterHelper.getDefaultChartParameter()}
                onChange={(type, param) => {
                    switch (type) {
                        case 'add':
                        case 'delete':
                        case 'update':
                            props.setComponents(props.components);
                            props.setUpdateLayout(!props.updateLayout);
                            break;
                        default:
                            throw new Error(
                                `invalid type in change parameter, (${type})`
                            );
                            break;
                    }
                }}
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
                            current={props.components.textColor}
                            handleCurrentChange={props.handleTextColor}
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
