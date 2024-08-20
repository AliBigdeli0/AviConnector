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
import Blanket from '@atlaskit/blanket';

export interface ThemeProps {
    showSpinner: MsgType;
    setShowSpinner: ReactSetter<MsgType>;
    inside: React.ReactElement;
}

export const InitTheme = (props: ThemeProps) => {
    const showSpinner = () => {
        return (
            <>
                <div
                    style={{
                        position: 'fixed',
                        top: '0',
                        left: '0',
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        zIndex: '700',
                    }}>
                    <Stack
                        alignBlock="center"
                        alignInline="center"
                        xcss={xcss({
                            alignItems: 'center',
                            textAlign: 'center',
                            zIndex: 'tooltip',
                        })}>
                        <Spinner
                            size="large"
                            label="Loading"
                            appearance="inherit"
                        />
                        <Lozenge appearance="default">
                            {props.showSpinner}
                        </Lozenge>
                    </Stack>
                </div>
                <Blanket
                    isTinted={true}
                    shouldAllowClickThrough={false}></Blanket>
            </>
        );
    };

    const showMainBodyOrSpinner = () => {
        if (props.showSpinner?.trim() !== '') {
            return showSpinner();
        }
        return <>{/*nothing*/}</>;
    };
    return (
        <ThemeProvider defaultColorMode="dark">
            {showMainBodyOrSpinner()}
            <MainBody {...props} />
        </ThemeProvider>
    );
};
