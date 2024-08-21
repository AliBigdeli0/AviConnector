import './home.css';

//
// do not remove this
import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import Button from '@atlaskit/button/new';
import '@atlaskit/css-reset';
import { Box } from '@atlaskit/primitives';
import { InitTheme } from '../../utility/theme';
import { CommonProps } from '../../utility/common_props';
import { MsgType, AlertMsgType } from '../../utility/types';

export interface HomeProps extends CommonProps {}

const Home = (props: HomeProps) => {
    const [showSpinner, setShowSpinner] = useState<MsgType>('');
    const [updateParent, setUpdateParent] = useState(false);
    const [alertMsg, setAlertMsg] = useState<AlertMsgType>([]);

    return (
        <InitTheme
            showSpinner={showSpinner}
            newAlerts={alertMsg}
            setNewAlerts={setAlertMsg}
            update={updateParent}
            setUpdate={setUpdateParent}
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
    const root = createRoot(domNode);
    root.render(<Home />);
}
