// css
import '@atlaskit/css-reset';

// icons

//
import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { token } from '@atlaskit/tokens';
import { Box, Inline, Text, xcss } from '@atlaskit/primitives';
import { HeadType, RowType } from '@atlaskit/dynamic-table/types';
import Tabs, { Tab, TabList, TabPanel } from '@atlaskit/tabs';
import Button, { IconButton } from '@atlaskit/button/new';
import DynamicTable from '@atlaskit/dynamic-table';
import Tooltip from '@atlaskit/tooltip';
import Textfield from '@atlaskit/textfield';

//
import { CommonProps } from '../../utility/common_props';
import { MsgType, AlertMsgType, ThemeType } from '../../utility/types';
import { ServerLiveModel, Timelayouts, WellData } from '../../utility/models';
import { ThemeHelper } from '../../utility/theme_helper';
import { SignalrService } from '../../utility/signalr_service';
import { InitTheme } from '../../header/theme';
import { Constant } from '../../utility/constants';
import { TimeHelper } from '../../utility/time_helper';
import { QueryParametersHelper } from '../../utility/params_helper';
import { OneChartLayout } from './one_chart_layout';

export interface TimeViewProps extends CommonProps {}

//
const TimeView = (props: TimeViewProps) => {
    const [showSpinner, setShowSpinner] = useState<MsgType>('');
    const [updateParent, setUpdateParent] = useState(false);
    const [count, setCount] = useState(0);
    const [well, setWell] = useState<WellData>();
    const [alertMsg, setAlertMsg] = useState<AlertMsgType>([]);
    const [theme, setTheme] = useState<ThemeType>(ThemeHelper.getTheme());
    const [pathItems, setPathItems] = useState<string[]>([]);

    useEffect(() => {
        props.signalRService.callbacks(
            async () => {
                await loadWell();
                setShowSpinner('');
            },
            async () => {
                setShowSpinner('Connection Problem!');
                await TimeHelper.delay(4000);
                await props.signalRService.restart();
            },
            async (err) => {
                console.error(err);
                setShowSpinner('Disconnected!');
                await TimeHelper.delay(4000);
                await props.signalRService.restart();
            },
            async () => {
                setShowSpinner('');
                await loadWell();
            },
            (err) => {
                console.error(err);
                setShowSpinner('Reconnecting!');
            }
        );
        const asyncStart = async () => {
            await props.signalRService.restart();
        };

        asyncStart();
    }, []);

    const loadWell = async () => {
        if (props.signalRService.connected()) {
            const wellId = QueryParametersHelper.getParameter('well_id');
            if (wellId !== null) {
                const rwells = await props.signalRService.wells();
                const w = rwells.find((we) => we.ID === wellId);
                if (w === undefined) {
                    window.location.href = '/';
                } else {
                    console.log('current well for time page is : ', w);
                    const pathI = [];
                    pathI.push(w.AliasWellName);
                    pathI.push(w.Name);
                    setPathItems(pathI);
                    setWell(w);
                }
            }
        }
    };

    const mainLayout = (layout: Timelayouts) => {
        switch (layout) {
            case Timelayouts.OnChartLayout:
                return <OneChartLayout {...props} />;
            case Timelayouts.TwoChartLayout:
                return <></>;
            default:
                return <>Invalid Layout</>;
        }
    };

    return (
        <>
            <input type="hidden" value={`${count}`}></input>
            <InitTheme
                showSpinner={showSpinner}
                //
                newAlerts={alertMsg}
                setNewAlerts={setAlertMsg}
                //
                update={updateParent}
                setUpdate={setUpdateParent}
                //
                PathItems={pathItems}
                //
                themeType={theme}
                setThemeType={setTheme}
                //
                {...props}
                inside={
                    <Box
                        id="main_home"
                        padding="space.100"
                        xcss={xcss({
                            height: `calc(100vh - ${Constant.MenuSize + 3}px)`,
                        })}>
                        {mainLayout(Timelayouts.OnChartLayout)}
                    </Box>
                }
            />
        </>
    );
};

const domNode = document.getElementById('root');
if (domNode !== null) {
    const root = createRoot(domNode);

    const signalRService = new SignalrService();
    root.render(<TimeView signalRService={signalRService} />);
}
