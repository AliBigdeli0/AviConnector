import './about.css';
import '@atlaskit/css-reset';

//
// do not remove this
import React, { useMemo, useState } from 'react';

import { createRoot } from 'react-dom/client';
import { InitTheme } from '../../utility/theme';
import { CommonProps } from '../../utility/common_props';
import { MsgType, AlertMsgType } from '../../utility/types';

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
    root.render(<About />);
}
