import { _decorator, instantiate, isValid, Node } from 'cc';
import { CmpSingletion } from "../Singleton/CmpSingletion";
import { LogMgr } from "./LogMgr";
import { PoolItemType, IPoolItem, DefaultPoolItem } from "./PoolItem";

const { ccclass } = _decorator;

/**
 * 对象池配置
 */
interface PoolConfig {
    /** 池最大容量，超过容量的对象将被销毁 */
    maxSize?: number;
    /** 池初始容量，创建时预先填充的对象数量 */
    initSize?: number;
    /** 扩容大小，当池为空时自动扩容的数量 */
    expandSize?: number;
    /** 对象工厂函数，用于创建新对象 */
    factory?: (...args: any[]) => IPoolItem;
    /** 默认重置函数 */
    resetFunc?: (item: IPoolItem) => void;
}

/**
 * 对象池类
 * 管理特定类型对象的创建和回收
 */
class Pool {
    /** 对象池ID */
    private _id: string;
    /** 对象池 */
    private _pool: IPoolItem[] = [];
    /** 对象池配置 */
    private _config: PoolConfig = { maxSize: 100, initSize: 0, expandSize: 10 };
    /** 已创建对象的总数（包括在池中和已获取的） */
    private _totalCreated: number = 0;

    public get maxSize(): number {
        return this._config.maxSize;
    }

    public get expandSize(): number {
        return this._config.expandSize || 10;
    }

    /**
     * 构造函数
     * @param id 对象池ID
     * @param config 对象池配置
     */
    constructor(id: string, config?: PoolConfig) {
        this._id = id;

        if (config) {
            this._config = { ...this._config, ...config };
        }

        // 初始化对象池
        this._init();
    }

    /**
     * 初始化对象池
     */
    private _init(): void {
        // 如果有初始大小和工厂函数，预先创建对象
        if (this._config.initSize && this._config.initSize > 0 && this._config.factory) {
            for (let i = 0; i < this._config.initSize; i++) {
                const item = this._config.factory();
                if (item) {
                    this._pool.push(item);
                    this._totalCreated++;
                }
            }
        }
    }

    /**
     * 获取对象
     * @param args 初始化参数
     * @returns 对象池中的对象或新创建的对象
     */
    public get(...args: any[]): IPoolItem {
        let item: IPoolItem = null;

        // 如果池中有对象，获取最后一个
        if (this._pool.length > 0) {
            item = this._pool.pop();
        }
        // 如果池为空，尝试自动扩容
        else if (this._config.factory) {
            // 检查是否已达到最大容量
            if (this._config.maxSize && this._totalCreated >= this._config.maxSize) {
                LogMgr.Ins.warn(`[Pool:${this._id}] 池已满，无法扩容，当前容量: ${this._totalCreated}/${this._config.maxSize}`);
                return null;
            }

            // 自动扩容
            this.expandPool();
            
            // 扩容后再次尝试获取
            if (this._pool.length > 0) {
                item = this._pool.pop();
            }
        }

        // 检查是否需要自动扩容（当可用对象少于阈值时）
        this._checkAndAutoExpand();

        // 如果成功获取对象，调用其初始化方法
        if (item && item.onInit) {
            try {
                item.onInit(...args);
            } catch (error) {
                LogMgr.Ins.error(`[Pool:${this._id}] 对象初始化失败:`, error);
                return null;
            }
        }

        return item;
    }

    /**
     * 回收对象
     * @param item 要回收的对象
     * @returns 是否成功回收
     */
    public put(item: IPoolItem): boolean {
        // 检查对象是否有效
        if (!item) {
            return false;
        }

        // 检查对象是否属于这个池
        if (item.poolId !== this._id) {
            LogMgr.Ins.warn(`[PoolMgr] 对象ID ${item.poolId} 与对象池ID ${this._id} 不匹配，无法回收`);
            return false;
        }

        // 检查池是否达到最大容量
        if (this._config.maxSize && this._pool.length >= this._config.maxSize) {
            // 超过容量，销毁对象
            if (item.onDestroy) {
                item.onDestroy();
            }
            return false;
        }

        // 重置对象状态
        if (item.onReset) {
            item.onReset();
        } else if (this._config.resetFunc) {
            this._config.resetFunc(item);
        }

        // 回收对象到池中
        this._pool.push(item);
        return true;
    }

    /**
     * 清理池中的无效对象
     * @returns 清理的对象数量
     */
    public cleanInvalidItems(): number {
        const originalLength = this._pool.length;
        this._pool = this._pool.filter(item => {
            if (!item) {
                return false;
            }

            // 如果是DefaultPoolItem，检查其node是否有效
            if (item instanceof DefaultPoolItem) {
                if (!item.isValid || !item.node || !item.node.isValid) {
                    return false;
                }
            }

            return true;
        });

        const cleanedCount = originalLength - this._pool.length;
        if (cleanedCount > 0) {
            LogMgr.Ins.debug(`[Pool:${this._id}] 清理了 ${cleanedCount} 个无效对象`);
        }

        return cleanedCount;
    }

    /**
     * 清空对象池
     * @param destroyAll 是否销毁所有对象
     */
    public clear(destroyAll: boolean = false): void {
        if (destroyAll) {
            // 逐个销毁对象
            for (const item of this._pool) {
                if (item && item.onDestroy) {
                    item.onDestroy();
                }
            }
        }

        // 清空池
        this._pool.length = 0;

        if (destroyAll) {
            this._totalCreated = 0;
        }
    }

    /**
     * 获取对象池大小
     */
    public get size(): number {
        return this._pool.length;
    }

    /**
     * 获取已创建对象的总数
     */
    public get totalCreated(): number {
        return this._totalCreated;
    }

    /**
     * 获取已分配对象的数量（不在池中）
     */
    public get allocated(): number {
        return this._totalCreated - this._pool.length;
    }

    /**
     * 获取池中的第一个对象
     */
    public getFirstItem(): IPoolItem {
        return this._pool[0] || null;
    }

    /**
     * 自动扩容池
     * @param expandCount 扩容数量，如果不指定则使用配置的expandSize
     */
    public expandPool(expandCount?: number): void {
        const count = expandCount || this.expandSize;
        const maxSize = this._config.maxSize;
        const currentTotal = this._totalCreated;
        
        // 如果已达最大容量，不再扩容
        if (maxSize && currentTotal >= maxSize) {
            LogMgr.Ins.warn(`[Pool:${this._id}] 已达最大容量，无法扩容: ${currentTotal}/${maxSize}`);
            return;
        }

        // 计算实际扩容数量
        let actualExpandCount = count;
        if (maxSize && currentTotal + count > maxSize) {
            actualExpandCount = maxSize - currentTotal;
        }

        if (actualExpandCount <= 0) {
            return;
        }

        LogMgr.Ins.debug(`[Pool:${this._id}] 开始扩容，数量: ${actualExpandCount}`);

        // 扩容创建对象
        for (let i = 0; i < actualExpandCount; i++) {
            try {
                const item = this._config.factory();
                if (item) {
                    this._pool.push(item);
                    this._totalCreated++;
                } else {
                    LogMgr.Ins.error(`[Pool:${this._id}] 扩容时工厂函数返回null`);
                }
            } catch (error) {
                LogMgr.Ins.error(`[Pool:${this._id}] 扩容时工厂函数执行失败:`, error);
            }
        }

        LogMgr.Ins.debug(`[Pool:${this._id}] 扩容完成，新增: ${actualExpandCount}, 总容量: ${this._totalCreated}`);
    }

    /**
     * 检查并自动扩容
     * 当可用对象少于阈值时自动扩容
     */
    private _checkAndAutoExpand(): void {
        // 如果 expandSize <= 2，表示不启用自动扩容
        if (this.expandSize <= 2) {
            return;
        }

        // 如果可用对象少于2个，自动扩容
        if (this._pool.length < 2) {
            // 检查是否已达到最大容量
            if (this._config.maxSize && this._totalCreated >= this._config.maxSize) {
                LogMgr.Ins.warn(`[Pool:${this._id}] 池已满，无法自动扩容，当前容量: ${this._totalCreated}/${this._config.maxSize}`);
                return;
            }

            LogMgr.Ins.debug(`[Pool:${this._id}] 可用对象不足（${this._pool.length} < 2），自动扩容`);
            this.expandPool();
        }
    }
}



/**
 * 对象池管理器
 * 单例类，管理所有类型的对象池
 */
@ccclass('PoolMgr')
export class PoolMgr extends CmpSingletion<PoolMgr> {
    /** 提供类型安全的单例访问 */
    public static get Ins(): PoolMgr {
        return this.getInstance<PoolMgr>();
    }

    /** 对象池映射表 */
    private _pools: Map<string, Pool> = new Map();

    /** 对象池根节点 */
    private _poolRoot: Node = null;
    /** 默认最大容量 */
    private _defaultMaxSize: number = 100;

    /** 
     * 节点池分组，用于组织不同类型的节点池 
     * 如：UI, Enemy, Bullet等
     */
    private _nodePoolGroups: string[] = ["UI", "Game", "Effect", "Fly"];

    /** 日志标签 */
    private readonly _logTag: string = "[PoolMgr]";

    public Name = "PoolMgr"

    public async init() {
        if (this._initialized) {
            LogMgr.Ins.warn(`[${this.Name}] 重复初始化`);
            return
        }
        this._initialized = true;
        LogMgr.Ins.info(`[${this.Name}] 初始化对象池管理器`);

        // 创建节点池根节点 - 确保不将其他管理器作为子节点
        this._poolRoot = new Node("PoolRoot");
        // 将PoolRoot添加到当前节点下，而不是将其他管理器添加到PoolRoot下
        this._poolRoot.parent = this.node;
        
        LogMgr.Ins.info(`[${this.Name}] 对象池根节点创建完成`);
    }

    /**
     * 打印日志
     * @param level 日志级别
     * @param message 日志消息
     */
    private _log(level: 'log' | 'warn' | 'error', message: string): void {
        LogMgr.Ins[level](`${this._logTag} ${message}`);
    }

    /**
     * 确保对象池存在
     * @param id 对象池ID
     * @returns 是否存在
     */
    private _ensurePoolExists(id: string): boolean {
        if (!this._pools.has(id)) {
            this._log('warn', `对象池ID ${id} 不存在`);
            return false;
        }
        return true;
    }

    /**
     * 创建对象池
     * @param id 对象池ID
     * @param config 对象池配置
     * @returns 是否成功创建
     */
    public createPool(id: string, config?: PoolConfig): boolean {
        // 检查ID是否已存在
        if (this._pools.has(id)) {
            this._log('warn', `对象池ID ${id} 已存在`);
            return false;
        }

        // 检查是否需要创建节点池
        const finalConfig = { ...config };
        if (finalConfig.factory && !finalConfig.maxSize) {
            finalConfig.maxSize = this._defaultMaxSize;
        }

        // 创建新池
        const pool = new Pool(id, finalConfig);
        this._pools.set(id, pool);
        return true;
    }

    /**
     * 获取对象
     * @param id 对象池ID
     * @param args 初始化参数
     * @returns 对象池中的对象或新创建的对象
     */
    public get<T extends IPoolItem>(id: string, ...args: any[]): T {
        // 获取对象池
        if (!this._ensurePoolExists(id)) return null;

        // 从池中获取对象
        return this._pools.get(id).get(...args) as T;
    }

    /**
     * 回收对象
     * @param item 要回收的对象
     * @returns 是否成功回收
     */
    public put(item: IPoolItem): boolean {
        // 检查对象是否有效
        if (!item) {
            return false;
        }

        const id = item.poolId;

        // 获取对象池
        if (!this._ensurePoolExists(id)) return false;

        // 回收对象
        return this._pools.get(id).put(item);
    }

    /**
     * 清空指定对象池
     * @param id 对象池ID
     * @param destroyAll 是否销毁所有对象
     */
    public clearPool(id: string, destroyAll: boolean = false): void {
        // 获取对象池
        if (!this._ensurePoolExists(id)) return;

        // 清空池
        this._pools.get(id).clear(destroyAll);

        if (destroyAll) {
            // 移除对象池
            this._pools.delete(id);
        }
    }

    /**
     * 清空所有对象池
     * @param destroyAll 是否销毁所有对象
     */
    public clearAll(destroyAll: boolean = false): void {
        // 遍历所有对象池
        this._pools.forEach((pool, id) => {
            pool.clear(destroyAll);
        });

        if (destroyAll) {
            // 清空对象池映射表
            this._pools.clear();
        }
    }

    /**
     * 获取对象池大小
     * @param id 对象池ID
     * @returns 对象池大小
     */
    public getPoolSize(id: string): number {
        // 获取对象池
        if (!this._ensurePoolExists(id)) return 0;

        return this._pools.get(id).size;
    }

    /**
     * 获取对象池信息
     * @param id 对象池ID
     * @returns 对象池信息
     */
    public getPoolInfo(id: string): { size: number, allocated: number, total: number } {
        // 获取对象池
        if (!this._ensurePoolExists(id)) {
            return { size: 0, allocated: 0, total: 0 };
        }

        const pool = this._pools.get(id);
        return {
            size: pool.size,
            allocated: pool.allocated,
            total: pool.totalCreated
        };
    }

    /**
     * 检查对象池是否存在
     * @param id 对象池ID
     * @returns 是否存在
     */
    public hasPool(id: string): boolean {
        return this._pools.has(id);
    }

    /**
     * 获取所有对象池ID
     * @returns 对象池ID数组
     */
    public getAllPoolIds(): string[] {
        return Array.from(this._pools.keys());
    }

    /**
     * 获取对象池总数
     * @returns 对象池总数
     */
    public getPoolCount(): number {
        return this._pools.size;
    }

    /**
     * 释放资源（在单例销毁时调用）
     */
    public release(): void {
        // 清理所有对象池
        this.clearAll(true);

        // 销毁节点池根节点
        if (this._poolRoot && isValid(this._poolRoot, true)) {
            this._poolRoot.destroy();
            this._poolRoot = null;
        }

        // 调用父类release
        super.release();
    }

    /**
     * 获取对象池根节点
     */
    public getPoolRoot(): Node {
        if (!this._poolRoot || !isValid(this._poolRoot, true)) {
            this.init();
        }
        return this._poolRoot;
    }

    /**
     * 在编辑器中更新
     */
    protected update(): void {
        if (!this._poolRoot || !isValid(this._poolRoot, true)) {
            this.init();
        }
    }

    /**
     * 获取或创建分组节点
     * @param group 分组名称 
     * @returns 分组节点
     */
    private _getOrCreateGroupNode(group: string): Node {
        if (!group || this._nodePoolGroups.indexOf(group) < 0) {
            return this._poolRoot;
        }

        // 查找或创建分组节点
        let groupNode = this._poolRoot.getChildByName(group);
        if (!groupNode) {
            groupNode = new Node(group);
            groupNode.parent = this._poolRoot;
        }

        return groupNode;
    }

    /**
     * 创建节点对象池的专用方法
     * @param id 对象池ID
     * @param prefab 预制体
     * @param initialSize 初始大小
     * @param maxSize 最大容量
     * @param group 分组名称（可选）
     * @param expandSize 扩容大小（可选）>2启用自动扩容
     */
    public createNodePool(id: string, prefab: any, initialSize: number = 10, maxSize: number = 50, group: string = "", expandSize: number = 10): boolean {
        // 如果已存在同名池，返回失败
        if (this._pools.has(id)) {
            this._log('warn', `节点池ID ${id} 已存在`);
            return false;
        }

        // 获取或创建分组节点
        const poolParent = this._getOrCreateGroupNode(group);

        // 创建节点池配置
        const config: PoolConfig = {
            maxSize: maxSize,
            initSize: initialSize,
            expandSize: expandSize,
            factory: () => {
                if (!isValid(prefab, true)) {
                    this._log('error', `创建节点池失败: 预制体无效`);
                    return null;
                }

                // 实例化预制体
                const node = instantiate(prefab);
                node.parent = poolParent;
                node.active = false;

                // 尝试获取或添加IPoolItem组件
                let poolItem = node.getComponent('IPoolItem');
                if (!poolItem) {
                    // 如果节点没有IPoolItem组件，创建一个默认的
                    const defaultPoolItem = node.addComponent(DefaultPoolItem);
                    defaultPoolItem.poolId = id;
                    defaultPoolItem.poolType = PoolItemType.NODE;
                    poolItem = defaultPoolItem as any;
                }

                // 验证poolItem是否有效
                if (!poolItem) {
                    this._log('error', `创建PoolItem失败`);
                    return null;
                }

                return poolItem;
            }
        };

        // 创建对象池
        return this.createPool(id, config);
    }

    /**
     * 获取特定分组中的所有对象池ID
     * @param group 分组名称
     */
    public getPoolIdsByGroup(group: string): string[] {
        // 找到分组节点
        const groupNode = this._poolRoot.getChildByName(group);
        if (!groupNode) {
            return [];
        }

        // 获取该分组下的所有池ID
        const result: string[] = [];
        this._pools.forEach((pool, id) => {
            const item = pool.getFirstItem();
            if (item && item.poolType === PoolItemType.NODE) {
                // 检查节点的父级是否是该分组
                const node = (item as any).node;
                if (node && node.parent === groupNode) {
                    result.push(id);
                }
            }
        });

        return result;
    }

    /**
     * 清空特定分组的所有对象池
     * @param group 分组名称
     * @param destroyAll 是否销毁所有对象
     */
    public clearPoolsByGroup(group: string, destroyAll: boolean = false): void {
        const poolIds = this.getPoolIdsByGroup(group);
        for (const id of poolIds) {
            this.clearPool(id, destroyAll);
        }
    }

    /**
     * 获取对象池统计信息
     */
    public getPoolStats(): {
        totalPools: number,
        totalObjects: number,
        activeObjects: number,
        groups: { [key: string]: { pools: number, objects: number } }
    } {
        const stats = {
            totalPools: this._pools.size,
            totalObjects: 0,
            activeObjects: 0,
            groups: {}
        };

        // 初始化分组统计
        for (const group of this._nodePoolGroups) {
            stats.groups[group] = { pools: 0, objects: 0 };
        }

        // 统计所有对象池
        this._pools.forEach((pool, id) => {
            const poolInfo = this.getPoolInfo(id);
            stats.totalObjects += poolInfo.total;
            stats.activeObjects += poolInfo.allocated;

            // 检查是否属于某个分组
            for (const group of this._nodePoolGroups) {
                const groupNode = this._poolRoot.getChildByName(group);
                if (groupNode) {
                    const item = pool.getFirstItem();
                    if (item && item.poolType === PoolItemType.NODE) {
                        const node = (item as any).node;
                        if (node && node.parent === groupNode) {
                            stats.groups[group].pools++;
                            stats.groups[group].objects += poolInfo.total;
                            break;
                        }
                    }
                }
            }
        });

        return stats;
    }

    /**
     * 打印对象池统计信息
     */
    public printStats(): void {
        const stats = this.getPoolStats();
        this._log('log', `===== 对象池统计信息 =====`);
        this._log('log', `总池数: ${stats.totalPools}`);
        this._log('log', `总对象数: ${stats.totalObjects}`);
        this._log('log', `活跃对象数: ${stats.activeObjects}`);
        this._log('log', `分组统计:`);

        for (const group in stats.groups) {
            if (stats.groups.hasOwnProperty(group)) {
                const info = stats.groups[group];
                this._log('log', `  ${group}: ${info.pools}个池, ${info.objects}个对象`);
            }
        }

        this._log('log', `========================`);
    }

    /**
     * 根据预制体初始化节点池
     * @param id 对象池ID，通常使用预制体路径
     * @param prefab 预制体资源
     * @param initialSize 初始池大小
     * @param maxSize 最大池大小
     * @param group 分组名称
     * @returns 是否成功初始化
     */
    public initPool(id: string, prefab: any, initialSize: number = 5, maxSize: number = 20, group: string = "Game"): boolean {
        // 如果池已存在，直接返回true
        if (this.hasPool(id)) {
            return true;
        }

        // 创建节点池
        return this.createNodePool(id, prefab, initialSize, maxSize, group);
    }

    /**
     * 从节点池获取节点
     * @param id 对象池ID
     * @param active 是否立即激活节点，默认为true
     * @param args 初始化参数
     * @returns 节点对象
     */
    public getNode(id: string, active: boolean = true, ...args: any[]): Node {
        // 检查对象池是否存在
        if (!this._pools.has(id)) {
            this._log('error', `对象池 ${id} 不存在，当前可用池: [${Array.from(this._pools.keys()).join(', ')}]`);
            return null;
        }

        const pool = this._pools.get(id);
        if (!pool) {
            this._log('error', `对象池 ${id} 获取失败`);
            return null;
        }

        this._log('log', `尝试从对象池 ${id} 获取节点，池大小: ${pool.size}, 已分配: ${pool.allocated}, 总创建: ${pool.totalCreated}`);

        const item = this.get(id, ...args);
        if (!item) {
            this._log('error', `从对象池 ${id} 获取对象失败，池大小: ${pool.size}, 已分配: ${pool.allocated}, 总创建: ${pool.totalCreated}`);
            return null;
        }

        // 确保是节点类型的对象
        if (item.poolType !== PoolItemType.NODE) {
            this._log('error', `${id} 不是节点类型对象池，类型: ${item.poolType}`);
            return null;
        }

        // 获取节点
        let node: Node = null;

        // 如果item是DefaultPoolItem（Component），直接获取其node属性
        if (item instanceof DefaultPoolItem) {
            node = item.node;
        } else {
            // 其他情况，尝试通过any类型访问
            node = (item as any).node;
        }

        // 检查节点是否有效
        if (!node) {
            this._log('error', `从对象池 ${id} 获取的节点为空，item类型: ${item.constructor.name}`);
            return null;
        }

        if (!isValid(node, true)) {
            this._log('error', `从对象池 ${id} 获取的节点无效，节点已被销毁`);
            return null;
        }

        // 检查节点的基本属性
        if (!node.position) {
            this._log('error', `从对象池 ${id} 获取的节点缺少position属性`);
            return null;
        }

        // 设置节点激活状态
        node.active = active;

        // 返回节点
        return node;
    }

    /**
     * 回收节点到节点池(会自动隐藏,超限会删除)
     * @param id 对象池ID
     * @param node 要回收的节点
     * @returns 是否成功回收
     */
    public putNode(id: string, node: Node): boolean {
        if (!node || !isValid(node)) {
            return false;
        }

        let pool = this._pools.get(id);
        if (!pool || this.getPoolSize(id) >= pool.maxSize) {
            this._log('warn', `超出限制，删除`);
            node.destroy();
            return false;
        }

        // 获取节点上的PoolItem组件
        const poolItem = node.getComponent('IPoolItem') || node.getComponent(DefaultPoolItem);
        if (!poolItem) {
            this._log('warn', `节点没有IPoolItem组件，无法回收`);
            node.destroy();
            return false;
        }

        // 将节点禁用
        node.active = false;

        // 查找节点池对应的分组
        let parentNode = this._poolRoot;

        // 获取分组名称
        const groupName = this._findGroupNameForPool(id);
        if (groupName) {
            const groupNode = this._poolRoot.getChildByName(groupName);
            if (groupNode) {
                parentNode = groupNode;
            }
        }

        // 设置节点的父节点为对象池父节点
        node.parent = parentNode;

        // 回收到对象池，先转为unknown再转为IPoolItem以避免类型错误
        return this.put(poolItem as unknown as IPoolItem);
    }

    /**
     * 查找对象池ID对应的分组名称
     * @param id 对象池ID
     * @returns 分组名称，如果找不到则返回空字符串
     */
    private _findGroupNameForPool(id: string): string {
        // 直接检查id是否包含分组名称
        for (const group of this._nodePoolGroups) {
            if (id === group || id.startsWith(group)) {
                return group;
            }
        }

        // 查找已有的实例所在分组
        const pool = this._pools.get(id);
        if (pool) {
            const firstItem = pool.getFirstItem();
            if (firstItem && firstItem.poolType === PoolItemType.NODE) {
                const node = (firstItem as any).node;
                if (node && node.parent) {
                    for (const group of this._nodePoolGroups) {
                        if (node.parent.name === group) {
                            return group;
                        }
                    }
                }
            }
        }

        return "";
    }

    /**
     * 获取对象池对应的父节点
     * @param id 对象池ID
     * @returns 父节点，如果找不到则返回null
     */
    public getPoolParent(id: string): Node | null {
        if (!id || !this._pools.has(id)) {
            return null;
        }

        // 获取分组名称
        const groupName = this._findGroupNameForPool(id);
        if (groupName) {
            // 返回对应的分组节点
            return this._poolRoot.getChildByName(groupName);
        }

        // 如果没有找到分组，返回根节点
        return this._poolRoot;
    }

    /**
     * 清理指定对象池中的无效对象
     * @param id 对象池ID
     * @returns 清理的对象数量
     */
    public cleanPoolInvalidItems(id: string): number {
        if (!this._ensurePoolExists(id)) return 0;
        return this._pools.get(id).cleanInvalidItems();
    }

    /**
     * 清理所有对象池中的无效对象
     * @returns 总共清理的对象数量
     */
    public cleanAllInvalidItems(): number {
        let totalCleaned = 0;
        this._pools.forEach((pool, id) => {
            const cleaned = pool.cleanInvalidItems();
            totalCleaned += cleaned;
            if (cleaned > 0) {
                this._log('log', `对象池 ${id} 清理了 ${cleaned} 个无效对象`);
            }
        });

        if (totalCleaned > 0) {
            this._log('log', `总共清理了 ${totalCleaned} 个无效对象`);
        }

        return totalCleaned;
    }

    /**
     * 手动扩容指定对象池
     * @param id 对象池ID
     * @param expandCount 扩容数量，如果不指定则使用池配置的expandSize
     * @returns 是否扩容成功
     */
    public expandPool(id: string, expandCount?: number): boolean {
        if (!this._ensurePoolExists(id)) {
            return false;
        }

        const pool = this._pools.get(id);
        if (!pool) {
            return false;
        }

        // 检查是否已达到最大容量
        const maxSize = pool.maxSize;
        const currentTotal = pool.totalCreated;
        
        if (maxSize && currentTotal >= maxSize) {
            this._log('warn', `对象池 ${id} 已达最大容量，无法扩容: ${currentTotal}/${maxSize}`);
            return false;
        }

        // 计算实际扩容数量
        const count = expandCount || pool.expandSize;
        let actualExpandCount = count;
        if (maxSize && currentTotal + count > maxSize) {
            actualExpandCount = maxSize - currentTotal;
        }

        if (actualExpandCount <= 0) {
            return false;
        }

        this._log('log', `手动扩容对象池 ${id}，数量: ${actualExpandCount}`);

        // 调用池的扩容方法
        pool.expandPool(actualExpandCount);
        
        return true;
    }

    /**
     * 获取单个对象池统计信息
     * @param id 对象池ID
     * @returns 池统计信息
     */
    public getSinglePoolStats(id: string): { total: number, allocated: number, available: number, maxSize: number, expandSize: number } | null {
        if (!this._ensurePoolExists(id)) {
            return null;
        }

        const pool = this._pools.get(id);
        if (!pool) {
            return null;
        }

        return {
            total: pool.totalCreated,
            allocated: pool.allocated,
            available: pool.size,
            maxSize: pool.maxSize,
            expandSize: pool.expandSize
        };
    }
} 