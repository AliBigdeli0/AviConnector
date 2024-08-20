// imports
import ThemeProvider from '@atlaskit/app-provider';

import { Grid } from '@atlaskit/primitives';
import React from 'react';
import { menu } from './menu';

export const mainBody = (inside: React.ReactElement) => {
    return (
        <Grid gap="space.0">
            {menu()}
            {inside}
        </Grid>
    );
};

export const InitTheme = (inside: React.ReactElement) => {
    return (
        <ThemeProvider defaultColorMode="dark">
            {mainBody(inside)}
        </ThemeProvider>
    );
};
