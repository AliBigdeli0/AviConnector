//
import MenuIcon from '@atlaskit/icon/glyph/menu';
import './menu.css';

//
import React from 'react';
import { useEffect, useState } from 'react';
import UserIcon from '@atlaskit/icon/glyph/user-avatar-circle';

import { IconButton } from '@atlaskit/button/new';
import Button from '@atlaskit/button/new';

import { Box, Inline, xcss, Stack } from '@atlaskit/primitives';
import { MainBodyProps } from './mainbody';
import Lozenge from '@atlaskit/lozenge';
import { ButtonItem, MenuGroup, Section } from '@atlaskit/menu';
import Popup from '@atlaskit/popup';

export interface MenuProps extends MainBodyProps {}

export const Menu = (props: MenuProps) => {
    const [timeStr, setTimeStr] = useState('');
    const [isOpenMenu, setIsOpenMenu] = useState(false);

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
                        Well Monitor
                    </span>
                </Inline>
            </>
        );
    };

    const menuElements = () => {
        return (
            <Popup
                isOpen={isOpenMenu}
                onClose={() => setIsOpenMenu(false)}
                content={() => <></>}
                placement="bottom-start"
                trigger={(triggerProps) => (
                    <Button
                        {...triggerProps}
                        isSelected={isOpenMenu}
                        iconBefore={MenuIcon}
                        onClick={() => setIsOpenMenu(!isOpenMenu)}>
                        Menu
                    </Button>
                )}
            />
        );
    };

    const rightSideElements = () => {
        return (
            <Stack
                alignInline="center"
                xcss={xcss({
                    borderLeftStyle: 'solid',
                    borderLeftWidth: '1px',
                    borderLeftColor: 'color.border.accent.gray',
                    paddingLeft: 'space.100',
                    marginTop: 'space.025',
                })}>
                <Box xcss={xcss({ display: 'flex' })}>
                    <Stack alignInline="center" alignBlock="end">
                        <IconButton
                            icon={UserIcon}
                            label="User"
                            spacing="compact"
                            appearance="default"></IconButton>

                        <Lozenge appearance="inprogress" isBold>
                            {timeStr}
                        </Lozenge>
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
