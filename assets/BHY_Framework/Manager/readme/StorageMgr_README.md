# 存储管理器 (StorageMgr) 使用指南

## 概述

StorageMgr 是一个高性能的数据存储管理系统，专门为 Cocos Creator 游戏开发设计。它提供了本地存储、数据加密、自动保存等功能，支持游戏进度、设置、用户数据等的持久化存储。

## 主要特性

- ✅ **本地存储** - 支持本地数据的存储和读取
- ✅ **数据加密** - 支持敏感数据的加密存储
- ✅ **自动保存** - 支持数据的自动保存功能
- ✅ **数据验证** - 支持数据的完整性验证
- ✅ **类型安全** - 完整的 TypeScript 类型支持

## 快速开始

### 1. 基本存储

```typescript
// 存储数据
StorageMgr.Ins.setString('playerName', 'Player1');
StorageMgr.Ins.setNumber('playerLevel', 10);
StorageMgr.Ins.setBoolean('soundEnabled', true);

// 读取数据
const playerName = StorageMgr.Ins.getString('playerName', 'DefaultPlayer');
const playerLevel = StorageMgr.Ins.getNumber('playerLevel', 1);
const soundEnabled = StorageMgr.Ins.getBoolean('soundEnabled', true);
```

### 2. 对象存储

```typescript
// 存储对象
const playerData = {
    name: 'Player1',
    level: 10,
    coins: 1000,
    items: ['sword', 'shield']
};
StorageMgr.Ins.setObject('playerData', playerData);

// 读取对象
const savedPlayerData = StorageMgr.Ins.getObject('playerData', {});
```

### 3. 加密存储

```typescript
// 加密存储敏感数据
StorageMgr.Ins.setEncryptedString('userToken', 'sensitive_token_data');

// 读取加密数据
const token = StorageMgr.Ins.getEncryptedString('userToken', '');
```

## API 参考

### 基本数据类型

```typescript
// 字符串操作
setString(key: string, value: string): void
getString(key: string, defaultValue?: string): string

// 数字操作
setNumber(key: string, value: number): void
getNumber(key: string, defaultValue?: number): number

// 布尔操作
setBoolean(key: string, value: boolean): void
getBoolean(key: string, defaultValue?: boolean): boolean
```

### 对象操作

```typescript
// 对象存储
setObject(key: string, value: any): void
getObject(key: string, defaultValue?: any): any

// 数组存储
setArray(key: string, value: any[]): void
getArray(key: string, defaultValue?: any[]): any[]
```

### 加密操作

```typescript
// 加密存储
setEncryptedString(key: string, value: string): void
getEncryptedString(key: string, defaultValue?: string): string

// 加密对象
setEncryptedObject(key: string, value: any): void
getEncryptedObject(key: string, defaultValue?: any): any
```

### 管理操作

```typescript
// 检查键是否存在
hasKey(key: string): boolean

// 删除键
removeKey(key: string): void

// 清空所有数据
clearAll(): void

// 获取所有键
getAllKeys(): string[]

// 获取存储大小
getStorageSize(): number
```

## 使用场景

### 1. 游戏进度保存

```typescript
// 保存游戏进度
saveGameProgress() {
    const gameData = {
        level: this.currentLevel,
        score: this.totalScore,
        coins: this.coins,
        unlockedItems: this.unlockedItems,
        lastSaveTime: Date.now()
    };
    
    StorageMgr.Ins.setObject('gameProgress', gameData);
    StorageMgr.Ins.setNumber('lastSaveTime', Date.now());
}

// 加载游戏进度
loadGameProgress() {
    const gameData = StorageMgr.Ins.getObject('gameProgress', {});
    if (gameData.level) {
        this.currentLevel = gameData.level;
        this.totalScore = gameData.score;
        this.coins = gameData.coins;
        this.unlockedItems = gameData.unlockedItems;
    }
}
```

### 2. 游戏设置

```typescript
// 保存游戏设置
saveGameSettings() {
    const settings = {
        musicVolume: AudioMgr.Ins.getMusicVolume(),
        soundVolume: AudioMgr.Ins.getSoundVolume(),
        language: this.currentLanguage,
        quality: this.graphicsQuality
    };
    
    StorageMgr.Ins.setObject('gameSettings', settings);
}

// 加载游戏设置
loadGameSettings() {
    const settings = StorageMgr.Ins.getObject('gameSettings', {});
    if (settings.musicVolume !== undefined) {
        AudioMgr.Ins.setMusicVolume(settings.musicVolume);
        AudioMgr.Ins.setSoundVolume(settings.soundVolume);
        this.currentLanguage = settings.language || 'zh_CN';
        this.graphicsQuality = settings.quality || 'medium';
    }
}
```

### 3. 用户数据

```typescript
// 保存用户数据
saveUserData() {
    const userData = {
        userId: this.userId,
        nickname: this.nickname,
        avatar: this.avatarUrl,
        achievements: this.achievements
    };
    
    // 加密存储敏感数据
    StorageMgr.Ins.setEncryptedObject('userData', userData);
}

// 加载用户数据
loadUserData() {
    const userData = StorageMgr.Ins.getEncryptedObject('userData', {});
    if (userData.userId) {
        this.userId = userData.userId;
        this.nickname = userData.nickname;
        this.avatarUrl = userData.avatar;
        this.achievements = userData.achievements || [];
    }
}
```

## 最佳实践

### 1. 数据验证

```typescript
// 验证数据完整性
validateGameData() {
    const gameData = StorageMgr.Ins.getObject('gameProgress', {});
    
    // 检查必要字段
    if (!gameData.level || !gameData.score) {
        console.warn('游戏数据不完整，使用默认值');
        return false;
    }
    
    // 检查数据范围
    if (gameData.level < 1 || gameData.score < 0) {
        console.warn('游戏数据异常，重置数据');
        return false;
    }
    
    return true;
}
```

### 2. 自动保存

```typescript
// 自动保存机制
class AutoSave {
    private saveInterval: number = 30000; // 30秒
    private lastSaveTime: number = 0;
    
    startAutoSave() {
        setInterval(() => {
            const now = Date.now();
            if (now - this.lastSaveTime >= this.saveInterval) {
                this.saveGameData();
                this.lastSaveTime = now;
            }
        }, 5000); // 每5秒检查一次
    }
    
    private saveGameData() {
        // 保存游戏数据
        StorageMgr.Ins.setObject('gameProgress', this.getGameData());
        console.log('自动保存完成');
    }
}
```

### 3. 数据迁移

```typescript
// 数据版本迁移
migrateData() {
    const currentVersion = 2;
    const savedVersion = StorageMgr.Ins.getNumber('dataVersion', 1);
    
    if (savedVersion < currentVersion) {
        // 执行数据迁移
        this.migrateFromV1ToV2();
        StorageMgr.Ins.setNumber('dataVersion', currentVersion);
    }
}
```

### 4. 错误处理

```typescript
// 安全的存储操作
safeStorageOperation(operation: () => void) {
    try {
        operation();
    } catch (error) {
        console.error('存储操作失败:', error);
        // 尝试恢复或使用默认值
        this.handleStorageError();
    }
}

private handleStorageError() {
    // 清理损坏的数据
    StorageMgr.Ins.removeKey('gameProgress');
    // 使用默认设置
    this.loadDefaultSettings();
}
```

## 注意事项

1. **数据安全**: 敏感数据使用加密存储
2. **数据验证**: 读取数据时进行完整性验证
3. **存储限制**: 注意本地存储的容量限制
4. **版本兼容**: 考虑数据格式的版本兼容性
5. **错误处理**: 为所有存储操作添加错误处理

## 故障排除

### 常见问题

1. **数据丢失**
   - 检查存储键名是否正确
   - 检查数据格式是否兼容
   - 检查存储空间是否充足

2. **数据损坏**
   - 实现数据验证机制
   - 提供数据恢复功能
   - 使用备份数据

3. **性能问题**
   - 避免频繁的存储操作
   - 使用批量存储
   - 实现存储缓存

### 调试技巧

```typescript
// 检查存储状态
const allKeys = StorageMgr.Ins.getAllKeys();
console.log('所有存储键:', allKeys);

const storageSize = StorageMgr.Ins.getStorageSize();
console.log('存储大小:', storageSize);

// 检查特定数据
const hasGameData = StorageMgr.Ins.hasKey('gameProgress');
console.log('是否有游戏数据:', hasGameData);
```

## 更新日志

### v1.0.0
- 初始版本
- 支持基本数据类型存储
- 支持对象存储
- 支持加密存储
- 支持数据验证

## 许可证

MIT License 