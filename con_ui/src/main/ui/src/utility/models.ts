// models
export interface AlertMsg {
    type: 'danger' | 'sucess' | 'info';
    title: string;
    description: string;
}

// screen size
export interface WinSize {
    width: number;
    height: number;
}

// database
export interface WellData {
    ID: string;
    IP: string;
    Name: string;
    SubHoleName: string;
    AliasWellName: string;
    AliasRegionName: string;
    IsOffline: boolean;
    LiveData: ServerLiveModelResponse | undefined;
}

export interface ServerLiveModel {
    well_id: string;
    times: { [key: string]: string };
    parameters: { [key: string]: string };
}

export interface ServerLiveModelResponse {
    wellId: string;
    timeString: string;
    liveTimes: { [key: string]: string };
    parameters: { [key: string]: string };
    isAvalible: boolean;
    lastDepth: string;
}

// timeview ui
export enum Timelayouts {
    OnChartLayout = 1,
    TwoChartLayout = 2,
}

// chart
export interface ChartPoint {
    y: Date;
    x: number;
}

export interface ChartData {
    startTimer(): any;
}

export enum ChartDataType {
    Fake = 0,
    Real = 1,
}
