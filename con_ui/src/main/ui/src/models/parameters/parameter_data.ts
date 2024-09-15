import { ParameterBaseData } from './parameter_base_data';

export interface ParameterData {
    IsComposite: boolean;
    ShowName: string;
    Elements: ParameterBaseData[];
}
