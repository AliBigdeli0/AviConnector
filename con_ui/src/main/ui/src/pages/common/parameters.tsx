// icons
import CheckIcon from '@atlaskit/icon/glyph/check';
import CrossIcon from '@atlaskit/icon/glyph/cross';
import AddIcon from '@atlaskit/icon/glyph/add';
import EditorTextColorIcon from '@atlaskit/icon/glyph/editor/text-color';
import ErrorIcon from '@atlaskit/icon/glyph/error';
import ChevronDownIcon from '@atlaskit/icon/glyph/chevron-down';

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
import Flag from '@atlaskit/flag';
import InlineEdit from '@atlaskit/inline-edit';
import TextField from '@atlaskit/textfield';
import { token } from '@atlaskit/tokens';
import Banner from '@atlaskit/banner';
import { PopupSelect } from '@atlaskit/select';

// local
import { ReactSetter } from '../../types/setter';
import { ComponentParameters } from '../../models/parameters/component-parameters';
import { ParameterUIBaseData } from '../../models/parameters/parameter-ui-base-data';
import { ParameterData } from '../../models/parameters/parameter_data';
import { UnitStaticCategories } from '../../models/units/unit-static-category';
import { UnitHelper } from '../../utility/unit_helper';
import { ParameterBox } from './parameterbox';
import { UnitBox } from './unitbox';
import { ParameterBaseData } from '../../models/parameters/parameter_base_data';
import { ParameterHelper } from '../../utility/parameter-helper';
import { ColorBox } from './colorbox';
import { ColorHelper } from '../../utility/color_helper';
import { Constant } from '../../utility/constants';
import { EmptyErrorType } from '../../types/error';
import { ParameterOnChangeEvent, StrokeType } from '../../types/parameter';
import { MessageBoxYesNo } from './messagebox';

//
const gridStyles = xcss({
    width: '100%',
    paddingBottom: 'space.100',
});

//
const allStrokes = ParameterHelper.getAllStrokes();

//
export interface ParametersModalProps {
    openDialog: boolean;
    setOpenDialog: ReactSetter<boolean>;
    component: ParameterUIBaseData | undefined;
    parameters: ParameterData | undefined;
    units: UnitStaticCategories[] | undefined;
}

//
const fontSize = token('font.body');

const readViewContainerStyles = xcss({
    display: 'flex',
    maxWidth: '100%',
    paddingBlock: 'space.100',
    paddingInline: 'space.075',
    fontSize: `${fontSize}px`,
    wordBreak: 'break-word',
});

const closeContainerStyles = xcss({
    gridArea: 'close',
});

const titleContainerStyles = xcss({
    gridArea: 'title',
});

export const ParametersModal = (props: ParametersModalProps) => {
    const [error, setError] = useState<string | EmptyErrorType>(
        Constant.EmptyError
    );
    const [name, setName] = useState(props.component?.showName);
    const [paramCode, setParamCode] = useState(props.component?.dbCode);
    const [unitCatetoryId, setUnitCategoryId] = useState<number | undefined>();
    const [unitId, setUnitId] = useState<number | undefined>();
    const [unitDefaultId, setUnitDefaultId] = useState<number | undefined>();
    const [parameter, setParameter] = useState<ParameterBaseData | undefined>();
    const [color, setColor] = useState<string>('');
    const [min, setMin] = useState<number>(0);
    const [max, setMax] = useState<number>(100);
    const [minStr, setMinStr] = useState('0');
    const [maxStr, setMaxStr] = useState('100');
    const [stroke, setStroke] = useState<StrokeType>(1);

    useEffect(() => {
        if (props.component === undefined) return;
        setName(props.component.showName);
        setParamCode(props.component.dbCode);
        setParameter(
            ParameterHelper.getWithParameterCode(
                props.parameters,
                props.component.dbCode
            )
        );
        setUnitCategoryId(props.component.unitCategoryID);
        setUnitId(props.component.unitID);
        setUnitDefaultId(props.component.unitDefaultID);

        if ('color' in props.component) {
            setColor(props.component.color as string);
        }

        if ('min' in props.component) {
            setMinStr(props.component.min as string);
            setMin(props.component.min as number);
        }

        if ('max' in props.component) {
            setMaxStr(props.component.max as string);
            setMax(props.component.max as number);
        }

        if ('stroke' in props.component) {
            setStroke(props.component.stroke as StrokeType);
        }
    }, [props.component]);

    useEffect(() => {
        if (props.component === undefined) return;
        if (name === undefined) return;

        props.component.showName = name;
    }, [name]);

    useEffect(() => {
        if (props.component === undefined) return;
        if (paramCode === undefined) return;

        props.component.dbCode = paramCode;
    }, [paramCode]);

    useEffect(() => {
        if (props.component === undefined) return;
        if (unitCatetoryId === undefined) return;

        props.component.unitCategoryID = unitCatetoryId;
    }, [unitCatetoryId]);

    useEffect(() => {
        if (props.component === undefined) return;
        if (unitId === undefined) return;

        props.component.unitID = unitId;
    }, [unitId]);

    useEffect(() => {
        if (props.component === undefined) return;
        if (unitDefaultId === undefined) return;

        props.component.unitDefaultID = unitDefaultId;
    }, [unitDefaultId]);

    useEffect(() => {
        if (props.component === undefined) return;
        if (color === undefined) return;
        if (!('color' in props.component)) return;

        props.component.color = color;
    }, [color]);

    useEffect(() => {
        if (props.component === undefined) return;
        if (!('min' in props.component)) return;

        props.component.min = min;
    }, [min]);

    useEffect(() => {
        if (props.component === undefined) return;
        if (!('max' in props.component)) return;

        props.component.max = max;
    }, [max]);

    useEffect(() => {
        if (props.component === undefined) return;
        if (!('stroke' in props.component)) return;

        props.component.stroke = stroke;
    }, [stroke]);

    const closeModal = () => {
        if (beforeCloseCheck()) {
            props.setOpenDialog(false);
        }
    };

    const beforeCloseCheck = () => {
        setError(Constant.EmptyError);

        if (name === undefined) {
            setError('name can not be undefined!');
            return false;
        }

        if (name.trim() === '') {
            setError('name can not be empty!');
            return false;
        }

        if (isNaN(min) || isNaN(max)) {
            setError('minimum or maximum can not be empty.');
            return false;
        }

        if (min > max) {
            setError('minimum value can not be grather than maximum');
            return false;
        }

        if (
            paramCode === undefined ||
            (paramCode !== undefined && paramCode.trim() === '')
        ) {
            setError('you should select a parameter');
            return false;
        }

        return true;
    };

    const showError = () => {
        if (error === Constant.EmptyError) return <></>;

        return (
            <Banner
                appearance="error"
                icon={<ErrorIcon label="Error" secondaryColor="inherit" />}>
                {error}
            </Banner>
        );
    };

    const showParameters = () => {
        return (
            <Grid templateColumns="2fr 1fr">
                <Flex
                    xcss={xcss({
                        alignContent: 'center',
                        verticalAlign: 'center',
                        alignItems: 'center',
                    })}>
                    <Text align="center" weight="bold">
                        Mapped To: {name}({paramCode})
                    </Text>
                </Flex>
                <Flex>
                    <ParameterBox
                        handleChangeDefault={(id, param) => {
                            setParamCode(param.ID);
                            setName(param.ShowName);
                            setParameter(
                                ParameterHelper.getWithParameterCode(
                                    props.parameters,
                                    param.ID
                                )
                            );
                        }}
                        parameters={props.parameters}
                    />
                </Flex>
            </Grid>
        );
    };

    const showUnits = () => {
        return (
            <Grid
                templateColumns="2fr 1fr"
                xcss={xcss({ marginTop: 'space.025' })}>
                <Flex
                    xcss={xcss({
                        alignContent: 'center',
                        verticalAlign: 'center',
                        alignItems: 'center',
                    })}>
                    {parameter !== undefined ? (
                        <Text align="center">
                            {UnitHelper.getCategoryName(
                                unitCatetoryId,
                                props.units
                            )}{' '}
                            {'> '}
                            {UnitHelper.getUnitName(
                                unitCatetoryId,
                                unitId,
                                props.units
                            )}
                        </Text>
                    ) : (
                        <Text weight="bold">Select A Parameter</Text>
                    )}
                </Flex>
                <Flex>
                    {parameter !== undefined ? (
                        <UnitBox
                            units={props.units}
                            selectedParameter={parameter}
                            handleChange={(unit, category, defaultUnit) => {
                                setUnitCategoryId(category.id);
                                setUnitId(unit.id);
                                setUnitDefaultId(defaultUnit.id);
                            }}
                            handleParameterChange={(
                                unit,
                                category,
                                defaultUnit
                            ) => {
                                setUnitCategoryId(category.id);
                                setUnitId(unit.id);
                                setUnitDefaultId(defaultUnit.id);
                            }}
                        />
                    ) : (
                        <></>
                    )}
                </Flex>
            </Grid>
        );
    };

    const showColors = () => {
        if (props.component === undefined) return <></>;
        if ('color' in props.component)
            return (
                <Grid
                    templateColumns="2fr 1fr"
                    xcss={xcss({ marginTop: 'space.025' })}>
                    <Flex
                        xcss={xcss({
                            alignContent: 'center',
                            verticalAlign: 'center',
                            alignItems: 'center',
                        })}>
                        Parameter Color
                    </Flex>
                    <Flex>
                        <ColorBox
                            current={color}
                            colors={ColorHelper.getAllColors()}
                            handleCurrentChange={(c) => {
                                setColor(c);
                            }}
                        />
                    </Flex>
                </Grid>
            );
        return <></>;
    };

    const showMin = () => {
        if (props.component === undefined) return <></>;
        if (!('min' in props.component)) return <></>;

        return (
            <Grid
                templateColumns="2fr 1fr"
                xcss={xcss({ marginTop: 'space.025' })}>
                <Flex
                    xcss={xcss({
                        alignContent: 'center',
                        verticalAlign: 'center',
                        alignItems: 'center',
                    })}>
                    Parameter Minimum Value
                </Flex>
                <Flex>
                    <TextField
                        type="text"
                        value={minStr}
                        onChange={(event) => {
                            setMinStr(event.currentTarget.value);
                            setMin(parseFloat(event.currentTarget.value));
                        }}
                    />
                </Flex>
            </Grid>
        );
    };

    const showMax = () => {
        if (props.component === undefined) return <></>;
        if (!('max' in props.component)) return <></>;

        return (
            <Grid
                templateColumns="2fr 1fr"
                xcss={xcss({ marginTop: 'space.025' })}>
                <Flex
                    xcss={xcss({
                        alignContent: 'center',
                        verticalAlign: 'center',
                        alignItems: 'center',
                    })}>
                    Parameter Maximum Value
                </Flex>
                <Flex>
                    <TextField
                        type="text"
                        value={maxStr}
                        onChange={(event) => {
                            setMaxStr(event.currentTarget.value);
                            setMax(parseFloat(event.currentTarget.value));
                        }}
                    />
                </Flex>
            </Grid>
        );
    };

    const showStroke = () => {
        if (props.component === undefined) return <></>;
        if (!('stroke' in props.component)) return <></>;

        return (
            <Grid
                templateColumns="2fr 1fr"
                xcss={xcss({ marginTop: 'space.025' })}>
                <Flex
                    xcss={xcss({
                        alignContent: 'center',
                        verticalAlign: 'center',
                        alignItems: 'center',
                    })}>
                    Line Stroke
                </Flex>
                <Flex>
                    <PopupSelect
                        options={Object.keys(allStrokes).map((key: string) => {
                            const keyNum = parseInt(key, 10);
                            return { label: allStrokes[keyNum], value: keyNum };
                        })}
                        value={{
                            label: ParameterHelper.getStrokeById(stroke),
                            value: stroke as StrokeType,
                        }}
                        target={({ isOpen, ...triggerprops }) => (
                            <Button
                                shouldFitContainer
                                {...triggerprops}
                                iconAfter={ChevronDownIcon}>
                                {ParameterHelper.getStrokeById(stroke)}
                            </Button>
                        )}
                        onChange={(elem) => {
                            if (elem === undefined) return;
                            if (elem === null) return;
                            setStroke(elem.value as StrokeType);
                        }}
                    />
                </Flex>
            </Grid>
        );
    };

    const body = () => {
        if (props.component === undefined) return <>component is empty</>;
        return (
            <Stack xcss={xcss({ width: '100%', paddingTop: 'space.100' })}>
                <Grid>
                    {showError()}
                    {showParameters()}
                    {showUnits()}
                    {showColors()}
                    {showMin()}
                    {showMax()}
                    {showStroke()}
                </Grid>
            </Stack>
        );
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
                                        <InlineEdit
                                            defaultValue={name}
                                            editButtonLabel={name}
                                            editView={({
                                                errorMessage,
                                                ...fieldProps
                                            }) => (
                                                <TextField
                                                    {...fieldProps}
                                                    autoFocus
                                                    value={name}
                                                    onChange={(e) => {
                                                        setName(
                                                            e.currentTarget
                                                                .value
                                                        );
                                                    }}
                                                />
                                            )}
                                            readView={() => (
                                                <Box
                                                    xcss={
                                                        readViewContainerStyles
                                                    }
                                                    testId="read-view">
                                                    {name}
                                                </Box>
                                            )}
                                            onConfirm={(value) =>
                                                setName(value)
                                            }
                                        />
                                    </ModalTitle>
                                </Flex>
                            </Grid>
                        </ModalHeader>
                        <ModalBody>{body()}</ModalBody>
                        <ModalFooter>
                            <Button appearance="primary" onClick={closeModal}>
                                Apply
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
    defaultComponent: ParameterUIBaseData;
    onChange: ParameterOnChangeEvent;
}

//
export const Parameters = (props: ParametersProps) => {
    const [update, setUpdate] = useState(false);
    const [updateParameterModal, setUpdateParameterModal] = useState(false);
    const [updateYesNoModal, setUpdateYesNoModal] = useState(false);

    const [openParameterDialog, setOpenParameterDialog] = useState(false);
    const [openYesNoDialog, setOpenYesNoDialog] = useState(false);

    const [indexToDelete, setIndexToDelete] = useState<number | undefined>();

    const [component, setComponent] = useState<
        ParameterUIBaseData | undefined
    >();

    useEffect(() => {
        openModal();
    }, [updateParameterModal]);

    useEffect(() => {
        if (indexToDelete === undefined) return;
        setOpenYesNoDialog(true);
    }, [updateYesNoModal]);

    useEffect(() => {
        if (component === undefined) return;
        if (openParameterDialog === true) return;

        props.onChange('update', component);
    }, [openParameterDialog]);

    const openModal = () => {
        if (component === undefined) return;
        setOpenParameterDialog(true);
    };

    const parameterModal = () => {
        return (
            <ParametersModal
                openDialog={openParameterDialog}
                setOpenDialog={setOpenParameterDialog}
                component={component}
                {...props}
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

    const yesNoModal = () => {
        if (!openYesNoDialog) return <></>;
        return (
            <MessageBoxYesNo
                title="Delete Parameter"
                message="Do you want to delete this parameter?"
                openDialog={openYesNoDialog}
                setOpenDialog={setOpenYesNoDialog}
                yes={() => {
                    setOpenYesNoDialog(false);

                    if (indexToDelete === undefined) return;
                    const deletedItem = props.components.elements.splice(
                        indexToDelete,
                        1
                    );

                    if (deletedItem !== undefined && deletedItem.length > 0)
                        props.onChange('delete', deletedItem[0]);
                }}
                no={() => {
                    setOpenYesNoDialog(false);
                }}
            />
        );
    };

    return (
        <Stack xcss={xcss({ width: '100%', paddingTop: 'space.100' })}>
            {yesNoModal()}
            {parameterModal()}
            <Box xcss={gridStyles}>
                <Flex justifyContent="end">
                    <IconButton
                        appearance="primary"
                        icon={AddIcon}
                        label="Add Parameters"
                        testId="parameters-list-add"
                        onClick={() => {
                            props.components.elements.push({
                                ...props.defaultComponent,
                            });
                            setUpdate(!update);
                            props.onChange('add', props.defaultComponent);
                        }}
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
                                            element.unitCategoryID,
                                            element.unitID,
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
                                            setUpdateParameterModal(
                                                !updateParameterModal
                                            );
                                        }, 500);
                                    },
                                },
                                {
                                    content: 'remove',
                                    testId: `parameters-list-test-${index}-delete`,
                                    onClick: () => {
                                        setIndexToDelete(index);
                                        setUpdateYesNoModal(!updateYesNoModal);
                                    },
                                },
                            ]}
                        />
                    </Box>
                );
            })}
        </Stack>
    );
};
