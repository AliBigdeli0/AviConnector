import { CookieHelper } from './cookie_helper';

import * as signalR from '@microsoft/signalr';

import {
    SignalROnBulkLiveCallback,
    SignalROnClose,
    SignalROnError,
    SignalROnErrorCallback,
    SignalROnPageConfigCallback,
    SignalROnReconnecting,
    SignalROnReconnectted,
    SignalROnRestart as SignalROnStarted,
    SignalROnStaticUnitsCallback,
    SignalROnWellsCallback,
} from './types';
import { ServerLiveModelResponse } from '../models/server_live_response';
import { WellData } from '../models/welldata';
import { ParameterData } from '../models/parameters/parameter_data';
import { UnitStaticCategories } from '../models/units/unit-static-category';
import { ServerLiveModel } from '../models/server-live-model';

export class SignalrService {
    con: signalR.HubConnection | undefined = undefined;

    onclose: SignalROnClose | undefined = undefined;
    onreconnected: SignalROnReconnectted | undefined = undefined;
    onreconnecting: SignalROnReconnecting | undefined = undefined;
    onstarted: SignalROnStarted | undefined = undefined;
    onerror: SignalROnError | undefined = undefined;

    private onErrorCallback: SignalROnErrorCallback | undefined = undefined;
    private onWellsCallback: SignalROnWellsCallback | undefined = undefined;
    private OnBulkLiveCallback: SignalROnBulkLiveCallback | undefined =
        undefined;
    private onPageConfigCallback: SignalROnPageConfigCallback | undefined =
        undefined;
    private onStaticUnitCallback: SignalROnStaticUnitsCallback | undefined =
        undefined;

    async start() {
        this.con = undefined;
        this.con = new signalR.HubConnectionBuilder()
            .withUrl(this.uri, signalR.HttpTransportType.LongPolling)
            .configureLogging(signalR.LogLevel.Error)
            .withAutomaticReconnect([1000])
            .build();
        await this.con.start();

        this.loadEvents();
    }

    loadEvents() {
        this.con?.on('error_callback', (data) => {
            if (this.onErrorCallback !== undefined) this.onErrorCallback(data);
        });

        this.con?.on(
            'bulk_live_callback',
            (liveData: ServerLiveModelResponse[]) => {
                if (this.OnBulkLiveCallback !== undefined)
                    this.OnBulkLiveCallback(liveData);
            }
        );

        this.con?.on('wells_callback', (list) => {
            if (this.onWellsCallback !== undefined) this.onWellsCallback(list);
        });

        this.con?.on('page_configure_callback', (data) => {
            if (this.onPageConfigCallback !== undefined)
                this.onPageConfigCallback(data);
        });

        this.con?.on('load_static_units_callback', (arr) => {
            if (this.onStaticUnitCallback !== undefined) {
                this.onStaticUnitCallback(arr);
            }
        });
    }

    async restart() {
        try {
            if (this.con !== undefined) {
                await this.con.stop();
            }
            await this.start();

            if (this.onstarted !== undefined) this.onstarted();

            this.con?.onclose(async (err) => {
                if (this.onclose !== undefined) this.onclose(err);
            });
            if (this.onreconnected !== undefined)
                this.con?.onreconnected(this.onreconnected);
            if (this.onreconnecting !== undefined)
                this.con?.onreconnecting(this.onreconnecting);
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
                const retList: WellData[] = [];
                list.forEach((well) => {
                    retList.push(JSON.parse(well));
                });
                res(retList);
            };
            await this.con?.invoke('wells');
        });
    }

    async pageConfig(wellID: string): Promise<ParameterData> {
        return new Promise(async (res, err) => {
            this.onPageConfigCallback = (data: any) => {
                const deserializedData = JSON.parse(data);
                res(JSON.parse(deserializedData.json_parser));
            };
            await this.con?.invoke('page_configure', wellID);
        });
    }

    async loadUnits(): Promise<UnitStaticCategories[]> {
        return new Promise(async (res, err) => {
            this.onStaticUnitCallback = (data) => {
                res(data);
            };
            await this.con?.invoke('load_static_units');
        });
    }

    async bulkLive(
        models: ServerLiveModel[]
    ): Promise<ServerLiveModelResponse[]> {
        const modelStrings = models.map((well) => JSON.stringify(well));

        return new Promise(async (res, err) => {
            this.onErrorCallback = (msg) => {
                err(msg);
            };

            this.OnBulkLiveCallback = (lives) => {
                res(lives);
            };

            await this.con?.invoke('bulk_live', modelStrings);
        });
    }

    state(): signalR.HubConnectionState {
        return this.con?.state ?? signalR.HubConnectionState.Disconnected;
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
