import { ParameterUIBaseData } from '../models/parameters/parameter-ui-base-data';

export type StrokeType = 1 | 2 | 3 | 4 | 5;

export type ParameterOnChangeEventActions = 'add' | 'update' | 'delete';

export type ParameterOnChangeEvent = (
    action: ParameterOnChangeEventActions,
    param: ParameterUIBaseData
) => void;
