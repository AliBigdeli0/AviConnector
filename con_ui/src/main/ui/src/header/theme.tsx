// icons
import SuccessIcon from '@atlaskit/icon/glyph/check-circle';
import DangerIcon from '@atlaskit/icon/glyph/select-clear';
import InfoIcon from '@atlaskit/icon/glyph/warning';

// react
import React from 'react';

// atlassian
import { token } from '@atlaskit/tokens';
import { MainBody } from './mainbody';
import { Stack, xcss } from '@atlaskit/primitives';
import { AutoDismissFlag, FlagGroup } from '@atlaskit/flag';

import Spinner from '@atlaskit/spinner';
import Lozenge from '@atlaskit/lozenge';
import Blanket from '@atlaskit/blanket';
import ThemeProvider from '@atlaskit/app-provider';

// local
import { AlertMsg } from '../models/alertmsg';
import { AlertMsgType, MsgType } from '../types/msg';
import { ReactSetter } from '../types/setter';
import { ThemeType } from '../types/theme-type';

export interface ThemeProps {
    showSpinner: MsgType;
    newAlerts: AlertMsgType;
    setNewAlerts: ReactSetter<AlertMsgType>;
    inside: React.ReactElement;
    update: boolean;
    setUpdate: ReactSetter<boolean>;
    PathItems: string[];
    themeType: ThemeType;
    setThemeType: ReactSetter<ThemeType>;
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

    const alertToIcon = (alert: AlertMsg) => {
        switch (alert.type) {
            case 'sucess':
                return (
                    <SuccessIcon
                        primaryColor={token('color.icon.success')}
                        label="success"
                        size="medium"
                    />
                );
            case 'danger':
                return (
                    <DangerIcon
                        primaryColor={token('color.icon.danger')}
                        label="danger"
                        size="medium"
                    />
                );
            case 'info':
                return (
                    <InfoIcon
                        primaryColor={token('color.icon.warning')}
                        label="warning"
                        size="medium"
                    />
                );
            default:
                return <></>;
        }
    };

    const handleDismiss = () => {
        const newArray = props.newAlerts.slice(1);
        props.setNewAlerts(newArray);
        props.setUpdate(!props.update);
    };

    const showAlerts = () => {
        return (
            <FlagGroup onDismissed={handleDismiss}>
                {props.newAlerts.map((alert, index) => {
                    return (
                        <AutoDismissFlag
                            id={`flag_${index}`}
                            icon={alertToIcon(alert)}
                            key={`key_flag_group_${index}`}
                            title={alert.title}
                            description={alert.description}
                        />
                    );
                })}
            </FlagGroup>
        );
    };
    return (
        <ThemeProvider defaultColorMode={props.themeType}>
            {showMainBodyOrSpinner()}
            {showAlerts()}
            <MainBody {...props} />
        </ThemeProvider>
    );
};
