# 资源管理器 (ResMgr) 使用指南

## 概述

ResMgr 是一个高性能的资源管理系统，专门为 Cocos Creator 游戏开发设计。它支持 Bundle 资源加载、远程资源加载、资源释放等功能，提供了完整的资源生命周期管理。

## 主要特性

- ✅ **Bundle 管理** - 支持 Bundle 的加载和管理
- ✅ **远程资源** - 支持远程资源的加载和缓存
- ✅ **资源释放** - 支持资源的自动释放和手动释放
- ✅ **类型安全** - 完整的 TypeScript 类型支持
- ✅ **错误处理** - 完善的错误处理机制

## 快速开始

### 1. 加载 Bundle

```typescript
// 加载 Bundle
const bundle = await ResMgr.Ins.loadBundle('game');
if (bundle) {
    console.log('Bundle 加载成功');
}
```

### 2. 加载资源

```typescript
// 加载单个资源
const spriteFrame = await ResMgr.Ins.getOrLoadAsset<SpriteFrame>(
    'game', 
    'textures/player', 
    SpriteFrame
);

// 加载目录资源
const textures = await ResMgr.Ins.loadDir<SpriteFrame>(
    'game', 
    'textures/enemies', 
    SpriteFrame
);
```

### 3. 设置精灵图片

```typescript
// 设置精灵图片
await ResMgr.Ins.setSpriteFrame(sprite, 'game', 'textures/player');
```

## API 参考

### Bundle 管理

```typescript
// 获取 Bundle
getBundle(name: string): AssetManager.Bundle

// 加载 Bundle
loadBundle(bundleName: string, onComplete?: Function): Promise<AssetManager.Bundle>
```

### 资源加载

```typescript
// 获取或加载资源
getOrLoadAsset<T extends Asset>(
    bundleName: string, 
    path: string, 
    type?: new () => T, 
    onComplete?: Function
): Promise<T>

// 加载目录资源
loadDir<T extends Asset>(
    bundleName: string, 
    dir: string, 
    type?: new () => T, 
    onComplete?: Function
): Promise<T[]>

// 加载远程资源
loadRemote<T extends Asset>(
    url: string, 
    options?: any, 
    onComplete?: Function
): Promise<T>
```

### 资源释放

```typescript
// 释放 Bundle
releaseBundle(bundleName: string): void

// 释放资源
releaseAsset(bundleName: string, path: string): void

// 释放目录资源
releaseDir(bundleName: string, dir: string): void
```

### 便捷方法

```typescript
// 设置精灵图片
setSpriteFrame(sprite: Sprite | Node, bundleName: string, path: string): Promise<void>

// 加载远程图片
loadRemoteImage(sprite: Sprite, url: string): Promise<void>

// 加载所有 Bundle
loadAllBundles(bundleNames: string[], onProgress?: Function): Promise<void>
```

## 使用场景

### 1. 游戏资源加载

```typescript
// 加载游戏资源
async loadGameResources() {
    // 加载 Bundle
    const bundle = await ResMgr.Ins.loadBundle('game');
    if (!bundle) return;
    
    // 加载玩家资源
    const playerTexture = await ResMgr.Ins.getOrLoadAsset<SpriteFrame>(
        'game', 'textures/player', SpriteFrame
    );
    
    // 加载敌人资源
    const enemyTextures = await ResMgr.Ins.loadDir<SpriteFrame>(
        'game', 'textures/enemies', SpriteFrame
    );
    
    console.log('游戏资源加载完成');
}
```

### 2. UI 资源管理

```typescript
// 加载 UI 资源
async loadUIResources() {
    const uiBundle = await ResMgr.Ins.loadBundle('ui');
    if (!uiBundle) return;
    
    // 加载按钮资源
    const buttonTextures = await ResMgr.Ins.loadDir<SpriteFrame>(
        'ui', 'buttons', SpriteFrame
    );
    
    // 设置按钮图片
    for (const button of buttons) {
        await ResMgr.Ins.setSpriteFrame(button, 'ui', 'buttons/normal');
    }
}
```

### 3. 远程资源加载

```typescript
// 加载远程头像
async loadRemoteAvatar(sprite: Sprite, avatarUrl: string) {
    try {
        await ResMgr.Ins.loadRemoteImage(sprite, avatarUrl);
        console.log('远程头像加载成功');
    } catch (error) {
        console.error('远程头像加载失败:', error);
        // 使用默认头像
        await ResMgr.Ins.setSpriteFrame(sprite, 'ui', 'default_avatar');
    }
}
```

## 最佳实践

### 1. 资源加载策略

```typescript
// 预加载重要资源
async preloadImportantResources() {
    const bundleNames = ['game', 'ui'];
    
    // 显示加载进度
    await ResMgr.Ins.loadAllBundles(bundleNames, (progress) => {
        console.log(`加载进度: ${progress * 100}%`);
    });
    
    // 预加载关键资源
    await Promise.all([
        ResMgr.Ins.getOrLoadAsset('game', 'textures/player', SpriteFrame),
        ResMgr.Ins.getOrLoadAsset('ui', 'buttons/start', SpriteFrame)
    ]);
}
```

### 2. 内存管理

```typescript
// 场景切换时释放资源
onSceneChange() {
    // 释放不需要的资源
    ResMgr.Ins.releaseDir('game', 'textures/level1');
    ResMgr.Ins.releaseDir('ui', 'panels/mainMenu');
}
```

### 3. 错误处理

```typescript
// 资源加载错误处理
async loadResourceWithFallback(bundleName: string, path: string) {
    try {
        const asset = await ResMgr.Ins.getOrLoadAsset(bundleName, path, SpriteFrame);
        return asset;
    } catch (error) {
        console.error(`资源加载失败: ${bundleName}/${path}`, error);
        // 使用默认资源
        return await ResMgr.Ins.getOrLoadAsset('common', 'default', SpriteFrame);
    }
}
```

### 4. 性能优化

```typescript
// 批量加载资源
async loadBatchResources() {
    const resources = [
        { bundle: 'game', path: 'textures/player' },
        { bundle: 'game', path: 'textures/enemy' },
        { bundle: 'ui', path: 'buttons/start' }
    ];
    
    const promises = resources.map(res => 
        ResMgr.Ins.getOrLoadAsset(res.bundle, res.path, SpriteFrame)
    );
    
    const results = await Promise.all(promises);
    console.log(`批量加载了 ${results.length} 个资源`);
}
```

## 注意事项

1. **Bundle 管理**: 合理组织 Bundle 结构，避免单个 Bundle 过大
2. **内存管理**: 及时释放不需要的资源，避免内存泄漏
3. **错误处理**: 为所有资源加载操作添加错误处理
4. **加载策略**: 根据游戏需求选择合适的加载策略
5. **缓存策略**: 合理使用资源缓存，平衡内存和性能

## 故障排除

### 常见问题

1. **Bundle 加载失败**
   - 检查 Bundle 名称是否正确
   - 检查 Bundle 文件是否存在
   - 检查网络连接（远程 Bundle）

2. **资源加载失败**
   - 检查资源路径是否正确
   - 检查资源类型是否匹配
   - 检查 Bundle 是否已加载

3. **内存问题**
   - 定期释放不需要的资源
   - 监控内存使用情况
   - 使用资源池管理频繁创建的资源

### 调试技巧

```typescript
// 检查 Bundle 状态
const bundle = ResMgr.Ins.getBundle('game');
if (bundle) {
    console.log('Bundle 已加载');
} else {
    console.log('Bundle 未加载');
}

// 检查资源是否存在
const asset = ResMgr.Ins.getAsset('game', 'textures/player', SpriteFrame);
if (asset) {
    console.log('资源已加载');
} else {
    console.log('资源未加载');
}
```

## 更新日志

### v1.0.0
- 初始版本
- 支持 Bundle 管理
- 支持远程资源加载
- 支持资源释放
- 支持错误处理

## 许可证

MIT License 