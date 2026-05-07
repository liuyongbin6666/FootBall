import { Constructor, director, find, Node, screen, UITransform, view } from 'cc';
import { SDK } from '../Sdk/SDK';
import { UILayerType } from './Enums/UILayerType';
import { UIPanelBase } from './UIPanelBase';
import { UIPanelPool } from './UIPanelPool';
import { CmpSingletion } from '../Singleton/CmpSingletion';

/**
 * UI管理器单例类
 * 负责管理所有UI面板的显示、隐藏和层级
 */
export class UIMgr extends CmpSingletion<UIMgr> {
    /** 提供类型安全的单例访问 */
    public static get Ins(): UIMgr {
        return this.getInstance<UIMgr>();
    }

    private _uiCanvas: Node = null;
    /** UI根节点 */
    private _uiRoot: Node = null;
    /** UI层级根节点 */
    private _layerRoots: Map<UILayerType, Node> = new Map();
    /** UI面板池 */
    public _panelPool: UIPanelPool = null;
    
    /** 当前打开的面板 */
    public _openPanels: Map<string, UIPanelBase> = new Map();
    /** 面板栈（记录打开顺序） */
    private _panelStack: string[] = [];


    public Name = "UIMgr"
    public async init() {
        if (this._initialized) {
            return
        }
        this._initialized = true;

        this._panelPool = new UIPanelPool();

        // 游戏初始化完成时创建UI根节点
        this._onGameInited();
    }

    /**
     * 释放UI管理器资源
     */
    public release(): void {
        console.log('[UIMgr] UI管理器释放资源');

        // 关闭所有打开的面板
        // this.closeAllPanels(true);

        // 释放面板池资源
        if (this._panelPool) {
            this._panelPool.destroyAll();
        }


        // 清理数据
        this._openPanels.clear();
        this._panelStack = [];
        this._initialized = false;
    }

    /**
     * 游戏初始化完成回调
     */
    private _onGameInited(): void {
        this._createUIRoot();
        this._createLayerRoots();
    }

    /**
     * 创建UI根节点
     */
    private _createUIRoot(): void {
        // 查找Canvas节点
        this._uiCanvas = find('Canvas');
        if (!this._uiCanvas) {
            console.error('[UIMgr] 未找到Canvas节点');
            return;
        }

        // 查找或创建GameUI节点
        this._uiRoot = find('Canvas/GameUI');
        if (!this._uiRoot) {
            // 如果GameUI不存在，则创建
            this._uiRoot = new Node('GameUI');
            this._uiCanvas.addChild(this._uiRoot);
        }

        // 关键：将Canvas设置为持久根节点，确保UI系统在场景切换时保持
        director.addPersistRootNode(this._uiCanvas);
        console.log('[UIMgr] UI根节点创建完成，Canvas已设置为持久根节点');
    }

    /**
     * 创建UI层级根节点
     */
    private _createLayerRoots(): void {
        // 创建各层级的根节点
        const layerTypes = [
            UILayerType.BACKGROUND_0,
            UILayerType.NORMAL_1,
            UILayerType.POPUP_2,
            UILayerType.TIPS_3,
            UILayerType.TOP_4,
            UILayerType.SYSTEM_5,
            UILayerType.SYSTEM_6,
        ];
        // let { width, height, scale } = this._RestScreenResize();

        // SDK.width = width;
        // SDK.height = height;
        // SDK.scale = scale;

        layerTypes.forEach(layerType => {
            // 创建层级根节点
            const layerRoot = new Node(`UILayer_${layerType}`);

            // 设置层级根节点属性
            const uiTransform = layerRoot.addComponent(UITransform);

            uiTransform.height = SDK.height;
            uiTransform.width = SDK.width;
            // 设置层级
            layerRoot.setSiblingIndex(layerType);

            // 添加到UI根节点
            this._uiRoot.addChild(layerRoot);

            // 保存层级根节点
            this._layerRoots.set(layerType, layerRoot);
        });
    }
    /** 屏幕自适应 */
    // private _RestScreenResize(): { width: number, height: number, scale: number } {
    //     let _transform = this._uiRoot.getComponent(UITransform);
    //     let scale = 1;
    //     let isLongScreen = (screen.windowSize.height / screen.windowSize.width) >= 2;
    //     console.log("是否是长屏:", isLongScreen, JSON.stringify(screen.windowSize.width), screen.devicePixelRatio);
    //     if ((screen.windowSize.width / screen.windowSize.height) < (_transform.width / _transform.height)) {
    //         console.log("宽度不变，高度根据屏幕比缩放")
    //         _transform.height = screen.windowSize.height / screen.windowSize.width * _transform.width;

    //         scale = _transform.width / (screen.windowSize.width / screen.devicePixelRatio)
    //     } else {
    //         console.log("高度不变，宽度根据屏幕比缩放")
    //         _transform.width = screen.windowSize.width / screen.windowSize.height * _transform.height

    //         scale = _transform.height / (screen.windowSize.height / screen.devicePixelRatio);
    //     }
    //     view.emit('canvas-resize');
    //     return { width: _transform.width, height: _transform.height, scale: scale }
    // }

    public getLayerRoot(layerType: UILayerType = UILayerType.SYSTEM_5) {
        return this._layerRoots.get(layerType);
    }

    /**预加载UI */
    public async preloadPanel<T extends UIPanelBase>(clazz: Constructor<T>, bundleName = "", prefabPath = "") {
        const clazzName: string = clazz.prototype.name

        // 检查面板是否已经打开
        if (!this._openPanels.has(clazzName))
            // 获取面板实例
            this._panelPool.getPanel(clazzName, bundleName, prefabPath);
    }

    /**打开UI面板 */
    public async openPanel<T extends UIPanelBase>(clazz: Constructor<T>, data?: { [key: string]: any }, bundleName = "GameUI", prefabPath?, parent?: Node): Promise<T> {
        const clazzName: string = clazz.prototype.name

        // 检查面板是否已经打开
        if (this._openPanels.has(clazzName)) {
            const panel = this._openPanels.get(clazzName) as T;
            // 更新面板数据
            if (panel)
                await panel.open(data);
            return panel;
        }
        if (!bundleName || bundleName == "") {
            bundleName = "GameUI";
        }
        // 保存到打开面板列表
        this._openPanels.set(clazzName, null);
        if (!prefabPath) {
            prefabPath = clazzName;
        }

        // 获取面板实例
        const panel = await this._panelPool.getPanel(clazzName, bundleName, prefabPath) as T;
        if (!panel)
            return;


        // 获取面板层级类型 
        const layerRoot = parent ? parent : this._layerRoots.get(panel.layerType);

        // 添加到对应层级
        layerRoot.addChild(panel.node);
        // 打开面板
        await panel.open(data);

        // 保存到打开面板列表
        this._openPanels.set(clazzName, panel);
        // 添加到面板栈
        this._addToPanelStack(clazzName);

        // 发送面板打开事件
        // EventMgr.Ins.emit('ui_panel_opened', { clazzName });

        return panel;
    }

    /** 关闭UI面板 */
    public async closePanel<T extends UIPanelBase>(clazz: Constructor<T>) {
        const clazzName: string = clazz.prototype.name
        const panel = this._openPanels.get(clazzName) as T;
        panel && await panel.close();
    }

    /**
     * 关闭所有打开的面板
     * @param destroy 是否销毁面板
     * @returns 是否成功关闭
     */
    public async closeAllPanels(): Promise<boolean> {
        // 获取所有打开的面板ID
        const panelIds = Array.from(this._openPanels.keys());

        // 关闭所有面板
        for (const panelId of panelIds) {

            const panel = this._openPanels.get(panelId);
            panel && await panel.close();
        }

        return true;
    }

    /**
     * 检查面板是否已打开
     * @param panelId 面板ID
     * @returns 是否已打开
     */
    public hasOpenPanel<T extends UIPanelBase>(clazz: Constructor<T>) {
        return this._openPanels.has(clazz.prototype.name);
    }

    /**
     * 获取打开的面板实例
     * @param panelId 面板ID
     * @returns 面板实例
     */
    public getOpenPanel<T extends UIPanelBase>(clazz: Constructor<T>): T {
        const clazzName: string = clazz.prototype.name
        return this._openPanels.get(clazzName) as T;
    }

    /**
     * 获取所有打开的面板
     * @returns 面板实例映射
     */
    public getAllOpenPanels(): Map<string, UIPanelBase> {
        return this._openPanels;
    }

    /**
     * 获取面板栈顶面板ID
     * @returns 栈顶面板ID
     */
    public getTopPanelId(): string {
        if (this._panelStack.length === 0) {
            return null;
        }

        return this._panelStack[this._panelStack.length - 1];
    }


    /**
     * 将面板添加到面板栈
     * @param panelId 面板ID
     */
    private _addToPanelStack(panelId: string): void {
        // 如果已在栈中，则先移除
        this._removeFromPanelStack(panelId);

        // 添加到栈顶
        this._panelStack.push(panelId);
    }

    /**
     * 从面板栈移除面板
     * @param panelId 面板ID
     */
    public _removeFromPanelStack(panelId: string): void {
        const index = this._panelStack.indexOf(panelId);
        if (index !== -1) {
            this._panelStack.splice(index, 1);
        }
    }

    /**
     * 返回上一个面板（关闭当前栈顶面板）
     * @returns 是否成功返回
     */
    public async backToPreviousPanel() {
        if (this._panelStack.length <= 1) {
            return
        }

        // 获取栈顶面板ID
        const topPanelId = this.getTopPanelId();
        if (!topPanelId) {
            return
        }

        // 关闭栈顶面板
        const panel = this._openPanels.get(topPanelId);
        panel && await panel.close();
    }

    /**
     * 场景切换时清理场景相关UI
     * @param keepGlobalUI 是否保持全局UI（如暂停面板、设置界面等）
     */
    public async onSceneChanged(keepGlobalUI: boolean = true): Promise<void> {
        console.log('[UIMgr] 场景切换，清理场景相关UI');

        if (keepGlobalUI) {
            // 只关闭场景相关的UI，保持全局UI
            const panelsToClose: string[] = [];

            this._openPanels.forEach((panel, panelId) => {
                if (panel && !panel.isGlobalUI) {
                    panelsToClose.push(panelId);
                }
            });

            // 关闭场景相关UI
            for (const panelId of panelsToClose) {
                const panel = this._openPanels.get(panelId);
                if (panel) {
                    await panel.close();
                }
            }
        } else {
            // 关闭所有UI
            await this.closeAllPanels();
        }
    }

    /**
     * 检查UI根节点是否有效
     */
    public isUIRootValid(): boolean {
        return this._uiRoot && this._uiRoot.isValid;
    }

    /**
     * 重新初始化UI根节点（用于场景切换后的恢复）
     */
    public reinitUIRoot(): void {
        if (!this.isUIRootValid()) {
            console.log('[UIMgr] UI根节点无效，重新初始化');
            this._createUIRoot();
            this._createLayerRoots();
        }
    }

    /**
     * 获取UI根节点
     */
    public getUIRoot(): Node {
        return this._uiRoot;
    }

    /**
     * 检查面板是否为全局UI
     * @param panelId 面板ID
     */
    public isGlobalUI(panelId: string): boolean {
        const panel = this._openPanels.get(panelId);
        return panel ? panel.isGlobalUI : false;
    }
} 