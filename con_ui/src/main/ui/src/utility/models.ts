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
