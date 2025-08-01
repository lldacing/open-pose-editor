import React, { useEffect, useMemo, useState } from 'react'
import * as Popover from '@radix-ui/react-popover'
import { PinLeftIcon } from '@radix-ui/react-icons'
import classes from './styles.module.css'
import Slider from '../Slider'
import { BodyEditor } from '../../editor'
import useForceUpdate from '../../hooks/useFoceUpdate'
import i18n from '../../i18n'
import { BodyController } from '../../body'

const { PopoverContent, IconButton, PopoverArrow, Input } = classes

const Slider2: React.FC<{
    type: 'int' | 'float' | undefined
    name: string
    range: [number, number]
    getValue(): number
    onChange?: (value: number) => void
    onValueCommit?: (value: number) => void
    forceUpdate: () => any
}> = ({
    type,
    name,
    range,
    getValue,
    onChange,
    onValueCommit,
    forceUpdate,
}) => {
    const value = getValue()
    const [inputValue, setInputValue] = useState(() =>
        type == 'int' ? value.toString() : getValue().toFixed(2)
    )

    useEffect(() => {
        setInputValue(type == 'int' ? value.toString() : getValue().toFixed(2))
    }, [value])

    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'flex-end',
            }}
        >
            <div
                style={{
                    minWidth: 60,
                    maxWidth: 120,
                    // width:"max-content",
                    overflow: 'hidden',
                    color: 'gray',
                    fontSize: '70%',
                    marginInlineEnd: 10,
                    // whiteSpace: 'nowrap',
                    textAlign: 'end',
                    textOverflow: 'ellipsis',
                }}
            >
                {name}
            </div>
            <Slider
                key={name}
                range={range}
                value={getValue()}
                onValueChange={(value: number) => {
                    if (type == 'int') {
                        onChange?.(Math.round(value))
                    } else onChange?.(value)
                    forceUpdate()
                }}
                onValueCommit={onValueCommit}
                style={{
                    width: 150,
                }}
            ></Slider>
            <input
                className={Input}
                type={type === 'int' ? 'number' : 'text'}
                style={{
                    marginInlineStart: 10,
                    width: 60,
                    height: 20,
                    color: 'gray',
                    fontSize: '70%',
                }}
                value={inputValue}
                onChange={(event) => {
                    const value = event.target.value

                    setInputValue(value)

                    // 当输入有效数字时，同时更新slider
                    const numValue = parseFloat(value)
                    if (!isNaN(numValue)) {
                        // 确保数值在范围内
                        const clampedValue = Math.max(Math.min(numValue, range[1]), range[0])
                        if (type == 'int') {
                            onChange?.(Math.round(clampedValue))
                        } else {
                            onChange?.(clampedValue)
                        }
                        forceUpdate()
                    }
                }}
                onBlur={() => {
                    try {
                        let v = parseFloat(inputValue)
                        if (isNaN(v)) throw 'Is NaN'
                        v = Math.max(Math.min(v, range[1]), range[0])
                        console.debug(v)
                        onChange?.(v)
                    } catch (error) {
                        console.log('invalid input')
                        setInputValue(value.toString())
                    }
                }}
            ></input>
        </div>
    )
}

function GetCameraParamController(editor: BodyEditor) {
    const CameraParamsInit = {
        OutputWidth: { type: 'int', range: [128, 3000], name: i18n.t('Width') },
        OutputHeight: {
            type: 'int',
            range: [128, 3000],
            name: i18n.t('Height'),
        },
        CameraNear: { range: [0.1, 2000], name: i18n.t('Camera Near') },
        CameraFar: { range: [0.1, 20000], name: i18n.t('Camera Far') },
        CameraFocalLength: {
            range: [0.1, 100],
            name: i18n.t('Camera Focal Length'),
        },
    } as const

    return Object.entries(
        CameraParamsInit as Record<
            keyof typeof CameraParamsInit,
            {
                type: 'int' | 'float' | undefined
                range: [number, number]
                name: string
            }
        >
    ).map(([paramName, { type, range, name }]) => {
        return {
            type,
            name,
            range,
            getValue() {
                const value = editor[paramName as keyof typeof CameraParamsInit]
                // webui exception in launch
                return isNaN(value) ? range[0] : value
            },
            onChange(value: number) {
                editor[paramName as keyof typeof CameraParamsInit] = value
            },
        }
    })
}

function GetBodyParamController(editor: BodyEditor) {
    const BodyParamsInit = {
        BoneThickness: { range: [0.1, 3], name: i18n.t('Bone Thickness') },
        HeadSize: { range: [0.1, 100], name: i18n.t('Head Size') },
        NoseToNeck: { range: [0.1, 100], name: i18n.t('Nose To Neck') },
        ShoulderWidth: { range: [0.1, 100], name: i18n.t('Shoulder Width') },
        ShoulderToHip: { range: [0.1, 100], name: i18n.t('Shoulder To Hip') },
        ArmLength: { range: [0.1, 100], name: i18n.t('Arm Length') },
        Forearm: { range: [0.1, 100], name: i18n.t('Forearm') },
        UpperArm: { range: [0.1, 100], name: i18n.t('Upper Arm') },
        HandSize: { range: [0.1, 10], name: i18n.t('Hand Size') },
        Hips: { range: [0.1, 100], name: i18n.t('Hips') },
        LegLength: { range: [0.1, 100], name: i18n.t('Leg Length') },
        Thigh: { range: [0.1, 100], name: i18n.t('Thigh') },
        LowerLeg: { range: [0.1, 100], name: i18n.t('Lower Leg') },
        FootSize: { range: [0.1, 10], name: i18n.t('Foot Size') },
    } as const

    function PushExecuteBodyParamsCommand(
        editor: BodyEditor,
        controller: BodyController,
        name: keyof typeof BodyParamsInit,
        oldValue: number,
        value: number
    ) {
        console.debug(oldValue, value)
        const cmd = {
            execute: () => {
                controller[name] = value
                controller.Update()
            },
            undo: () => {
                controller[name] = oldValue
                controller.Update()
            },
        }
        cmd.execute()
        editor.pushCommand(cmd)
    }

    let currentBody = editor.getSelectedBody()
    let currentController: BodyController | null = currentBody
        ? new BodyController(currentBody)
        : null

    const getCurrentController = () => {
        const body = editor.getSelectedBody()

        if (body !== currentBody) {
            currentBody = body
            currentController = body ? new BodyController(body) : null
        }

        return currentController
    }

    let oldValue = 0
    let changing = false

    return Object.entries(
        BodyParamsInit as Record<
            keyof typeof BodyParamsInit,
            {
                type: 'int' | 'float' | undefined
                range: [number, number]
                name: string
            }
        >
    ).map(([_paramName, { type, range, name }]) => {
        return {
            type,
            name,
            range,
            getValue: () => {
                const paramName = _paramName as keyof typeof BodyParamsInit
                const controller = getCurrentController()
                if (controller) {
                    return controller[paramName]
                }
                return -1
            },
            onChange(value: number) {
                const paramName = _paramName as keyof typeof BodyParamsInit
                const controller = getCurrentController()

                if (controller) {
                    // the first time
                    if (!changing) oldValue = controller[paramName]
                    changing = true
                    controller[paramName] = value
                }
            },
            onValueCommit(value: number) {
                const paramName = _paramName as keyof typeof BodyParamsInit
                const controller = getCurrentController()

                if (controller) {
                    changing = false
                    PushExecuteBodyParamsCommand(
                        editor,
                        controller,
                        paramName,
                        oldValue,
                        value
                    )
                    controller[paramName] = value
                }
            },
        }
    })
}

const ControllerPopover: React.FC<{
    editor: BodyEditor
    style?: React.CSSProperties
}> = ({ editor, style }) => {
    const forceUpdate = useForceUpdate()
    const [open, setOpen] = useState(false)

    const cameraParamController = useMemo(() => {
        return GetCameraParamController(editor)
    }, [editor])
    const bodyParamController = useMemo(() => {
        return GetBodyParamController(editor)
    }, [editor])

    const [bodySelected, setBodySelected] = useState(false)
    useEffect(() => {
        const select = () => {
            setBodySelected(true)
        }
        const unselect = () => {
            setBodySelected(false)
        }
        editor.SelectEventManager.AddEventListener(select)
        editor.UnselectEventManager.AddEventListener(unselect)

        return () => {
            editor.SelectEventManager.RemoveEventListener(select)
            editor.UnselectEventManager.RemoveEventListener(unselect)
        }
    }, [editor])
    return (
        <Popover.Root open={open}>
            <Popover.Trigger asChild>
                <button
                    className={IconButton}
                    style={style}
                    onClick={() => setOpen((v) => !v)}
                >
                    <PinLeftIcon />
                </button>
            </Popover.Trigger>
            <Popover.Portal>
                <Popover.Content className={PopoverContent} sideOffset={5}>
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 10,
                        }}
                    >
                        {cameraParamController.map((props, index) => (
                            <Slider2
                                key={index}
                                {...props}
                                forceUpdate={forceUpdate}
                            ></Slider2>
                        ))}
                        {bodySelected ? (
                            <>
                                <div
                                    style={{
                                        fontSize: 15,
                                        marginTop: 10,
                                        marginBottom: 8,
                                    }}
                                >
                                    {i18n.t('Body Parameters')}
                                </div>
                                {bodyParamController.map((props, index) => (
                                    <Slider2
                                        key={index}
                                        {...props}
                                        forceUpdate={forceUpdate}
                                    ></Slider2>
                                ))}
                            </>
                        ) : undefined}
                    </div>
                    <Popover.Arrow className={PopoverArrow} />
                </Popover.Content>
            </Popover.Portal>
        </Popover.Root>
    )
}

export default ControllerPopover