/* eslint-disable */
import { IEntity } from "./IEntity";

/**
 * 组件接口，定义所有组件应具备的属性和方法
 */
export interface IComponent {
    /** 创建组件 */
    create(owner: IEntity): boolean;
    
    /** 激活组件 */
    active(data?: any): boolean;
    
    /** 设置持久化数据上下文 */
    onSetDBContext(data: any): boolean;
    
    /** 导出持久化数据上下文 */
    exportDBContext(): any;
    
    /** 获取所属实体 */
    getEntity<T extends IEntity>(): T;
    
    /** 获取组件类型 */
    getType(): string;
    
    /** 清理组件 */
    clear(): void;
    
    /** 释放组件资源 */
    release(): void;
} 