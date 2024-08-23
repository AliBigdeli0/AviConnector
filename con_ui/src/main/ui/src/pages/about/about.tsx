import '../../assets/scss/about.css';
import '@atlaskit/css-reset';

//
// do not remove this
import React, { useMemo, useState } from 'react';

import { createRoot } from 'react-dom/client';
import { InitTheme } from '../../header/theme';
import { CommonProps } from '../../utility/common_props';
import { MsgType, AlertMsgType } from '../../utility/types';
import { SignalrService } from '../../utility/signalr_service';

export interface AboutProps extends CommonProps {}

const About = (props: AboutProps) => {
    const [showSpinner, _] = useState<MsgType>('');
    const [updateParent, setUpdateParent] = useState(false);
    const [alertMsg, setAlertMsg] = useState<AlertMsgType>([]);
    const pathItems = ['About'];

    return (
        <InitTheme
            showSpinner={showSpinner}
            newAlerts={alertMsg}
            setNewAlerts={setAlertMsg}
            update={updateParent}
            setUpdate={setUpdateParent}
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
