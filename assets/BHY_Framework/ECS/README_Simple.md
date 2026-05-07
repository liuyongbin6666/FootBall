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
    ├── testPlayer.ts   # 玩家实体示例
    ├── SimpleTypeExample.ts # 简单类型示例
    └── TestPlayerExample.ts # 测试玩家示例
```

## 基本概念

- **实体(Entity)**: 游戏中的对象，如玩家、怪物、NPC等。实体本身不包含游戏逻辑，而是由组件来扩展其功能。
- **组件(Component)**: 实现具体功能的模块，如移动、渲染、背包等功能。一个实体可以附加多个组件。
- **系统(System)**: 管理实体的创建、获取和销毁，是ECS框架的核心。

## 核心特性

### 1. 简单直观的类型系统

Entity和Component类型直接使用类名，无需额外配置：

```typescript
// Entity类
export class PlayerEntity extends BaseEntity {
    // 类型名称自动为 'PlayerEntity'
}

// Component类
export class MovementComponent extends BaseComponent {
    // 类型名称自动为 'MovementComponent'
}
```

### 2. 基础Entity类

```typescript
import { BaseEntity } from '../core/BaseEntity';

export class MyEntity extends BaseEntity {
    // 继承基础功能
    // 类型名称: 'MyEntity'
    
    public getEntityType(): string {
        return this.constructor.name; // 返回 'MyEntity'
    }
}
```

### 3. 基础Component类

```typescript
import { BaseComponent } from '../core/BaseComponent';

export class MyComponent extends BaseComponent {
    // 继承基础功能
    // 类型名称: 'MyComponent'
    
    public getType(): string {
        return this.constructor.name; // 返回 'MyComponent'
    }
}
```

## 使用示例

### 基础使用

```typescript
// 1. 定义Entity类
export class PlayerEntity extends BaseEntity {
    private playerName: string = '';
    
    public setPlayerName(name: string): void {
        this.playerName = name;
    }
    
    public getPlayerName(): string {
        return this.playerName;
    }
}

// 2. 定义Component类
export class MovementComponent extends BaseComponent {
    private speed: number = 5;
    
    public setSpeed(speed: number): void {
        this.speed = speed;
    }
    
    public getSpeed(): number {
        return this.speed;
    }
}

// 3. 使用
const player = new PlayerEntity();
const movement = new MovementComponent();

player.setPlayerName('Hero');
movement.setSpeed(10);

player.addComponent(movement);

console.log('Player type:', player.getEntityType()); // 'PlayerEntity'
console.log('Movement type:', movement.getType()); // 'MovementComponent'
```

### 实际游戏场景

```typescript
// 游戏中的Entity和Component定义
export class EnemyEntity extends BaseEntity {
    private enemyLevel: number = 1;
    
    public setLevel(level: number): void {
        this.enemyLevel = level;
    }
    
    public getLevel(): number {
        return this.enemyLevel;
    }
}

export class CombatComponent extends BaseComponent {
    private attackPower: number = 10;
    private defensePower: number = 5;
    
    public attack(target: EnemyEntity): number {
        const targetCombat = target.getComponent<CombatComponent>('CombatComponent');
        if (targetCombat) {
            return Math.max(0, this.attackPower - targetCombat.defensePower);
        }
        return this.attackPower;
    }
}

// 在游戏中使用
export class GameManager {
    public static createEnemy(): void {
        const enemy = new EnemyEntity();
        const combat = new CombatComponent();
        
        enemy.addComponent(combat);
        enemy.setLevel(5);
        
        console.log('Enemy created with type:', enemy.getEntityType());
        console.log('Combat component type:', combat.getType());
    }
}
```

## 最佳实践

### 1. 命名规范

- Entity类名以 `Entity` 结尾
- Component类名以 `Component` 结尾
- 使用描述性的类名

### 2. 类型管理

- 直接使用类名作为类型标识
- 无需额外的类型注册或装饰器
- 保持代码简洁易懂

### 3. 性能优化

- 使用对象池复用Entity和Component
- 避免频繁创建和销毁对象
- 合理使用组件组合

## 注意事项

1. **类型名称唯一性**: 确保Entity和Component的类型名称在各自范围内唯一
2. **命名规范**: 使用清晰的类名，便于理解和维护
3. **向后兼容**: 保持与现有代码的兼容性

## 优势

1. **简单直观**: 直接使用类名，无需额外配置
2. **易于理解**: 代码结构清晰，学习成本低
3. **类型安全**: 充分利用TypeScript类型系统
4. **高性能**: 轻量级设计，适合中小型项目
5. **Cocos集成**: 无缝对接Cocos Creator

这个简化的ECS框架专注于核心功能，提供了简单易用的Entity-Component-System实现，特别适合快速开发和原型设计。 