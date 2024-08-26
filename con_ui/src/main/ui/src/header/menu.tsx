//
import MenuIcon from '@atlaskit/icon/glyph/menu';
import UserIcon from '@atlaskit/icon/glyph/user-avatar-circle';
import HomeIcon from '@atlaskit/icon/glyph/home';
import InfoIcon from '@atlaskit/icon/glyph/info';

import '../assets/scss/menu.css';

//
import { token } from '@atlaskit/tokens';
import { IconButton } from '@atlaskit/button/new';
import { useEffect, useState } from 'react';
import { MenuGroup, ButtonItem, Section } from '@atlaskit/menu';
import { Box, Inline, xcss, Stack, Text } from '@atlaskit/primitives';

import React from 'react';
import Lozenge from '@atlaskit/lozenge';
import Popup from '@atlaskit/popup';
import Button from '@atlaskit/button/new';
import Breadcrumbs, { BreadcrumbsItem } from '@atlaskit/breadcrumbs';
import Tooltip from '@atlaskit/tooltip';
import Toggle from '@atlaskit/toggle';

import { MainBodyProps } from '../header/mainbody';
import { Constant } from '../utility/constants';
import { ThemeHelper } from '../utility/theme_helper';

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

    const leftElements = () => {
        return (
            <Inline>
                <Box
                    xcss={xcss({
                        color: 'color.text.accent.blue',

                        borderRightStyle: 'solid',
                        borderRightWidth: '1px',
                        borderRightColor: 'color.border.accent.gray',

                        paddingRight: 'space.100',
                        paddingLeft: 'space.100',

                        verticalAlign: 'center',
                        alignContent: 'center',
                        height: Constant.MenuSizePixcel,
                    })}>
                    <span
                        style={{
                            color: token('color.text.accent.blue'),
                            fontSize: 30,
                        }}>
                        {Constant.AppName}
                    </span>
                </Box>

                {menuElements()}
                {breakCrumbs()}
            </Inline>
        );
    };

    const menuItems = () => {
        return (
            <MenuGroup
                maxWidth={400}
                minWidth={150}
                onClick={(e) => e.stopPropagation()}>
                <Section>
                    <ButtonItem
                        iconBefore={<HomeIcon label="" />}
                        onClick={() => {
                            window.location.href = '/';
                        }}>
                        Home
                    </ButtonItem>
                </Section>
                <Section hasSeparator>
                    <ButtonItem
                        iconBefore={<InfoIcon label="" />}
                        onClick={() => {
                            window.location.href = '/about';
                        }}>
                        About
                    </ButtonItem>
                </Section>
            </MenuGroup>
        );
    };

    const menuElements = () => {
        return (
            <Box
                xcss={xcss({
                    borderRightStyle: 'solid',
                    borderRightWidth: '1px',
                    borderRightColor: 'color.border.accent.gray',

                    verticalAlign: 'center',
                    alignContent: 'center',
                    height: Constant.MenuSizePixcel,
                })}>
                <Popup
                    isOpen={isOpenMenu}
                    onClose={() => setIsOpenMenu(false)}
                    content={menuItems}
                    placement="bottom-start"
                    trigger={(triggerProps) => (
                        <Button
                            {...triggerProps}
                            isSelected={isOpenMenu}
                            iconBefore={MenuIcon}
                            appearance="subtle"
                            onClick={() => setIsOpenMenu(!isOpenMenu)}>
                            Menu
                        </Button>
                    )}
                />
            </Box>
        );
    };

    const breakCrumbs = () => {
        return (
            <Box
                xcss={xcss({
                    borderRightStyle: 'solid',
                    borderRightWidth: '1px',
                    borderRightColor: 'color.border.accent.gray',

                    paddingRight: 'space.100',
                    paddingLeft: 'space.100',

                    verticalAlign: 'center',
                    alignContent: 'center',
                    height: Constant.MenuSizePixcel,
                })}>
                <Breadcrumbs>
                    {props.PathItems.map((path, index) => {
                        return (
                            <BreadcrumbsItem
                                key={'menu_break_crumbs_' + index}
                                text={path}
                            />
                        );
                    })}
                </Breadcrumbs>
            </Box>
        );
    };

    const rightSideElements = () => {
        return (
            <Inline alignInline="center" xcss={xcss({})}>
                <Box
                    xcss={xcss({
                        borderLeftStyle: 'solid',
                        borderLeftWidth: '1px',
                        borderLeftColor: 'color.border.accent.gray',

                        display: 'flex',

                        paddingLeft: 'space.100',
                        paddingRight: 'space.100',
                        alignContent: 'center',
                        alignItems: 'center',
                        height: Constant.MenuSizePixcel,
                    })}>
                    <Stack alignInline="center" alignBlock="end">
                        <Tooltip content="Dark/Light Mode">
                            <Toggle
                                size="regular"
                                isChecked={props.themeType === 'dark'}
                                onChange={() => {
                                    console.log(props.themeType);
                                    if (props.themeType === 'dark') {
                                        ThemeHelper.changeTheme('light');
                                    } else {
                                        ThemeHelper.changeTheme('dark');
                                    }
                                    window.location.href = window.location.href;
                                }}></Toggle>
                        </Tooltip>
                    </Stack>
                </Box>

                <Box
                    xcss={xcss({
                        borderLeftStyle: 'solid',
                        borderLeftWidth: '1px',
                        borderLeftColor: 'color.border.accent.gray',

                        display: 'flex',

                        paddingLeft: 'space.100',

                        height: Constant.MenuSizePixcel,
                    })}>
                    <Stack alignInline="center" alignBlock="end">
                        <IconButton
                            icon={UserIcon}
                            label="User"
                            spacing="compact"
                            appearance="default"></IconButton>

                        <Lozenge appearance="default" isBold>
                            {timeStr}
                        </Lozenge>
                    </Stack>
                </Box>
            </Inline>
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
                {leftElements()}
                {rightSideElements()}
            </Inline>
        </Box>
    );
};
