import { ObjectType } from "../types/Types";
import { IEntity } from "./IEntity";
import { IComponent } from "./IComponent";

/**
 * 实体系统接口，定义实体系统的基本行为
 */
export interface IEntitySystem {
    /** 插入实体到系统 */
    insertEntity(entity: IEntity): boolean;
    
    /** 获取指定ID的实体 */
    getEntity<T extends IEntity>(uid: string): T;
    
    /** 创建主玩家实体 */
    createMainPlayer<T extends IEntity, T2 extends IComponent>(cls: ObjectType<T>, componentClsList: ObjectType<T2>[]): T;
    
    /** 创建实体 */
    createEntity<T extends IEntity, T2 extends IComponent>(cls: ObjectType<T>, componentClsList: ObjectType<T2>[]): T;
    
    /** 清理系统 */
    clear(): void;
    
    /** 释放系统资源 */
    release(): void;
} 