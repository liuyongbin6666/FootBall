# 游戏暂停系统

这是一个完整的游戏暂停/恢复系统，基于 Cocos Creator 3.8.5+ 开发，支持多种暂停类型和UI暂停管理。

## 核心组件

### 1. GameStateMgr - 游戏状态管理器
负责管理游戏的整体状态，包括暂停、开始、恢复等功能。

**主要功能：**
- 游戏状态管理（Playing, Paused, Loading, Game Over, Victory）
- 多种暂停类型支持（Scene, Global, Custom）
- UI暂停计数器管理（用于多层UI界面）
- 事件驱动的状态变化通知
- 状态检查和验证

**使用示例：**
```typescript
// 场景暂停（推荐用于游戏内暂停）
GameStateMgr.Ins.pauseScene();

// 全局暂停（推荐用于应用切换）
GameStateMgr.Ins.pauseGlobal();

// 恢复游戏
GameStateMgr.Ins.resumeGame();

// UI暂停管理（用于多层UI界面）
GameStateMgr.Ins.pauseUI();   // 打开UI时调用
GameStateMgr.Ins.resumeUI();  // 关闭UI时调用

// 检查游戏状态
if (GameStateMgr.Ins.isGamePlaying()) {
    // 游戏正在进行
}

// 检查UI暂停状态
if (GameStateMgr.Ins.isUIPaused()) {
    // 有UI界面打开
}
```

### 2. GameController - 游戏控制器
处理键盘输入和游戏逻辑控制。

**功能：**
- ESC键：暂停/恢复游戏
- R键：重新开始游戏
- 游戏时间统计

### 3. PausePanel - 暂停面板
游戏暂停时显示的UI面板。

**功能：**
- 自动显示/隐藏
- 恢复游戏按钮
- 重新开始按钮
- 退出游戏按钮

### 4. EventMgr - 事件管理器
处理系统内的事件通信。

## 暂停类型详解

### 1. Scene Pause（场景暂停）
- **API**: `director.pause()`
- **效果**: 暂停游戏逻辑，UI和音频继续
- **适用场景**: 游戏内暂停菜单
- **使用**: `GameStateMgr.Ins.pauseScene()`

### 2. Global Pause（全局暂停）
- **API**: `game.pause()`
- **效果**: 暂停所有内容，包括渲染和音频
- **适用场景**: 应用切换、系统级暂停
- **使用**: `GameStateMgr.Ins.pauseGlobal()`

### 3. Custom Pause（自定义暂停）
- **API**: 可扩展
- **效果**: 只暂停特定系统
- **适用场景**: 特殊需求
- **使用**: `GameStateMgr.Ins.pauseCustom()`

## UI暂停管理

### 问题背景
在游戏中，经常需要打开多层UI界面（如：设置界面 → 音效设置 → 音量调节），每层界面都需要暂停游戏，关闭时恢复。

### 解决方案
使用计数器管理UI暂停状态：

```typescript
// 打开UI界面时
GameStateMgr.Ins.pauseUI();  // 计数器 +1

// 关闭UI界面时  
GameStateMgr.Ins.resumeUI(); // 计数器 -1

// 当计数器归零时，游戏自动恢复
```

### 核心方法

```typescript
// UI暂停管理
GameStateMgr.Ins.pauseUI();           // 增加UI暂停计数
GameStateMgr.Ins.resumeUI();          // 减少UI暂停计数
GameStateMgr.Ins.getUIPauseCount();   // 获取当前UI暂停计数
GameStateMgr.Ins.isUIPaused();        // 检查是否处于UI暂停状态
GameStateMgr.Ins.resetUIPauseCount(); // 强制重置UI暂停计数（异常情况）
```

### 使用场景示例

```typescript
// 打开设置界面
onOpenSettings() {
    GameStateMgr.Ins.pauseUI();  // 计数器: 1
    this.settingsPanel.active = true;
}

// 打开音效设置
onOpenSoundSettings() {
    GameStateMgr.Ins.pauseUI();  // 计数器: 2
    this.soundPanel.active = true;
}

// 关闭音效设置
onCloseSoundSettings() {
    GameStateMgr.Ins.resumeUI(); // 计数器: 1
    this.soundPanel.active = false;
}

// 关闭设置界面
onCloseSettings() {
    GameStateMgr.Ins.resumeUI(); // 计数器: 0，游戏自动恢复
    this.settingsPanel.active = false;
}
```

## 事件系统

系统使用事件驱动架构，主要事件包括：

```typescript
// 游戏状态事件
'GAME_STARTED'      // 游戏开始
'GAME_PAUSED'       // 游戏暂停
'GAME_RESUMED'      // 游戏恢复
'GAME_ENDED'        // 游戏结束
'GAME_VICTORY'      // 游戏胜利
'GAME_RESTARTED'    // 游戏重新开始
'GAME_STATE_CHANGED' // 游戏状态改变

// 暂停类型事件
'GAME_SCENE_PAUSED'  // 场景暂停
'GAME_GLOBAL_PAUSED' // 全局暂停
'GAME_CUSTOM_PAUSED' // 自定义暂停
```

## 键盘控制

- **ESC**: 暂停/恢复游戏
- **R**: 重新开始游戏

## 示例组件

### 1. GamePauseExample
基础暂停功能演示，包含：
- 暂停/恢复按钮
- 游戏时间显示
- 玩家移动示例

### 2. PauseTypeExample
不同暂停类型演示，包含：
- 场景暂停、全局暂停、自定义暂停
- 暂停类型说明
- 玩家精灵颜色变化

### 3. TweenPauseTest
Tween动画暂停测试，包含：
- 位置、旋转、缩放动画
- 不同暂停类型对动画的影响
- 动画状态显示

### 4. UIPauseExample
UI暂停管理演示，包含：
- 多层UI界面管理
- UI暂停计数器显示
- 面板状态管理

## 最佳实践

### 1. 暂停类型选择
- **游戏内暂停菜单**: 使用 `pauseScene()`
- **应用切换**: 使用 `pauseGlobal()`
- **多层UI界面**: 使用 `pauseUI()` / `resumeUI()`

### 2. 状态检查
```typescript
// 在update中检查游戏状态
update(deltaTime: number) {
    if (GameStateMgr.Ins.isGamePlaying()) {
        // 只在游戏进行中执行逻辑
        this.updatePlayerMovement(deltaTime);
    }
}
```

### 3. 事件监听
```typescript
// 监听游戏状态变化
EventMgr.Ins.on('GAME_PAUSED', this.onGamePaused, this);
EventMgr.Ins.on('GAME_RESUMED', this.onGameResumed, this);
```

### 4. UI暂停管理
```typescript
// 在UI组件的onLoad中暂停
onLoad() {
    GameStateMgr.Ins.pauseUI();
}

// 在UI组件的onDestroy中恢复
onDestroy() {
    GameStateMgr.Ins.resumeUI();
}
```

## 扩展可能性

1. **自定义暂停类型**: 在 `pauseGameSystems()` 中添加新的暂停逻辑
2. **暂停动画**: 为暂停/恢复添加过渡动画
3. **暂停音效**: 在暂停时播放音效
4. **暂停截图**: 在暂停时保存游戏截图
5. **网络同步**: 在多人游戏中同步暂停状态

## 注意事项

1. **状态一致性**: 确保所有组件都正确检查游戏状态
2. **事件清理**: 在组件销毁时清理事件监听
3. **UI暂停计数**: 避免UI暂停计数出现负数
4. **异常处理**: 在异常情况下使用 `resetUIPauseCount()` 重置计数
5. **性能考虑**: 避免在暂停状态下执行不必要的逻辑

## 文件结构

```
assets/BHY_Framework/
├── Manager/
│   ├── GameStateMgr.ts          # 游戏状态管理器
│   ├── GameController.ts         # 游戏控制器
│   └── example/
│       ├── GamePauseExample.ts   # 基础暂停示例
│       ├── PauseTypeExample.ts   # 暂停类型示例
│       ├── TweenPauseTest.ts     # Tween暂停测试
│       └── UIPauseExample.ts     # UI暂停示例
├── UI/
│   └── PausePanel.ts            # 暂停面板
├── FrameConfig/
│   └── FrameEvents.ts           # 事件常量
└── Singleton/
    └── ClsSingleton.ts          # 单例基类
``` 