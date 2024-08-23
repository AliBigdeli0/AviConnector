import '../../assets/scss/home.css';
import '@atlaskit/css-reset';

//
// do not remove this
import React, { useEffect, useState } from 'react';

import { createRoot } from 'react-dom/client';
import { Box, xcss } from '@atlaskit/primitives';

import { InitTheme } from '../../header/theme';
import { CommonProps } from '../../utility/common_props';
import { MsgType, AlertMsgType } from '../../utility/types';
import { Constant } from '../../utility/constants';
import { SignalrService } from '../../utility/signalr_service';
import { WellData } from '../../utility/models';
import { TimeHelper } from '../../utility/time_helper';

export interface HomeProps extends CommonProps {}

const Home = (props: HomeProps) => {
    const [showSpinner, setShowSpinner] = useState<MsgType>('');
    const [updateParent, setUpdateParent] = useState(false);
    const [alertMsg, setAlertMsg] = useState<AlertMsgType>([]);
    const [wells, setWells] = useState<WellData[]>([]);
    const pathItems = ['Home'];

    //
    useEffect(() => {
        props.signalRService.callbacks(
            async () => {
                await loadWells();
                setShowSpinner('');
            },
            async () => {
                setShowSpinner('Problem In Connection!');
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
                await loadWells();
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

        return () => {
            /*nothing*/
        };
    }, []);

    const loadWells = async () => {
        if (props.signalRService.connected()) {
            const rwells = await props.signalRService.wells();
            console.log('wells recieved: ', rwells);
            setWells(rwells);
        }
    };

    //
    return (
        <InitTheme
            showSpinner={showSpinner}
            newAlerts={alertMsg}
            setNewAlerts={setAlertMsg}
            update={updateParent}
            setUpdate={setUpdateParent}
            PathItems={pathItems}
            {...props}
            inside={
                <Box
                    id="main_home"
                    padding="space.100"
                    xcss={xcss({
                        height: `calc(100vh - ${Constant.MenuSize + 3}px)`,
                    })}></Box>
            }
        />
    );
};

const domNode = document.getElementById('root');
if (domNode !== null) {
    const root = createRoot(domNode);

    const signalRService = new SignalrService();
    root.render(<Home signalRService={signalRService} />);
}
