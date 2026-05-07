import { instantiate, Node, Prefab } from 'cc';
import { ResMgr } from '../Manager/ResMgr';
import { UIMgr } from './UIMgr';
import { UIPanelBase } from './UIPanelBase';

/**
 * UI面板对象池
 * 管理UI面板的创建、缓存和销毁
 */
export class UIPanelPool {
    /** 面板实例缓存 */
    public _panelCache: Map<string, UIPanelBase> = new Map();
    /** 加载中的面板 */
    private _loadingPanels: Set<string> = new Set();

    /**
     * 获取面板实例
     * @param classzName 面板ID
     * @returns 面板实例Promise
     */
    public async getPanel(classzName: string, bundleName = "", prefabPath = ""): Promise<UIPanelBase> {
        // 检查是否有缓存的实例
        if (this._panelCache.has(classzName)) {
            return this._panelCache.get(classzName);
        }

        // 检查是否正在加载
        if (this._loadingPanels.has(classzName)) {
            console.warn("加载中:", classzName)
            return
        }
        this._loadingPanels.add(classzName);


        // await new Promise<void>((resolve) => UIMgr.Ins.scheduleOnce(() => { resolve() }, 0.5))

        // 创建加载Promise
        const panel = await this._createPanel(classzName, prefabPath, bundleName);


        // 等待面板加载完成 
        this._loadingPanels.delete(classzName);

        // 如果需要缓存，则保存到缓存中
        panel && panel.isCache && this._panelCache.set(classzName, panel);
        return panel;
    }

    /**
     * 创建面板实例
     * @param config 面板配置
     * @returns 面板实例Promise
     */
    private async _createPanel(classzName = "", prefabPath = "", bundleName = ""): Promise<UIPanelBase> {
        if (!prefabPath) prefabPath = classzName;
        if (!bundleName) bundleName = classzName;


        await ResMgr.Ins.loadBundle(bundleName);

        // 加载预制体
        const prefab = await ResMgr.Ins.getOrLoadAsset(bundleName, prefabPath, Prefab);
        if (!prefab) {
            console.error(`预制体加载失败: ${prefabPath}`);
            return
        }

        // 实例化预制体
        const node = instantiate(prefab) as Node;
        if (!node) {
            console.error(`预制体实例化失败: ${prefabPath}`);
            return
        }

        // 获取面板脚本
        const panel = node.getComponent(UIPanelBase) as UIPanelBase;

        if (!panel) {
            console.error(`面板脚本获取失败: ${classzName}`);
            return
        }

        // 初始化面板
        panel.initialize(classzName, prefabPath, bundleName);

        return panel;
    }

    /**
     * 清理缓存
     * @param force 是否强制清理所有缓存
     */
    public clearCache(force: boolean = false): void {
        // 获取所有面板ID
        const panelIds = Array.from(this._panelCache.keys());

        // 遍历所有缓存的面板
        panelIds.forEach(panelId => {
            const panel = this._panelCache.get(panelId);

            // 如果是强制清理或者面板配置为不缓存，则销毁面板
            if (force || !panel.isCache) {
                // 销毁节点
                panel.node.destroy();
                // 从缓存中移除
                this._panelCache.delete(panelId);
            }
        });
    }

    /**
     * 销毁所有面板
     */
    public destroyAll(): void {
        this.clearCache(true);
    }
} 