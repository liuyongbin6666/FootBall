import { _decorator, Component, Node } from 'cc';
import { IEntitySystem } from '../interfaces/IEntitySystem';
import { IEntity } from '../interfaces/IEntity';
import { IComponent } from '../interfaces/IComponent';
import { ObjectType } from '../types/Types';
import { ClsSingleton } from '../../Singleton/ClsSingleton';

/**
 * 实体系统类，负责创建和管理实体
 */
export class EntitySystem extends ClsSingleton<EntitySystem> implements IEntitySystem {
    /**
     * 初始化实体系统
     */
    init(): void {
        // 清理现有数据
        this.clear();
        this._mainPlayer = null;
        this._entityMap.clear();
    }
    /** 提供类型安全的单例访问 */
    public static get Ins(): EntitySystem {
        return this.getInstance<EntitySystem>();
    }
    
    /** 主玩家实体 */
    private _mainPlayer: IEntity | null = null;
    /** 实体映射表 */
    private _entityMap: Map<string, IEntity> = new Map<string, IEntity>();

    /**
     * 插入实体到系统
     * @param entity 实体实例
     * @returns 是否插入成功
     */
    public insertEntity(entity: IEntity): boolean {
        const uid = entity.uid;
        if (this._entityMap.has(uid)) {
            return false;
        }
        this._entityMap.set(uid, entity);
        return true;
    }

    /**
     * 获取指定ID的实体
     * @param uid 实体唯一ID
     * @returns 实体实例
     */
    public getEntity<T extends IEntity>(uid: string): T {
        if (this._entityMap.has(uid)) {
            return this._entityMap.get(uid) as T;
        }
        return null!;
    }

    /**
     * 获取主玩家实体
     * @returns 主玩家实体
     */
    public getMainPlayer<T extends IEntity>(): T {
        return this._mainPlayer as T;
    }

    /**
     * 创建主玩家实体
     * @param cls 实体类
     * @param componentClsList 组件类列表
     * @returns 主玩家实体实例
     */
    public createMainPlayer<T extends IEntity, T2 extends IComponent>(cls: ObjectType<T>, componentClsList: ObjectType<T2>[]): T {
        if (this._mainPlayer) {
            return this._mainPlayer as T;
        }
        const entity: T = this.createEntity(cls, componentClsList);
        this._mainPlayer = entity;
        return entity;
    }

    /**
     * 创建实体
     * @param cls 实体类
     * @param componentClsList 组件类列表
     * @returns 实体实例
     */
    public createEntity<T extends IEntity, T2 extends IComponent>(cls: ObjectType<T>, componentClsList: ObjectType<T2>[]): T {
        const entity: T = new cls();
        if (!entity.create(null)) {
            entity.release();
            return null!;
        }
        if (!entity.registerComponent(componentClsList)) {
            entity.release();
            return null!;
        }
        if (!entity.active(null)) {
            entity.release();
            return null!;
        }
        this.insertEntity(entity);
        return entity;
    }

    /**
     * 删除实体
     * @param uid 实体唯一ID
     * @returns 是否删除成功
     */
    public removeEntity(uid: string): boolean {
        if (!this._entityMap.has(uid)) {
            return false;
        }
        const entity = this._entityMap.get(uid)!;
        entity.release();
        this._entityMap.delete(uid);
        return true;
    }

    /**
     * 获取所有实体
     * @returns 实体数组
     */
    public getAllEntities(): IEntity[] {
        return Array.from(this._entityMap.values());
    }

    /**
     * 清理系统
     */
    public clear(): void {
        if (this._mainPlayer) {
            this._mainPlayer.clear();
        }
        
        this._entityMap.forEach((entity) => {
            entity.clear();
        });
    }

    /**
     * 释放系统资源
     */
    public release(): void {
        if (this._mainPlayer) {
            this._mainPlayer.release();
            this._mainPlayer = null;
        }
        
        this._entityMap.forEach((entity) => {
            entity.release();
        });
        this._entityMap.clear();
    }
} 