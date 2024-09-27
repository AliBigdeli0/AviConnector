// icons
import CrossIcon from '@atlaskit/icon/glyph/cross';

// react
import React, { Fragment, useState, useEffect } from 'react';
import { jsx } from '@emotion/react';

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
import {
    MessageBoxApplyEvent,
    MessageBoxCloseEvent,
    MessageBoxNoEvent,
    MessageBoxOkEvent,
    MessageBoxTypes,
    MessageBoxYesEvent,
} from '../../types/messagebox';

//
interface MessageBoxBaseOriginalProps {
    openDialog: boolean;
    setOpenDialog: ReactSetter<boolean>;

    title: string;
    message: string;
}

interface MessageBoxBaseProps extends MessageBoxBaseOriginalProps {
    footer: jsx.JSX.Element;
    showType: MessageBoxTypes;
    close: MessageBoxCloseEvent;
    apply: MessageBoxApplyEvent;
}

interface MessageBoxOkProps extends MessageBoxBaseOriginalProps {
    ok: MessageBoxOkEvent;
    type: MessageBoxTypes;
}

interface MessageBoxYesNoProps extends MessageBoxBaseOriginalProps {
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
const MessageBoxBase = (props: MessageBoxBaseProps) => {
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
                                            props.close();
                                            closeModal();
                                        }}
                                    />
                                </Flex>

                                <Flex
                                    xcss={titleContainerStyles}
                                    justifyContent="start">
                                    <ModalTitle appearance={props.showType}>
                                        {props.title}
                                    </ModalTitle>
                                </Flex>
                            </Grid>
                        </ModalHeader>
                        <ModalBody>{props.message}</ModalBody>
                        <ModalFooter>{props.footer}</ModalFooter>
                    </Modal>
                )}
            </ModalTransition>
        </Fragment>
    );
};

export const MessageBoxOk = (props: MessageBoxOkProps) => {
    return (
        <MessageBoxBase
            footer={
                <>
                    <Button
                        appearance={props.type}
                        onClick={() => {
                            props.ok();
                        }}>
                        Apply
                    </Button>
                </>
            }
            close={props.ok}
            apply={props.ok}
            showType={props.type}
            {...props}
        />
    );
};

export const MessageBoxYesNo = (props: MessageBoxYesNoProps) => {
    return (
        <MessageBoxBase
            footer={
                <>
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
                </>
            }
            close={props.no}
            apply={props.yes}
            showType="warning"
            {...props}
        />
    );
};
