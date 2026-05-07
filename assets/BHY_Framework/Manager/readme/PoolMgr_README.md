# 对象池管理器 (PoolMgr) 使用指南

## 概述

PoolMgr 是一个高性能的对象池管理系统，专门为 Cocos Creator 游戏开发设计。它支持节点对象和普通对象的池化管理，可以有效减少内存分配和垃圾回收，提升游戏性能。

## 主要特性

- ✅ **节点池管理** - 支持预制体节点的池化管理
- ✅ **自定义对象池** - 支持任意实现 IPoolItem 接口的对象
- ✅ **分组管理** - 支持按功能分组管理对象池
- ✅ **自动清理** - 自动清理无效对象，防止内存泄漏
- ✅ **统计信息** - 提供详细的池使用统计信息
- ✅ **类型安全** - 完整的 TypeScript 类型支持

## 快速开始

### 1. 初始化框架

```typescript
// 在游戏启动时初始化框架
BHFramework.Ins.init();
```

### 2. 创建节点池

```typescript
// 创建子弹池
PoolMgr.Ins.initPool("Bullet", bulletPrefab, 10, 50, "Game");

// 创建敌人池
PoolMgr.Ins.initPool("Enemy", enemyPrefab, 5, 20, "Game");

// 创建特效池
PoolMgr.Ins.initPool("Effect", effectPrefab, 20, 100, "Effect");
```

### 3. 使用节点池

```typescript
// 获取节点
const bullet = PoolMgr.Ins.getNode("Bullet", true);
if (bullet) {
    // 设置位置等属性
    bullet.setPosition(100, 100);
}

// 回收节点
PoolMgr.Ins.putNode("Bullet", bullet);
```

### 4. 创建自定义对象池

```typescript
// 定义自定义对象
class CustomItem implements IPoolItem {
    public readonly poolId: string = "CustomItem";
    public readonly poolType: PoolItemType = PoolItemType.NORMAL;
    
    public onInit(data: any): void {
        // 初始化逻辑
    }
    
    public onReset(): void {
        // 重置逻辑
    }
    
    public onDestroy(): void {
        // 销毁逻辑
    }
}

// 创建自定义对象池
PoolMgr.Ins.createPool("CustomItem", {
    maxSize: 30,
    initSize: 5,
    factory: () => new CustomItem()
});

// 使用自定义对象池
const item = PoolMgr.Ins.get<CustomItem>("CustomItem", "初始化数据");
PoolMgr.Ins.put(item);
```

## API 参考

### 核心方法

#### 节点池管理

```typescript
// 初始化节点池
initPool(id: string, prefab: Prefab, initialSize?: number, maxSize?: number, group?: string): boolean

// 获取节点
getNode(id: string, active?: boolean, ...args: any[]): Node

// 回收节点
putNode(id: string, node: Node): boolean
```

#### 自定义对象池

```typescript
// 创建对象池
createPool(id: string, config?: PoolConfig): boolean

// 获取对象
get<T extends IPoolItem>(id: string, ...args: any[]): T

// 回收对象
put(item: IPoolItem): boolean
```

#### 池管理

```typescript
// 清空指定池
clearPool(id: string, destroyAll?: boolean): void

// 清空所有池
clearAll(destroyAll?: boolean): void

// 清理无效对象
cleanAllInvalidItems(): number

// 获取池信息
getPoolInfo(id: string): { size: number, allocated: number, total: number }
```

#### 统计信息

```typescript
// 获取所有池ID
getAllPoolIds(): string[]

// 获取池统计信息
getPoolStats(): {
    totalPools: number,
    totalObjects: number,
    activeObjects: number,
    groups: { [key: string]: { pools: number, objects: number } }
}

// 打印统计信息
printStats(): void
```

### 配置选项

```typescript
interface PoolConfig {
    maxSize?: number;        // 最大容量
    initSize?: number;       // 初始大小
    factory?: (...args: any[]) => IPoolItem;  // 工厂函数
    resetFunc?: (item: IPoolItem) => void;    // 重置函数
}
```

## 使用场景

### 1. 子弹系统

```typescript
// 初始化子弹池
PoolMgr.Ins.initPool("Bullet", bulletPrefab, 20, 100, "Game");

// 发射子弹
const bullet = PoolMgr.Ins.getNode("Bullet", true);
if (bullet) {
    bullet.setPosition(player.position);
    // 设置子弹属性...
}

// 子弹销毁时回收
PoolMgr.Ins.putNode("Bullet", bullet);
```

### 2. 敌人系统

```typescript
// 初始化敌人池
PoolMgr.Ins.initPool("Enemy", enemyPrefab, 10, 50, "Game");

// 生成敌人
const enemy = PoolMgr.Ins.getNode("Enemy", true);
if (enemy) {
    enemy.setPosition(spawnPoint);
    // 设置敌人属性...
}

// 敌人死亡时回收
PoolMgr.Ins.putNode("Enemy", enemy);
```

### 3. 特效系统

```typescript
// 初始化特效池
PoolMgr.Ins.initPool("Explosion", explosionPrefab, 30, 200, "Effect");

// 播放特效
const effect = PoolMgr.Ins.getNode("Explosion", true);
if (effect) {
    effect.setPosition(target.position);
    // 播放动画...
    
    // 特效结束后回收
    setTimeout(() => {
        PoolMgr.Ins.putNode("Explosion", effect);
    }, 2000);
}
```

## 最佳实践

### 1. 池大小设置

- **初始大小**: 根据游戏开始时的预期需求设置
- **最大大小**: 根据内存限制和性能要求设置
- **监控使用**: 定期检查池的使用情况，调整大小

### 2. 分组管理

```typescript
// 按功能分组
"Game"    // 游戏对象：子弹、敌人、道具
"UI"      // 界面元素：按钮、面板、提示
"Effect"  // 特效：爆炸、粒子、音效
"Fly"     // 飞行物：飞镖、魔法弹
```

### 3. 内存管理

```typescript
// 定期清理无效对象
setInterval(() => {
    const cleaned = PoolMgr.Ins.cleanAllInvalidItems();
    if (cleaned > 0) {
        console.log(`清理了 ${cleaned} 个无效对象`);
    }
}, 30000); // 每30秒清理一次
```

### 4. 性能监控

```typescript
// 定期打印统计信息
setInterval(() => {
    PoolMgr.Ins.printStats();
}, 60000); // 每60秒打印一次
```

## 注意事项

1. **及时回收**: 使用完对象后要及时回收，避免内存泄漏
2. **池大小**: 根据实际需求设置合适的池大小，避免过大或过小
3. **分组管理**: 合理使用分组功能，便于管理和清理
4. **错误处理**: 检查返回的对象是否有效，避免空指针错误
5. **生命周期**: 在场景切换时清理不需要的池

## 故障排除

### 常见问题

1. **对象获取失败**
   - 检查池是否存在
   - 检查预制体是否有效
   - 检查池大小是否足够

2. **内存泄漏**
   - 确保及时回收对象
   - 定期清理无效对象
   - 检查对象生命周期管理

3. **性能问题**
   - 调整池大小
   - 使用分组管理
   - 监控统计信息

### 调试技巧

```typescript
// 启用详细日志
LogMgr.Ins.setLevel(LogLevel.DEBUG);

// 打印池信息
PoolMgr.Ins.printStats();

// 检查特定池
const info = PoolMgr.Ins.getPoolInfo("Bullet");
console.log(`子弹池: ${info.size}/${info.total} (${info.allocated} 活跃)`);
```

## 更新日志

### v1.0.0
- 初始版本
- 支持节点池和自定义对象池
- 支持分组管理
- 支持统计信息
- 支持自动清理

## 许可证

MIT License 