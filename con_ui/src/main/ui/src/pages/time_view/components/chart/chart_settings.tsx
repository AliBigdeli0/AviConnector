// react
import React, { Fragment, useEffect, useRef } from 'react';
import { css, jsx } from '@emotion/react';

// atlassian
import Drawer from '@atlaskit/drawer';
import { token } from '@atlaskit/tokens';
import Tabs, { Tab, TabList, TabPanel } from '@atlaskit/tabs';

// local
import { TimeChartProp } from './time_charts';
import { ReactSetter } from '../../../../utility/types';

// interface

export interface ChartSettingsProps extends TimeChartProp {
    open: boolean;
    setOpen: ReactSetter<boolean>;
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

    const tabs = () => {
        return (
            <Tabs id="chart_settings_id">
                <TabList>
                    <Tab>Lines</Tab>
                    <Tab>Parameters</Tab>
                    <Tab>Total</Tab>
                </TabList>

                <TabPanel>lines</TabPanel>
                <TabPanel>parameters</TabPanel>
                <TabPanel>total</TabPanel>
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
