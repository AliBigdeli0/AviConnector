import { ParameterBaseData } from '../models/parameters/parameter_base_data';

export type ParameterBoxChangeEvent = (
    id: string,
    parameter: ParameterBaseData
) => void;
