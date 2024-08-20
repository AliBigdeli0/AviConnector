// imports
import ThemeProvider from '@atlaskit/app-provider';

import { Grid } from '@atlaskit/primitives';
import React from 'react';
import { Menu } from './menu';
import { ThemeProps } from './theme';

export interface MainBodyProps extends ThemeProps {}

export const MainBody = (props: MainBodyProps) => {
    return (
        <Grid gap="space.0">
            {<Menu {...props} />}
            {props.inside}
        </Grid>
    );
};
