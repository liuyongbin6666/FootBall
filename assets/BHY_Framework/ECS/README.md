# BHYFrame ECS系统

这是一个基于Cocos Creator 3.8.5+的轻量级ECS（Entity-Component-System）框架，适用于中小型游戏开发。

## 目录结构

```
ECS/
├── interfaces/         # 接口定义
│   ├── IEntity.ts      # 实体接口
│   ├── IComponent.ts   # 组件接口
│   └── IEntitySystem.ts # 实体系统接口
├── types/              # 类型定义
│   ├── Types.ts        # 通用类型定义
│   ├── EntityType.ts   # 实体类型枚举
│   └── ComponentType.ts # 组件类型枚举
├── core/               # 核心实现
│   ├── BaseEntity.ts   # 基础实体类
│   └── BaseComponent.ts # 基础组件类
├── systems/            # 系统实现
│   └── EntitySystem.ts # 实体系统
└── examples/           # 使用示例
    ├── Player.ts       # 玩家实体示例
    ├── InventoryComponent.ts # 背包组件示例
    └── GameManager.ts  # 游戏管理器示例
```



....以后再实现
BHYEcs/
├── core/
│   ├── World.ts              # 世界核心类
│   ├── Entity.ts             # 实体基类
│   ├── Component.ts          # 组件基类
│   ├── System.ts             # 系统基类
│   └── ComponentStorage.ts   # 组件存储类
├── interfaces/
│   ├── IWorld.ts             # 世界接口
│   ├── IEntity.ts            # 实体接口
│   ├── IComponent.ts         # 组件接口
│   └── ISystem.ts            # 系统接口
├── utils/
│   ├── EventEmitter.ts       # 事件系统
│   ├── ObjectPool.ts         # 对象池
│   └── Serializer.ts         # 序列化工具
├── extensions/
│   ├── CocosNodeBridge.ts    # Cocos节点桥接
│   ├── TransformSystem.ts    # 变换系统
│   └── RenderSystem.ts       # 渲染系统
├── examples/
│   ├── BasicUsage.ts         # 基础用法示例
│   ├── GameExample.ts        # 游戏示例
│   └── MonsterSystem.ts      # 怪物系统示例
└── README.md                 # 使用文档

性能优化设计
组件存储优化
使用Map存储同类型组件，按实体ID快速查找
考虑支持稀疏数组实现，进一步优化遍历性能
实体查询缓存
缓存查询结果，减少重复过滤操作
智能更新缓存，仅在组件添加/移除时重建
对象池复用
实体和组件使用对象池，减少GC压力
提供回收和重用机制
事件系统优化
使用事件优先级队列
支持事件批处理和合并

实现建议与关键点
从世界开始实现：先实现核心的World类及其接口
增量式开发：先实现基础功能，再添加高级特性
编写单元测试：确保每个模块功能正确
文档先行：先写API设计和使用示例，再实现代码
性能测试：针对大量实体的场景测试性能
提供迁移工具：帮助从旧框架迁移到新框架
框架优点
组合优点：结合了两个框架的优势
类型安全：充分利用TypeScript类型系统
高性能：优化的组件存储和查询
灵活性：支持接口和抽象类，适应不同场景
Cocos集成：无缝对接Cocos Creator
完整性：包含事件系统、数据持久化等全面功能
这个框架设计综合了两个现有框架的优点，提供了更加完善、易用和高性能的ECS实现，特别适合在Cocos Creator环境中开发中小型游戏项目。
我可以继续深入讨论具体的实现细节，或者针对您关注的特定方面提供更详细的设计。

....
## 基本概念

- **实体(Entity)**: 游戏中的对象，如玩家、怪物、NPC等。实体本身不包含游戏逻辑，而是由组件来扩展其功能。
- **组件(Component)**: 实现具体功能的模块，如移动、渲染、背包等功能。一个实体可以附加多个组件。
- **系统(System)**: 管理实体的创建、获取和销毁，是ECS框架的核心。

## API详解

### 实体系统 (EntitySystem)

实体系统是ECS框架的核心，负责管理所有实体的创建、获取和销毁。

#### 获取单例实例
```typescript
// 获取实体系统实例
const entitySystem = EntitySystem.Ins;
```

#### 创建实体
```typescript
// 创建普通实体
const entity = EntitySystem.Ins.createEntity(
    EntityClass,
    [Component1, Component2]
);

// 创建主玩家实体
const player = EntitySystem.Ins.createMainPlayer(
    PlayerClass,
    [MovementComponent, InventoryComponent]
);
```

#### 获取实体
```typescript
// 获取主玩家
const player = EntitySystem.Ins.getMainPlayer<PlayerClass>();

// 根据ID获取实体
const entity = EntitySystem.Ins.getEntity<EntityClass>(entityId);

// 获取所有实体
const allEntities = EntitySystem.Ins.getAllEntities();
```

#### 删除实体
```typescript
// 删除实体
EntitySystem.Ins.removeEntity(entityId);
```

#### 清理和释放
```typescript
// 清理所有实体（不删除）
EntitySystem.Ins.clear();

// 释放所有实体资源
EntitySystem.Ins.release();
```

### 实体 (BaseEntity)

实体是游戏中的对象，继承自`BaseEntity`，通过组件扩展功能。

#### 生命周期方法
```typescript
// 创建实体
entity.create(data);

// 激活实体
entity.active(data);

// 清理实体
entity.clear();

// 释放实体资源
entity.release();
```

#### 组件管理
```typescript
// 注册多个组件
entity.registerComponent([Component1, Component2]);

// 添加单个组件
const component = new MyComponent();
entity.addComponent(component);

// 获取组件
const component = entity.getComponent<MyComponent>(ComponentType.MY_TYPE);
```

#### 属性管理
```typescript
// 设置属性
await entity.setAttr('health', 100);

// 获取属性
const health = entity.getAttr<number>('health');
```

#### 数据持久化
```typescript
// 保存实体数据
const data = entity.exportDBContext();

// 加载实体数据
entity.onSetDBContext(data);
```

### 组件 (BaseComponent)

组件实现具体功能，继承自`BaseComponent`。

#### 生命周期方法
```typescript
// 创建组件
component.create(entity);

// 激活组件
component.active(data);

// 清理组件
component.clear();

// 释放组件资源
component.release();
```

#### 重写方法
```typescript
// 重写组件类型
public getType(): string {
    return ComponentType.MY_COMPONENT;
}

// 组件创建时调用
protected onCreate(): void {
    // 初始化逻辑
}

// 组件激活时调用
protected onActive(): void {
    // 激活逻辑，可以在这里订阅事件
    EventMgr.Ins.on('some_event', this.handleEvent, this);
}
```

#### 数据持久化
```typescript
// 保存组件数据
public exportDBContext(): any {
    return {
        myData: this._myData
    };
}

// 加载组件数据
public onSetDBContext(data: any): boolean {
    if (data && data.myData) {
        this._myData = data.myData;
    }
    return true;
}
```

## 使用方法

### 1. 创建实体类

继承`BaseEntity`并实现相关方法：

```typescript
import { BaseEntity } from '../core/BaseEntity';
import { EntityType } from '../types/EntityType';

export class Player extends BaseEntity {
    // 实体特有属性
    protected _playerInfo = { name: '玩家', level: 1 };

    // 重写方法
    public getEntityType(): EntityType {
        return EntityType.PLAYER;
    }

    // 添加自定义方法
    public setName(name: string): void {
        this._playerInfo.name = name;
    }
    
    // 处理数据持久化
    public exportDBContext(): any {
        return {
            playerInfo: {...this._playerInfo}
        };
    }
    
    public onSetDBContext(data: any): boolean {
        if (data && data.playerInfo) {
            this._playerInfo = {...this._playerInfo, ...data.playerInfo};
        }
        return true;
    }
}
```

### 2. 创建组件类

继承`BaseComponent`并实现相关方法：

```typescript
import { BaseComponent } from '../core/BaseComponent';
import { ComponentType } from '../types/ComponentType';
import { EventMgr } from '../../Manager/EventMgr';

export class InventoryComponent extends BaseComponent {
    // 组件特有属性
    private _items = new Map<number, Item>();
    
    // 初始化逻辑
    protected onCreate(): void {
        // 初始化背包
    }
    
    // 激活逻辑
    protected onActive(): void {
        // 订阅事件
        EventMgr.Ins.on('add_item', this.addItem, this);
    }

    // 重写组件类型
    public getType(): string {
        return ComponentType.INVENTORY;
    }

    // 添加自定义方法
    public addItem(item: Item): boolean {
        this._items.set(item.id, {...item});
        // 发布事件通知其他组件
        EventMgr.Ins.emit('inventory_changed', Array.from(this._items.values()));
        return true;
    }
    
    // 数据持久化
    public exportDBContext(): any {
        return {
            inventory: {
                items: Array.from(this._items.values())
            }
        };
    }
    
    // 资源释放
    public release(): void {
        // 取消事件订阅
        EventMgr.Ins.offTarget(this);
    }
}
```

### 3. 使用实体系统创建和管理实体

```typescript
import { _decorator, Component } from 'cc';
import { EntitySystem } from '../systems/EntitySystem';
import { Player } from './Player';
import { InventoryComponent } from './InventoryComponent';
import { ComponentType } from '../types/ComponentType';

const { ccclass } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {
    onLoad() {
        // 初始化ECS系统
        this.initECS();
    }
    
    private initECS() {
        // 创建主玩家实体
        const player = EntitySystem.Ins.createMainPlayer(
            Player,
            [InventoryComponent]
        ) as Player;

        // 初始化玩家数据
        player.setName('勇者');
        
        // 获取背包组件
        const inventory = player.getComponent(ComponentType.INVENTORY) as InventoryComponent;
        
        // 添加物品到背包
        inventory.addItem({ id: 1, name: '生命药水', count: 5 });
    }
    
    onDestroy() {
        // 释放ECS系统资源
        EntitySystem.Ins.release();
    }
}
```

### 4. 事件通信

组件之间可以通过事件系统进行通信：

```typescript
// 订阅事件
EventMgr.Ins.on('inventory_changed', this.handleInventoryChange, this);

// 发布事件
EventMgr.Ins.emit('add_item', { id: 1, name: '生命药水', count: 5 });

// 取消订阅
EventMgr.Ins.offTarget(this);
```

### 5. 数据持久化

```typescript
// 保存游戏数据
saveGame() {
    const player = EntitySystem.Ins.getMainPlayer<Player>();
    const saveData = player.exportDBContext();
    // 保存到本地存储
    localStorage.setItem('gameData', JSON.stringify(saveData));
}

// 加载游戏数据
loadGame() {
    const saveDataStr = localStorage.getItem('gameData');
    if (saveDataStr) {
        const saveData = JSON.parse(saveDataStr);
        const player = EntitySystem.Ins.getMainPlayer<Player>();
        player.onSetDBContext(saveData);
    }
}
```

## 高级用法

### 组件通信模式

1. **事件通信**: 松耦合，适合跨系统组件通信
   ```typescript
   // 在A组件中发布事件
   EventMgr.Ins.emit('player_move', { x: 10, y: 20 });
   
   // 在B组件中订阅事件
   EventMgr.Ins.on('player_move', this.onPlayerMove, this);
   ```

2. **直接引用**: 紧耦合，适合关联性强的组件
   ```typescript
   // 获取另一个组件
   const otherComponent = this.getEntity().getComponent<OtherComponent>(ComponentType.OTHER);
   otherComponent.doSomething();
   ```

3. **中介者模式**: 使用实体作为中介
   ```typescript
   // 通过实体属性共享数据
   this.getEntity().setAttr('position', { x: 10, y: 20 });
   
   // 在其他组件中访问
   const position = this.getEntity().getAttr<{x: number, y: number}>('position');
   ```

### 组件组合与复用

通过组合不同的组件，可以快速构建具有不同功能的实体：

```typescript
// 构建玩家实体
const player = EntitySystem.Ins.createEntity(
    BaseEntity,
    [
        MovementComponent,    // 移动功能
        AnimationComponent,   // 动画功能
        InputComponent,       // 输入处理
        InventoryComponent,   // 背包功能
        CombatComponent       // 战斗功能
    ]
);

// 构建NPC实体
const npc = EntitySystem.Ins.createEntity(
    BaseEntity,
    [
        MovementComponent,    // 移动功能
        AnimationComponent,   // 动画功能
        DialogueComponent,    // 对话功能
        AIComponent           // AI行为
    ]
);
```

### 与其他系统集成

#### 与资源管理器集成

```typescript
import { ResMgr } from '../../Manager/ResMgr';

export class RenderComponent extends BaseComponent {
    private _sprite: Sprite = null;
    
    protected onCreate(): void {
        // 从资源管理器加载资源
        ResMgr.Ins.getOrLoadAsset("UI", "player/avatar", SpriteFrame).then(spriteFrame => {
            // 使用加载的资源
            this._sprite = this.getEntity().getAttr<Sprite>('spriteNode');
            if (this._sprite) {
                this._sprite.spriteFrame = spriteFrame;
            }
        });
    }
    
    public release(): void {
        // 释放引用的资源
        ResMgr.Ins.releaseReference(this);
        super.release();
    }
}
```

#### 与音频管理器集成

```typescript
import { AudioMgr } from '../../Manager/AudioMgr';

export class AudioComponent extends BaseComponent {
    protected onActive(): void {
        // 订阅事件
        EventMgr.Ins.on('player_attack', this.playAttackSound, this);
    }
    
    private playAttackSound(): void {
        // 播放音效
        AudioMgr.Ins.playEffect('attack');
    }
    
    public release(): void {
        EventMgr.Ins.offTarget(this);
        super.release();
    }
}
```

### 动态组件管理

在游戏运行时可以动态添加或移除组件：

```typescript
// 动态添加组件
const buffComponent = new BuffComponent();
entity.addComponent(buffComponent);
buffComponent.active({ duration: 10, power: 5 });

// 移除组件（自定义方法）
removeComponent(entity: IEntity, componentType: string): void {
    const component = entity.getComponent(componentType);
    if (component) {
        component.clear();
        component.release();
        // 从组件映射表中移除（需要自定义方法）
        this._removeComponentFromEntity(entity, componentType);
    }
}
```

## 性能优化建议

1. **组件粒度控制**
   - 避免创建过于细粒度的组件，这会增加组件间通信和管理开销
   - 功能相关的逻辑应该放在同一个组件中

2. **事件使用优化**
   - 避免频繁触发事件，特别是在Update等高频调用的函数中
   - 使用节流或防抖技术限制事件触发频率
   - 不使用的事件监听器要及时移除，防止内存泄漏

3. **数据持久化优化**
   - 只序列化必要的数据，避免深层嵌套对象
   - 考虑使用增量更新而非全量序列化
   - 大型数据考虑压缩后存储

4. **实体池管理**
   - 对于频繁创建和销毁的实体（如子弹、特效），使用对象池模式
   ```typescript
   // 简单的实体池示例
   class EntityPool {
       private _pool: Map<string, IEntity[]> = new Map();
       
       getEntity(type: string, ...args: any[]): IEntity {
           if (!this._pool.has(type) || this._pool.get(type).length === 0) {
               // 创建新实体
               return EntitySystem.Ins.createEntity(...args);
           }
           // 从池中获取
           return this._pool.get(type).pop();
       }
       
       recycleEntity(type: string, entity: IEntity): void {
           if (!this._pool.has(type)) {
               this._pool.set(type, []);
           }
           entity.clear(); // 重置状态但不释放资源
           this._pool.get(type).push(entity);
       }
   }
   ```

5. **组件更新调度**
   - 不是所有组件都需要每帧更新，可以根据需要调整更新频率
   - 考虑使用时间切片或任务调度系统分散计算压力

## 注意事项

1. 实体应该专注于基本属性和生命周期管理，具体功能应由组件实现。
2. 组件之间应尽量解耦，通过事件系统通信而非直接引用。
3. 释放资源时应该同时清理实体、组件和事件监听。
4. 确保组件的`onCreate`和`onActive`方法不会抛出异常，这可能导致实体创建失败。
5. 实体和组件的`release`方法应该彻底清理所有资源，防止内存泄漏。
6. 避免创建循环引用，这会导致垃圾回收失效。

## 实体池管理器 (EntityPoolMgr)

实体池管理器是ECS框架的扩展组件，专门用于管理游戏中频繁创建和销毁的实体（如子弹、特效、敌人等），通过对象池模式提高性能并减少内存碎片。

### 获取单例实例
```typescript
// 获取实体池管理器实例
const entityPoolMgr = EntityPoolMgr.Ins;
```

### 创建实体池
```typescript
// 创建子弹实体池
entityPoolMgr.createPool('bullet', {
    entityClass: BulletEntity,
    componentClasses: [MovementComponent, CollisionComponent, RenderComponent],
    initialSize: 20,     // 初始池容量
    maxSize: 100,        // 最大池容量，0表示无限制
    expandSize: 10,      // 自动扩展大小
    initData: { speed: 10, damage: 5 }  // 预初始化数据
});
```

### 从池中获取实体
```typescript
// 获取子弹实体
const bullet = entityPoolMgr.get<BulletEntity>('bullet', {
    position: { x: 100, y: 200 },
    direction: { x: 1, y: 0 }
});

// 使用实体
if (bullet) {
    // 子弹已经被自动激活，可以直接使用
    bullet.fire();
}
```

### 回收实体到池
```typescript
// 当子弹击中目标或离开屏幕时回收
entityPoolMgr.put('bullet', bullet);
```

### 获取池统计信息
```typescript
// 获取单个池的统计信息
const bulletPoolStats = entityPoolMgr.getPoolStats('bullet');
console.log(`子弹池状态: 空闲 ${bulletPoolStats.free}, 使用中 ${bulletPoolStats.used}, 总数 ${bulletPoolStats.total}`);

// 获取所有池的统计信息
const allStats = entityPoolMgr.getAllPoolStats();
console.log('所有实体池状态:', allStats);
```

### 清理和释放池
```typescript
// 清理池（回收所有实体但不销毁）
entityPoolMgr.clearPool('bullet');

// 释放池（销毁所有实体并移除池）
entityPoolMgr.releasePool('bullet');

// 释放所有池
entityPoolMgr.releaseAll();
```

## 使用示例：子弹系统

下面是一个使用实体池管理器实现子弹系统的完整示例：

```typescript
import { _decorator, Component, Vec2 } from 'cc';
import { EntitySystem } from '../systems/EntitySystem';
import { EntityPoolMgr } from '../systems/EntityPoolMgr';
import { BulletEntity } from './BulletEntity';
import { MovementComponent } from './MovementComponent';
import { CollisionComponent } from './CollisionComponent';
import { RenderComponent } from './RenderComponent';
import { EventMgr } from '../../Manager/EventMgr';

const { ccclass } = _decorator;

@ccclass('WeaponSystem')
export class WeaponSystem extends Component {
    onLoad() {
        // 初始化实体池
        this.initEntityPool();
        
        // 订阅事件
        EventMgr.Ins.on('player_fire', this.onPlayerFire, this);
    }
    
    private initEntityPool() {
        // 创建子弹实体池
        EntityPoolMgr.Ins.createPool('bullet', {
            entityClass: BulletEntity,
            componentClasses: [MovementComponent, CollisionComponent, RenderComponent],
            initialSize: 20,
            maxSize: 100,
            expandSize: 10,
            initData: { speed: 10, damage: 5 }
        });
    }
    
    private onPlayerFire(data: { position: Vec2, direction: Vec2 }) {
        // 从池中获取子弹
        const bullet = EntityPoolMgr.Ins.get<BulletEntity>('bullet', {
            position: data.position,
            direction: data.direction
        });
        
        if (bullet) {
            // 设置子弹参数并发射
            bullet.setDamage(this.calculateDamage());
            bullet.fire();
            
            // 监听子弹生命周期结束事件
            bullet.once('bullet_end', () => {
                // 回收子弹到池
                EntityPoolMgr.Ins.put('bullet', bullet);
            });
        }
    }
    
    private calculateDamage(): number {
        // 计算伤害逻辑
        return 10 + Math.floor(Math.random() * 5);
    }
    
    onDestroy() {
        // 取消事件订阅
        EventMgr.Ins.offTarget(this);
        
        // 释放实体池
        EntityPoolMgr.Ins.releasePool('bullet');
    }
}
```

## 最佳实践：实体池管理

1. **合理设置池容量**
   - 初始容量设置为常规需求量，避免频繁扩展
   - 最大容量设置为峰值需求，防止内存占用过大
   - 扩展大小设置为平均突发需求量

2. **统一的生命周期管理**
   - 在实体的`clear`方法中确保彻底重置所有状态
   - 使用事件来监听实体生命周期结束，自动回收到池中

3. **池分组管理**
   - 按功能或场景对实体池进行分组命名（如'bullet:normal'、'bullet:special'）
   - 场景切换时释放不需要的池，保留通用池

4. **预热策略**
   - 在游戏启动或加载关卡时预先创建和初始化实体池
   - 在低CPU使用率时进行池扩展，避免在游戏高峰期扩展造成卡顿

5. **配合资源管理**
   - 实体池创建前确保相关资源已预加载
   - 实体池释放时考虑是否需要释放关联资源

// ... existing code ... 