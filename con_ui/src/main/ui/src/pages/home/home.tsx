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
import { MsgType } from '../../utility/types';

export interface HomeProps extends CommonProps {}

const Home = (props: HomeProps) => {
    const [showSpinner, setShowSpinner] = useState<MsgType>('');
    return (
        <InitTheme
            showSpinner={showSpinner}
            setShowSpinner={setShowSpinner}
            {...props}
            inside={
                <Box padding="space.025">
                    <Button
                        appearance="primary"
                        spacing="compact"
                        onClick={() => {
                            setShowSpinner('show data...');
                            setTimeout(() => {
                                setShowSpinner('');
                            }, 5000);
                        }}>
                        My Button inside theming
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
