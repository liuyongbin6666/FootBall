import { Node, tween, UIOpacity, UITransform, Vec3 } from 'cc';
import { UIAnimationType } from './Enums/UIAnimationType';
import { SDK } from '../Sdk/SDK';

/**
 * UI动画工具类
 * 提供界面打开和关闭的动画效果
 */
export class UIAnimationUtils {
    /** 动画持续时间 */
    private static readonly DURATION: number = 0.3;
    /** 缩放起始值 */
    private static readonly SCALE_FROM: number = 0.3;
    /** 缩放结束值 */
    private static readonly SCALE_TO: number = 1.0;
    /** 透明度起始值 */
    private static readonly OPACITY_FROM: number = 0;
    /** 透明度结束值 */
    private static readonly OPACITY_TO: number = 255;

    /**
     * 播放打开动画
     * @param node 目标节点
     * @param animType 动画类型
     * @param resolve 完成回调
     */
    public static async playOpenAnimation(node: Node, animType: UIAnimationType) {
        // 重置节点状态
        node.active = true;

       
    }

    /**
     * 播放关闭动画
     * @param node 目标节点
     * @param animType 动画类型
     */
    public static async playCloseAnimation(node: Node, animType: UIAnimationType): Promise<void> {
        switch (animType) {
            case UIAnimationType.NONE:
                node.active = false;
                break;

            case UIAnimationType.SCALE:
                await this.playScaleCloseAnimation(node);
                break;

            case UIAnimationType.FADE:
                await this.playFadeCloseAnimation(node);
                break;

            default:
                node.active = false;
                break;
        }
    }

    /**
     * 播放缩放打开动画
     * @param node 目标节点
     * @param resolve 完成回调
     */
    private static playScaleOpenAnimation(node: Node) {
        return new Promise<void>((resolve) => {
            // 设置初始缩放
            node.scale = new Vec3(this.SCALE_FROM, this.SCALE_FROM, 1);

            // 执行缩放动画
            tween(node)
                .to(this.DURATION, { scale: new Vec3(this.SCALE_TO, this.SCALE_TO, 1) }, { easing: 'backOut' })
                .call(() => {
                    resolve();
                })
                .start();
        })
    }

    /**
     * 播放缩放关闭动画
     * @param node 目标节点
     */
    private static playScaleCloseAnimation(node: Node) {
        return new Promise<void>((resolve) => {
            // 执行缩放动画
            tween(node)
                .to(this.DURATION, { scale: new Vec3(this.SCALE_FROM, this.SCALE_FROM, 1) }, { easing: 'backIn' })
                .call(() => {
                    node.active = false;
                    // 重置缩放
                    node.scale = new Vec3(this.SCALE_TO, this.SCALE_TO, 1);
                    resolve();
                })
                .start();
        })
    }

    /**
     * 播放渐隐渐显打开动画
     * @param node 目标节点
     */
    private static playFadeOpenAnimation(node: Node) {
        return new Promise<void>((resolve) => {
            // 获取或添加UIOpacity组件
            let uiOpacity = node.getComponent(UIOpacity);
            if (!uiOpacity) {
                uiOpacity = node.addComponent(UIOpacity);
            }

            // 设置初始透明度
            uiOpacity.opacity = this.OPACITY_FROM;

            // 执行渐变动画
            tween(uiOpacity)
                .to(this.DURATION, { opacity: this.OPACITY_TO }, { easing: 'quadOut' })
                .call(() => {
                    resolve();
                })
                .start();
        })
    }

    /**
     * 播放渐隐渐显关闭动画
     * @param node 目标节点
     */
    private static playFadeCloseAnimation(node: Node) {
        return new Promise<void>((resolve) => {
            // 获取或添加UIOpacity组件
            let uiOpacity = node.getComponent(UIOpacity);
            if (!uiOpacity) {
                uiOpacity = node.addComponent(UIOpacity);
            }

            // 执行渐变动画
            tween(uiOpacity)
                .to(this.DURATION, { opacity: this.OPACITY_FROM }, { easing: 'quadIn' })
                .call(() => {
                    node.active = false;
                    // 重置透明度
                    uiOpacity.opacity = this.OPACITY_TO;
                    resolve();
                })
                .start();

        })
    }
} 