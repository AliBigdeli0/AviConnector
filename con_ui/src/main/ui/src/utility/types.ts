import { AlertMsg } from './models';

// types
export type MsgType = string;

export type ReactSetter<T> = React.Dispatch<React.SetStateAction<T>>;
export type SpinnerSetter = ReactSetter<string>;

export type AlertMsgType = AlertMsg[];

export type SignalROnClose = (err?: Error) => void;
export type SignalROnReconnectted = (id: string | undefined) => void;
export type SignalROnReconnecting = (err?: Error) => void;
export type SignalROnRestart = () => void;
export type SignalROnError = (err: any) => void;
