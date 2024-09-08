// icons
import EditorBackgroundColorIcon from '@atlaskit/icon/glyph/editor/background-color';
import EditorTextColorIcon from '@atlaskit/icon/glyph/editor/text-color';
import ChevronDownIcon from '@atlaskit/icon/glyph/chevron-down';

// react
import React, { Fragment, useEffect, useRef, useState } from 'react';
import { css, jsx } from '@emotion/react';
import Select, { PopupSelect } from '@atlaskit/select';

// atlassian
import { Stack, Box, xcss, Inline, Grid, Text } from '@atlaskit/primitives';
import Button from '@atlaskit/button/new';
import DropdownMenu, {
    DropdownItem,
    DropdownItemGroup,
} from '@atlaskit/dropdown-menu';

// local
import { ColorBoxChangeEvent, ColorBoxColors } from '../../utility/types';

//
export interface ColorBoxProps {
    current: string;
    handleCurrentChange: ColorBoxChangeEvent;
    colors: ColorBoxColors;
}

//
export const ColorBox = (props: ColorBoxProps) => {
    return (
        <Box
            xcss={xcss({
                width: '100%',
            })}>
            <PopupSelect
                onChange={(item) => {
                    if (item === null) return;
                    if (item === undefined) return;

                    props.handleCurrentChange(item.value);
                }}
                target={({ isOpen, ...triggerprops }) => (
                    <Button
                        shouldFitContainer
                        {...triggerprops}
                        iconAfter={ChevronDownIcon}
                        iconBefore={() => (
                            <EditorTextColorIcon
                                label=""
                                primaryColor={props.current}
                            />
                        )}>
                        {props.current}
                    </Button>
                )}
                options={Object.entries(props.colors).map((key, value) => {
                    return {
                        label: (
                            <Inline>
                                <EditorTextColorIcon
                                    label=""
                                    primaryColor={key[1] as any}
                                />
                                <Text>{key[1]}</Text>
                            </Inline>
                        ),
                        value: key[1],
                    };
                })}></PopupSelect>
        </Box>
    );
};
