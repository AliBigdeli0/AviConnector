//
import './menu.css';

//
import React from 'react';
import GraphbarIcon from '@atlaskit/icon/glyph/graph-bar';
import UserIcon from '@atlaskit/icon/glyph/user-avatar-circle';

import { IconButton } from '@atlaskit/button/new';
import { Box, Inline, xcss, Stack, Text } from '@atlaskit/primitives';
import Heading from '@atlaskit/heading';

export const menu = () => {
    const logoElements = () => {
        return (
            <>
                <Inline>
                    <IconButton
                        icon={GraphbarIcon}
                        color="var(--ds-background-brand-bold)"
                        label="Edit"
                        spacing="compact"
                        appearance="subtle"></IconButton>
                    <span
                        style={{
                            fontSize: '30px',
                            fontWeight: 'bold',
                            color: 'var(--ds-background-brand-bold)',
                        }}>
                        Well Viewer
                    </span>
                </Inline>
            </>
        );
    };

    const rightSideElements = () => {
        return (
            <Stack alignInline="center">
                <Box
                    xcss={xcss({
                        display: 'flex',
                    })}>
                    <Stack alignInline="center" alignBlock="end">
                        <IconButton
                            icon={UserIcon}
                            label="User"
                            spacing="compact"
                            appearance="default"></IconButton>

                        <span style={{ fontFamily: 'orbitron' }}>
                            Well Viewer
                        </span>
                    </Stack>
                </Box>
            </Stack>
        );
    };

    return (
        <Box
            xcss={xcss({
                borderBottomWidth: '1px',
                borderBottomStyle: 'solid',
                borderBottomColor: 'color.border.accent.gray',
                width: '100%',
                paddingBottom: 'space.025',
            })}>
            <Inline grow="fill" spread="space-between">
                {logoElements()}
                {rightSideElements()}
            </Inline>
        </Box>
    );
};
