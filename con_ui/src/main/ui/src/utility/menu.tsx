//
import './menu.css';

//
import React, { useEffect, useMemo, useState } from 'react';
import UserIcon from '@atlaskit/icon/glyph/user-avatar-circle';

import { IconButton } from '@atlaskit/button/new';
import { Box, Inline, xcss, Stack, Text } from '@atlaskit/primitives';
import { MainBodyProps } from './mainbody';

export class MenuProps extends MainBodyProps {}

export const menu = (props: MenuProps) => {
    const [timeStr, setTimeStr] = useState('');

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            const hours = now.getHours().toString().padStart(2, '0');
            const minutes = now.getMinutes().toString().padStart(2, '0');
            const seconds = now.getSeconds().toString().padStart(2, '0');

            setTimeStr(`${hours}:${minutes}:${seconds}`);
        };

        updateTime();
        const timerId = setInterval(updateTime, 1000);

        return () => clearInterval(timerId);
    }, []);

    const logoElements = () => {
        return (
            <>
                <Inline
                    xcss={xcss({
                        borderRightStyle: 'solid',
                        borderRightWidth: '1px',
                        borderRightColor: 'color.border.accent.gray',
                        paddingRight: 'space.100',
                    })}>
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

    const menuElements = () => {
        return <></>;
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

                        <span
                            style={{
                                fontFamily: 'cursive',
                                fontWeight: 'bold',
                            }}>
                            {timeStr}
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
                {menuElements()}
                {rightSideElements()}
            </Inline>
        </Box>
    );
};
