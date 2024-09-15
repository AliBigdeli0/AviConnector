// out
import { Chart, ScatterDataPoint } from 'chart.js';

// local
import { AlertMsg } from '../models/alertmsg';
import { ServerLiveModelResponse } from '../models/server_live_response';
import { ParameterBaseData } from '../models/parameters/parameter_base_data';
import { UnitStaticCategories } from '../models/units/unit-static-category';
import { UnitStaticDetails } from '../models/units/unit-static-details';

// types
export type MsgType = string;

export type ThemeType = 'dark' | 'light';

export type ReactSetter<T> = React.Dispatch<React.SetStateAction<T>>;
export type SpinnerSetter = ReactSetter<string>;

export type AlertMsgType = AlertMsg[];

export type SignalROnClose = (err?: Error) => void;
export type SignalROnReconnectted = (id: string | undefined) => void;
export type SignalROnReconnecting = (err?: Error) => void;
export type SignalROnRestart = () => void;
export type SignalROnError = (err: any) => void;

export type SignalROnErrorCallback = (data: string) => void;
export type SignalROnWellsCallback = (wells: string[]) => void;
export type SignalROnBulkLiveCallback = (
    lives: ServerLiveModelResponse[]
) => void;
export type SignalROnPageConfigCallback = (data: any) => void;
export type SignalROnStaticUnitsCallback = (
    arr: UnitStaticCategories[]
) => void;

export type TimeChartType = Chart<
    'line',
    (number | ScatterDataPoint | null)[],
    unknown
>;

export type ColorBoxChangeEvent = (color: string) => void;
export type ColorBoxColors = Record<string, string>;

export type ParameterBoxChangeEvent = (
    id: string,
    parameter: ParameterBaseData
) => void;

export type UnitBoxChangeEvent = (currentUnit: UnitStaticDetails) => void;
