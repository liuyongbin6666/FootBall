# KungFuSoccer（功夫足球）游戏项目 Code Wiki

## 📋 项目概述

**项目名称**: KungFuSoccer（功夫足球）  
**项目类型**: 弹幕足球休闲游戏  
**游戏引擎**: Cocos Creator 3.8.7  
**开发语言**: TypeScript  
**核心玩法**: 玩家操控英雄站立不动，足球在英雄和敌人之间自动弹射，通过足球撞击消灭敌人获得经验和金币，升级后可选择英雄属性提升卡片增强战斗力。

---

## 🏗️ 项目架构

```
KungFuSoccer/
├── .creator/                      # Cocos Creator 项目配置
├── assets/                        # 游戏资源目录
│   ├── BHY_Framework/           # BHY游戏框架（核心架构）
│   │   ├── Manager/              # 管理器模块
│   │   ├── UI/                  # UI系统
│   │   ├── ECS/                 # 实体组件系统
│   │   ├── Sdk/                 # SDK集成
│   │   ├── Singleton/           # 单例模式
│   │   ├── Log/                 # 日志系统
│   │   ├── Crypto/              # 加密工具
│   │   ├── JsonBase/            # 数据基类
│   │   ├── JSZIP/               # 压缩工具
│   │   └── FrameConfig/         # 框架配置
│   ├── resources/               # 静态资源
│   │   ├── audio/              # 音频文件
│   │   ├── img/                # 图片资源
│   │   ├── prefab/             # 预制体
│   │   ├── spine/              # 骨骼动画
│   │   └── json/               # 配置数据表
│   ├── script/                 # 游戏业务逻辑
│   │   ├── collision/          # 碰撞系统
│   │   ├── data/              # 全局数据
│   │   ├── loading/            # 加载界面
│   │   ├── manager/            # 业务管理器
│   │   ├── pop/               # 弹窗
│   │   ├── ske/               # 骨骼动画
│   │   ├── sound/             # 音频管理
│   │   ├── tool/              # 工具类
│   │   └── view/              # 界面视图
│   └── sence/                 # 场景文件
└── settings/                  # Cocos Creator 设置
```

---

## 🎮 技术栈

### 核心技术

- **游戏引擎**: Cocos Creator 3.8.7
- **编程语言**: TypeScript
- **构建工具**: npm
- **版本控制**: Git

### 框架依赖

- **BHY_Framework**: 自研游戏框架，提供完整的游戏开发组件
  - 事件管理系统 (EventMgr)
  - 资源管理系统 (ResMgr)
  - 对象池管理系统 (PoolMgr)
  - UI管理系统 (UIMgr)
  - 日志系统 (LogMgr)
  - 音频管理系统 (AudioMgr)

---

## 📦 核心模块详解

### 1. 游戏业务脚本 (script/)

#### 1.1 视图层 (view/)

##### FightView.ts - 战斗界面核心类

**文件路径**: `assets/script/view/FightView.ts`

**功能描述**: 
- 管理战斗场景中的所有游戏对象
- 处理足球、敌人、英雄的创建和销毁
- 实现足球物理运动和碰撞检测
- 管理游戏状态（等待、开始、停止、结算、结束）

**核心属性**:
```typescript
- heroArr: heroStructure[]          // 英雄数组
- enemyArr: enemyStructure[]        // 敌人数组
- soccerArr: soccerStructure[]      // 足球数组
- bulletArr: bulletStructure[]      // 子弹数组
- soccerGameState: gameState        // 游戏状态枚举
- playerLevel: number               // 玩家等级
- wave: number                      // 当前波数
- HP: number                        // 当前血量
- EXP: number                       // 当前经验
```

**核心方法**:
| 方法名 | 参数 | 返回值 | 功能描述 |
|--------|------|--------|----------|
| createHeroOrTemp | hid:number, hIndex:number | void | 创建英雄或空位 |
| createEnemy | eid:number | void | 根据ID创建敌人 |
| createSoccer | - | void | 创建足球 |
| soccerGame | - | void | 核心游戏循环（定时器调用） |
| fightControllerFun | controllerEvent:GameEventName | void | 战斗碰撞事件处理 |
| freshHP | - | void | 刷新血量显示 |
| freshEXP | - | void | 刷新经验显示 |
| readNextWave | - | void | 读取下一波数据 |

**游戏状态枚举**:
```typescript
enum gameState {
    wait,    // 等待
    start,   // 开始
    stop,    // 暂停
    result,  // 结算
    over     // 结束
}
```

---

##### HallView.ts - 大厅界面

**文件路径**: `assets/script/view/HallView.ts`

**功能描述**: 
- 游戏主界面入口
- 提供进入战斗的入口
- 管理大厅背景音乐

**核心方法**:
| 方法名 | 参数 | 返回值 | 功能描述 |
|--------|------|--------|----------|
| openFight | - | void | 打开战斗界面 |

---

##### AmplificationCardView.ts - 酒馆抽卡界面

**文件路径**: `assets/script/view/AmplificationCardView.ts`

**功能描述**: 
- 升级后弹出英雄属性选择界面
- 实现卡牌抽奖逻辑
- 根据概率生成不同品质的卡牌
- 管理英雄属性提升

**核心属性**:
```typescript
- cardjoinHeroArr: number[]                      // 已上阵英雄ID数组
- cardProHeroArr: cardAddProStructure[]         // 已生成提升的属性数组
- saveAmpCardPro: ampCardProTableStructure       // 当前抽卡概率
- produceCardArr: cardAddProStructure[]         // 临时存储的卡牌数据
```

**核心方法**:
| 方法名 | 参数 | 返回值 | 功能描述 |
|--------|------|--------|----------|
| drawHeroCard | cardNode:Node, cardIndex:number | void | 绘制英雄卡牌 |
| freshThreeCard | - | void | 刷新三张卡牌 |
| selectHeroCard | e:any | void | 选择卡牌处理 |
| cardQuality | heroQuality:number, cardQualityNode:Node | void | 设置卡牌背景品质颜色 |
| findAllLevelHero | heroQua:number | heroStructure[] | 查找指定品质的所有英雄 |

**卡牌品质颜色**:
| 品质等级 | 数值 | 颜色 |
|----------|------|------|
| 白色 | 1 | img_whiteCard |
| 绿色 | 2 | img_greenCard |
| 蓝色 | 3 | img_blueCard |
| 紫色 | 4 | img_purpleCard |
| 红色 | 5 | img_redCard |
| 黄色 | 6 | img_yellowCard |

---

#### 1.2 数据层 (data/)

##### GlobalData.ts - 全局数据管理

**文件路径**: `assets/script/data/GlobalData.ts`

**功能描述**: 
- 单例模式的全局数据管理器
- 存储和管理游戏运行时所有数据
- 提供JSON配置表数据访问接口

**核心属性**:
```typescript
- chapterTableArr: chapterStructure[]      // 章节表
- levelTableArr: levelStructure[]         // 关卡表
- waveTableArr: waveStructure[]           // 波数表
- heroTableArr: heroStructure[]           // 英雄表
- enemyTableArr: enemyStructure[]         // 敌人表
- heroSkillTableArr: heroSkillStructure[] // 英雄技能表
- heroProGrowUpTableArr: heroPropertyTableStructure[] // 英雄属性增幅表
- ampCardProTableArr: ampCardProTableStructure[]       // 抽卡概率表
- propArr: propStructure[]               // 道具表
- unlockHeroArr: heroStructure[]        // 已解锁英雄表
- joinHeroArr: heroStructure[]          // 上阵英雄表
- gameRecord: gameRecordStructure       // 游戏记录
- userInfo: userStructure                // 用户信息
- musicState: boolean                    // 音乐状态
- soundState: boolean                    // 音效状态
```

**单例访问方式**:
```typescript
GlobalData.Instance.chapterTableArr
GlobalData.Instance.heroTableArr
```

---

##### GlobalStructure.ts - 数据结构定义

**文件路径**: `assets/script/data/GlobalStructure.ts`

**功能描述**: 
- 定义游戏中所有使用的数据结构接口
- 提供TypeScript类型检查支持

**核心接口**:

###### heroStructure - 英雄数据结构
```typescript
interface heroStructure {
    heroID: number;              // 英雄ID
    heroHeadImgPath: string;     // 英雄头像路径
    heroImgPath: string;          // 英雄图片路径
    heroName: string;            // 英雄名称
    heroIntroduce: string;       // 英雄介绍
    heroType: number;            // 英雄类型 (0=空位)
    restrainType: number;       // 属性克制
    speed: number;               // 速度
    harm: number;                // 初始伤害
    skillArr: Array<number>;     // 技能ID数组
    heroItem: Node;             // 英雄节点（动态）
    heroIndex: number;           // 站位下标
    HP: number;                  // 当前血量
    catchSoccerID: number;      // 接球状态 (0=闲置)
    unlock: boolean;            // 是否解锁
    join: boolean;               // 是否上阵
    harmLevel: number;           // 伤害等级
    criticalLevel: number;       // 暴击等级
    breakOutLevel: number;       // 会心等级
    HPLevel: number;             // 血量等级
    criticalChance: number;      // 暴击率
    breakOutHarmChance: number;  // 会心率
    maxHP: number;               // 最大血量
    quality: number;             // 品质
    skillProArr: Array<relevanceProStructure>; // 技能成长
}
```

###### enemyStructure - 敌人数据结构
```typescript
interface enemyStructure {
    enemyID: number;             // 敌人ID
    enemyHeadImgPath: string;    // 敌人头像路径
    enemyName: string;           // 敌人名称
    enemyType: number;           // 敌人类型
    enemyOccupation: number;     // 敌人职业
    maxHP: number;               // 最大血量
    moveSpeed: number;           // 移动速度
    attackSpeed: number;         // 攻击速度
    attackDistance: number;      // 攻击距离
    harm: number;                // 伤害
    EXP: number;                 // 经验掉落
    gold: number;                // 金币掉落
    prop: number;                // 道具掉落
    skillProbability: number;    // 技能发动概率
    speak: string;               // 冒泡对话
    enemyItem: Node;             // 敌人节点（动态）
    HP: number;                  // 当前血量
    attackSpeedTime: number;     // 攻击计时
}
```

###### soccerStructure - 足球数据结构
```typescript
interface soccerStructure {
    soccerID: number;            // 足球ID
    soccerImgPath: string;       // 足球图片路径
    soccerType: number;          // 足球类型
    soccerItem: Node;            // 足球节点
    soccerState: number;         // 足球状态
    speed: number;               // 速度
    relevanceHeroID: number;     // 赋予球属性的英雄ID
    goalEnemySerialNum: number;  // 目标敌人编号
    goalHeroID: number;          // 回球目标英雄ID
    goalWallX: number;          // 回球点X
    speedWallX: number;          // X方向速度
    moveTotal: number;           // 移动次数累计
}
```

**足球状态说明**:
| 状态值 | 状态名 | 描述 |
|--------|--------|------|
| 0 | 等待发球 | 等待英雄发球 |
| 1 | 发球 | 向目标敌人运动 |
| 2 | 回球 | 向目标英雄运动 |
| 3 | 发球漏球 | 目标敌人死亡，保持轨迹 |
| 4 | 发球碰墙 | 改变轨迹向英雄折返 |
| 5 | 回球漏球 | 目标英雄空位，保持轨迹 |
| 6 | 回球碰墙 | 随机X点返回 |

###### waveStructure - 波数数据结构
```typescript
interface waveStructure {
    waveID: number;                              // 波数ID
    enemyAriseArr: Array<relevanceProStructure>; // 小怪池
    total: number;                               // 小怪上限个数
    intervalTime: number;                        // 小怪间隔时间(秒)
    BossID: number;                              // BossID (0=无Boss)
    BossBornTime: number;                        // Boss出现时间
}
```

---

#### 1.3 事件系统 (manager/)

##### GameCustomEvent.ts - 自定义事件管理

**文件路径**: `assets/script/manager/GameCustomEvent.ts`

**功能描述**: 
- 全局自定义事件系统
- 提供事件的添加、移除、触发功能
- 同一事件在同一节点上发送和监听

**核心方法**:
| 方法名 | 参数 | 返回值 | 功能描述 |
|--------|------|--------|----------|
| addCustomEvent | eventName:string, callback:Function, target:any | void | 添加单个事件监听 |
| addMoreCustomEvent | eventName:string, callback:Function, target:any | void | 添加多个事件监听 |
| removeCustomEvent | eventName:string | void | 移除单个事件监听 |
| removeMoreCustomEvent | eventName:string, eventIndexID:string | void | 移除多个事件监听 |

**使用示例**:
```typescript
// 添加监听
GameCustomEvent.Instance.addCustomEvent(GameEventName.FIGHT_COLLISION_EVENT, this.handler, this);

// 触发事件
GameCustomEvent.Instance.node.emit(GameEventName.FIGHT_COLLISION_EVENT, eventData);

// 移除监听
GameCustomEvent.Instance.removeCustomEvent(GameEventName.FIGHT_COLLISION_EVENT);
```

---

##### GameEventName.ts - 事件名称常量

**文件路径**: `assets/script/manager/GameEventName.ts`

**功能描述**: 
- 定义游戏中所有使用的事件名称常量
- 提供事件携带的数据结构

**事件列表**:
```typescript
static FIGHT_COLLISION_EVENT = "fight_collision_event"        // 战斗碰撞事件
static FIGHT_OTHER_VIEW_EVENT = "fight_other_view_event"      // 战斗其他界面事件
static AMPLIFICATION_CARD_FRESH_EVENT = "amplification_card_fresh_event" // 刷新酒馆卡牌
static CHAPTER_RESULT_CLOSE_EVENT = "chapter_result_close_event" // 结算关闭
static HERO_SKE_EVENT = "hero_ske_event"                      // 英雄骨骼动画
static TIPS_EVENT = "tips_event"                              // 弹窗事件
static TIPS_STRIP_EVENT = "tips_strip_event"                  // 提示事件
static GUIDANCE_NEW_HAND_OPEN_EVENT = "guidance_new_hand_open_event" // 新手引导开启
static GUIDANCE_NEW_HAND_CLOSE_EVENT = "guidance_new_hand_close_event" // 新手引导关闭
```

---

##### Layer.ts - 层级管理器

**文件路径**: `assets/script/manager/Layer.ts`

**功能描述**: 
- 管理UI层级和界面加载
- 提供界面的显示、隐藏、删除功能
- 统一管理预制体路径映射

**核心属性**:
```typescript
layerView: Node              // 界面层
layerGuidance: Node          // 引导层
layerPop: Node               // 弹窗层
layerTips: Node              // 提示层
layerTransition: Node        // 过渡层
preNodeArr: preStructure[]   // 已加载界面数组
preItemArr: preItemStructure[] // 已加载组件数组
```

**核心方法**:
| 方法名 | 参数 | 返回值 | 功能描述 |
|--------|------|--------|----------|
| show | preName:string, showLayer:Node | void | 显示界面 |
| close | preName:string, closeLayer:Node | void | 关闭界面 |
| delete | preName:string, deleteLayer:Node | void | 删除界面（释放内存） |
| get | preName:string, showLayer:Node | Node | 获取界面节点 |
| getGamePrePath | preName:string | string | 获取预制体路径 |

**预制体路径映射**:
| 界面名称 | 路径 |
|----------|------|
| loading | prefab/view/loading |
| tips | prefab/pop/tips |
| tipsStrip | prefab/pop/tipsStrip |
| hall | prefab/view/hall |
| set | prefab/view/set |
| fight | prefab/view/fight/fight |
| fightMoveHero | prefab/view/fight/fightMoveHero |
| battleHeroState | prefab/view/battleHeroState/battleHeroState |
| amplificationCard | prefab/view/amplificationCard |

---

#### 1.4 音频系统 (sound/)

##### AudioMG.ts - 音频管理器

**文件路径**: `assets/script/sound/AudioMG.ts`

**功能描述**: 
- 管理背景音乐和音效播放
- 提供音量控制功能
- 支持多个音效同时播放

**核心属性**:
```typescript
main_audio: AudioSource       // 背景音乐
sound_once: AudioSource       // 单个音效
sound_more: AudioSource[]     // 多个音效
clipArr: clipNameStructure[]  // 已加载音效缓存
```

**核心方法**:
| 方法名 | 参数 | 返回值 | 功能描述 |
|--------|------|--------|----------|
| playMusicAudio | audioPath:string | void | 播放背景音乐 |
| playSoundAudio | audioPath:string, name:string | void | 播放单个音效 |
| playMoreSoundAudio | soundMoreArr:soundStructure[] | void | 播放多个音效 |
| setMusicVolume | value:number | void | 设置音乐音量 |
| setSoundVolume | value:number | void | 设置音效音量 |
| pauseSound_once | - | void | 暂停音效 |

**使用示例**:
```typescript
AudioMG.Instance.playMusicAudio("audio/hall_bgyy");
AudioMG.Instance.playSoundAudio("audio/soccer_kick", "soccer_kick");
```

---

#### 1.5 工具类 (tool/)

##### OperationTool.ts - 操作工具类

**功能**: 
- 提供通用操作方法
- 计算足球运动角度
- 处理小数精度

**核心方法**:
```typescript
calculateAngle(x1:number, y1:number, x2:number, y2:number): number  // 计算角度
retainDecimal(decimal:number, value:number): number                 // 保留小数
```

---

##### LoadImgTool.ts - 图片加载工具

**功能**: 
- 异步加载图片资源
- 缓存已加载的图片

---

##### CharacterTool.ts - 字符处理工具

**功能**: 
- 字符串替换
- 字符格式化

---

### 2. BHY_Framework 框架模块

#### 2.1 管理器系统 (Manager/)

##### EventMgr.ts - 事件管理器

**文件路径**: `assets/BHY_Framework/Manager/EventMgr.ts`

**功能描述**: 
- 实现事件的发布-订阅模式
- 提供类型安全的事件系统
- 支持批量移除事件

**核心方法**:
| 方法名 | 参数 | 返回值 | 功能描述 |
|--------|------|--------|----------|
| on | eventName:string, callback:Function, target?:any | void | 订阅事件 |
| off | eventName:string, callback?:Function, target?:any | void | 取消订阅 |
| offTarget | target:any | void | 移除目标所有事件 |
| emit | eventName:string, ...args:any[] | void | 触发事件 |
| clear | - | void | 清除所有事件 |
| getListenerCount | eventName:string | number | 获取监听器数量 |
| hasListeners | eventName:string | boolean | 检查是否有监听器 |

**使用示例**:
```typescript
EventMgr.Ins.on('game_start', callback, this);
EventMgr.Ins.emit('game_start', arg1, arg2);
EventMgr.Ins.off('game_start', callback, this);
EventMgr.Ins.offTarget(this);
```

---

##### ResMgr.ts - 资源管理器

**文件路径**: `assets/BHY_Framework/Manager/ResMgr.ts`

**功能描述**: 
- 管理Bundle资源加载和释放
- 支持远程图片加载
- 提供资源缓存机制

**核心方法**:
| 方法名 | 参数 | 返回值 | 功能描述 |
|--------|------|--------|----------|
| loadBundle | bundleName:string | Promise<Bundle> | 加载Bundle包 |
| getOrLoadAsset | bundleName, path, type, onComplete | Promise<T> | 获取或加载资源 |
| loadDir | bundleName, dir, type, onComplete | Promise<T[]> | 加载目录下所有资源 |
| setSpriteFrame | sprite:Sprite, bundleName, path | Promise<void> | 设置Sprite图片 |
| loadRemoteImage | sprite:Sprite, url:string | void | 加载远程图片 |
| releaseBundle | bundleName:string | void | 释放Bundle |
| releaseAsset | bundleName:string, path:string | void | 释放指定资源 |
| getAsset | bundleName, path, type | T | 获取已加载资源 |

---

##### PoolMgr.ts - 对象池管理器

**功能**: 
- 管理游戏对象的复用
- 减少GC压力
- 提高性能

---

##### AudioMgr.ts - 音频管理器

**功能**: 
- 管理游戏音频播放
- 支持BGM和音效分离
- 提供音量控制接口

---

##### StorageMgr.ts - 存储管理器

**功能**: 
- 管理本地数据持久化
- 支持加密存储
- 提供数据存档功能

---

#### 2.2 UI系统 (UI/)

##### UIMgr.ts - UI管理器

**功能**: 
- 管理UI面板的显示/隐藏
- 处理UI层级
- 管理UI动画

---

##### UIPanelBase.ts - UI面板基类

**功能**: 
- 定义UI面板生命周期
- 提供通用UI功能接口

---

#### 2.3 ECS系统 (ECS/)

##### 实体组件系统架构

**目录结构**:
```
ECS/
├── core/               # 核心实现
│   ├── BaseComponent.ts
│   ├── BaseEntity.ts
│   └── README.md
├── interfaces/         # 接口定义
│   ├── IComponent.ts
│   ├── IEntity.ts
│   └── IEntitySystem.ts
├── systems/           # 系统实现
│   ├── EntitySystem.ts
│   └── EntityPoolMgr.ts
├── types/
│   └── Types.ts
└── examples/         # 使用示例
```

---

#### 2.4 SDK系统 (Sdk/)

##### SDK集成

**目录结构**:
```
Sdk/
├── PlatformSDK/       # 平台SDK适配
│   ├── WxSDK.ts      // 微信
│   ├── TbSDK.ts      // 淘宝
│   ├── KsSDK.ts      // 快手
│   └── ...其他平台
├── SDKBtn/           # SDK按钮组件
├── SDKUI/            # SDK界面组件
├── exp/              # SDK扩展功能
│   ├── SDKAD.ts
│   ├── SDKShare.ts
│   └── SDKUserInfo.ts
├── libs/             # SDK类型声明
└── SDK.ts            # SDK主入口
```

**支持的平台**:
- 微信 (WxSDK)
- 抖音/头条 (ToutiaoSDK/TbSDK)
- 快手 (KsSDK)
- 华为 (HuaWeiSDK)
- 小米 (XiaomiSDK)
- OPPO (OPPOSDK)
- Vivo (VivoSDK)
- 芒果TV (MangGuoSDK)
- 哔哩哔哩 (BlBlSDK)
- 支付宝 (ZfbSDK)
- 荣耀 (HonorSDK)

---

## 🎯 核心游戏流程

### 游戏启动流程

```
1. Layer.ts 初始化
   ↓
2. SDK 初始化 (SDK.Login, SDK.CheckPrivacy)
   ↓
3. GameStorage 数据加载
   ↓
4. 加载 loading 界面
   ↓
5. 预加载弹窗和提示界面
   ↓
6. 进入 HallView 大厅界面
```

### 战斗流程

```
1. HallView.openFight() 打开战斗界面
   ↓
2. FightView.start() 初始化战斗
   ↓
3. 读取关卡配置 (GlobalData)
   ↓
4. 创建英雄和初始足球
   ↓
5. 启动定时器 soccerGame()
   ↓
6. 敌人产生和移动
   ↓
7. 足球运动和碰撞检测
   ↓
8. 判断游戏状态
   ├── 升级 → AmplificationCardView
   ├── 通关 → 读取下一波
   └── 失败 → 游戏结束
```

### 酒馆抽卡流程

```
1. 经验达到升级条件
   ↓
2. 显示 AmplificationCardView
   ↓
3. 根据概率随机卡牌品质
   ↓
4. 选择卡牌后发送事件
   ↓
5. FightView 接收事件并更新属性
   ↓
6. 继续战斗
```

---

## 📊 数据流图

### 英雄数据流

```
HeroTable.json → GlobalData.heroTableArr → FightView.heroArr → UI显示
                                    ↓
                          AmplificationCardView 选择提升
                                    ↓
                          更新 heroArr 属性
                                    ↓
                          GlobalData.joinHeroArr 同步
```

### 敌人数据流

```
WaveTable.json → GlobalData.waveTableArr → FightView 创建敌人
                                            ↓
                                    enemyArr 数组管理
                                            ↓
                                    足球碰撞检测
                                            ↓
                                    敌人死亡处理
```

---

## 🔧 配置数据表

### JSON配置表列表

| 表名 | 路径 | 用途 |
|------|------|------|
| chapterJson | resources/json/chapterJson.txt | 章节配置 |
| levelJson | resources/json/levelJson.txt | 关卡配置 |
| waveJson | resources/json/waveJson.txt | 波数配置 |
| heroJson | resources/json/heroJson.txt | 英雄配置 |
| enemyJson | resources/json/enemyJson.txt | 敌人配置 |
| heroSkillJson | resources/json/heroSkillJson.txt | 英雄技能配置 |
| heroPropertyJson | resources/json/heroPropertyJson.txt | 英雄属性增幅配置 |
| ampCardProJson | resources/json/ampCardProJson.txt | 抽卡概率配置 |
| propJson | resources/json/propJson.txt | 道具配置 |
| enemyBuffJson | resources/json/enemyBuffJson.txt | 敌人BUFF配置 |
| heroBuffJson | resources/json/heroBuffJson.txt | 英雄BUFF配置 |

---

## 🚀 运行方式

### 开发环境

1. **安装 Cocos Creator 3.8.7**
   - 下载地址: https://www.cocos.com/creator

2. **克隆项目**
   ```bash
   git clone <repository_url>
   cd KungFuSoccer
   ```

3. **打开项目**
   - 使用 Cocos Creator 打开项目根目录
   - Cocos Creator 会自动识别 `.creator` 配置文件

4. **运行项目**
   - 在 Cocos Creator 编辑器中点击 "运行" 按钮
   - 或使用快捷键 Ctrl+R (Windows) / Cmd+R (Mac)

### 构建发布

1. **Web平台构建**
   - 菜单: 项目 → 构建发布
   - 选择 Web Desktop 或 Web Mobile
   - 配置构建选项后点击 "构建"

2. **原生平台构建**
   - iOS: 需要 macOS 和 Xcode
   - Android: 需要 Android Studio 和 NDK

3. **小游戏平台构建**
   - 微信: 导出微信小游戏
   - 抖音: 导出字节小游戏
   - 快手: 导出快手小游戏

### 项目配置

**package.json**:
```json
{
  "name": "KungFuSoccer",
  "uuid": "80622fb4-5109-4126-8ac4-0466d0867aec",
  "creator": {
    "version": "3.8.7"
  }
}
```

**TypeScript 配置**:
- 位于 `tsconfig.json`
- 启用严格模式
- 目标 ES2017+

---

## 📝 命名规范

### 文件命名
- **TypeScript文件**: 大驼峰命名法 (PascalCase)
  - `FightView.ts`
  - `GlobalData.ts`
  - `EventMgr.ts`

### 类命名
- **类名**: 大驼峰命名法
  - `class FightView`
  - `class GlobalData`
- **单例实例**: `Ins` 或 `Instance`
  - `GlobalData.Instance`
  - `AudioMG.Instance`

### 变量命名
- **私有变量**: 小驼峰 + 下划线前缀
  - `_initObject()`
  - `_onEvent()`
- **组件引用**: 类型 + 描述
  - `btn_close: Button`
  - `lab_gold: Label`
  - `img_soccerField: Sprite`
- **数组命名**: 复数形式
  - `heroArr: heroStructure[]`
  - `enemyArr: enemyStructure[]`

### 常量命名
- **静态常量**: 全大写 + 下划线分隔
  - `FIGHT_COLLISION_EVENT`
  - `GAME_STATE_START`

---

## 🎓 扩展指南

### 添加新英雄

1. 在 `heroJson.txt` 中添加英雄配置
2. 添加英雄头像和立绘资源
3. 在 `heroSkillJson.txt` 中配置技能
4. 更新 `GlobalData.heroTableArr`

### 添加新关卡

1. 在 `chapterJson.txt` 中配置章节
2. 在 `levelJson.txt` 中配置关卡
3. 在 `waveJson.txt` 中配置波数
4. 添加关卡背景音乐

### 添加新平台SDK

1. 在 `Sdk/PlatformSDK/` 下创建新SDK文件
2. 实现 SDK 接口方法
3. 在 `SDKWrapped.ts` 中添加平台判断
4. 在 `BuildSetting.ts` 中配置平台参数

---

## 📚 相关文档

- [BHY_Framework 框架文档](assets/BHY_Framework/README.md)
- [Cocos Creator 官方文档](https://docs.cocos.com/creator/manual/zh/)
- [TypeScript 官方文档](https://www.typescriptlang.org/docs/)

---

## 📞 技术支持

如有问题，请通过以下方式联系：
- 提交 Issue 到项目仓库
- 联系开发团队邮箱

---

**最后更新**: 2026-05-21  
**文档版本**: 1.0.0
