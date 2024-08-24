import '../../assets/scss/about.css';
import '@atlaskit/css-reset';

// icons
import EmailIcon from '@atlaskit/icon/glyph/email';
import CodeIcon from '@atlaskit/icon/glyph/editor/code';
import CalendarIcon from '@atlaskit/icon/glyph/calendar';
import OfficeBuildingIcon from '@atlaskit/icon/glyph/office-building';
import ChildIssuesIcon from '@atlaskit/icon/glyph/child-issues';

//
// do not remove this
import React, { useMemo, useState } from 'react';

import { Box, Inline, Text, xcss } from '@atlaskit/primitives';
import SectionMessage from '@atlaskit/section-message';

import { createRoot } from 'react-dom/client';
import { InitTheme } from '../../header/theme';
import { CommonProps } from '../../utility/common_props';
import { MsgType, AlertMsgType, ThemeType } from '../../utility/types';
import { SignalrService } from '../../utility/signalr_service';
import { ThemeHelper } from '../../utility/theme_helper';
import { Constant } from '../../utility/constants';

export interface AboutProps extends CommonProps {}

const About = (props: AboutProps) => {
    const [showSpinner, _] = useState<MsgType>('');
    const [updateParent, setUpdateParent] = useState(false);
    const [alertMsg, setAlertMsg] = useState<AlertMsgType>([]);
    const pathItems = ['About'];
    const [theme, setTheme] = useState<ThemeType>(ThemeHelper.getTheme());

    const Subsection = (icon: any, text: string) => {
        return (
            <Inline xcss={xcss({ paddingBottom: 'space.100' })}>
                {icon}
                <Box
                    as="span"
                    xcss={xcss({
                        paddingTop: 'space.025',
                        paddingLeft: 'space.050',
                    })}>
                    {text}
                </Box>
            </Inline>
        );
    };

    const AboutBox = () => {
        return (
            <Box
                xcss={xcss({
                    backgroundColor: 'color.background.neutral',
                    padding: 'space.100',
                    borderRadius: '4px',

                    alignContent: 'center',
                    alignItems: 'center',
                    width: '500px',
                })}>
                <SectionMessage
                    title={`About ${Constant.AppName}`}
                    appearance="information">
                    {Subsection(
                        <CodeIcon label="Software Name" size="medium" />,
                        `App Name: ${Constant.AppName}`
                    )}
                    {Subsection(
                        <ChildIssuesIcon label="Software Name" size="medium" />,
                        `Version: ${Constant.Version}`
                    )}
                    {Subsection(
                        <OfficeBuildingIcon
                            label="Software Name"
                            size="medium"
                        />,
                        `Company: Mehran Expert Developers`
                    )}
                    {Subsection(
                        <CodeIcon label="Software Name" size="medium" />,
                        `Tech Lead: Ali Bigdeli`
                    )}
                    {Subsection(
                        <EmailIcon label="Software Name" size="medium" />,
                        `Tech Lead Email: alibigdeli66@gmail.com`
                    )}
                    {Subsection(
                        <CalendarIcon label="Software Name" size="medium" />,
                        `Copyright: ©2024`
                    )}
                </SectionMessage>
            </Box>
        );
    };

    return (
        <InitTheme
            showSpinner={showSpinner}
            newAlerts={alertMsg}
            setNewAlerts={setAlertMsg}
            update={updateParent}
            setUpdate={setUpdateParent}
            //
            themeType={theme}
            setThemeType={setTheme}
            //
            PathItems={pathItems}
            {...props}
            inside={
                <Box
                    as="div"
                    xcss={xcss({
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: `calc(100vh - ${Constant.MenuSize + 3}px)`,
                    })}>
                    <AboutBox />
                </Box>
            }
        />
    );
};

const domNode = document.getElementById('root');
if (domNode !== null) {
    const root = createRoot(domNode);

    const signalRService = new SignalrService();
    root.render(<About signalRService={signalRService} />);
}
