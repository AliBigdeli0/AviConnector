//
import React from 'react';

import GraphbarIcon from '@atlaskit/icon/glyph/graph-bar';
import UserIcon from '@atlaskit/icon/glyph/user-avatar-circle';

import { IconButton } from '@atlaskit/button/new';
import {
    Bleed,
    Box,
    Inline,
    xcss,
    Text,
    Stack,
    Flex,
} from '@atlaskit/primitives';

export const sidebar = () => {
    const logoElements = () => {
        return (
            <Inline>
                <IconButton
                    icon={GraphbarIcon}
                    label="Edit"
                    spacing="compact"
                    appearance="subtle"></IconButton>
                <Text size="large">Well Viewer</Text>
            </Inline>
        );
    };

    const rightSideElements = () => {
        return (
            <Stack alignInline="center">
                <Box
                    xcss={xcss({
                        display: 'flex',
                    })}>
                    <Stack alignBlock="end">
                        <IconButton
                            icon={UserIcon}
                            label="User"
                            spacing="compact"
                            appearance="default"></IconButton>
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
            })}>
            <Inline grow="fill" spread="space-between">
                {logoElements()}
                {rightSideElements()}
            </Inline>
        </Box>
    );
};
