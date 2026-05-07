# 游戏暂停系统使用指南

## 概述

游戏暂停系统是一个完整的游戏状态管理解决方案，提供了游戏暂停、恢复、重新开始等功能。系统采用事件驱动架构，支持多种游戏状态的管理。

## 核心组件

### 1. GameStateMgr (游戏状态管理器)

负责管理游戏的整体状态，包括：
- 游戏状态枚举 (GameState)
- 状态转换逻辑
- 事件发送机制

**主要功能：**
- `pauseGame()` - 暂停游戏
- `resumeGame()` - 恢复游戏
- `startGame()` - 开始游戏
- `restartGame()` - 重新开始游戏
- `endGame()` - 结束游戏
- `victory()` - 游戏胜利

### 2. GameController (游戏控制器)

负责处理游戏逻辑和输入控制：
- 键盘输入处理
- 游戏循环管理
- 游戏时间统计

**主要功能：**
- 自动处理ESC键暂停/恢复
- 自动处理R键重新开始
- 游戏时间统计
- 游戏逻辑更新

### 3. PausePanel (暂停面板)

提供暂停时的UI界面：
- 暂停界面显示/隐藏
- 按钮交互处理
- 动画效果支持

## 使用方法

### 1. 基本使用

```typescript
// 暂停游戏
GameStateMgr.Ins.pauseGame();

// 恢复游戏
GameStateMgr.Ins.resumeGame();

// 检查游戏状态
if (GameStateMgr.Ins.isGamePaused()) {
    console.log('游戏已暂停');
}

// 重新开始游戏
GameStateMgr.Ins.restartGame();
```

### 2. 在组件中使用

```typescript
import { GameStateMgr } from "./Manager/GameStateMgr";
import { EventMgr } from "./Manager/EventMgr";
import { FrameEvents } from "./FrameConfig/FrameEvents";

@ccclass('MyGameComponent')
export class MyGameComponent extends Component {
    
    onLoad() {
        // 监听游戏状态变化
        EventMgr.Ins.on(FrameEvents.GAME_PAUSED, this.onGamePaused, this);
        EventMgr.Ins.on(FrameEvents.GAME_RESUMED, this.onGameResumed, this);
    }
    
    onDestroy() {
        // 取消事件监听
        EventMgr.Ins.off(FrameEvents.GAME_PAUSED, this.onGamePaused, this);
        EventMgr.Ins.off(FrameEvents.GAME_RESUMED, this.onGameResumed, this);
    }
    
    private onGamePaused() {
        // 游戏暂停时的处理逻辑
        this.node.active = false; // 隐藏某些UI
    }
    
    private onGameResumed() {
        // 游戏恢复时的处理逻辑
        this.node.active = true; // 显示某些UI
    }
    
    update(deltaTime: number) {
        // 只在游戏进行中执行更新逻辑
        if (GameStateMgr.Ins.isGamePlaying()) {
            this.updateGameLogic(deltaTime);
        }
    }
}
```

### 3. 添加游戏控制器

在游戏场景中添加GameController组件：

```typescript
// 在场景根节点上添加GameController组件
const gameController = this.addComponent(GameController);
gameController.enableKeyboardControl = true;
gameController.pauseKey = KeyCode.ESCAPE;
gameController.restartKey = KeyCode.R;
```

### 4. 创建暂停面板

1. 创建暂停面板预制体
2. 添加PausePanel组件
3. 设置按钮和UI元素
4. 在场景中放置暂停面板

## 游戏状态

系统定义了以下游戏状态：

- `UNINITIALIZED` - 未初始化
- `LOADING` - 正在加载
- `PLAYING` - 游戏中
- `PAUSED` - 暂停中
- `GAME_OVER` - 游戏结束
- `VICTORY` - 胜利

## 事件系统

系统使用事件驱动架构，主要事件包括：

- `GAME_STARTED` - 游戏开始
- `GAME_PAUSED` - 游戏暂停
- `GAME_RESUMED` - 游戏恢复
- `GAME_ENDED` - 游戏结束
- `GAME_VICTORY` - 游戏胜利
- `GAME_RESTARTED` - 游戏重新开始
- `GAME_STATE_CHANGED` - 游戏状态改变

## 键盘控制

默认键盘控制：
- `ESC` - 暂停/恢复游戏
- `R` - 重新开始游戏

可以通过GameController组件自定义按键设置。

## 最佳实践

### 1. 状态检查

在更新逻辑中始终检查游戏状态：

```typescript
update(deltaTime: number) {
    if (GameStateMgr.Ins.isGamePlaying()) {
        // 只在游戏进行中执行更新逻辑
        this.updateGameLogic(deltaTime);
    }
}
```

### 2. 事件监听

使用事件系统而不是直接调用状态管理器：

```typescript
// 推荐：使用事件监听
EventMgr.Ins.on(FrameEvents.GAME_PAUSED, this.onGamePaused, this);

// 不推荐：直接检查状态
if (GameStateMgr.Ins.isGamePaused()) {
    // 处理暂停逻辑
}
```

### 3. 资源管理

确保在组件销毁时清理事件监听：

```typescript
onDestroy() {
    EventMgr.Ins.offTarget(this);
}
```

### 4. UI响应

让UI组件响应游戏状态变化：

```typescript
private onGameStateChanged(newState: GameState) {
    switch (newState) {
        case GameState.PAUSED:
            this.showPauseUI();
            break;
        case GameState.PLAYING:
            this.hidePauseUI();
            break;
    }
}
```

## 扩展功能

### 1. 自定义暂停逻辑

可以扩展GameStateMgr添加自定义暂停逻辑：

```typescript
public pauseGameWithReason(reason: string): void {
    this.pauseGame();
    EventMgr.Ins.emit('GAME_PAUSED_WITH_REASON', reason);
}
```

### 2. 暂停时间统计

可以添加暂停时间统计功能：

```typescript
private _pauseStartTime: number = 0;
private _totalPauseTime: number = 0;

public pauseGame(): void {
    this._pauseStartTime = Date.now();
    // ... 其他暂停逻辑
}

public resumeGame(): void {
    if (this._pauseStartTime > 0) {
        this._totalPauseTime += Date.now() - this._pauseStartTime;
        this._pauseStartTime = 0;
    }
    // ... 其他恢复逻辑
}
```

### 3. 多层级暂停

支持多层级暂停系统：

```typescript
private _pauseStack: GameState[] = [];

public pushPause(): void {
    this._pauseStack.push(this._currentState);
    this.pauseGame();
}

public popPause(): void {
    if (this._pauseStack.length > 0) {
        const previousState = this._pauseStack.pop();
        this.setState(previousState);
    }
}
```

## 注意事项

1. **性能考虑**：在update循环中频繁检查游戏状态可能影响性能，建议使用事件驱动方式。

2. **状态一致性**：确保所有组件都正确响应游戏状态变化，避免状态不一致。

3. **内存管理**：及时清理事件监听，避免内存泄漏。

4. **错误处理**：在状态转换时添加适当的错误检查和日志记录。

5. **测试覆盖**：为暂停系统编写完整的单元测试，确保各种状态转换的正确性。

## 示例项目

参考 `GamePauseExample.ts` 文件查看完整的使用示例，包括：
- 基本暂停/恢复功能
- UI响应
- 游戏逻辑更新
- 事件处理

这个系统为游戏提供了完整的暂停功能支持，可以根据具体项目需求进行扩展和定制。 