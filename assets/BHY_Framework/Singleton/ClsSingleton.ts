/**
 * 泛型单例基类
 * 所有需要单例模式的类都可以继承此类，避免重复编写单例逻辑
 * @example
 * // 使用示例
 * class MyManager extends ClsSingleton<MyManager> {
 *   // 类实现...
 *   // 添加静态Ins访问器以获得更好的类型推断
 *   public static get Ins(): MyManager {
 *     return this.getInstance<MyManager>();
 *   }
 * }
 * 
 * // 获取实例
 * const manager = MyManager.Ins;
 */
export class ClsSingleton<T extends ClsSingleton<T>> {
    private static instances = new Map<any, any>();

    /**
     * 获取单例实例
     * 该方法自动处理实例的创建和缓存
     * 注意：建议在子类中重写静态Ins属性以获得更好的类型推断
     */
    public static get Ins(): any {
        const self = this as any;
        if (!ClsSingleton.instances.has(self)) {
            ClsSingleton.instances.set(self, new self());
        }
        return ClsSingleton.instances.get(self);
    }

    /**
     * 获取指定类型的单例实例
     * 子类应该通过此方法实现类型安全的Ins静态访问器
     * @example
     * public static get Ins(): MyManager {
     *   return this.getInstance<MyManager>();
     * }
     */
    protected static getInstance<U>(): U {
        const self = this;
        if (!ClsSingleton.instances.has(self)) {
            ClsSingleton.instances.set(self, new self());
        }
        return ClsSingleton.instances.get(self) as U;
    }

    /**
     * 销毁单例实例
     * 主要用于需要清理资源或重置状态的情况
     */
    public static destroyInstance<U>(cls: new () => U): void {
        if (ClsSingleton.instances.has(cls)) {
            // 如果实例实现了release方法，调用它进行资源释放
            const instance = ClsSingleton.instances.get(cls);
            if (instance && typeof instance.release === 'function') {
                instance.release();
            }

            // 从实例缓存中移除
            ClsSingleton.instances.delete(cls);
        }
    }

    /**
     * 清理所有单例实例
     * 通常在游戏退出或切换大场景时调用
     */
    public static clearAll(): void {
        // 对所有实例调用release方法（如果有）
        ClsSingleton.instances.forEach((instance) => {
            if (instance && typeof instance.release === 'function') {
                instance.release();
            }
        });

        // 清空实例缓存
        ClsSingleton.instances.clear();
    }

    /**
     * 检查是否存在单例实例
     * @param cls 类引用
     */
    public static has<U>(cls: new () => U): boolean {
        return ClsSingleton.instances.has(cls);
    }

    /** 是否已初始化 */
    protected _initialized = false;

    /** 初始化中的等待回调 */
    protected _initinCal: Map<string, (() => void)[]> = new Map();

    /** 初始化中 */
    protected _initin = false;

    public Name = "ClsSingleton"

    /**
     * 释放资源
     * 子类应重写此方法，在BHFramework.release()时被调用
     */
    public release(): void {
        // 子类重写此方法以释放资源
    }
} 