export interface ParameterBaseData {
    ID: string;
    ShowName: string;
    IsComposite: boolean;
    Elements: ParameterBaseData[];
}
