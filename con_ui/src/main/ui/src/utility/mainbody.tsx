// imports
import ThemeProvider from '@atlaskit/app-provider';

import { Grid } from '@atlaskit/primitives';
import React from 'react';
import { menu } from './menu';
import { ThemeProps } from './theme';

export class MainBodyProps extends ThemeProps {}

export const mainBody = (props: MainBodyProps, inside: React.ReactElement) => {
    return (
        <Grid gap="space.0">
            {menu(props)}
            {inside}
        </Grid>
    );
};
