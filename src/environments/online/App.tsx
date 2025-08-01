import React, { useCallback, useEffect, useRef, useState } from 'react'
import { download } from '../../utils/transfer'
import classes from './App.module.css'
import Menu from '../../components/Menu'
import PopupOver from '../../components/PopupOver'
import { useBodyEditor } from '../../hooks'
import {
    LockClosedIcon,
    LockOpen2Icon,
    ResetIcon,
    ResumeIcon,
    EyeOpenIcon,
    EyeNoneIcon,
} from '@radix-ui/react-icons'
import { getCurrentTime } from '../../utils/time'
import useMessageDispatch, {sendToAll} from '../../hooks/useMessageDispatch'

const { app, threejsCanvas, gallery, background } = classes

// 添加尺寸显示组件
const SizeDisplay: React.FC<{ width: number; height: number }> = ({ width, height }) => {
    return (
        <div style={{
            position: 'absolute',
            top: 10,
            left: 10,
            background: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            padding: '5px 10px',
            borderRadius: 5,
            fontSize: 12,
            zIndex: 100,
        }}>
            {width} × {height}
        </div>
    )
}

const PreviewCanvas = React.forwardRef<
    HTMLCanvasElement,
    {
        isLock: boolean
        enable: boolean
        eyeOpen: boolean
        onChange: (isLock: boolean) => void
        onRestore: () => void
        onRun: () => void
        onEye: () => void
    }
>(({ isLock, enable, eyeOpen, onChange, onRestore, onRun, onEye }, ref) => {
    const Icon = isLock ? LockClosedIcon : LockOpen2Icon
    const ToggleImagesIcon = eyeOpen ? EyeOpenIcon : EyeNoneIcon

    return (
        <div
            style={{
                position: 'relative',
                display: enable ? 'flex' : 'none',
                justifyContent: 'center',
                // backgroundColor: 'gray',
            }}
        >
            <canvas
                ref={ref}
                style={{
                    objectFit: 'contain',
                    width: 'unset',
                    // height:"unset",
                    maxHeight: '100%',
                    maxWidth: 300,
                }}
            ></canvas>
            <ToggleImagesIcon
                style={{
                    position: 'absolute',
                    top: -10,
                    right: 5,
                    backgroundColor: 'white',
                    borderRadius: 10,
                    padding: 5,
                }}
                onClick={() => {
                    onEye()
                }}
            />
            <ResumeIcon
                style={{
                    position: 'absolute',
                    top: 20,
                    right: 5,
                    backgroundColor: 'white',
                    borderRadius: 10,
                    padding: 5,
                }}
                onClick={() => {
                    onRun()
                }}
            ></ResumeIcon>
            <Icon
                style={{
                    position: 'absolute',
                    top: 50,
                    right: 5,
                    backgroundColor: 'white',
                    borderRadius: 10,
                    padding: 5,
                }}
                onClick={() => {
                    onChange(!isLock)
                }}
            ></Icon>

            <ResetIcon
                style={{
                    position: 'absolute',
                    top: 80,
                    right: 5,
                    backgroundColor: !isLock ? 'gray' : 'white',
                    borderRadius: 10,
                    padding: 5,
                }}
                onClick={() => {
                    if (isLock) onRestore()
                }}
            ></ResetIcon>
        </div>
    )
})

function App() {
    const canvasRef = useRef(null)
    const previewCanvasRef = useRef(null)

    const backgroundRef = useRef<HTMLDivElement>(null)
    const {editor, isModelLoaded} = useBodyEditor(canvasRef, previewCanvasRef, backgroundRef)
    const [imageData, setImageData] = useState<
        Record<string, { title: string; src: string }>
    >(() => ({
        pose: {
            title: '',
            src: '',
        },
        depth: {
            title: '',
            src: '',
        },
        normal: {
            title: '',
            src: '',
        },
        canny: {
            title: '',
            src: '',
        },
    }))

    // 添加状态用于跟踪输出尺寸
    const [outputSize, setOutputSize] = useState({ width: 512, height: 512 })

    const onChangeBackground = useCallback((url: string) => {
        const div = backgroundRef.current
        if (div) {
            div.style.backgroundImage = url ? `url(${url})` : 'none'
        }
    }, [])

    const onScreenShot = useCallback(
        (data: Record<string, { src: string; title: string }>) => {
            setImageData(data)
        },
        []
    )

    const [preview, setPreview] = useState(false)
    const [lockView, setLockView] = useState(false)
    // 添加状态用于控制图像显示/隐藏
    const [imagesVisible, setImagesVisible] = useState(false)

    useEffect(() => {
        const preview = (enable: boolean) => {
            setPreview(enable)
        }

        const lockView = (value: boolean) => {
            setLockView(value)
        }

        const onSceneReady = () => {
            sendToAll({
                method: 'SceneReady',
                type: 'event',
                payload: null
            })
        }

        editor?.PreviewEventManager.AddEventListener(preview)
        editor?.LockViewEventManager.AddEventListener(lockView)
        editor?.SceneReadyEventManager?.AddEventListener(onSceneReady)

        return () => {
            editor?.PreviewEventManager.RemoveEventListener(preview)
            editor?.LockViewEventManager.RemoveEventListener(lockView)
            editor?.SceneReadyEventManager?.RemoveEventListener(onSceneReady)
        }
    }, [editor])

    useMessageDispatch({
        GetAppVersion: () => __APP_VERSION__,
        MakeImages: () => editor?.MakeImages(),
        Pause: () => editor?.pause(),
        Resume: () => editor?.resume(),
        OutputWidth: (value: number) => {
            if (editor && typeof value === 'number') {
                editor.OutputWidth = value
                return true
            } else return false
        },
        OutputHeight: (value: number) => {
            if (editor && typeof value === 'number') {
                editor.OutputHeight = value
                return true
            } else return false
        },
        SetOutputSize: (width: number, height: number) => {
            if (editor && typeof width === 'number' && typeof height === 'number') {
                editor.OutputWidth = width
                editor.OutputHeight = height
                return true
            } else return false
        },
        GetOutputSize: () => {
            if (editor) {
                return  { width: editor.OutputWidth, height: editor.OutputHeight }
            }
            return {}
        },
        OnlyHand(value: boolean) {
            if (editor && typeof value === 'boolean') {
                editor.OnlyHand = value
                return true
            } else return false
        },
        MoveMode(value: boolean) {
            if (editor && typeof value === 'boolean') {
                editor.MoveMode = value
                return true
            } else return false
        },
        GetWidth: () => editor?.Width,
        GetHeight: () => editor?.Height,
        GetSceneData: () => editor?.GetSceneData(),
        LockView: () => editor?.LockView(),
        UnlockView: () => editor?.UnlockView(),
        RestoreView: () => editor?.RestoreView(),
        IsModelLoaded: () => isModelLoaded,
    })

    // 当模型加载完成时发送消息
    useEffect(() => {
        if (isModelLoaded) {
            // 发送消息给父窗口，告知模型已加载完成
            sendToAll({
                method: 'ModelLoaded',
                type: 'event',
                payload: null
            })
        }
    }, [isModelLoaded])

    // 添加一个 effect 来监听 editor 尺寸变化
    useEffect(() => {
        if (editor) {
            // 初始化时设置正确的尺寸
            setOutputSize({
                width: editor.OutputWidth,
                height: editor.OutputHeight
            });
            
            // 添加事件监听器，当editor尺寸变化时更新状态
            const handleOutputSizeChange = () => {
                setOutputSize({
                    width: editor.OutputWidth,
                    height: editor.OutputHeight
                });
            };
            
            editor.OutputSizeUpdateEventManager?.AddEventListener(handleOutputSizeChange);
            
            return () => {
                editor.OutputSizeUpdateEventManager?.RemoveEventListener(handleOutputSizeChange);
            };
        }
    }, [editor]);

    return (
        <div ref={backgroundRef} className={background}>
            {/* 添加尺寸显示组件 */}
            <SizeDisplay width={outputSize.width} height={outputSize.height} />
            <canvas
                className={threejsCanvas}
                tabIndex={-1}
                ref={canvasRef}
                onContextMenu={(e) => {
                    e.preventDefault()
                }}
            ></canvas>
            <div className={gallery}>
                {/* 根据 imagesVisible 状态决定是否显示图像 */}
                {imagesVisible && Object.entries(imageData).map(([name, { src, title }]) => (
                    <img
                        key={name}
                        // avoid show error image
                        {...(src ? { src } : {})}
                        title={title}
                        onClick={(e) => {
                            const image = e.target as HTMLImageElement
                            const title = image?.getAttribute('title') ?? ''
                            const url = image?.getAttribute('src') ?? ''
                            download(url, title)
                        }}
                    ></img>
                ))}
                <PreviewCanvas
                    enable={preview}
                    ref={previewCanvasRef}
                    isLock={lockView}
                    eyeOpen={imagesVisible}
                    onChange={(isLock) => {
                        if (isLock) {
                            editor?.LockView()
                        } else {
                            editor?.UnlockView()
                        }
                    }}
                    onRestore={() => {
                        editor?.RestoreView()
                    }}
                    onRun={async () => {
                        if (!editor) return
                        const image = editor.MakeImages()
                        const result = Object.fromEntries(
                            Object.entries(image).map(([name, imgData]) => [
                                name,
                                {
                                    src: imgData,
                                    title: name + '_' + getCurrentTime(),
                                },
                            ])
                        )
                        onScreenShot(result)
                    }}
                    onEye={() => {
                        setImagesVisible(!imagesVisible)
                    }}
                ></PreviewCanvas>
            </div>
            <div
                className={app}
                style={{
                    pointerEvents: 'none',
                }}
            >
                <div
                    style={{
                        pointerEvents: 'initial',
                        marginTop: 10,
                        display: 'flex',
                        justifyContent: 'center',
                    }}
                >
                    {editor ? (
                        <Menu
                            editor={editor}
                            onChangeBackground={onChangeBackground}
                            onScreenShot={onScreenShot}
                        />
                    ) : undefined}
                </div>
            </div>
            {editor ? (
                <PopupOver
                    editor={editor}
                    style={{
                        pointerEvents: 'initial',
                        position: 'fixed',
                        top: 10,
                        right: 10,
                    }}
                ></PopupOver>
            ) : undefined}
        </div>
    )
}

export default App