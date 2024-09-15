// icons
import EditorTextColorIcon from '@atlaskit/icon/glyph/editor/text-color';
import ChevronDownIcon from '@atlaskit/icon/glyph/chevron-down';

// react
import React from 'react';

// atlassian
import { Box, xcss, Inline, Text } from '@atlaskit/primitives';
import Button from '@atlaskit/button/new';
import { PopupSelect } from '@atlaskit/select';

// local
import { ColorBoxChangeEvent, ColorBoxColors } from '../../types/colorbox';

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
