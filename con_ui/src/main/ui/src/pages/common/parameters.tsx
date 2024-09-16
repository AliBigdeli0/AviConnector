// icons
import CheckIcon from '@atlaskit/icon/glyph/check';
import CrossIcon from '@atlaskit/icon/glyph/cross';
import AddIcon from '@atlaskit/icon/glyph/add';
import EditorTextColorIcon from '@atlaskit/icon/glyph/editor/text-color';

// react
import React, { Fragment, useState, useCallback, useEffect } from 'react';

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
    component: ParameterUIBaseData | undefined;
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

    const body = () => {
        if (props.component === undefined) return <>component is empty</>;
        return <></>;
    };
    return (
        <Fragment>
            <ModalTransition>
                {props.openDialog && (
                    <Modal
                        onClose={closeModal}
                        shouldCloseOnOverlayClick={false}
                        shouldCloseOnEscapePress={false}>
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
                                    <ModalTitle>
                                        {props.component?.showName}
                                    </ModalTitle>
                                </Flex>
                            </Grid>
                        </ModalHeader>
                        <ModalBody>{body()}</ModalBody>
                        <ModalFooter>
                            <Button appearance="primary" onClick={closeModal}>
                                Close
                            </Button>
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
    const [update, setUpdate] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [component, setComponent] = useState<
        ParameterUIBaseData | undefined
    >();

    useEffect(() => {
        openModal();
    }, [update]);

    const openModal = () => {
        if (component !== undefined) {
            setOpenDialog(true);
        }
    };

    const modal = () => {
        return (
            <ParametersModal
                openDialog={openDialog}
                setOpenDialog={setOpenDialog}
                component={component}
            />
        );
    };

    const showColorbox = (element: ParameterUIBaseData) => {
        if ('color' in element) {
            return (
                <Box
                    xcss={xcss({
                        marginTop: 'space.0',
                    })}>
                    <EditorTextColorIcon
                        label=""
                        primaryColor={element.color as any}
                    />
                </Box>
            );
        }

        return <></>;
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
                    <Box
                        key={'parameters_box_' + index}
                        xcss={xcss({ margin: 'space.025' })}>
                        <Flag
                            key={`parameters_box_flag_${index}`}
                            testId={`parameters-list-test-${index}`}
                            appearance="info"
                            icon={<CheckIcon label="success" />}
                            title={
                                <Flex justifyContent="start">
                                    {showColorbox(element)}
                                    <Box
                                        xcss={xcss({ marginTop: 'space.050' })}>
                                        {element.showName}
                                    </Box>
                                </Flex>
                            }
                            description={
                                <Stack as="div">
                                    <Text>WitsML ID: {element.id}</Text>
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
                                </Stack>
                            }
                            id="parameter code"
                            actions={[
                                {
                                    content: 'edit',
                                    testId: `parameters-list-test-${index}-edit`,
                                    onClick: () => {
                                        setComponent(element);
                                        setTimeout(() => {
                                            setUpdate(!update);
                                        }, 500);
                                    },
                                },
                                { content: 'remove', onClick: noop },
                            ]}
                        />
                    </Box>
                );
            })}
        </Stack>
    );
};
