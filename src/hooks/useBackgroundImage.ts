import { useEffect, useState } from 'react';
import { BodyEditor } from '../editor';

/**
 * 自定义Hook用于检测编辑器是否有背景图
 * 使用BodyEditor的backgroundRef来检测背景图状态，避免使用定时器
 * @param editor - BodyEditor实例
 * @returns boolean - 是否有背景图
 */
export const useBackgroundImage = (editor: BodyEditor | undefined): boolean => {
    const [hasBackgroundImage, setHasBackgroundImage] = useState(false);

    useEffect(() => {
        // 如果没有editor实例，则直接返回
        if (!editor) return;

        // 检查当前是否有背景图
        const checkBackgroundImage = () => {
            // 使用editor的backgroundRef来检查背景图
            if (editor.backgroundRef?.current) {
                const computedStyle = getComputedStyle(editor.backgroundRef.current);
                const backgroundImage = computedStyle.backgroundImage;
                return backgroundImage !== 'none' && backgroundImage !== '';
            }
            return false;
        };

        // 初始化背景图状态检查
        const initialHasImage = checkBackgroundImage();
        setHasBackgroundImage(initialHasImage);

        // 创建MutationObserver来监听backgroundRef元素的样式变化
        let observer: MutationObserver | null = null;
        
        if (editor.backgroundRef?.current) {
            // 使用MutationObserver监听DOM变化
            observer = new MutationObserver(() => {
                const hasImage = checkBackgroundImage();
                setHasBackgroundImage(hasImage);
            });
            
            // 开始观察backgroundRef元素的属性变化
            observer.observe(editor.backgroundRef.current, {
                attributes: true,
                attributeFilter: ['style']
            });
        }

        // 清理函数
        return () => {
            if (observer) {
                observer.disconnect();
            }
        };
    }, [editor]);

    return hasBackgroundImage;
};