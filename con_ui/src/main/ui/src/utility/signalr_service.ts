import { CookieHelper } from './cookie_helper';

import * as signalR from '@microsoft/signalr';
import { WellData } from './models';
import {
    SignalROnClose,
    SignalROnError,
    SignalROnReconnecting,
    SignalROnReconnectted,
    SignalROnRestart as SignalROnStarted,
} from './types';
import { TimeHelper } from './time_helper';

export class SignalrService {
    conn: signalR.HubConnection | undefined = undefined;
    onclose: SignalROnClose | undefined = undefined;
    onreconnected: SignalROnReconnectted | undefined = undefined;
    onreconnecting: SignalROnReconnecting | undefined = undefined;
    onstarted: SignalROnStarted | undefined = undefined;
    onerror: SignalROnError | undefined = undefined;

    onErrorCallback: ((data: string) => void) | undefined = undefined;
    onWellsCallback: ((wells: WellData[]) => void) | undefined = undefined;

    async start() {
        this.conn = undefined;
        this.conn = new signalR.HubConnectionBuilder()
            .withUrl(this.uri, signalR.HttpTransportType.LongPolling)
            .configureLogging(signalR.LogLevel.Error)
            .withAutomaticReconnect([1000])
            .build();
        await this.conn.start();

        this.loadEvents();
    }

    loadEvents() {
        this.conn?.on('error_callback', (data) => {
            if (this.onErrorCallback !== undefined) this.onErrorCallback(data);
        });

        this.conn?.on('wells_callback', (list) => {
            if (this.onWellsCallback !== undefined) this.onWellsCallback(list);
        });
    }

    async restart() {
        try {
            if (this.conn !== undefined) {
                await this.conn.stop();
            }
            await this.start();

            if (this.onstarted !== undefined) this.onstarted();

            this.conn?.onclose(async (err) => {
                if (this.onclose !== undefined) this.onclose(err);
            });
            if (this.onreconnected !== undefined)
                this.conn?.onreconnected(this.onreconnected);
            if (this.onreconnecting !== undefined)
                this.conn?.onreconnecting(this.onreconnecting);
        } catch (err) {
            console.error(err);
            if (this.onerror !== undefined) this.onerror(err);
        }
    }

    callbacks(
        onstarted: () => void,
        onerror: () => void,
        onclose: (err?: Error) => void,
        onreconnected: (id: string | undefined) => void,
        onreconnecting: (err?: Error) => void
    ) {
        this.onstarted = onstarted;
        this.onerror = onerror;
        this.onclose = onclose;
        this.onreconnected = onreconnected;
        this.onreconnecting = onreconnecting;
    }

    async wells(): Promise<WellData[]> {
        return new Promise(async (res, err) => {
            this.onErrorCallback = (data) => {
                err(data);
            };

            this.onWellsCallback = (list) => {
                res(list);
            };
            await this.conn?.invoke('wells');
        });
    }

    state(): signalR.HubConnectionState {
        return this.conn?.state ?? signalR.HubConnectionState.Disconnected;
    }

    connected(): boolean {
        console.log('the signalr state:', this.state());
        return this.state() === signalR.HubConnectionState.Connected;
    }

    private get uri(): string {
        console.log(CookieHelper.readApiAddress);
        return `${CookieHelper.readApiAddress}/signalr`;
    }
}
