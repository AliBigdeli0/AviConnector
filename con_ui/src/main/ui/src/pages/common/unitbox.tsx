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
import { ReactSetter, UnitBoxChangeEvent } from '../../utility/types';
import { ParameterBaseData } from '../../models/parameters/parameter_base_data';
import { UnitStaticCategories } from '../../models/units/unit-static-category';

//
export interface UnitBoxProps {
    selectedParameter: ParameterBaseData | undefined;
    units: UnitStaticCategories[] | undefined;

    handleChange: UnitBoxChangeEvent;
}

//
export const UnitBox = (props: UnitBoxProps) => {
    const [selectedUnit, setSelectedUnit] = useState<
        UnitStaticCategories | undefined
    >();

    useEffect(() => {
        searchUnit(props.selectedParameter);
    }, []);

    useEffect(() => {
        searchUnit(props.selectedParameter);
    }, [props.selectedParameter]);

    const searchUnit = (param: ParameterBaseData | undefined) => {
        if (param === undefined) return;
        if (props.units === undefined) return;

        const id = param.ID;
        props.units.forEach((category) => {
            category.details.forEach((detail) => {
                if (detail.codes.includes(id)) {
                    setSelectedUnit(category);
                    props.handleChange(detail);
                }
            });
        });
    };

    const showBox = () => {
        if (props.selectedParameter === undefined)
            return (
                <Box
                    xcss={xcss({
                        width: '100%',
                    })}>
                    <Button shouldFitContainer appearance="subtle">
                        Parameter Is Empty
                    </Button>
                </Box>
            );

        return (
            <PopupSelect
                onChange={(item) => {
                    if (item === null) return;
                    if (item === undefined) return;

                    props.handleChange(item.value);
                }}
                target={({ isOpen, ...triggerprops }) => (
                    <Button
                        shouldFitContainer
                        {...triggerprops}
                        iconAfter={ChevronDownIcon}>
                        ...
                    </Button>
                )}
                options={selectedUnit?.details.map((unit) => {
                    return {
                        label: unit.name,
                        value: unit,
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
