import '../../assets/scss/home.css';
import '@atlaskit/css-reset';
// icons
import RecentIcon from '@atlaskit/icon/glyph/recent';
import EditorNumberListIcon from '@atlaskit/icon/glyph/editor/number-list';
import CrossCircleIcon from '@atlaskit/icon/glyph/cross-circle';
import CheckCircleIcon from '@atlaskit/icon/glyph/check-circle';

//
// do not remove this
import React, { useEffect, useMemo, useState } from 'react';
// tslint:disable:no-var-requires
const dayjs = require('dayjs');

//
import { createRoot } from 'react-dom/client';
import { Box, xcss } from '@atlaskit/primitives';
import { HeadType, RowType } from '@atlaskit/dynamic-table/types';
import Tabs, { Tab, TabList, TabPanel } from '@atlaskit/tabs';
import Button, { IconButton } from '@atlaskit/button/new';
import DynamicTable from '@atlaskit/dynamic-table';
import Tooltip from '@atlaskit/tooltip';

//
import { InitTheme } from '../../header/theme';
import { CommonProps } from '../../utility/common_props';
import { MsgType, AlertMsgType } from '../../utility/types';
import { Constant } from '../../utility/constants';
import { SignalrService } from '../../utility/signalr_service';
import { ServerLiveModel, WellData } from '../../utility/models';
import { TimeHelper } from '../../utility/time_helper';
import { StringHelper } from '../../utility/string_helper';

//
export interface HomeProps extends CommonProps {}

const Home = (props: HomeProps) => {
    const [showSpinner, setShowSpinner] = useState<MsgType>('');
    const [updateParent, setUpdateParent] = useState(false);
    const [update, setUpdate] = useState(false);
    const [count, setCount] = useState(0);
    const [wells, setWells] = useState<WellData[]>([]);
    const [alertMsg, setAlertMsg] = useState<AlertMsgType>([]);

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

        getActivityCode();
    }, []);

    useEffect(() => {
        const timerId = setInterval(async () => {
            await getActivityCode();
            setUpdate(!update);
            setCount(count + 1);
        }, 5000);

        return () => {
            clearInterval(timerId);
        };
    }, [count]);

    const getActivityCode = async () => {
        const liveModels = wells
            .filter((well) => !well.IsOffline)
            .map((well) => {
                const params: { [key: string]: string } = {};
                params[Constant.ActivityCode] = '';

                const live: ServerLiveModel = {
                    well_id: well.ID,
                    parameters: params,
                    times: {},
                };
                return live;
            });

        try {
            const serverBulkData = await props.signalRService.bulkLive(
                liveModels
            );

            serverBulkData.forEach((live) => {
                const well = wells.find((w) => w.ID === live.wellId);
                if (well !== undefined) well.LiveData = live;
            });
        } catch (err) {
            console.error(err);
        }
    };

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
                    <TabPanel>
                        {showWellsOnDynamicTable('Online Wells', online)}
                    </TabPanel>
                    <TabPanel>
                        {showWellsOnDynamicTable('Archived Wells', archived)}
                    </TabPanel>
                </Tabs>
            </Box>
        );
    };

    const showWellTime = (well: WellData) => {
        if (well.LiveData === undefined || well.LiveData === null) return '';
        const activityTime = new dayjs(
            well.LiveData?.liveTimes[Constant.ActivityCode]
        );

        return `last registered time: ${activityTime.format(
            'YYYY-MM-DD HH:mm:ss'
        )}`;
    };

    const hasTimeReached = (well: WellData) => {
        if (well.LiveData === undefined || well.LiveData === null) return true;
        const liveTime = new dayjs(well.LiveData?.timeString);

        const activityTime = new dayjs(
            well.LiveData?.liveTimes[Constant.ActivityCode]
        );

        const diffTime = Math.abs(liveTime.diff(activityTime, 'milliseconds'));
        console.log(well.Name, ':', diffTime);
        return diffTime >= Constant.FiveMinutes;
    };

    const showWellIcon = (well: WellData) => {
        return hasTimeReached(well) ? CrossCircleIcon : CheckCircleIcon;
    };

    const showWellColor: (well: WellData) => 'danger' | 'default' = (
        well: WellData
    ) => {
        return hasTimeReached(well) ? 'danger' : 'default';
    };

    const showWellsOnDynamicTable = (
        caption: string,
        wellsToShow: WellData[]
    ) => {
        const header: HeadType = {
            cells: [
                {
                    content: <>Status</>,
                },
                {
                    content: <>Name</>,
                },
                {
                    content: <>Rig Name</>,
                },
                {
                    content: <>ID</>,
                },
                {
                    content: <>IP</>,
                },
                {
                    content: <>Time View</>,
                },
                {
                    content: <>Depth View</>,
                },
            ],
        };

        const rows: RowType[] = [];

        wellsToShow.forEach((well) => {
            rows.push({
                cells: [
                    {
                        content: (
                            <Tooltip content={showWellTime(well)}>
                                <Button
                                    iconBefore={showWellIcon(well)}
                                    appearance={showWellColor(well)}>
                                    {StringHelper.activityConverter(
                                        well.LiveData?.parameters[
                                            Constant.ActivityCode
                                        ]
                                    )}
                                </Button>
                            </Tooltip>
                        ),
                    },
                    {
                        content: <Box as="span">{well.Name}</Box>,
                    },
                    {
                        content: <Box as="span">{well.AliasWellName}</Box>,
                    },
                    {
                        content: <Box as="span">{well.ID}</Box>,
                    },
                    {
                        content: <Box as="span">{well.IP}</Box>,
                    },
                    {
                        content: (
                            <IconButton icon={RecentIcon} label="Live View" />
                        ),
                    },
                    {
                        content: (
                            <IconButton
                                icon={EditorNumberListIcon}
                                label="Depth View"
                            />
                        ),
                    },
                ],
            });
        });

        return (
            <Box
                as="div"
                xcss={xcss({
                    width: '100%',
                    overflow: 'auto',
                })}>
                <DynamicTable
                    caption={caption}
                    rowsPerPage={100}
                    defaultPage={1}
                    head={header}
                    rows={rows}
                />
            </Box>
        );
    };

    //
    return (
        <>
            <input type="hidden" value={`${count}`}></input>
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
        </>
    );
};

const domNode = document.getElementById('root');
if (domNode !== null) {
    const root = createRoot(domNode);

    const signalRService = new SignalrService();
    root.render(<Home signalRService={signalRService} />);
}
