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

//
export interface ParametersProps {
    max: number;
}

//
export const Parameters = (props: ParametersProps) => {
    const [openDialog, setOpenDialog] = useState(false);
    const openModal = useCallback(() => setOpenDialog(true), []);
    const closeModal = useCallback(() => setOpenDialog(false), []);

    const gridStyles = xcss({
        width: '100%',
        paddingBottom: 'space.100',
    });

    const closeContainerStyles = xcss({
        gridArea: 'close',
    });

    const titleContainerStyles = xcss({
        gridArea: 'title',
    });

    const modal = () => {
        return (
            <Fragment>
                <ModalTransition>
                    {openDialog && (
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
                                <Button
                                    appearance="subtle"
                                    onClick={closeModal}>
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

            <Flag
                testId="parameters-list-test"
                appearance="info"
                icon={<CheckIcon label="success" />}
                title={
                    <Text color="color.text.accent.green">Weight On Bit</Text>
                }
                description={
                    <Stack as="div">
                        <Text>Mappted To: 0102</Text>
                        <Text>Unit: klb/pre</Text>
                        <Text>ID: 33093984-39843930-23439349</Text>
                    </Stack>
                }
                id="parameter code"
                actions={[
                    {
                        content: 'edit',
                        testId: 'parameters-list-test-edit',
                        onClick: () => {
                            openModal();
                        },
                    },
                    { content: 'remove', onClick: noop },
                ]}
            />
        </Stack>
    );
};
