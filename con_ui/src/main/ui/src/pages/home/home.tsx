import '../../assets/scss/home.css';
import '@atlaskit/css-reset';
// icons
import RecentIcon from '@atlaskit/icon/glyph/recent';
import EditorNumberListIcon from '@atlaskit/icon/glyph/editor/number-list';
import CrossCircleIcon from '@atlaskit/icon/glyph/cross-circle';
import CheckCircleIcon from '@atlaskit/icon/glyph/check-circle';
import SearchIcon from '@atlaskit/icon/glyph/search';

//
// do not remove this
import React, { useEffect, useMemo, useState } from 'react';
// tslint:disable:no-var-requires
const dayjs = require('dayjs');

//
import { token } from '@atlaskit/tokens';
import { createRoot } from 'react-dom/client';
import { Box, Inline, Text, xcss } from '@atlaskit/primitives';
import { HeadType, RowType } from '@atlaskit/dynamic-table/types';
import Tabs, { Tab, TabList, TabPanel } from '@atlaskit/tabs';
import Button, { IconButton } from '@atlaskit/button/new';
import DynamicTable from '@atlaskit/dynamic-table';
import Tooltip from '@atlaskit/tooltip';
import Textfield from '@atlaskit/textfield';

//
import { InitTheme } from '../../header/theme';
import { CommonProps } from '../../utility/common_props';
import { Constant } from '../../utility/constants';
import { SignalrService } from '../../utility/signalr_service';
import { TimeHelper } from '../../utility/time_helper';
import { StringHelper } from '../../utility/string_helper';
import { ThemeHelper } from '../../utility/theme_helper';
import { ServerLiveModel } from '../../models/server-live-model';
import { WellData } from '../../models/welldata';
import { AlertMsgType, MsgType } from '../../types/msg';
import { ThemeType } from '../../types/theme-type';

//
export interface HomeProps extends CommonProps {}

const Home = (props: HomeProps) => {
    const [showSpinner, setShowSpinner] = useState<MsgType>('');
    const [updateParent, setUpdateParent] = useState(false);
    const [count, setCount] = useState(0);
    const [wells, setWells] = useState<WellData[]>([]);
    const [alertMsg, setAlertMsg] = useState<AlertMsgType>([]);
    const [search, setSearch] = useState('');
    const [theme, setTheme] = useState<ThemeType>(ThemeHelper.getTheme());

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
    }, []);

    useEffect(() => {
        const timerId = setInterval(async () => {
            await getActivityCode();
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
                <Textfield
                    appearance="standard"
                    onChange={(e) => {
                        e.stopPropagation();
                        setSearch((e.target as any).value);
                    }}
                    placeholder="Search"
                    elemBeforeInput={
                        <SearchIcon size="small" label="search" />
                    }></Textfield>
                <Tabs id="wells_tab">
                    <TabList>
                        <Tab>Online Wells</Tab>
                        <Tab>Archived Wells</Tab>
                    </TabList>
                    <TabPanel>{showWellsOnDynamicTable(true, online)}</TabPanel>
                    <TabPanel>
                        {showWellsOnDynamicTable(false, archived)}
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
        return diffTime >= Constant.FiveMinutes;
    };

    const showWellIcon = (well: WellData) => {
        return hasTimeReached(well) ? (
            <CrossCircleIcon label="" primaryColor="#FF5630" />
        ) : (
            <CheckCircleIcon label="" primaryColor="#36B37E" />
        );
    };

    const statusString = (well: WellData) => {
        const str = StringHelper.activityConverter(
            well.LiveData?.parameters[Constant.ActivityCode]
        );
        const MAX_LEN = 20;
        if (str.length > MAX_LEN) return StringHelper.trim(str, MAX_LEN);
        else if (str.length < 10) return StringHelper.appendSpace(str, 10);
        else return str;
    };

    const showWellsOnDynamicTable = (
        isOnline: boolean,
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
        wellsToShow
            .filter((well) => {
                if (search.trim() === '') {
                    return true;
                }
                return (
                    well.Name.toLocaleLowerCase().includes(search) ||
                    well.AliasWellName.toLocaleLowerCase().includes(search) ||
                    well.ID.toLocaleLowerCase().includes(search) ||
                    well.IP.toLocaleLowerCase().includes(search)
                );
            })
            .forEach((well, index) => {
                rows.push({
                    cells: [
                        {
                            content: isOnline ? (
                                <Tooltip content={showWellTime(well)}>
                                    <Inline
                                        xcss={xcss({
                                            width: '100%',
                                        })}>
                                        <Box
                                            xcss={xcss({
                                                paddingLeft: 'space.100',
                                            })}>
                                            {showWellIcon(well)}
                                        </Box>
                                        <Box
                                            as="span"
                                            xcss={xcss({
                                                paddingTop: 'space.025',
                                            })}>
                                            {statusString(well)}
                                        </Box>
                                    </Inline>
                                </Tooltip>
                            ) : (
                                <Button
                                    key={`key_flag_archive_${well.ID}_${index}`}
                                    appearance="default">
                                    disable
                                </Button>
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
                                <IconButton
                                    appearance="primary"
                                    icon={RecentIcon}
                                    label="Live View"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        window.location.href = `/time_view?well_id=${well.ID}`;
                                    }}
                                />
                            ),
                        },
                        {
                            content: (
                                <IconButton
                                    appearance="primary"
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
                    paddingTop: 'space.050',
                })}>
                <DynamicTable
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
