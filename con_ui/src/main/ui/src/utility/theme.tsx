// imports
import ThemeProvider from '@atlaskit/app-provider';

import { css, jsx } from '@emotion/react';
import { Grid, Inline, Stack, xcss } from '@atlaskit/primitives';
import React from 'react';
import { MainBody } from './mainbody';
import { MsgType, ReactSetter } from './types';
import { token } from '@atlaskit/tokens';
import Spinner, { type Size } from '@atlaskit/spinner';
import { CSSProperties } from '@atlaskit/atlassian-navigation/dist/types/theme/types';
import Lozenge from '@atlaskit/lozenge';

export interface ThemeProps {
    showSpinner: MsgType;
    setShowSpinner: ReactSetter<MsgType>;
    inside: React.ReactElement;
}

export const InitTheme = (props: ThemeProps) => {
    const showSpinner = () => {
        return (
            <div
                style={{
                    position: 'absolute',
                    top: '47%',
                    left: '47%',
                    transform: 'transform(-50%, -50%)',
                }}>
                <Stack
                    alignBlock="center"
                    alignInline="center"
                    xcss={xcss({
                        alignItems: 'center',
                        textAlign: 'center',
                    })}>
                    <Spinner size="large" label="Loading" />
                    <Lozenge appearance="default">{props.showSpinner}</Lozenge>
                </Stack>
            </div>
        );
    };

    const showMainBodyOrSpinner = () => {
        if (props.showSpinner?.trim() !== '') {
            return showSpinner();
        }
        return <MainBody {...props} />;
    };
    return (
        <ThemeProvider defaultColorMode="dark">
            {showMainBodyOrSpinner()}
        </ThemeProvider>
    );
};
