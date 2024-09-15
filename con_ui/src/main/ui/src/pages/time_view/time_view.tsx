// css
import '@atlaskit/css-reset';

// icons

//
import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Box, xcss } from '@atlaskit/primitives';

// local
import { CommonProps } from '../../utility/common_props';
import { MsgType, AlertMsgType, ThemeType } from '../../utility/types';
import { ThemeHelper } from '../../utility/theme_helper';
import { SignalrService } from '../../utility/signalr_service';
import { InitTheme } from '../../header/theme';
import { Constant } from '../../utility/constants';
import { TimeHelper } from '../../utility/time_helper';
import { QueryParametersHelper } from '../../utility/params_helper';
import { OneChartLayout } from './one_chart_layout';
import { WellData } from '../../models/welldata';
import { UnitStaticCategories } from '../../models/units/unit-static-category';
import { ParameterData } from '../../models/parameters/parameter_data';
import { Timelayouts } from '../../models/time-layouts';

export interface TimeViewProps extends CommonProps {}

//
const TimeView = (props: TimeViewProps) => {
    const [showSpinner, setShowSpinner] = useState<MsgType>('');
    const [updateParent, setUpdateParent] = useState(false);
    const [count, setCount] = useState(0);
    const [well, setWell] = useState<WellData>();
    const [parameterData, setParameterData] = useState<
        ParameterData | undefined
    >();
    const [units, setUnits] = useState<UnitStaticCategories[] | undefined>();
    const [alertMsg, setAlertMsg] = useState<AlertMsgType>([]);
    const [theme, setTheme] = useState<ThemeType>(ThemeHelper.getTheme());
    const [pathItems, setPathItems] = useState<string[]>([]);

    useEffect(() => {
        props.signalRService.callbacks(
            async () => {
                await loadPageInitData();
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
                await loadPageInitData();
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

    useEffect(() => {
        loadPageConfigure();
    }, [well]);

    useEffect(() => {
        loadUnits();
    }, [parameterData]);

    const loadPageInitData = async () => {
        await loadWell();
    };

    const loadUnits = async () => {
        if (props.signalRService.connected()) {
            const u = await props.signalRService.loadUnits();
            console.log(u);
            setUnits(u);
        }
    };

    const loadPageConfigure = async () => {
        if (props.signalRService.connected()) {
            if (well === undefined) return;
            const pageConfig = await props.signalRService.pageConfig(well.ID);
            setParameterData(pageConfig);
        }
    };

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
                return (
                    <OneChartLayout
                        units={units}
                        parameters={parameterData}
                        {...props}
                    />
                );
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
