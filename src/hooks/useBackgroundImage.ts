import { useEffect, useState } from 'react';
import { BodyEditor } from '../editor';

export const useBackgroundImage = (editor: BodyEditor) => {
    const [hasBackgroundImage, setHasBackgroundImage] = useState(false);

    // 监听背景图变化
    useEffect(() => {
        const checkBackgroundImage = () => {
            if (editor && editor.parentElem instanceof HTMLElement) {
                const computedStyle = getComputedStyle(editor.parentElem);
                const backgroundImage = computedStyle.backgroundImage;
                setHasBackgroundImage(backgroundImage !== 'none' && backgroundImage !== '');
            }
        };

        // 初始检查
        checkBackgroundImage();

        // 添加一个定时器，定期检查背景图状态，确保状态同步
        const interval = setInterval(checkBackgroundImage, 1000);

        return () => {
            // 清除定时器
            clearInterval(interval);
        };
    }, [editor]);

    return hasBackgroundImage;
};