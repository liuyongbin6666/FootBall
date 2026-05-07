# BHYFramework 游戏框架

基于Cocos Creator 3.8.5+的完整游戏开发框架，提供模块化的架构设计和丰富的功能组件。

## 🏗️ 框架架构

```
BHYFramework/
├── BHYFrame.ts              # 框架主入口
├── Manager/                  # 管理器模块
│   ├── AudioMgr.ts          # 音频管理器
│   ├── EventMgr.ts          # 事件管理器
│   ├── GameStateMgr.ts      # 游戏状态管理器
│   ├── LogMgr.ts            # 日志管理器
│   ├── PoolMgr.ts           # 对象池管理器
│   ├── ResMgr.ts            # 资源管理器
│   ├── SceneMgr.ts          # 场景管理器
│   └── StorageMgr.ts        # 存储管理器
├── UI/                      # UI系统
│   ├── UIMgr.ts             # UI管理器
│   ├── UIPanelBase.ts       # UI面板基类
│   ├── UIPanelPool.ts       # UI面板池
│   └── UIAnimationUtils.ts  # UI动画工具
├── ECS/                     # 实体组件系统
│   ├── core/                # 核心实现
│   ├── interfaces/          # 接口定义
│   ├── systems/             # 系统实现
│   └── examples/            # 使用示例
├── Fsm/                     # 状态机系统
│   ├── Fsm.ts               # 状态机基类
│   ├── FsmState.ts          # 状态基类
│   └── example/             # 使用示例
├── Singleton/               # 单例模式
│   ├── ClsSingleton.ts      # 类单例
│   └── CmpSingletion.ts     # 组件单例
├── Log/                     # 日志系统
│   └── Logger.ts            # 日志工具
├── Utils/                   # 工具类
│   └── NodeUtils.ts         # 节点工具
├── HOT/                     # 热更新
│   └── HotUpdate.ts         # 热更新管理器
└── FrameConfig/             # 框架配置
    ├── FrameData.ts          # 框架数据
    └── FrameEvents.ts        # 框架事件
```

## 🚀 快速开始

### 1. 基础初始化

```typescript
import { BHYFramework } from './BHY_Framework/BHYFrame';

// 获取框架实例
const framework = BHYFramework.Ins;

// 基础初始化
await framework.init();

console.log('框架版本:', framework.getVersion());
console.log('初始化状态:', framework.isInitialized());
```

### 2. 高级初始化

```typescript
import { BHYFramework, FrameworkInitOptions } from './BHY_Framework/BHYFrame';

const options: FrameworkInitOptions = {
    debug: true,
    hotUpdate: false,
    enableUI: true,
    enableAudio: true,
    enablePool: true,
    customConfig: {
        logLevel: 'INFO',
        enablePerformanceLog: true
    }
};

await framework.init(options);
```

### 3. 使用管理器

```typescript
// 获取所有管理器
const managers = framework.getManagers();

// 使用日志管理器
managers.logMgr.info('游戏启动');

// 使用事件管理器
managers.eventMgr.on('game_start', this.onGameStart, this);

// 使用存储管理器
managers.storageMgr.saveAll();

// 使用UI管理器
managers.uiMgr.showPanel('MainMenu');

// 使用音频管理器
managers.audioMgr.playBGM('main_bgm');

// 使用对象池管理器
const bullet = managers.poolMgr.spawn('Bullet');
```

## 📦 核心模块

### 1. 管理器模块 (Manager)

#### AudioMgr - 音频管理器
- 背景音乐管理
- 音效播放控制
- 音量设置
- 音频资源管理

#### EventMgr - 事件管理器
- 全局事件系统
- 事件订阅和发布
- 事件优先级
- 事件队列管理

#### GameStateMgr - 游戏状态管理器
- 游戏状态切换
- 状态持久化
- 状态回滚
- 状态同步

#### LogMgr - 日志管理器
- 分级日志输出
- 日志历史记录
- 性能监控
- 调试信息管理

#### PoolMgr - 对象池管理器
- 对象复用
- 内存优化
- 池化策略
- 自动回收

#### ResMgr - 资源管理器
- 资源加载
- 资源缓存
- 内存管理
- 预加载策略

#### SceneMgr - 场景管理器
- 场景切换
- 场景预加载
- 场景状态管理
- 场景数据持久化

#### StorageMgr - 存储管理器
- 数据持久化
- 自动保存
- 数据加密
- 跨平台存储

### 2. UI系统 (UI)

#### UIMgr - UI管理器
- UI面板管理
- UI层级控制
- UI动画系统
- UI事件处理

#### UIPanelBase - UI面板基类
- 面板生命周期
- 面板状态管理
- 面板动画
- 面板数据绑定

### 3. ECS系统 (ECS)

#### 实体组件系统
- Entity - 实体基类
- Component - 组件基类
- System - 系统基类
- 类型自动识别

#### 使用示例
```typescript
// 定义Entity
export class PlayerEntity extends BaseEntity {
    // 实体逻辑
}

// 定义Component
export class MovementComponent extends BaseComponent {
    // 移动逻辑
}

// 使用
const player = new PlayerEntity();
const movement = new MovementComponent();
player.addComponent(movement);
```

### 4. 状态机系统 (Fsm)

#### Fsm - 状态机
- 状态切换
- 状态条件
- 状态动作
- 状态历史

#### 使用示例
```typescript
// 定义状态
export class IdleState extends FsmState {
    onEnter() { /* 进入空闲状态 */ }
    onUpdate() { /* 更新逻辑 */ }
    onExit() { /* 退出状态 */ }
}

// 使用状态机
const fsm = new Fsm();
fsm.addState('idle', new IdleState());
fsm.changeState('idle');
```

### 5. 单例模式 (Singleton)

#### ClsSingleton - 类单例
- 线程安全
- 延迟初始化
- 资源管理

#### CmpSingletion - 组件单例
- Cocos组件单例
- 生命周期管理
- 自动销毁

## 🔧 配置选项

### FrameworkInitOptions

```typescript
interface FrameworkInitOptions {
    /** 是否启用调试模式 */
    debug?: boolean;
    /** 是否启用热更新 */
    hotUpdate?: boolean;
    /** 是否启用UI系统 */
    enableUI?: boolean;
    /** 是否启用音频系统 */
    enableAudio?: boolean;
    /** 是否启用对象池 */
    enablePool?: boolean;
    /** 自定义配置 */
    customConfig?: any;
}
```

## 📋 最佳实践

### 1. 初始化顺序
1. 日志管理器 (LogMgr)
2. 存储管理器 (StorageMgr)
3. 事件管理器 (EventMgr)
4. 资源管理器 (ResMgr)
5. 音频管理器 (AudioMgr)
6. 对象池管理器 (PoolMgr)
7. 游戏状态管理器 (GameStateMgr)
8. UI管理器 (UIMgr)
9. 场景管理器 (SceneMgr)

### 2. 资源管理
- 使用对象池复用对象
- 及时释放不需要的资源
- 合理使用预加载
- 监控内存使用

### 3. 事件系统
- 使用事件解耦模块
- 及时移除事件监听
- 避免事件循环
- 使用事件优先级

### 4. 数据持久化
- 使用装饰器自动注册
- 设置合理的保存频率
- 数据加密保护
- 跨平台兼容

## 🛠️ 开发工具

### FrameworkExample
完整的使用示例，包含：
- 基础初始化
- 高级配置
- 功能测试
- 资源释放

### FrameworkUtils
框架工具类，提供：
- 快速初始化
- 状态检查
- 管理器访问
- 调试工具

## 📊 性能优化

### 1. 内存管理
- 对象池复用
- 及时释放资源
- 避免内存泄漏
- 监控内存使用

### 2. 渲染优化
- 合理使用UI层级
- 减少DrawCall
- 使用图集
- 优化动画

### 3. 加载优化
- 资源预加载
- 异步加载
- 加载进度显示
- 加载失败处理

## 🔍 调试支持

### 1. 日志系统
- 分级日志输出
- 日志历史记录
- 性能监控
- 错误追踪

### 2. 调试工具
- 框架状态检查
- 管理器状态监控
- 性能分析
- 内存监控

## 📈 版本历史

### v2.1.0 (当前版本)
- 完善框架架构
- 优化初始化流程
- 增强错误处理
- 改进文档

### v1.2.0
- 基础框架实现
- 核心管理器
- ECS系统
- UI系统

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

## 📄 许可证

MIT License

## 📞 联系方式

- 项目地址: [GitHub Repository]
- 问题反馈: [Issues]
- 文档地址: [Documentation]

---

**BHYFramework** - 让游戏开发更简单、更高效！ 