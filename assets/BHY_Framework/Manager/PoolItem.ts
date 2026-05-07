/**
 * @file PoolItem.ts
 * @description 对象池项相关定义
 */

import { _decorator, Component } from 'cc';
const { ccclass } = _decorator;

/**
 * 对象池项类型
 */
export enum PoolItemType {
    /** 普通对象 */
    NORMAL,
    /** 节点对象 */
    NODE
}

/**
 * 对象池项接口
 * 所有需要使用对象池管理的对象都应该实现此接口
 */
export interface IPoolItem {
    /** 唯一标识符，用于确定对象的类型 */
    readonly poolId: string;
    /** 对象类型 */
    readonly poolType: PoolItemType;
    /** 初始化对象（获取时调用） */
    onInit?(...args: any[]): void;
    /** 重置对象状态（回收时调用） */
    onReset?(): void;
    /** 销毁对象（清理时调用） */
    onDestroy?(): void;
}

/**
 * 默认对象池项组件
 * 当节点没有实现IPoolItem接口时，将使用此默认组件
 */
@ccclass('DefaultPoolItem')
export class DefaultPoolItem extends Component implements IPoolItem {
    public poolId: string = "";
    public poolType: PoolItemType = PoolItemType.NODE;

    public onInit(...args: any[]): void {
        // 检查组件本身是否有效
        if (!this.isValid) {
            console.error("[DefaultPoolItem] onInit: 组件无效");
            throw new Error("DefaultPoolItem onInit: 组件无效");
        }

        if (!this.node) {
            console.error("[DefaultPoolItem] onInit: 节点为null");
            throw new Error("DefaultPoolItem onInit: 节点为null");
        }

        if (!this.node.isValid) {
            console.error("[DefaultPoolItem] onInit: 节点无效");
            throw new Error("DefaultPoolItem onInit: 节点无效");
        }

        this.node.active = true;
    }

    public onReset(): void {
        if (!this.node) {
            console.warn("[DefaultPoolItem] onReset: 节点为null");
            return;
        }

        if (!this.node.isValid) {
            console.warn("[DefaultPoolItem] onReset: 节点无效");
            return;
        }

        this.node.active = false;
    }

    public onDestroy(): void {
        // 默认销毁逻辑
    }
} 