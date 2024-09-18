// icons
import ChevronDownIcon from '@atlaskit/icon/glyph/chevron-down';

// react
import React, { Fragment, useEffect, useRef, useState } from 'react';

// atlassian
import { Box, xcss } from '@atlaskit/primitives';
import Button from '@atlaskit/button/new';
import { PopupSelect } from '@atlaskit/select';

// local

import { ParameterBaseData } from '../../models/parameters/parameter_base_data';
import { UnitStaticCategories } from '../../models/units/unit-static-category';
import { UnitBoxChangeEvent } from '../../types/unitbox';
import { UnitStaticDetails } from '../../models/units/unit-static-details';

//
export interface UnitBoxProps {
    selectedParameter: ParameterBaseData | undefined;

    units: UnitStaticCategories[] | undefined;

    handleChange: UnitBoxChangeEvent;
    handleParameterChange: UnitBoxChangeEvent;
}

//
export const UnitBox = (props: UnitBoxProps) => {
    const [unitCategory, setUnitCategory] = useState<
        UnitStaticCategories | undefined
    >();

    const [unitDefault, setUnitDefault] = useState<
        UnitStaticDetails | undefined
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
                    setUnitCategory(category);
                    setUnitDefault(detail);
                    props.handleParameterChange(detail, category, detail);
                }
            });
        });
    };

    const defaultString = (unit: UnitStaticDetails) => {
        if (unitDefault === undefined) return '';
        if (unit.id === unitDefault.id) return ' (default)';
        return '';
    };

    const showBox = () => {
        if (props.selectedParameter === undefined)
            return (
                <Box
                    xcss={xcss({
                        width: '100%',
                    })}>
                    <Button shouldFitContainer appearance="subtle">
                        Empty
                    </Button>
                </Box>
            );

        return (
            <PopupSelect
                onChange={(item) => {
                    if (item === null) return;
                    if (item === undefined) return;
                    if (unitCategory === undefined) return;
                    if (unitDefault === undefined) return;

                    props.handleChange(item.value, unitCategory, unitDefault);
                }}
                target={({ isOpen, ...triggerprops }) => (
                    <Button
                        shouldFitContainer
                        {...triggerprops}
                        iconAfter={ChevronDownIcon}>
                        ...
                    </Button>
                )}
                options={unitCategory?.details.map((unit) => {
                    return {
                        label: unit.name + defaultString(unit),
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
