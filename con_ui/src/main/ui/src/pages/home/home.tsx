import './home.css';

//
// do not remove this
import React from 'react';
import { createRoot } from 'react-dom/client';
import Button from '@atlaskit/button/new';
import '@atlaskit/css-reset';
import { Box } from '@atlaskit/primitives';
import { InitTheme } from '../../utility/theme';
import { CommonProps } from '../../utility/common_props';

export class HomeProps implements CommonProps {}

const Home = (props: HomeProps) => {
    return InitTheme(
        props,
        <Box padding="space.025">
            <Button appearance="primary" spacing="compact">
                My Button inside theming
            </Button>
        </Box>
    );
};

const domNode = document.getElementById('root');
if (domNode !== null) {
    const root = createRoot(domNode);
    root.render(<Home />);
}
