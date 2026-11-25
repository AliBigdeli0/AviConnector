import { ServerLiveModelResponse } from '../models/server_live_response';
import { UnitStaticCategories } from '../models/units/unit-static-category';

export type SignalROnClose = (err?: Error) => void;
export type SignalROnErrorCallback = (data: string) => void;
export type SignalROnError = (err: any) => void;

export type SignalROnBulkLiveCallback = (
    lives: ServerLiveModelResponse[]
) => void;

export type SignalROnPageConfigCallback = (data: any) => void;
export type SignalROnReconnectted = (id: string | undefined) => void;
export type SignalROnReconnecting = (err?: Error) => void;
export type SignalROnRestart = () => void;

export type SignalROnStaticUnitsCallback = (
    arr: UnitStaticCategories[]
) => void;

export type SignalROnWellsCallback = (wells: string[]) => void;
