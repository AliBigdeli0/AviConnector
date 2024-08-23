//
export class StringHelper {
    static trim(msg: string, len: number) {
        if (msg.length > len) {
            return msg.substring(0, len) + '...';
        }
        return msg;
    }

    static appendSpace(msg: string, spaceLen: number) {
        return msg + ' '.repeat(spaceLen - msg.length + 1);
    }

    static get notApplicable() {
        return 'Not Applicable';
    }

    static activityConverter(str?: string) {
        if (str === undefined) return this.notApplicable;
        switch (str.trim()) {
            case '0':
                return 'Undefined Status';
            case '1':
                return 'Rig Up & Tear Down';
            case '2':
                return 'Drilling';
            case '3':
                return 'Connection (drilling)';
            case '4':
                return 'Reaming';
            case '5':
                return 'Hole Opening';
            case '6':
                return 'Coring';
            case '7':
                return 'Condition and/or Circulate Mud';
            case '8':
                return 'Tripping In';
            case '9':
                return 'Tripping Out';
            case '10':
                return 'Lubricate Rig';
            case '11':
                return 'Rig Repair';
            case '12':
                return 'Cut / Slip Drilling Line';
            case '13':
                return 'Deviation Survey';
            case '14':
                return 'Wireline Logs';
            case '15':
                return 'Run Casing';
            case '16':
                return 'Cementing';
            case '17':
                return 'Plug Back';
            case '18':
                return 'Squeeze Cementing';
            case '19':
                return 'Wait On Cement';
            case '20':
                return 'Drill Cement and/or Float Equipment';
            case '21':
                return 'Nipple Up / NippleDown BOP Stack';
            case '22':
                return 'Test BOP';
            case '23':
                return 'Drill Stem Test';
            case '24':
                return 'Fishing';
            case '25':
                return 'Directional Work';
            case '26':
                return 'Well Control';
            case '27':
                return 'Stuck Pipe';
            case '28':
                return 'Wait on Weather';
            case '29':
                return 'Subsea';
            case '30':
                return 'Flow Check';
            case '31':
                return 'Pressure Integrity Test';
            case '32':
                return 'Lost Circulation';
            case '33':
                return 'Short Trip In';
            case '34':
                return 'Short Trip Out';
            case '35':
                return 'WashOut & Unplug Bit';
            case '36':
                return 'Milling';
            case '37':
                return 'Completion & Aband';
            case '38':
                return 'Client Waiting';
            case '39':
                return 'Contructor Waiting';
            case '40':
                return 'Service Company Waiting';
            case '41':
                return 'Other Waiting';
            case '20000':
                return 'TEST Ali';
            default:
                return this.notApplicable;
        }
    }
}
