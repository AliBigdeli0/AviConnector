import { ParameterUIChartData } from '../models/parameters/parameter-ui-chart-data';
import { ParameterBaseData } from '../models/parameters/parameter_base_data';
import { ParameterData } from '../models/parameters/parameter_data';
import { StrokeType } from '../types/parameter';
import { NumHelper } from './number_helper';

export class ParameterHelper {
    static getWithParameterCode(
        parameters: ParameterData | undefined,
        paramCode: string
    ): ParameterBaseData | undefined {
        if (parameters === undefined) return undefined;
        return parameters.Elements.flatMap((record) => record.Elements).filter(
            (elem) => elem.ID === paramCode
        )[0];
    }

    static getAllStrokes(): { [key: number]: string } {
        return {
            1: 'Thin',
            2: 'Small',
            3: 'Medium',
            4: 'Large',
            5: 'xLarge',
        };
    }

    static getStrokeById(stroke: StrokeType): string {
        return this.getAllStrokes()[stroke];
    }

    static getDefaultChartParameter(): ParameterUIChartData {
        return {
            id: NumHelper.generateUUID(),
            showName: 'Empty',
            dbCode: '0105',
            unitCategoryID: 2,
            unitID: 1,
            unitDefaultID: 1,
            color: '#ffffff',
            max: 100,
            min: 1,
            stroke: 1,
        };
    }
}
