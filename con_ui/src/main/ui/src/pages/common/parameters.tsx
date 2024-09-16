// icons
import CheckIcon from '@atlaskit/icon/glyph/check';
import CrossIcon from '@atlaskit/icon/glyph/cross';
import AddIcon from '@atlaskit/icon/glyph/add';

// react
import React, { Fragment, useState, useCallback } from 'react';

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
import Modal, {
    ModalBody,
    ModalFooter,
    ModalHeader,
    ModalTitle,
    ModalTransition,
} from '@atlaskit/modal-dialog';
import Button, { IconButton } from '@atlaskit/button/new';
import noop from '@atlaskit/ds-lib/noop';
import Flag, { FlagGroup } from '@atlaskit/flag';

// local
import { ReactSetter } from '../../types/setter';
import { ComponentParameters } from '../../models/parameters/component-parameters';
import { ParameterUIBaseData } from '../../models/parameters/parameter-ui-base-data';
import { ParameterData } from '../../models/parameters/parameter_data';
import { UnitStaticCategories } from '../../models/units/unit-static-category';
import { UnitHelper } from '../../utility/unit_helper';

const gridStyles = xcss({
    width: '100%',
    paddingBottom: 'space.100',
});

//
export interface ParametersModalProps {
    openDialog: boolean;
    setOpenDialog: ReactSetter<boolean>;
}

//
export const ParametersModal = (props: ParametersModalProps) => {
    const closeModal = useCallback(() => props.setOpenDialog(false), []);

    const closeContainerStyles = xcss({
        gridArea: 'close',
    });

    const titleContainerStyles = xcss({
        gridArea: 'title',
    });

    return (
        <Fragment>
            <ModalTransition>
                {props.openDialog && (
                    <Modal onClose={closeModal}>
                        <ModalHeader>
                            <Grid
                                gap="space.200"
                                templateAreas={['title close']}
                                xcss={gridStyles}>
                                <Flex
                                    xcss={closeContainerStyles}
                                    justifyContent="end">
                                    <IconButton
                                        appearance="subtle"
                                        icon={CrossIcon}
                                        label="Close Modal"
                                        onClick={closeModal}
                                    />
                                </Flex>

                                <Flex
                                    xcss={titleContainerStyles}
                                    justifyContent="start">
                                    <ModalTitle>Parameter View</ModalTitle>
                                </Flex>
                            </Grid>
                        </ModalHeader>
                        <ModalBody>
                            <span>here is the parameter code</span>
                            <span>My codes are here</span>
                        </ModalBody>
                        <ModalFooter>
                            <Button appearance="subtle" onClick={closeModal}>
                                Cancel
                            </Button>
                            <Button appearance="primary">Apply</Button>
                        </ModalFooter>
                    </Modal>
                )}
            </ModalTransition>
        </Fragment>
    );
};

//
export interface ParametersProps {
    components: ComponentParameters<ParameterUIBaseData>;
    parameters: ParameterData | undefined;
    units: UnitStaticCategories[] | undefined;
}

//
export const Parameters = (props: ParametersProps) => {
    const [openDialog, setOpenDialog] = useState(false);
    const openModal = useCallback(() => setOpenDialog(true), []);

    const modal = () => {
        return (
            <ParametersModal
                openDialog={openDialog}
                setOpenDialog={setOpenDialog}
            />
        );
    };

    return (
        <Stack xcss={xcss({ width: '100%', paddingTop: 'space.100' })}>
            {modal()}
            <Box xcss={gridStyles}>
                <Flex justifyContent="end">
                    <IconButton
                        appearance="primary"
                        icon={AddIcon}
                        label="Add Parameters"
                    />
                </Flex>
            </Box>

            {props.components.elements.map((element, index) => {
                return (
                    <Flag
                        testId={`parameters-list-test-${index}`}
                        appearance="info"
                        icon={<CheckIcon label="success" />}
                        title={
                            <Text color="color.text.accent.green">
                                {element.showName}
                            </Text>
                        }
                        description={
                            <Stack as="div">
                                <Text>Mappted To: {element.dbCode}</Text>
                                <Text>
                                    Unit Category:{' '}
                                    {UnitHelper.getCategoryName(
                                        element.unitCategoryID,
                                        props.units
                                    )}
                                </Text>
                                <Text>
                                    Unit:{' '}
                                    {UnitHelper.getUnitName(
                                        element.unitID,
                                        element.unitCategoryID,
                                        props.units
                                    )}
                                </Text>
                                <Text>ID: {element.id}</Text>
                            </Stack>
                        }
                        id="parameter code"
                        actions={[
                            {
                                content: 'edit',
                                testId: `parameters-list-test-${index}-edit`,
                                onClick: () => {
                                    openModal();
                                },
                            },
                            { content: 'remove', onClick: noop },
                        ]}
                    />
                );
            })}
        </Stack>
    );
};
