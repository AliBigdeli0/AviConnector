// icons
import EditorTextColorIcon from '@atlaskit/icon/glyph/editor/text-color';
import ChevronDownIcon from '@atlaskit/icon/glyph/chevron-down';

// react
import React, { Fragment, useEffect, useRef, useState } from 'react';

// atlassian
import {
    Stack,
    Box,
    xcss,
    Inline,
    Grid,
    Text,
    Flex,
} from '@atlaskit/primitives';
import Button from '@atlaskit/button/new';
import { PopupSelect } from '@atlaskit/select';

// local
import { ParameterBaseData, ParameterData } from '../../utility/models';

//
export interface ParameterBoxProps {
    parameters: ParameterData | undefined;
}

//
export const ParameterBox = (props: ParameterBoxProps) => {
    const showName = (parameter: ParameterBaseData) => {
        return (
            <Flex justifyContent="space-between">
                <Stack alignInline="start">
                    <Text size="medium">{parameter.ShowName}</Text>
                </Stack>
                <Stack alignInline="end">
                    <Text size="small">{'(' + parameter.ID + ')'}</Text>
                </Stack>
            </Flex>
        );
    };
    // ui
    const showBox = () => {
        if (props.parameters === undefined)
            return <Text>Parameters are undefined</Text>;

        return (
            <PopupSelect
                target={({ isOpen, ...triggerprops }) => (
                    <Button
                        shouldFitContainer
                        {...triggerprops}
                        iconAfter={ChevronDownIcon}>
                        {'my parameters'}
                    </Button>
                )}
                options={props.parameters.Elements.map((headerItem) => {
                    return {
                        label: headerItem.ShowName,
                        options: headerItem.Elements.map((parameterItem) => {
                            return {
                                label: showName(parameterItem),
                                value: parameterItem.ID,
                            };
                        }),
                    };
                })}
            />
        );
    };
    return (
        <Box
            as="div"
            xcss={xcss({
                width: '100%',
            })}>
            {showBox()}
        </Box>
    );
};
