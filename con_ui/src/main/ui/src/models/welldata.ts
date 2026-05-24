import { ServerLiveModelResponse } from './server_live_response';

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
