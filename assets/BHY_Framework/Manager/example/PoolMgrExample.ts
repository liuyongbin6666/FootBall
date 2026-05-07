import { _decorator, Component, Node, Prefab, instantiate } from 'cc';
import { PoolMgr } from '../PoolMgr';
import { IPoolItem, PoolItemType } from '../PoolItem';

const { ccclass, property } = _decorator;

/**
 * 自定义对象池项示例
 * 实现IPoolItem接口的对象
 */
class CustomPoolItem implements IPoolItem {
    public readonly poolId: string = "CustomItem";
    public readonly poolType: PoolItemType = PoolItemType.NORMAL;
    
    private _data: any = null;
    
    public onInit(data: any): void {
        this._data = data;
        console.log(`[CustomPoolItem] 初始化，数据: ${data}`);
    }
    
    public onReset(): void {
        this._data = null;
        console.log(`[CustomPoolItem] 重置`);
    }
    
    public onDestroy(): void {
        console.log(`[CustomPoolItem] 销毁`);
    }
    
    public getData(): any {
        return this._data;
    }
}

/**
 * 对象池管理器使用示例
 */
@ccclass('PoolMgrExample')
export class PoolMgrExample extends Component {
    @property(Prefab)
    bulletPrefab: Prefab = null;
    
    @property(Prefab)
    enemyPrefab: Prefab = null;
    
    @property(Prefab)
    effectPrefab: Prefab = null;

    start() {
        this.initPools();
        this.testObjectPools();
    }

    /**
     * 初始化对象池
     */
    private initPools() {
        // 初始化节点池
        if (this.bulletPrefab) {
            PoolMgr.Ins.initPool("Bullet", this.bulletPrefab, 10, 50, "Game");
        }
        
        if (this.enemyPrefab) {
            PoolMgr.Ins.initPool("Enemy", this.enemyPrefab, 5, 20, "Game");
        }
        
        if (this.effectPrefab) {
            PoolMgr.Ins.initPool("Effect", this.effectPrefab, 20, 100, "Effect");
        }
        
        // 创建自定义对象池
        PoolMgr.Ins.createPool("CustomItem", {
            maxSize: 30,
            initSize: 5,
            factory: () => new CustomPoolItem()
        });
    }

    /**
     * 测试对象池功能
     */
    private testObjectPools() {
        console.log("=== 开始测试对象池功能 ===");
        
        // 测试节点池
        this.testNodePools();
        
        // 测试自定义对象池
        this.testCustomObjectPools();
        
        // 打印统计信息
        PoolMgr.Ins.printStats();
    }

    /**
     * 测试节点池
     */
    private testNodePools() {
        console.log("--- 测试节点池 ---");
        
        // 获取子弹节点
        const bullet1 = PoolMgr.Ins.getNode("Bullet", true);
        const bullet2 = PoolMgr.Ins.getNode("Bullet", true);
        
        if (bullet1) {
            console.log(`获取子弹节点: ${bullet1.name}`);
            // 模拟使用后回收
            setTimeout(() => {
                PoolMgr.Ins.putNode("Bullet", bullet1);
                console.log("回收子弹节点");
            }, 2000);
        }
        
        if (bullet2) {
            console.log(`获取子弹节点: ${bullet2.name}`);
            // 模拟使用后回收
            setTimeout(() => {
                PoolMgr.Ins.putNode("Bullet", bullet2);
                console.log("回收子弹节点");
            }, 3000);
        }
        
        // 获取敌人节点
        const enemy = PoolMgr.Ins.getNode("Enemy", true);
        if (enemy) {
            console.log(`获取敌人节点: ${enemy.name}`);
            // 模拟使用后回收
            setTimeout(() => {
                PoolMgr.Ins.putNode("Enemy", enemy);
                console.log("回收敌人节点");
            }, 4000);
        }
    }

    /**
     * 测试自定义对象池
     */
    private testCustomObjectPools() {
        console.log("--- 测试自定义对象池 ---");
        
        // 获取自定义对象
        const item1 = PoolMgr.Ins.get<CustomPoolItem>("CustomItem", "数据1");
        const item2 = PoolMgr.Ins.get<CustomPoolItem>("CustomItem", "数据2");
        
        if (item1) {
            console.log(`获取自定义对象，数据: ${item1.getData()}`);
            // 模拟使用后回收
            setTimeout(() => {
                PoolMgr.Ins.put(item1);
                console.log("回收自定义对象1");
            }, 1000);
        }
        
        if (item2) {
            console.log(`获取自定义对象，数据: ${item2.getData()}`);
            // 模拟使用后回收
            setTimeout(() => {
                PoolMgr.Ins.put(item2);
                console.log("回收自定义对象2");
            }, 1500);
        }
    }

    /**
     * 测试批量操作
     */
    private testBatchOperations() {
        console.log("--- 测试批量操作 ---");
        
        const bullets: Node[] = [];
        
        // 批量获取子弹
        for (let i = 0; i < 10; i++) {
            const bullet = PoolMgr.Ins.getNode("Bullet", true);
            if (bullet) {
                bullets.push(bullet);
            }
        }
        
        console.log(`批量获取了 ${bullets.length} 个子弹`);
        
        // 批量回收
        setTimeout(() => {
            bullets.forEach(bullet => {
                PoolMgr.Ins.putNode("Bullet", bullet);
            });
            console.log("批量回收子弹");
        }, 5000);
    }

    /**
     * 测试池信息查询
     */
    private testPoolInfo() {
        console.log("--- 测试池信息查询 ---");
        
        const poolIds = PoolMgr.Ins.getAllPoolIds();
        console.log(`所有池ID: ${poolIds.join(', ')}`);
        
        poolIds.forEach(id => {
            const info = PoolMgr.Ins.getPoolInfo(id);
            console.log(`池 ${id}: 池中 ${info.size} 个, 已分配 ${info.allocated} 个, 总创建 ${info.total} 个`);
        });
        
        // 获取分组信息
        const gamePools = PoolMgr.Ins.getPoolIdsByGroup("Game");
        console.log(`Game分组池: ${gamePools.join(', ')}`);
    }

    /**
     * 测试清理功能
     */
    private testCleanup() {
        console.log("--- 测试清理功能 ---");
        
        // 清理无效对象
        const cleanedCount = PoolMgr.Ins.cleanAllInvalidItems();
        console.log(`清理了 ${cleanedCount} 个无效对象`);
        
        // 清理特定分组
        PoolMgr.Ins.clearPoolsByGroup("Effect", false);
        console.log("清理Effect分组的所有池");
    }

    /**
     * 按钮回调：测试节点池
     */
    public onTestNodePools() {
        this.testNodePools();
    }

    /**
     * 按钮回调：测试自定义对象池
     */
    public onTestCustomPools() {
        this.testCustomObjectPools();
    }

    /**
     * 按钮回调：测试批量操作
     */
    public onTestBatchOperations() {
        this.testBatchOperations();
    }

    /**
     * 按钮回调：查询池信息
     */
    public onQueryPoolInfo() {
        this.testPoolInfo();
    }

    /**
     * 按钮回调：清理池
     */
    public onCleanupPools() {
        this.testCleanup();
    }

    /**
     * 按钮回调：打印统计信息
     */
    public onPrintStats() {
        PoolMgr.Ins.printStats();
    }
} 