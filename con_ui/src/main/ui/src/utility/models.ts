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
}
