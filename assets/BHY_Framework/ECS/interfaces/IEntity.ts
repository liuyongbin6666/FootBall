/* eslint-disable */
import { IComponent } from './IComponent';
import { ObjectType } from '../types/Types';

/**
 * 实体接口，定义所有实体应具备的属性和方法
 */
export interface IEntity {
    /** 实体的唯一标识符 */
    readonly uid: string;
    
    /** 创建实体 */
    create(data?: any): boolean;
    
    /** 激活实体 */
    active(data?: any): boolean;
    
    /** 设置持久化数据上下文 */
    onSetDBContext(data: any): boolean;
    
    /** 导出持久化数据上下文 */
    exportDBContext(): any;
    
    /** 批量注册(添加)组件 */
    registerComponent<T extends IComponent>(componentClsList: ObjectType<T>[]): boolean;
    
    /** 添加组件 */
    addComponent(component: IComponent): boolean;
    
    /** 获取组件 */
    getComponent<T extends IComponent>(componentId: string): T;
    
    /** 设置属性 */
    setAttr(attrName: string, newVal: any, reason?: number, bSync?: boolean): Promise<boolean>;
    
    /** 获取属性 */
    getAttr<T>(attrName: string): T;
    
    /** 获取实体类型 */
    getEntityType(): string;
    
    /** 清理实体 */
    clear(): void;
    
    /** 重置实体状态用于对象池（轻量级清理，不清理运行时组件如FSM） */
    resetForPool(): void;
    
    /** 释放实体资源 */
    release(): void;
} 