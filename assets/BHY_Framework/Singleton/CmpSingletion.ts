import { _decorator, Component, isValid, Node } from 'cc';
import { Layer } from '../../script/manager/Layer';
const { ccclass } = _decorator;

/**
 * 组件化单例基类
 * 所有需要单例模式的组件都可以继承此类，避免重复编写单例逻辑
 * 使用Map进行实例管理，支持手动清理和资源释放
 * @example
 * // 使用示例
 * @ccclass('MyManager')
 * class MyManager extends CmpSingletion<MyManager> {
 *   // 组件实现...
 *   // 添加静态Ins访问器以获得更好的类型推断
 *   public static get Ins(): MyManager {
 *     return this.getInstance<MyManager>();
 *   }
 * }
 * 
 * // 获取实例
 * const manager = MyManager.Ins;
 */
@ccclass('CmpSingletion')
export class CmpSingletion<T extends CmpSingletion<T>> extends Component {
    private static instances = new Map<any, any>();
    private static singletonNodes = new Map<any, Node>();

    /**
     * 获取单例实例
     * 该方法自动处理实例的创建和缓存
     * 注意：建议在子类中重写静态Ins属性以获得更好的类型推断
     */
    public static get Ins(): any {
        const self = this as any;
        if (!CmpSingletion.instances.has(self)) {
            const singletonNode = CmpSingletion.createSingletonNode(self);
            CmpSingletion.singletonNodes.set(self, singletonNode);

            // 检查节点上是否已有该组件
            let instance = singletonNode.getComponent(self);
            if (!instance) {
                instance = singletonNode.addComponent(self) as any;
            }

            CmpSingletion.instances.set(self, instance);
        }
        return CmpSingletion.instances.get(self);
    }
    private static createSingletonNode(self: any) {
        // 获取框架持久化根节点 
        // 在框架根节点下创建管理器节点组
        let singletonManagers = Layer.Instance.node.getChildByName('SingletonManagers');
        if (!singletonManagers || !isValid(singletonManagers, true)) {
            singletonManagers = new Node('SingletonManagers');
            singletonManagers.parent =  Layer.Instance.node;
        }
        console.log('[CmpSingletion] 将创建单例节点-----', self.name);
        // 创建单例节点 - 确保所有管理器都是SingletonManagers的直接子节点
        const singletonNode = new Node(`[Singleton]${self.name}`);
        singletonNode.parent = singletonManagers;

        // 确保节点位置正确，避免被其他管理器错误地添加为子节点
        if (singletonNode.parent !== singletonManagers) {
            singletonNode.parent = singletonManagers;
        }

        return singletonNode;
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
        const self = this as any;
        if (!CmpSingletion.instances.has(self)) {
            // 确保单例节点存在
            let singletonNode = CmpSingletion.singletonNodes.get(self);
            if (!singletonNode) {
                singletonNode = CmpSingletion.createSingletonNode(self);
                CmpSingletion.singletonNodes.set(self, singletonNode);
            }

            // 检查节点上是否已有该组件
            let instance = singletonNode.getComponent(self);
            if (!instance) {
                instance = singletonNode.addComponent(self) as any;
            }

            CmpSingletion.instances.set(self, instance);
        }
        return CmpSingletion.instances.get(self) as U;
    }

    /**
     * 销毁单例实例
     * 主要用于需要清理资源或重置状态的情况
     */
    public static destroyInstance<U>(cls: new () => U): void {
        if (CmpSingletion.instances.has(cls)) {
            const instance = CmpSingletion.instances.get(cls);
            if (instance && typeof instance.release === 'function') {
                instance.release();
            }

            // 从节点上移除组件
            const singletonNode = CmpSingletion.singletonNodes.get(cls);
            if (singletonNode) {
                //已过时 singletonNode.removeComponent(instance);
                instance.destroy();
            }

            CmpSingletion.instances.delete(cls);
            CmpSingletion.singletonNodes.delete(cls);
        }
    }

    /**
     * 清理所有单例实例
     * 对所有实例调用release方法（如果有），然后清空实例缓存
     * 通常在游戏退出或切换大场景时调用
     */
    public static clearAll(): void {
        // 对所有实例调用release方法（如果有）
        CmpSingletion.instances.forEach((instance) => {
            if (instance && typeof instance.release === 'function') {
                instance.release();
            }
        });

        // 清空实例缓存
        CmpSingletion.instances.clear();

        // 销毁所有单例节点
        CmpSingletion.singletonNodes.forEach((node) => {
            if (node && node.isValid) {
                node.destroy();
            }
        });
        CmpSingletion.singletonNodes.clear();

        console.log('[CmpSingletion] 已清理所有单例实例');
    }

    /**
     * 检查是否存在单例实例
     * @param cls 类引用
     */
    public static has<U>(cls: new () => U): boolean {
        return CmpSingletion.instances.has(cls);
    }

    /** 是否已初始化 */
    protected _initialized = false;

    /** 初始化中的等待回调 */
    protected _initinCal: Map<string, (() => void)[]> = new Map();

    /** 初始化中 */
    protected _initin = false;

    public Name = "CmpSingletion";

    /**
     * 释放资源
     * 子类应重写此方法，在BHFramework.release()时被调用
     */
    public release(): void {
        // 子类重写此方法以释放资源
    }

    /**
     * 获取单例节点
     */
    public static getSingletonNode(): Node | null {
        // 由于现在每个管理器都有自己的节点，这个方法需要传入具体的类
        return null;
    }
}


