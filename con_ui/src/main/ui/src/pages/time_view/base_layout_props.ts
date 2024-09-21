import { ReactSetter } from '../../types/setter';
import { TimeViewProps } from './time_view';

export interface BaseLayoutProps extends TimeViewProps {
    updateLayout: boolean;
    setUpdateLayout: ReactSetter<boolean>;
}
