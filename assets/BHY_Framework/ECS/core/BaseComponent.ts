import { _decorator } from 'cc';
import { IComponent } from '../interfaces/IComponent';
import { IEntity } from '../interfaces/IEntity';

/**
 * 基础组件类，实现IComponent接口
 */
export class BaseComponent implements IComponent {
    /** 组件所属实体 */
    protected _owner: IEntity | null = null;

    /**
     * 创建组件
     * @param owner 所属实体
     * @returns 是否创建成功
     */
    public create(owner: IEntity): boolean {
        this._owner = owner;
        this.onCreate();
        return true
    }

    /**
     * 组件创建时调用
     */
    protected onCreate(): void { }

    /**
     * 激活组件
     * @param data 激活所需数据
     * @returns 是否激活成功
     */
    public active(data?: any): boolean {
        this.onActive();
        return true;
    }

    /**
     * 组件激活时调用
     */
    protected onActive(): void {
        // 事件订阅可以在这里进行
        // 例如：EventMgr.getInstance().on("some_event", this.someHandler, this);
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
     * 获取所属实体
     * @returns 所属实体
     */
    public getEntity<T extends IEntity>(): T {
        return this._owner as T;
    }

    /**
     * 获取组件类型
     * @returns 组件类型
     */
    public getType(): string {
        return this.constructor.name;
    }

    /**
     * 清理组件
     */
    public clear(): void { }

    /**
     * 释放组件资源
     */
    public release(): void {
        // 取消所有事件订阅
        // 例如：EventMgr.getInstance().offTarget(this);
    }
} 