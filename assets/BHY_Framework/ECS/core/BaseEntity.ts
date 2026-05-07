import { _decorator, Component } from 'cc';
import { IEntity } from '../interfaces/IEntity';
import { IComponent } from '../interfaces/IComponent';
import { ObjectType } from '../types/Types';

/**
 * 基础实体类，实现IEntity接口
 */
export class BaseEntity implements IEntity {
    /** 实体ID生成器 */
    private static EntityID: number = 0;
    /** 实体唯一ID */
    protected readonly _uid: string = "";
    /** 实体属性 */
    protected _attr: any = {};
    /** 组件映射表 */
    protected _componentMap: Map<string, IComponent> = new Map<string, IComponent>();

    /**
     * 构造函数
     */
    public constructor() {
        this._uid = "entity_" + (++BaseEntity.EntityID);
    }

    /**
     * 获取实体唯一ID
     */
    public get uid(): string {
        return this._uid;
    }

    /**
     * 创建实体
     * @param data 创建所需数据
     * @returns 是否创建成功
     */
    public create(data?: any): boolean {
        return true;
    }

    /**
     * 激活实体
     * @param data 激活所需数据
     * @returns 是否激活成功
     */
    public active(data?: any): boolean {
        return true;
    }

    /**
     * 设置持久化数据上下文
     * @param data 持久化数据
     * @returns 是否设置成功
     */
    public onSetDBContext(data: any): boolean {
        return true;
    }

    /**
     * 导出持久化数据上下文
     * @returns 持久化数据
     */
    public exportDBContext(): any {
        return null;
    }

    /**
     * 批量注册(添加)组件
     * @param componentClsList 组件类列表
     * @returns 是否注册成功
     */
    public registerComponent<T extends IComponent>(componentClsList: ObjectType<T>[]): boolean {
        for (let i = 0; i < componentClsList.length; ++i) {
            let component = new componentClsList[i]();
            component.create(this);
            this.addComponent(component);
        }
        return true;
    }

    /**
     * 添加组件
     * @param component 组件实例
     * @returns 是否添加成功
     */
    public addComponent(component: IComponent): boolean {
        if (!component) { return false; }
        let componentId = component.getType();
        this._componentMap.set(componentId, component);
        return true;
    }

    /**
     * 获取组件
     * @param componentId 组件ID
     * @returns 组件实例
     */
    public getComponent<T extends IComponent>(componentId: string): T {
        return this._componentMap.get(componentId) as T;
    }

    /**
     * 设置属性
     * @param attrName 属性名
     * @param newVal 新属性值
     * @param reason 变更原因
     * @param bSync 是否同步
     * @returns 是否设置成功
     */
    public setAttr(attrName: string, newVal: any, reason?: number, bSync?: boolean): Promise<boolean> {
        return new Promise((resolve) => {
            this._attr[attrName] = newVal;
            resolve(true);
        });
    }

    /**
     * 获取属性
     * @param attrName 属性名
     * @returns 属性值
     */
    public getAttr<T>(attrName: string): T {
        return this._attr[attrName] as T;
    }

    /**
     * 获取实体类型
     * @returns 实体类型
     */
    public getEntityType(): string {
        return this.constructor.name;
    }

    /**
     * 清理实体
     */
    public clear(): void {
        this._componentMap.forEach((value) => {
            value.clear();
        });
    }

    /**
     * 重置实体状态用于对象池（轻量级清理，不清理运行时组件如FSM）
     */
    public resetForPool(): void {
        // 只清理基础属性，不清理运行时组件
        this._attr = {};
        // 不清理组件映射，保持组件结构
    }

    /**
     * 释放实体资源
     */
    public release(): void {
        this.clear();
        this._componentMap.forEach((value) => {
            value.release();
        });
        this._componentMap.clear();
    }
} 