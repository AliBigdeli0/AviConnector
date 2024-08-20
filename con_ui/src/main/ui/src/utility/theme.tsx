// imports
import ThemeProvider from '@atlaskit/app-provider';

import { Box, Grid, Stack } from '@atlaskit/primitives';
import React, { useEffect } from 'react';
import { sidebar } from './sidebar';

export const mainBody = (inside: React.ReactElement) => {
    return (
        <Grid gap="space.0">
            {sidebar()}
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
