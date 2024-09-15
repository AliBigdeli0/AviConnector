export interface ServerLiveModelResponse {
    wellId: string;
    timeString: string;
    liveTimes: { [key: string]: string };
    parameters: { [key: string]: string };
    isAvalible: boolean;
    lastDepth: string;
}
