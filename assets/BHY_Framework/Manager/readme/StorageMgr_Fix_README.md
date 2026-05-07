# StorageMgr 修复说明

## 问题描述

在使用BHY框架的StorageMgr时，出现了以下错误：

1. **重复注册错误**: `Each script can have at most one Component`
2. **TypeError**: `Cannot set properties of null (setting '_sealed')`
3. **GameSettings重复注册**: 日志显示GameSettings被重复注册
## 问题原因

1. **模块热重载**: 在开发过程中，TypeScript装饰器可能被重复执行
2. **空对象访问**: 在访问类属性时没有进行null检查
3. **重复注册检测缺失**: 没有机制防止同一个类被重复注册

## 修复方案

### 1. 添加重复注册检测

```typescript
// 添加已注册类名集合
private static _registeredClassNames: Set<string> = new Set();

// 在注册类时检查是否已注册
public static registerClass(classType: Class, storageKey: string, autoSave: boolean = true) {
    if (this._registeredClassNames.has(storageKey)) {
        LogMgr.Ins.warn(`[StorageMgr] 类 ${storageKey} 已注册，跳过重复注册`);
        return;
    }
    // ... 注册逻辑
}
```

### 2. 添加空对象检查

```typescript
// 在所有关键方法中添加null检查
public saveByClass(classType: Class, auto: boolean = true): boolean {
    if (!classType) {
        LogMgr.Ins.warn(`[StorageMgr] 保存失败：类对象为空`);
        return false;
    }
    // ... 保存逻辑
}
```

### 3. 添加异常处理

```typescript
// 在属性访问时添加try-catch
try {
    value = classType[field.fieldName];
} catch (e) {
    LogMgr.Ins.warn(`[StorageMgr] 获取字段 ${field.fieldName} 值失败: ${e}`);
    continue;
}
```

### 4. 添加重置机制

```typescript
// 添加重置方法用于开发时热重载
public static resetRegistration() {
    this._fieldsByClass.clear();
    this._classMeta.clear();
    this._registeredClassNames.clear();
    LogMgr.Ins.info(`[StorageMgr] 已重置注册状态`);
}
```

### 5. 改进初始化流程

```typescript
// 在BHYFrame中优先初始化StorageMgr
private initSubSystems() {
    // 初始化存储管理器（优先初始化）
    StorageMgr.Ins.init();
    // ... 其他管理器初始化
}
```

## 使用方法

### 1. 基本使用

```typescript
// 定义数据类
@GDataClass("PlayerData")
class PlayerData {
    @GSave(0)
    public static level: number;

    @GSave("Player")
    public static name: string;
}

// 在游戏启动时初始化
StorageMgr.Ins.init();

// 保存数据
StorageMgr.Ins.saveAll();

// 加载数据
StorageMgr.Ins.loadAll();
```

### 2. 开发时重置

如果遇到重复注册问题，可以调用：

```typescript
StorageMgr.resetRegistration();
```

### 3. 测试验证

使用提供的`StorageMgrTest.ts`脚本进行测试：

```typescript
// 在场景中添加StorageMgrTest组件
// 组件会自动运行测试并输出结果
```

## 注意事项

1. **初始化顺序**: StorageMgr应该在游戏启动时优先初始化
2. **装饰器使用**: 确保装饰器参数正确，避免空值
3. **数据验证**: 在保存前验证数据的有效性
4. **异常处理**: 框架会自动处理大部分异常，但仍需注意日志输出

## 版本信息

- **修复版本**: 2.1.1
- **修复日期**: 2024年
- **兼容性**: 与现有代码完全兼容

## 测试结果

修复后的StorageMgr应该能够：

1. ✅ 正确处理重复注册
2. ✅ 避免null对象访问错误
3. ✅ 正常保存和加载数据
4. ✅ 支持热重载开发
5. ✅ 提供详细的错误日志 