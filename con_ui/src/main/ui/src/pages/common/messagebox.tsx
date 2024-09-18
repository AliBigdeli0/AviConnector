// icons
import CrossIcon from '@atlaskit/icon/glyph/cross';

// react
import React, { Fragment, useState, useEffect } from 'react';

// atlassian
import { Stack, Box, xcss, Grid, Text, Flex } from '@atlaskit/primitives';
import Modal, {
    ModalBody,
    ModalFooter,
    ModalHeader,
    ModalTitle,
    ModalTransition,
} from '@atlaskit/modal-dialog';
import Button, { IconButton } from '@atlaskit/button/new';

// local
import { ReactSetter } from '../../types/setter';
import { MessageBoxNoEvent, MessageBoxYesEvent } from '../../types/messagebox';

//
export interface MessageBoxProps {
    openDialog: boolean;
    setOpenDialog: ReactSetter<boolean>;

    title: string;
    message: string;

    yes: MessageBoxYesEvent;
    no: MessageBoxNoEvent;
}

//

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

//
export const MessageBoxYesNo = (props: MessageBoxProps) => {
    const closeModal = () => {
        props.setOpenDialog(false);
    };
    return (
        <Fragment>
            <ModalTransition>
                {props.openDialog && (
                    <Modal
                        width={'small'}
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
                                        onClick={() => {
                                            props.no();
                                            closeModal();
                                        }}
                                    />
                                </Flex>

                                <Flex
                                    xcss={titleContainerStyles}
                                    justifyContent="start">
                                    <ModalTitle appearance="warning">
                                        {props.title}
                                    </ModalTitle>
                                </Flex>
                            </Grid>
                        </ModalHeader>
                        <ModalBody>{props.message}</ModalBody>
                        <ModalFooter>
                            <Button
                                onClick={() => {
                                    props.no();
                                }}>
                                No
                            </Button>
                            <Button
                                appearance="warning"
                                onClick={() => {
                                    props.yes();
                                }}>
                                Yes
                            </Button>
                        </ModalFooter>
                    </Modal>
                )}
            </ModalTransition>
        </Fragment>
    );
};
