import '../../assets/scss/about.css';
import '@atlaskit/css-reset';

//
// do not remove this
import React, { useMemo, useState } from 'react';

import { createRoot } from 'react-dom/client';
import { InitTheme } from '../../header/theme';
import { CommonProps } from '../../utility/common_props';
import { MsgType, AlertMsgType, ThemeType } from '../../utility/types';
import { SignalrService } from '../../utility/signalr_service';
import { ThemeHelper } from '../../utility/theme_helper';

export interface AboutProps extends CommonProps {}

const About = (props: AboutProps) => {
    const [showSpinner, _] = useState<MsgType>('');
    const [updateParent, setUpdateParent] = useState(false);
    const [alertMsg, setAlertMsg] = useState<AlertMsgType>([]);
    const pathItems = ['About'];
    const [theme, setTheme] = useState<ThemeType>(ThemeHelper.getTheme());

    return (
        <InitTheme
            showSpinner={showSpinner}
            newAlerts={alertMsg}
            setNewAlerts={setAlertMsg}
            update={updateParent}
            setUpdate={setUpdateParent}
            //
            themeType={theme}
            setThemeType={setTheme}
            //
            PathItems={pathItems}
            {...props}
            inside={<>about page</>}
        />
    );
};

const domNode = document.getElementById('root');
if (domNode !== null) {
    const root = createRoot(domNode);

    const signalRService = new SignalrService();
    root.render(<About signalRService={signalRService} />);
}
