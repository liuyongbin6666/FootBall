import { _decorator, Component, Enum, game, Node } from 'cc';
import { AudioMgr } from '../Manager/AudioMgr';
import { SDKEvent } from '../Sdk/exp/SDKEvent';
import { UIAnimationType } from './Enums/UIAnimationType';
import { UILayerType } from './Enums/UILayerType';
import { IUIPanel } from './Interfaces/IUIPanel';
import { UIAnimationUtils } from './UIAnimationUtils';
import { UIMgr } from './UIMgr';

const { ccclass, property } = _decorator;

/**
 * UI面板基类
 * 所有UI面板的基类，实现IUIPanel接口
 */
@ccclass('UIPanelBase')
export class UIPanelBase extends Component implements IUIPanel {
    /** 面板是否可见 */
    protected _visible: boolean = false;
    /** 面板层级类型 */
    @property({
        type: Enum(UILayerType), displayName: "面板层级类型", tooltip: `面板层级类型<br>
        BACKGROUND_0: 底层界面<br>
        NORMAL_1: 正常界面<br>
        POPUP_2: 弹窗界面<br>
        TIPS_3: 提示界面<br>
        TOP_4: 最上层界面<br>
        SYSTEM_5: 系统界面<br>
        SYSTEM_6: 系统界面` })
    public layerType: UILayerType = UILayerType.NORMAL_1;

    @property({ type: Node, displayName: "nd_animObj" })
    nd_animObj: Node;

    /** 面板打开动画类型 */
    @property({
        type: Enum(UIAnimationType), displayName: "面板打开动画类型", tooltip: `面板打开动画类型<br>
        NONE: 无动画<br>
        SCALE: 缩放动画<br>
        FADE: 渐隐渐显动画` })
    public openAnimType: UIAnimationType = UIAnimationType.NONE;
    /** 面板关闭动画类型 */
    @property({
        type: Enum(UIAnimationType), displayName: "面板关闭动画类型", tooltip: `面板关闭动画类型<br>
        NONE: 无动画<br>
        SCALE: 缩放动画<br>
        FADE: 渐隐渐显动画` })
    public closeAnimType: UIAnimationType = UIAnimationType.NONE;

    @property({ displayName: "是否缓存面板" })
    isCache: Boolean = false;

    /** 是否为全局UI（场景切换时保持显示） */
    @property({ displayName: "是否为全局UI", tooltip: "场景切换时是否保持显示" })
    public isGlobalUI: boolean = false;

    /** 面板自定义数据 */
    protected _panelData: { [key: string]: any } = null;
    public classzName: string
    public prefabPath: string
    public bundleName: string
    public animObj: Node;

    /**
     * 初始化面板
     */
    public initialize(classzName: string, prefabPath: string, bundleName: string): void {
        // 隐藏面板
        this.node.active = false;

        this.classzName = classzName;
        this.prefabPath = prefabPath;
        this.bundleName = bundleName;
        this.animObj = this.nd_animObj ? this.nd_animObj : this.node;
        //if(this.nd_animObj)
    }

    /**
     * 获取面板根节点
     */
    public getRoot(): Node {
        return this.node;
    }

    /**
     * 获取面板层级类型
     */
    public getUILayerType(): UILayerType {
        return this.layerType;
    }

    /**
     * 获取面板打开动画类型
     */
    public getOpenAnimationType(): UIAnimationType {
        return this.openAnimType;
    }

    /**
     * 获取面板关闭动画类型
     */
    public getCloseAnimationType(): UIAnimationType {
        return this.closeAnimType;
    }

    /**
     * 面板是否可见
     */
    public isVisible(): boolean {
        return this._visible;
    }



    /**
     * 打开面板
     * @param data 面板参数
     */
    public async open(data?: { [key: string]: any }): Promise<void> {
        // 如果已经可见，则只更新数据
        if (this._visible) {
            if (data !== undefined) {
                this.updateData(data);
            }
            return;
        }

        // 保存面板数据
        if (data !== undefined) {
            this._panelData = data;
        }

        this.ClubButton && game.emit(SDKEvent.HideGameClubButton);

        // 调用子类打开前方法
        await this.onBeforeOpen();

        // 播放打开动画 
        this.node.active = true;
        await UIAnimationUtils.playOpenAnimation(this.animObj, this.openAnimType);
        this._visible = true;
        this.scheduleOnce(() => {
            this.onAfterOpen();
        });
    }

    /**
     * 面板打开前调用，子类可重写
     */
    protected onBeforeOpen(): void {
        // 子类实现
    }

    /**
     * 面板打开后调用，子类可重写
     */
    protected onAfterOpen(): void {
        // 子类实现
    }

    /** 关闭按钮点击 */
    protected onBack() {
        AudioMgr.Ins.playUISound("closeUI");//close
        this.close()
    }

    /**
     * 关闭面板
     */
    public async close(): Promise<void> {
        // 如果已经隐藏，则直接返回
        if (!this._visible) {
            return;
        }

        if (this._visible) {
            // 调用子类关闭前方法
            this.onBeforeClose();

            // 播放关闭动画 
            await UIAnimationUtils.playCloseAnimation(this.animObj, this.closeAnimType)
            this._visible = false;

            // 调用子类关闭后方法
            this.onAfterClose();
        }

        // let clazzName = this.constructor.prototype.name
        // 从打开面板列表移除
        UIMgr.Ins._openPanels.delete(this.classzName);
        // 从面板栈移除
        UIMgr.Ins._removeFromPanelStack(this.classzName);

        game.targetOff(this);

        if (!this.isCache) {
            // 销毁节点
            this.node.removeFromParent();
            this.node.destroy();
        }

        // 发送面板关闭事件
        // EventMgr.Ins.emit('ui_panel_closed', { clazzName });

        this.ClubButton && game.emit(SDKEvent.ShowGameClubButton);
    }

    /**
     * 界面关闭前，子类可重写
     */
    protected onBeforeClose(): void {
        // 子类实现
    }

    /**
     * 面板关闭后调用，子类可重写
     */
    protected onAfterClose(): void {
        // 子类实现
    }

    /**
     * 显示面板
     * @param data 面板参数
     */
    public async show(data?: any): Promise<void> {
        return this.open(data);
    }

    /**
     * 隐藏面板
     */
    public async hide(): Promise<void> {
        return this.close();
    }

    /**
     * 更新面板数据
     * @param data 面板数据
     */
    public updateData(data: { [key: string]: any }): void {
        this._panelData = data;
        this.onUpdateData(data);
    }

    /**
     * 面板数据更新时调用，子类可重写
     * @param data 面板数据
     */
    protected onUpdateData(data: { [key: string]: any }): void {
        // 子类实现
    }

    /**
     * 刷新面板显示
     */
    public refresh(): void {
        this.onRefresh();
    }

    /**
     * 面板刷新时调用，子类可重写
     */
    protected onRefresh(): void {
        // 子类实现
    }

    /**
     * 销毁面板前调用
     */
    protected onDestroy(): void {
        // 清理事件监听
        this.onRelease();


    }

    /**
     * 释放面板资源，子类可重写
     */
    protected onRelease(): void {
        // 子类实现
    }




    /** 是否处理游戏圈 */
    protected get ClubButton() { return this.classzName != "HomeUI" }
} 