import { ClsSingleton } from '../../Singleton/ClsSingleton';
import { IEntity } from '../interfaces/IEntity';
import { ObjectType } from '../types/Types';
import { EntitySystem } from './EntitySystem';
import { IComponent } from '../interfaces/IComponent';

/**
 * 实体池配置接口
 */
export interface EntityPoolConfig {
    /** 实体类 */
    entityClass: ObjectType<IEntity>;
    /** 组件类列表 */
    componentClasses: ObjectType<IComponent>[];
    /** 初始容量 */
    initialSize?: number;
    /** 最大容量，0表示无限制 */
    maxSize?: number;
    /** 自动扩展大小 */
    expandSize?: number;
    /** 预初始化数据 */
    initData?: any;
}

/**
 * 实体池项
 */
interface EntityPoolItem {
    /** 实体类 */
    entityClass: ObjectType<IEntity>;
    /** 组件类列表 */
    componentClasses: ObjectType<IComponent>[];
    /** 空闲实体队列 */
    freeEntities: IEntity[];
    /** 使用中的实体 */
    usedEntities: Set<IEntity>;
    /** 最大容量，0表示无限制 */
    maxSize: number;
    /** 自动扩展大小 */
    expandSize: number;
    /** 预初始化数据 */
    initData: any;
}

/**
 * 实体池管理器
 * 用于管理游戏中频繁创建和销毁的实体对象池
 */
export class EntityPoolMgr extends ClsSingleton<EntityPoolMgr> {
    /** 提供类型安全的单例访问 */
    public static get Ins(): EntityPoolMgr {
        return this.getInstance<EntityPoolMgr>();
    }
    
    /** 实体池映射 */
    private _pools: Map<string, EntityPoolItem> = new Map();

    /**
     * 创建实体池
     * @param poolId 池ID
     * @param config 池配置
     * @returns 是否创建成功
     */
    public createPool(poolId: string, config: EntityPoolConfig): boolean {
        if (this._pools.has(poolId)) {
            console.warn(`[EntityPoolMgr] 池已存在: ${poolId}`);
            return false;
        }

        const initialSize = config.initialSize || 5;
        const maxSize = config.maxSize || 0;
        const expandSize = config.expandSize || 3;

        // 创建池
        const pool: EntityPoolItem = {
            entityClass: config.entityClass,
            componentClasses: config.componentClasses,
            freeEntities: [],
            usedEntities: new Set(),
            maxSize: maxSize,
            expandSize: expandSize,
            initData: config.initData || null
        };

        // 预创建实体
        this._preCreateEntities(pool, initialSize);

        // 保存池
        this._pools.set(poolId, pool);
        console.log(`[EntityPoolMgr] 创建池成功: ${poolId}, 初始容量: ${initialSize}`);
        return true;
    }

    /**
     * 预创建实体
     * @param pool 实体池
     * @param count 数量
     */
    private _preCreateEntities(pool: EntityPoolItem, count: number): void {
        const maxSize = pool.maxSize;
        const currentTotal = pool.freeEntities.length + pool.usedEntities.size;
        
        // 如果已达最大容量，不再创建
        if (maxSize > 0 && currentTotal >= maxSize) {
            return;
        }

        // 计算实际创建数量
        let createCount = count;
        if (maxSize > 0) {
            createCount = Math.min(count, maxSize - currentTotal);
        }

        // 创建实体
        for (let i = 0; i < createCount; i++) {
            const entity = EntitySystem.Ins.createEntity(
                pool.entityClass,
                pool.componentClasses,
            );
            
            if (entity) {
                // 初始化数据
                if (pool.initData) {
                    entity.onSetDBContext(pool.initData);
                }
                // 预创建时只清理基础状态，不清理FSM等运行时组件
                entity.resetForPool();
                // 添加到空闲队列
                pool.freeEntities.push(entity);
            }
        }
    }

    /**
     * 从池中获取实体
     * @param poolId 池ID
     * @param initData 初始化数据
     * @returns 实体实例
     */
    public get<T extends IEntity>(poolId: string, initData?: any): T | null {
        const pool = this._pools.get(poolId);
        if (!pool) {
            console.warn(`[EntityPoolMgr] 池不存在: ${poolId}`);
            return null;
        }
        //console.log(`[EntityPoolMgr] 获取实体: ${poolId},空闲:${pool.freeEntities.length},使用:${pool.usedEntities.size}`);
        // 如果空闲队列为空，尝试扩展池
        if (pool.freeEntities.length === 0) {
            this._preCreateEntities(pool, pool.expandSize);
            
            // 如果扩展后仍为空，返回null
            if (pool.freeEntities.length === 0) {
                console.warn(`[EntityPoolMgr] 池 ${poolId} 已满`);
                return null;
            }
        }

        // 从队列获取实体
        const entity = pool.freeEntities.pop() as T;
        
        // 检查是否需要自动扩容（当可用实体少于阈值时）
        this._checkAndAutoExpand(pool);
        
        // 激活实体
        entity.active(initData);
        
        // 添加到使用中集合
        pool.usedEntities.add(entity);
        
        return entity;
    }

    /**
     * 回收实体到池
     * @param poolId 池ID
     * @param entity 实体
     * @returns 是否回收成功
     */
    public put(poolId: string, entity: IEntity): boolean {
        const pool = this._pools.get(poolId);
        if (!pool) {
            console.warn(`[EntityPoolMgr] 池不存在: ${poolId}`);
            return false;
        }

        // 检查是否属于此池
        if (!pool.usedEntities.has(entity)) {
            console.warn(`[EntityPoolMgr] 实体不属于池: ${poolId}`);
            return false;
        }

        // 清理实体状态
        entity.clear();
        
        // 从使用中移除
        pool.usedEntities.delete(entity);
        
        // 添加到空闲队列
        pool.freeEntities.push(entity);
        //console.log(`[EntityPoolMgr] 回收实体: ${entity.uid} 到池 ${poolId}`);
        return true;
    }

    /**
     * 获取池统计信息
     * @param poolId 池ID
     * @returns 统计信息
     */
    public getPoolStats(poolId: string): { free: number, used: number, total: number } | null {
        const pool = this._pools.get(poolId);
        if (!pool) {
            return null;
        }

        return {
            free: pool.freeEntities.length,
            used: pool.usedEntities.size,
            total: pool.freeEntities.length + pool.usedEntities.size
        };
    }

    /**
     * 获取所有池统计信息
     * @returns 统计信息
     */
    public getAllPoolStats(): { [poolId: string]: { free: number, used: number, total: number } } {
        const stats: { [poolId: string]: { free: number, used: number, total: number } } = {};
        
        this._pools.forEach((pool, poolId) => {
            stats[poolId] = {
                free: pool.freeEntities.length,
                used: pool.usedEntities.size,
                total: pool.freeEntities.length + pool.usedEntities.size
            };
        });
        
        return stats;
    }

    /**
     * 清理池（回收所有实体但不销毁）
     * @param poolId 池ID
     * @returns 是否清理成功
     */
    public clearPool(poolId: string): boolean {
        const pool = this._pools.get(poolId);
        if (!pool) {
            return false;
        }

        // 清理并回收所有使用中的实体
        pool.usedEntities.forEach(entity => {
            entity.clear();
            pool.freeEntities.push(entity);
        });
        
        // 清空使用中集合
        pool.usedEntities.clear();
        
        return true;
    }

    /**
     * 释放池（销毁所有实体并移除池）
     * @param poolId 池ID
     * @returns 是否释放成功
     */
    public releasePool(poolId: string): boolean {
        const pool = this._pools.get(poolId);
        if (!pool) {
            return false;
        }

        // 清理并释放所有实体
        pool.freeEntities.forEach(entity => {
            entity.release();
            EntitySystem.Ins.removeEntity(entity.uid);
        });
        
        pool.usedEntities.forEach(entity => {
            entity.release();
            EntitySystem.Ins.removeEntity(entity.uid);
        });
        
        // 移除池
        this._pools.delete(poolId);
        
        return true;
    }

    /**
     * 释放所有池
     */
    public releaseAll(): void {
        const poolIds = Array.from(this._pools.keys());
        poolIds.forEach(poolId => {
            this.releasePool(poolId);
        });
    }

    /**
     * 检查并自动扩容
     * 当可用实体少于阈值时自动扩容
     * @param pool 实体池
     */
    private _checkAndAutoExpand(pool: EntityPoolItem): void {
        // 如果 expandSize <= 2，表示不启用自动扩容
        if (pool.expandSize <= 2) {
            return;
        }

        // 如果可用实体少于2个，自动扩容
        if (pool.freeEntities.length < 2) {
            // 检查是否已达到最大容量
            if (pool.maxSize > 0 && (pool.freeEntities.length + pool.usedEntities.size) >= pool.maxSize) {
                console.warn(`[EntityPoolMgr] 池已满，无法自动扩容，当前容量: ${pool.freeEntities.length + pool.usedEntities.size}/${pool.maxSize}`);
                return;
            }

            console.log(`[EntityPoolMgr] 可用实体不足（${pool.freeEntities.length} < 2），自动扩容`);
            this._preCreateEntities(pool, pool.expandSize);
        }
    }
} 