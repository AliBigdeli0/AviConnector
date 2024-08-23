import '../../assets/scss/home.css';
import '@atlaskit/css-reset';
// icons
import RecentIcon from '@atlaskit/icon/glyph/recent';
import EditorNumberListIcon from '@atlaskit/icon/glyph/editor/number-list';

//
// do not remove this
import React, { useEffect, useState } from 'react';

import { createRoot } from 'react-dom/client';
import { Box, xcss } from '@atlaskit/primitives';
import TableTree, {
    Cell,
    Header,
    Headers,
    Row,
    Rows,
} from '@atlaskit/table-tree';
import Tabs, { Tab, TabList, TabPanel } from '@atlaskit/tabs';
import { IconButton } from '@atlaskit/button/new';

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
    const wellsTab = () => {
        const online = wells.filter((well) => !well.IsOffline);
        const archived = wells.filter((well) => well.IsOffline);
        return (
            <Box>
                <Tabs id="wells_tab">
                    <TabList>
                        <Tab>Online Wells</Tab>
                        <Tab>Archived Wells</Tab>
                    </TabList>
                    <TabPanel>{showWellsOnTable(online)}</TabPanel>
                    <TabPanel>{showWellsOnTable(archived)}</TabPanel>
                </Tabs>
            </Box>
        );
    };

    const showWellsOnTable = (wellsToShow: WellData[]) => {
        return (
            <Box
                as="div"
                xcss={xcss({
                    width: '100%',
                })}>
                <TableTree>
                    <Headers>
                        <Header width={150}>Status</Header>
                        <Header width={150}>Name</Header>
                        <Header width={150}>Rig Name</Header>
                        <Header width={150}>ID</Header>
                        <Header width={150}>IP</Header>
                        <Header width={150}>Live View</Header>
                        <Header width={150}>Depth View</Header>
                    </Headers>
                    <Rows
                        items={wellsToShow}
                        render={(data: WellData) => (
                            <Row items={[]} hasChildren={false}>
                                <Cell>{data.ID}</Cell>
                                <Cell>{data.Name}</Cell>
                                <Cell>{data.AliasWellName}</Cell>
                                <Cell>{data.ID}</Cell>
                                <Cell>{data.IP}</Cell>
                                <Cell>
                                    {
                                        <IconButton
                                            icon={RecentIcon}
                                            label="Live View"
                                        />
                                    }
                                </Cell>
                                <Cell>
                                    {
                                        <IconButton
                                            icon={EditorNumberListIcon}
                                            label="Depth View"
                                        />
                                    }
                                </Cell>
                            </Row>
                        )}></Rows>
                </TableTree>
            </Box>
        );
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
                    })}>
                    {wellsTab()}
                </Box>
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
