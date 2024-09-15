// icons
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

import { ParameterBoxChangeEvent } from '../../utility/types';
import { ParameterData } from '../../models/parameters/parameter_data';
import { ParameterBaseData } from '../../models/parameters/parameter_base_data';

//
export interface ParameterBoxProps {
    handleChangeDefault: ParameterBoxChangeEvent | undefined;

    parameters: ParameterData | undefined;
}

//
export const ParameterBox = (props: ParameterBoxProps) => {
    const showName = (parameter: ParameterBaseData) => {
        return parameter.ShowName + '     (' + parameter.ID + ')';
    };
    // ui
    const showBox = () => {
        if (props.parameters === undefined)
            return <Text>Parameters are undefined</Text>;

        return (
            <PopupSelect
                onChange={(item) => {
                    if (item === null) return;
                    if (item === undefined) return;

                    if (props.handleChangeDefault !== undefined) {
                        props.handleChangeDefault(item.value.ID, item.value);
                    }
                }}
                target={({ isOpen, ...triggerprops }) => (
                    <Button
                        shouldFitContainer
                        {...triggerprops}
                        iconAfter={ChevronDownIcon}>
                        ...
                    </Button>
                )}
                options={props.parameters.Elements.map((headerItem) => {
                    return {
                        label: headerItem.ShowName,
                        options: headerItem.Elements.map((parameterItem) => {
                            return {
                                label: showName(parameterItem),
                                value: parameterItem,
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
