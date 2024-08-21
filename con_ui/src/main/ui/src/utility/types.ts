import { AlertMsg } from './models';

// types
export type MsgType = string;
export type ReactSetter<T> = React.Dispatch<React.SetStateAction<T>>;
export type AlertMsgType = AlertMsg[];
