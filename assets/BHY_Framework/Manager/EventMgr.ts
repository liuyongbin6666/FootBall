import { ClsSingleton } from "../Singleton/ClsSingleton";
import { LogMgr } from "./LogMgr";

/**
 * 事件管理器，实现事件的发布订阅功能
 * 使用示例：
 * EventMgr.Ins.on('eventName', callback, target);
 * EventMgr.Ins.emit('eventName', arg1, arg2);
 * EventMgr.Ins.off('eventName', callback, target);
 * EventMgr.Ins.offTarget(target);
 * EventMgr.Ins.clear();
 * EventMgr.Ins.getListenerCount('eventName');  
 */
export class EventMgr extends ClsSingleton<EventMgr> {
    public Name = "EventMgr"

    public async init() {
        if (this._initialized) {
            LogMgr.Ins.error(`[${this.Name}] 重复初始化`);
            return
        }
        this._initialized = true;
        LogMgr.Ins.info(`[${this.Name}] 初始化管理器组件`);
    }

    /**
     * 释放事件管理器资源
     */
    public release(): void {
        LogMgr.Ins.info('[EventMgr] 事件管理器释放资源');
        // 清除所有事件监听
        this.clear();
    }

    /** 提供类型安全的单例访问 */
    public static get Ins(): EventMgr {
        return this.getInstance<EventMgr>();
    }

    /** 事件回调映射表 */
    private _eventMap: Map<string, Array<{ callback: Function, target: any }>> = new Map();

    /**
     * 订阅事件
     * @param eventName 事件名称
     * @param callback 回调函数
     * @param target 回调上下文
     */
    public on(eventName: string, callback: Function, target?: any): void {
        if (!eventName || !callback) {
            LogMgr.Ins.warn('[EventMgr] 订阅事件失败：事件名称或回调函数为空', 'EventMgr');
            return;
        }

        let eventList = this._eventMap.get(eventName);
        if (!eventList) {
            eventList = [];
            this._eventMap.set(eventName, eventList);
        }

        // 避免重复添加
        for (let i = 0; i < eventList.length; i++) {
            if (eventList[i].callback === callback && eventList[i].target === target) {
                //LogMgr.Ins.debug(`[EventMgr] 事件 ${eventName} 已存在相同监听器，跳过添加`, 'EventMgr');
                return;
            }
        }

        eventList.push({ callback, target });
        //LogMgr.Ins.debug(`[EventMgr] 成功订阅事件: ${eventName}`, 'EventMgr');
    }

    /**
     * 取消订阅事件
     * @param eventName 事件名称
     * @param callback 回调函数
     * @param target 回调上下文
     */
    public off(eventName: string, callback?: Function, target?: any): void {
        if (!eventName) {
            LogMgr.Ins.warn('[EventMgr] 取消订阅事件失败：事件名称为空', 'EventMgr');
            return;
        }

        // 如果不指定回调和目标，则移除所有该事件的监听
        if (!callback && !target) {
            const removed = this._eventMap.delete(eventName);
            if (removed) {
                //LogMgr.Ins.debug(`[EventMgr] 成功移除事件 ${eventName} 的所有监听器`, 'EventMgr');
            }
            return;
        }

        let eventList = this._eventMap.get(eventName);
        if (!eventList) {
            //LogMgr.Ins.debug(`[EventMgr] 事件 ${eventName} 不存在监听器`, 'EventMgr');
            return;
        }

        let removedCount = 0;
        for (let i = eventList.length - 1; i >= 0; i--) {
            const item = eventList[i];
            if ((!callback || item.callback === callback) &&
                (!target || item.target === target)) {
                eventList.splice(i, 1);
                removedCount++;
            }
        }

        if (eventList.length === 0) {
            this._eventMap.delete(eventName);
        }

        if (removedCount > 0) {
            //LogMgr.Ins.debug(`[EventMgr] 成功移除事件 ${eventName} 的 ${removedCount} 个监听器`, 'EventMgr');
        }
    }

    /**
     * 取消指定目标的所有事件订阅
     * @param target 目标对象
     */
    public offTarget(target: any): void {
        if (!target) {
            LogMgr.Ins.warn('[EventMgr] 取消目标事件失败：目标对象为空', 'EventMgr');
            return;
        }

        let totalRemoved = 0;
        this._eventMap.forEach((eventList, eventName) => {
            let removedCount = 0;
            for (let i = eventList.length - 1; i >= 0; i--) {
                if (eventList[i].target === target) {
                    eventList.splice(i, 1);
                    removedCount++;
                }
            }

            if (eventList.length === 0) {
                this._eventMap.delete(eventName);
            }

            totalRemoved += removedCount;
        });

        if (totalRemoved > 0) {
            //LogMgr.Ins.debug(`[EventMgr] 成功移除目标的所有事件监听器，共 ${totalRemoved} 个`, 'EventMgr');
        }
    }

    /**
     * 触发事件
     * @param eventName 事件名称
     * @param arg 可变参数
     */
    public emit(eventName: string, ...args: any[]): void {
        if (!eventName) {
            LogMgr.Ins.warn('[EventMgr] 触发事件失败：事件名称为空', 'EventMgr');
            return;
        }

        const eventList = this._eventMap.get(eventName);
        if (!eventList || eventList.length === 0) {
            //LogMgr.Ins.debug(`[EventMgr] 事件 ${eventName} 没有监听器`, 'EventMgr');
            return;
        }

        //LogMgr.Ins.debug(`[EventMgr] 触发事件: ${eventName}，监听器数量: ${eventList.length}`, 'EventMgr');

        // 创建副本避免回调中修改列表的问题
        const eventsCopy = [...eventList];
        for (let i = 0; i < eventsCopy.length; i++) {
            const event = eventsCopy[i];
            //console.log("注册的时间===>", event);

            try {
                event.callback.apply(event.target, args);
            } catch (error) {
                LogMgr.Ins.error(`[EventMgr] 事件 ${eventName} 回调执行出错: ${error}`, 'EventMgr');
            }
        }
    }

    /**
     * 清除所有事件
     */
    public clear(): void {
        const eventCount = this._eventMap.size;
        this._eventMap.clear();
        LogMgr.Ins.info(`[EventMgr] 清除所有事件，共 ${eventCount} 个事件`, 'EventMgr');
    }

    /**
     * 获取事件监听器数量
     * @param eventName 事件名称
     * @returns 监听器数量
     */
    public getListenerCount(eventName: string): number {
        const eventList = this._eventMap.get(eventName);
        return eventList ? eventList.length : 0;
    }

    /**
     * 获取所有事件名称
     * @returns 事件名称数组
     */
    public getEventNames(): string[] {
        return Array.from(this._eventMap.keys());
    }

    /**
     * 检查事件是否存在监听器
     * @param eventName 事件名称
     * @returns 是否存在监听器
     */
    public hasListeners(eventName: string): boolean {
        return this.getListenerCount(eventName) > 0;
    }
} 