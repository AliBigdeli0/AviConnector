import '../../assets/scss/home.css';
import '@atlaskit/css-reset';

//
// do not remove this
import React, { useEffect, useState } from 'react';

import { createRoot } from 'react-dom/client';
import { Box, xcss } from '@atlaskit/primitives';
import { InitTheme } from '../../header/theme';
import { CommonProps } from '../../utility/common_props';
import { MsgType, AlertMsgType } from '../../utility/types';
import { SizeHelper } from '../../utility/size_helper';
import { Constant } from '../../utility/constants';

export interface HomeProps extends CommonProps {}

const Home = (props: HomeProps) => {
    const [showSpinner, setShowSpinner] = useState<MsgType>('');
    const [updateParent, setUpdateParent] = useState(false);
    const [alertMsg, setAlertMsg] = useState<AlertMsgType>([]);
    const pathItems = ['Home'];

    //
    useEffect(() => {
        const size = SizeHelper.getElementSize('main_home');
        console.log('the size is: ', size);
    });

    //
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
                <Box
                    id="main_home"
                    padding="space.100"
                    xcss={xcss({
                        backgroundColor: 'color.background.accent.red.bolder',
                        height: `calc(100vh - ${Constant.MenuSize + 3}px)`,
                    })}></Box>
            }
        />
    );
};

const domNode = document.getElementById('root');
if (domNode !== null) {
    const root = createRoot(domNode);
    root.render(<Home />);
}
