import './home.css';
import '@atlaskit/css-reset';

//
// do not remove this
import React, { useMemo, useState } from 'react';

import { createRoot } from 'react-dom/client';
import { Box } from '@atlaskit/primitives';
import { InitTheme } from '../../utility/theme';
import { CommonProps } from '../../utility/common_props';
import { MsgType, AlertMsgType } from '../../utility/types';

import Button from '@atlaskit/button/new';
import { CookieHelper } from '../../utility/cookie_helper';

export interface HomeProps extends CommonProps {}

const Home = (props: HomeProps) => {
    const [showSpinner, setShowSpinner] = useState<MsgType>('');
    const [updateParent, setUpdateParent] = useState(false);
    const [alertMsg, setAlertMsg] = useState<AlertMsgType>([]);
    const pathItems = ['Home'];
    return (
        <InitTheme
            showSpinner={showSpinner}
            newAlerts={alertMsg}
            setNewAlerts={setAlertMsg}
            update={updateParent}
            setUpdate={setUpdateParent}
            PathItems={pathItems}
            {...props}
            inside={
                <Box padding="space.100">
                    <Button
                        appearance="primary"
                        spacing="compact"
                        onClick={() => {
                            setShowSpinner('show data...');
                            setTimeout(() => {
                                setShowSpinner('');
                            }, 5000);
                        }}>
                        Show Spinner
                    </Button>
                    <Button
                        appearance="primary"
                        onClick={() => {
                            alertMsg.push({
                                type: 'sucess',
                                title: 'test',
                                description: `${alertMsg.length}from description`,
                            });
                            setAlertMsg(alertMsg);
                            setUpdateParent(!updateParent);
                        }}>
                        Show Message
                    </Button>
                </Box>
            }
        />
    );
};

const domNode = document.getElementById('root');
if (domNode !== null) {
    console.log('the api address is : ', CookieHelper.readApiAddress);
    const root = createRoot(domNode);
    root.render(<Home />);
}
