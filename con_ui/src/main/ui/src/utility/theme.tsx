// imports
import ThemeProvider from '@atlaskit/app-provider';

import { Grid } from '@atlaskit/primitives';
import React from 'react';
import { menu } from './menu';
import { mainBody } from './mainbody';

export class ThemeProps {}

export const InitTheme = (props: ThemeProps, inside: React.ReactElement) => {
    return (
        <ThemeProvider defaultColorMode="dark">
            {mainBody(props, inside)}
        </ThemeProvider>
    );
};
