# ECS核心类：实体与组件

本目录包含ECS(Entity-Component-System)架构的核心实现类`BaseEntity`和`BaseComponent`，它们是整个ECS框架的基础。

## 实体与组件概览

| 特性 | BaseEntity（基础实体） | BaseComponent（基础组件） |
|------|----------------------|------------------------|
| 定义 | 游戏中的对象（玩家、怪物等） | 实现特定功能的模块（移动、背包等） |
| 职责 | "是什么"，容器和协调者 | "能做什么"，功能实现者 |
| 关系 | 包含多个组件 | 始终附加到一个实体 |
| 生命周期 | 管理自身和所有组件的生命周期 | 专注于自身功能的生命周期 |

## BaseEntity（基础实体）

### 核心特性
- **唯一标识**：每个实体都有一个唯一的`uid`
- **组件容器**：通过`_componentMap`管理附加的组件
- **属性存储**：包含`_attr`字典存储通用属性

### 主要职责
1. **组件管理**：添加、注册和获取组件
2. **生命周期控制**：创建(`create`)、激活(`active`)、清理(`clear`)和释放(`release`)
3. **属性访问**：提供设置和获取属性的通用接口
4. **实体类型**：定义实体的类型（玩家、怪物等）

### 代码示例
```typescript
// 创建玩家实体
const player = new Player();
player.create({name: "勇者"});

// 添加组件
player.registerComponent([InventoryComponent, MovementComponent]);

// 获取组件
const inventory = player.getComponent(ComponentType.INVENTORY);

// 设置属性
await player.setAttr("gold", 100);
```

## BaseComponent（基础组件）

### 核心特性
- **所属实体**：通过`_owner`引用所属实体
- **单一职责**：专注于实现特定功能
- **类型标识**：每个组件都有一个类型标识

### 主要职责
1. **功能实现**：实现特定的游戏功能
2. **事件响应**：响应游戏事件和状态变化
3. **数据处理**：处理与特定功能相关的数据
4. **实体访问**：通过`getEntity()`访问所属实体

### 代码示例
```typescript
// 背包组件实现
export class InventoryComponent extends BaseComponent {
    // 返回组件类型
    public getType(): string {
        return ComponentType.INVENTORY;
    }
    
    // 添加物品功能
    public addItem(item: Item): boolean {
        // 实现添加物品逻辑
    }
    
    // 获取所属玩家
    private getPlayer(): Player {
        return this.getEntity<Player>();
    }
}
```

## 生命周期对比

| 生命周期 | BaseEntity | BaseComponent |
|---------|------------|---------------|
| 创建 | `create()` | `create(owner)` |
| 初始化 | - | `onCreate()` |
| 激活 | `active(data)` | `active(data)` |
| 激活完成 | - | `onActive()` |
| 清理 | `clear()` | `clear()` |
| 释放 | `release()` | `release()` |

## 数据流

1. **实体到组件**：
   - 实体通过`_componentMap`存储和管理组件
   - 组件通过`_owner`引用所属实体

2. **组件到组件**：
   - 组件可以通过所属实体获取其他组件
   - 组件之间通过事件系统进行通信，保持松耦合
   ```typescript
   // 组件A获取组件B
   const componentB = this.getEntity().getComponent(ComponentType.OTHER);
   
   // 组件A通过事件通知组件B
   EventMgr.Ins.emit('item_used', {itemId: 123});
   ```

## 设计原则与最佳实践

1. **单一职责**：
   - 实体应该专注于组件的组织和协调
   - 组件应该专注于单一功能的实现

2. **松耦合**：
   - 组件之间应该通过事件系统通信，避免直接依赖
   - 实体不应该直接实现游戏逻辑，而是通过组件

3. **组件复用**：
   - 设计通用组件，可以被多种实体使用
   - 避免在组件中硬编码对特定实体类型的依赖

4. **生命周期管理**：
   - 正确实现`release()`方法，清理资源和事件监听
   - 在销毁实体时确保释放所有组件

## 实际应用

1. **玩家系统**：
   - `Player`实体 + `InventoryComponent`(背包) + `SkillComponent`(技能) + `AttributeComponent`(属性)

2. **怪物系统**：
   - `Monster`实体 + `AIComponent`(AI) + `CombatComponent`(战斗) + `PatrolComponent`(巡逻)

3. **交互对象**：
   - `InteractiveObject`实体 + `TriggerComponent`(触发器) + `DialogueComponent`(对话)

## 注意事项

1. 组件不应该直接在构造函数中引用所属实体，应该在`create(owner)`方法中设置
2. 避免在实体中实现复杂的游戏逻辑，应该将其分解到组件中
3. 组件之间的通信优先使用事件系统，避免直接依赖
4. 正确管理资源的生命周期，特别是在释放组件和实体时 