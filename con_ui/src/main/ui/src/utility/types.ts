// models
export interface AlertMsg {
    type: 'danger' | 'sucess' | 'info';
    title: string;
    description: string;
}

// types
export type MsgType = string;
export type ReactSetter<T> = React.Dispatch<React.SetStateAction<T>>;
export type AlertMsgType = AlertMsg[];
