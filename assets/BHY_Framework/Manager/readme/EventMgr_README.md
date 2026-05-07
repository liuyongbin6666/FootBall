# 事件管理器 (EventMgr) 使用指南

## 概述

EventMgr 是一个高性能的事件发布订阅系统，专门为 Cocos Creator 游戏开发设计。它提供了类型安全的事件管理功能，支持事件的发布、订阅和取消订阅。

## 主要特性

- ✅ **发布订阅模式** - 支持事件的发布和订阅
- ✅ **类型安全** - 完整的 TypeScript 类型支持
- ✅ **自动清理** - 支持按目标清理事件监听
- ✅ **统计信息** - 提供事件监听器统计
- ✅ **错误处理** - 完善的错误处理机制

## 快速开始

### 1. 订阅事件

```typescript
// 订阅事件
EventMgr.Ins.on('playerMove', this.onPlayerMove, this);
EventMgr.Ins.on('enemyDeath', this.onEnemyDeath, this);
EventMgr.Ins.on('gameOver', this.onGameOver, this);
```

### 2. 发布事件

```typescript
// 发布事件
EventMgr.Ins.emit('playerMove', { x: 100, y: 200 });
EventMgr.Ins.emit('enemyDeath', { enemyId: 123, score: 100 });
EventMgr.Ins.emit('gameOver', { finalScore: 5000 });
```

### 3. 取消订阅

```typescript
// 取消特定事件的监听
EventMgr.Ins.off('playerMove', this.onPlayerMove, this);

// 取消目标的所有事件监听
EventMgr.Ins.offTarget(this);
```

## API 参考

### 核心方法

```typescript
// 订阅事件
on(eventName: string, callback: Function, target?: any): void

// 发布事件
emit(eventName: string, ...args: any[]): void

// 取消订阅
off(eventName: string, callback?: Function, target?: any): void

// 取消目标的所有事件监听
offTarget(target: any): void

// 清空所有事件监听
clear(): void
```

### 查询方法

```typescript
// 获取事件监听器数量
getListenerCount(eventName: string): number

// 获取所有事件名称
getEventNames(): string[]

// 检查是否有监听器
hasListeners(eventName: string): boolean
```

## 使用场景

### 1. 游戏状态管理

```typescript
// 订阅游戏状态变化
EventMgr.Ins.on('gameStateChanged', this.onGameStateChanged, this);

// 发布状态变化
EventMgr.Ins.emit('gameStateChanged', { 
    from: 'playing', 
    to: 'paused' 
});
```

### 2. 玩家操作

```typescript
// 订阅玩家操作
EventMgr.Ins.on('playerAction', this.onPlayerAction, this);

// 发布玩家操作
EventMgr.Ins.emit('playerAction', {
    type: 'attack',
    target: enemy,
    damage: 50
});
```

### 3. UI 交互

```typescript
// 订阅UI事件
EventMgr.Ins.on('buttonClick', this.onButtonClick, this);

// 发布UI事件
EventMgr.Ins.emit('buttonClick', {
    buttonId: 'startGame',
    data: { level: 1 }
});
```

## 最佳实践

### 1. 事件命名规范

```typescript
// 使用驼峰命名法
'playerMove'      // 玩家移动
'enemyDeath'      // 敌人死亡
'gameStateChanged' // 游戏状态变化
'uiButtonClick'   // UI按钮点击
```

### 2. 事件数据结构

```typescript
// 使用对象传递数据
EventMgr.Ins.emit('playerMove', {
    position: { x: 100, y: 200 },
    direction: 'right',
    speed: 5
});
```

### 3. 生命周期管理

```typescript
class GameComponent extends Component {
    onLoad() {
        // 订阅事件
        EventMgr.Ins.on('gameEvent', this.onGameEvent, this);
    }
    
    onDestroy() {
        // 取消订阅，防止内存泄漏
        EventMgr.Ins.offTarget(this);
    }
}
```

### 4. 错误处理

```typescript
// 在回调函数中添加错误处理
onPlayerMove(data: any) {
    try {
        // 处理事件逻辑
        this.handlePlayerMove(data);
    } catch (error) {
        console.error('处理玩家移动事件失败:', error);
    }
}
```

## 注意事项

1. **及时取消订阅**: 在组件销毁时取消订阅，避免内存泄漏
2. **事件命名**: 使用清晰、一致的事件命名规范
3. **数据结构**: 使用对象传递复杂数据，避免参数过多
4. **错误处理**: 在事件回调中添加适当的错误处理
5. **性能考虑**: 避免在频繁触发的事件中执行复杂操作

## 故障排除

### 常见问题

1. **事件没有触发**
   - 检查事件名称是否正确
   - 检查订阅和发布的时机
   - 检查回调函数是否正确

2. **内存泄漏**
   - 确保在组件销毁时取消订阅
   - 使用 `offTarget()` 清理目标的所有事件

3. **性能问题**
   - 避免在频繁事件中执行复杂操作
   - 考虑使用事件节流或防抖

### 调试技巧

```typescript
// 检查事件监听器数量
const count = EventMgr.Ins.getListenerCount('playerMove');
console.log(`playerMove 事件有 ${count} 个监听器`);

// 获取所有事件名称
const events = EventMgr.Ins.getEventNames();
console.log('所有事件:', events);

// 检查是否有监听器
const hasListeners = EventMgr.Ins.hasListeners('playerMove');
console.log('playerMove 是否有监听器:', hasListeners);
```

## 更新日志

### v1.0.0
- 初始版本
- 支持事件发布订阅
- 支持按目标清理事件
- 支持事件统计信息
- 支持错误处理

## 许可证

MIT License 