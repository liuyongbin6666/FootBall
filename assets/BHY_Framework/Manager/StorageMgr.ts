// /**
//  * @file StorageMgr.ts
//  * @description 游戏存储管理器，支持全局存储和分类存储两种模式
//  */

// import { game } from 'cc';
// import JSZIP from '../JSZIP/JSZIP';
// import { SDKEvent } from '../Sdk/exp/SDKEvent';
// import { ClsSingleton } from '../Singleton/ClsSingleton';
// import { LogMgr } from './LogMgr';

// // 类型定义
// export type Class = new () => any;
// export type FInitDefaultValue = () => any;
// export type FMinMax = () => number;
// export type FFieldDecoratorsProtocol = (target: any, propertyName: string) => void;
// export type ClassDecorator = <T extends Function>(target: T) => T | void;

// /**
//  * 存储设置类，用于存储属性的元数据
//  */
// class GameStorageSetting {
//     /** 所属类 */
//     public ClassType: Class;
//     /** 字段名 */
//     public FieldName: string;
//     /** 默认值 */
//     public DefaultValue?: any | FInitDefaultValue;
//     /** 是否每日刷新 */
//     public DailyRefresh?: boolean;
//     /** 是否低频更新 */
//     public LowUpdate?: boolean;
//     /** 是否为静态属性 */
//     public IsStatic?: boolean;
// }

// /**
//  * 数据类注册信息
//  */
// class DataClassInfo {
//     /** 类构造函数 */
//     constructor(
//         public storageKey: string,
//         public autoSave: boolean = true
//     ) { }
// }
 

// /**
//  * 游戏存储管理器
//  * 负责游戏数据的本地存储和读取
//  */
// export class StorageMgr extends ClsSingleton<StorageMgr> {
//     /** 提供类型安全的单例访问 */
//     public static get Ins(): StorageMgr {
//         return this.getInstance<StorageMgr>();
//     }

//     /** 游戏版本号 */
//     public static Version: string = "1.0.0";
//     /** 版本键名 */
//     private static readonly VersionName = "Version_BHGame";
//     /** 每日刷新日期 */
//     public static DailyRefreshDate: string;
//     /** 每日刷新日期键名 */
//     private static readonly DailyRefreshDateName = "DailyRefreshDate_BHGame";

//     /** 按类型分组的存储设置 */
//     private static _settingsByClass: Map<Class, GameStorageSetting[]> = new Map();
//     /** 注册的数据类信息 */
//     private static _registeredClasses: Map<Class, DataClassInfo> = new Map();
//     /** 存储键名基础 */
//     private static readonly kStorageNameBase = "GameSave_BHGame";

//     /** 自动保存间隔(秒) */
//     private _autoSaveInterval: number = 1.5;
//     /** 是否启用自动保存 */
//     private _autoSaveEnabled: boolean = true;
//     /** 自动保存定时器ID */
//     private _autoSaveTimerId: number = null;

//     public Name = "StorageMgr";

//     /**
//      * 注册存储设置
//      * @param setting 存储设置
//      */
//     public static RegisterSetting(setting: GameStorageSetting): void {
//         if (!StorageMgr._settingsByClass.has(setting.ClassType)) {
//             StorageMgr._settingsByClass.set(setting.ClassType, []);
//         }
//         StorageMgr._settingsByClass.get(setting.ClassType).push(setting);
//         //LogMgr.Ins.info(`[StorageMgr] 注册字段: ${setting.ClassType.name}.${setting.FieldName}, 默认值: ${setting.DefaultValue}`);
//     }

//     /**
//      * 注册数据类
//      * @param target 类构造函数
//      * @param key 存储键名(可选)
//      * @param autoSave 是否自动保存
//      */
//     public static RegisterClass(classType: Class, storageKey: string, autoSave: boolean = true): void {
//         StorageMgr._registeredClasses.set(classType, new DataClassInfo(
//             storageKey,
//             autoSave
//         ));
//         LogMgr.Ins.info(`[StorageMgr] 注册数据类: ${storageKey}, 类名: ${classType.name}`);
//     }

//     /**
//      * 获取类的存储键名
//      * @param classType 类构造函数
//      * @returns 存储键名
//      */
//     private static GetClassStorageKey(classType: Class): string {
//         const info = StorageMgr._registeredClasses.get(classType);
//         return info ? `${StorageMgr.kStorageNameBase}_${info.storageKey}` : '';
//     }

//    /** 初始化存储管理器 */
//     public async init( ): Promise<void> {
//         if (this._initialized) {
//             return;
//         }
//         this._initialized = true; 

//         // 执行每日刷新检查
//         StorageMgr.CheckDailyRefresh();

//         // 加载存储数据
//         this.loadAllClassData();

//         // 启动自动保存
//         if (this._autoSaveEnabled) {
//             this.startAutoSave();
//         }

//         LogMgr.Ins.info(`[StorageMgr] 存储管理器初始化完成`);
//     }

//     /**
//      * 开始自动保存
//      */
//     private startAutoSave(): void {
//         if (this._autoSaveTimerId) {
//             clearInterval(this._autoSaveTimerId);
//         }
//         this._autoSaveTimerId = setInterval(() => {
//             if (this._autoSaveEnabled) {
//                 this.Save();
//             }
//         }, this._autoSaveInterval * 1000) as any;
//         LogMgr.Ins.info(`[StorageMgr] 自动保存已启动，间隔: ${this._autoSaveInterval}秒`);
//     }

//     /**
//      * 停止自动保存
//      */
//     private stopAutoSave(): void {
//         if (this._autoSaveTimerId) {
//             clearInterval(this._autoSaveTimerId);
//             this._autoSaveTimerId = null;
//         }
//         LogMgr.Ins.info(`[StorageMgr] 自动保存已停止`);
//     }

//     /**
//      * 设置自动保存状态
//      * @param enabled 是否启用自动保存
//      */
//     public setAutoSaveEnabled(enabled: boolean): void {
//         this._autoSaveEnabled = enabled;
//         if (enabled) {
//             this.startAutoSave();
//         } else {
//             this.stopAutoSave();
//         }
//         LogMgr.Ins.info(`[StorageMgr] 自动保存已${enabled ? '启用' : '禁用'}`);
//     }

//     /**
//      * 获取自动保存状态
//      * @returns 是否启用自动保存
//      */
//     public isAutoSaveEnabled(): boolean {
//         return this._autoSaveEnabled;
//     }

//     /**
//      * 设置自动保存间隔
//      * @param interval 间隔时间(毫秒)
//      */
//     public setAutoSaveInterval(interval: number): void {
//         if (interval <= 0) {
//             LogMgr.Ins.warn(`[StorageMgr] 自动保存间隔必须大于0，设置失败`);
//             return;
//         }
//         this._autoSaveInterval = interval / 1000;
//         if (this._autoSaveEnabled) {
//             this.startAutoSave();
//         }
//         LogMgr.Ins.info(`[StorageMgr] 自动保存间隔已设置为 ${interval}ms`);
//     }

//     /**
//      * 保存所有数据
//      * @returns 是否成功保存
//      */
//     public Save(): void {
//         StorageMgr.CheckDailyRefresh();

//         if (true) {
//             // 分类存储模式
//             for (const [classType, info] of StorageMgr._registeredClasses.entries()) {
//                 if (info.autoSave) {
//                     this.SaveByClass(classType);
//                 }
//             }
//         } else {
//             // 全局存储模式
//             this.SaveGlobal();
//         }

//         // 保存版本和日期信息
//         localStorage.setItem(StorageMgr.VersionName, StorageMgr.Version);
//         localStorage.setItem(StorageMgr.DailyRefreshDateName, StorageMgr.DailyRefreshDate);
//     }

//     /**
//      * 全局存储模式保存
//      */
//     private SaveGlobal(): void {
//         const data: any = {};

//         StorageMgr._settingsByClass.forEach((settings, classType) => {
//             for (const setting of settings) {
//                 try {
//                     const value = setting.ClassType[setting.FieldName];
//                     data[`${classType.name}_${setting.FieldName}`] = value;
//                 } catch (e) {
//                     LogMgr.Ins.warn(`[StorageMgr] 获取字段 ${setting.FieldName} 值失败: ${e}`);
//                 }
//             }
//         });

//         try {
//             localStorage.setItem(StorageMgr.kStorageNameBase, JSON.stringify(data));
//             LogMgr.Ins.debug(`[StorageMgr] 全局数据已保存`);
//         } catch (e) {
//             LogMgr.Ins.error(`[StorageMgr] 保存全局数据失败: ${e}`);
//         }
//     }

//     /**
//      * 保存指定类型的数据
//      * @param classType 数据类类型
//      * @returns 是否成功保存
//      */
//     public SaveByClass(classType: Class): boolean {
//         const settings = StorageMgr._settingsByClass.get(classType);
//         if (!settings || settings.length === 0) {
//             LogMgr.Ins.warn(`[StorageMgr] 未找到类型 ${classType.name} 的存储设置`);
//             return false;
//         }

//         const storageKey = StorageMgr.GetClassStorageKey(classType);
//         if (!storageKey) {
//             LogMgr.Ins.warn(`[StorageMgr] 未找到类型 ${classType.name} 的存储key`);
//             return false;
//         }

//         const data: any = {};
//         for (const setting of settings) {
//             try {
//                 const value = setting.ClassType[setting.FieldName];
//                 data[setting.FieldName] = value;
//             } catch (e) {
//                 LogMgr.Ins.warn(`[StorageMgr] 获取字段 ${setting.FieldName} 值失败: ${e}`);
//             }
//         }

//         try {

//             localStorage.setItem(storageKey, JSZIP.JSZip_Str(JSON.stringify(data)));
//             //LogMgr.Ins.debug(`[StorageMgr] 已保存类 ${storageKey} 数据, 共 ${settings.length} 个属性`);
//             return true;
//         } catch (e) {
//             LogMgr.Ins.error(`[StorageMgr] 保存类 ${storageKey} 数据失败: ${e}`);
//             return false;
//         }
//     }

//     /**
//      * 加载所有类数据
//      */
//     private loadAllClassData(): void {
//         if (true) {
//             // 分类存储模式
//             for (const [classType] of StorageMgr._registeredClasses.entries()) {
//                 this.LoadByClass(classType);
//             }
//         } else {
//             // 全局存储模式
//             this.LoadGlobal();
//         }

//         // 设置版本信息
//         StorageMgr.Version = localStorage.getItem(StorageMgr.VersionName) || StorageMgr.Version;
//         StorageMgr.DailyRefreshDate = localStorage.getItem(StorageMgr.DailyRefreshDateName) || Date.now().toString();
//     }

//     /**
//      * 全局存储模式加载
//      */
//     private LoadGlobal(): void {
//         const str = localStorage.getItem(StorageMgr.kStorageNameBase);
//         if (!str) {
//             LogMgr.Ins.info(`[StorageMgr] 未找到全局存储数据，应用默认值`);
//             StorageMgr.ApplyDefaultValue(false);
//             return;
//         }

//         try {
//             const data = JSON.parse(str);
//             StorageMgr._settingsByClass.forEach((settings, classType) => {
//                 for (const setting of settings) {
//                     const key = `${classType.name}_${setting.FieldName}`;
//                     if (data[key] !== undefined) {
//                         setting.ClassType[setting.FieldName] = data[key];
//                     } else if (setting.DefaultValue !== undefined) {
//                         if (typeof setting.DefaultValue === "function") {
//                             setting.ClassType[setting.FieldName] = setting.DefaultValue();
//                         } else {
//                             setting.ClassType[setting.FieldName] = setting.DefaultValue;
//                         }
//                     }
//                 }
//             });
//             LogMgr.Ins.info(`[StorageMgr] 全局数据已加载`);
//         } catch (e) {
//             LogMgr.Ins.error(`[StorageMgr] 加载全局数据失败: ${e}`);
//             StorageMgr.ApplyDefaultValue(false);
//         }
//     }

//     /**
//      * 加载指定类型的数据
//      * @param classType 数据类类型
//      * @returns 是否成功加载
//      */
//     public LoadByClass(classType: Class): boolean {
//         const settings = StorageMgr._settingsByClass.get(classType);
//         if (!settings || settings.length === 0) {
//             LogMgr.Ins.warn(`[StorageMgr] 未找到类型 ${classType.name} 的存储设置`);
//             return false;
//         }

//         const storageKey = StorageMgr.GetClassStorageKey(classType);
//         if (!storageKey) {
//             LogMgr.Ins.warn(`[StorageMgr] 未找到类型 ${classType.name} 的存储key`);
//             return false;
//         }

//         const str = JSZIP.Str_JSZip(localStorage.getItem(storageKey));
//         if (!str) {
//             LogMgr.Ins.info(`[StorageMgr] 未找到类 ${storageKey} 的存储数据，使用默认值`);
//             StorageMgr.ApplyDefaultValue(false, settings);
//             return false;
//         }

//         try {
//             const data = JSON.parse(str);
//             for (const setting of settings) {
//                 if (data[setting.FieldName] !== undefined) {
//                     setting.ClassType[setting.FieldName] = data[setting.FieldName];
//                 } else if (setting.DefaultValue !== undefined) {
//                     if (typeof setting.DefaultValue === "function") {
//                         setting.ClassType[setting.FieldName] = setting.DefaultValue();
//                     } else {
//                         setting.ClassType[setting.FieldName] = setting.DefaultValue;
//                     }
//                 }
//             }
//             LogMgr.Ins.debug(`[StorageMgr] 已加载类 ${storageKey} 数据, 共 ${settings.length} 个属性`);
//             return true;
//         } catch (e) {
//             LogMgr.Ins.error(`[StorageMgr] 加载类 ${storageKey} 数据出错: ${e}`);
//             StorageMgr.ApplyDefaultValue(false, settings);
//             return false;
//         }
//     }

//     /**
//      * 限制数值范围
//      */
//     private static Clamp(value: number, min: number, max: number): number {
//         if (value < min) {
//             return min;
//         } else if (value > max) {
//             return max;
//         }
//         return value;
//     }

//     /**
//      * 应用默认值
//      */
//     public static ApplyDefaultValue(bOnlyDailyRefresh: boolean, settings?: GameStorageSetting[]): void {
//         if (settings) {
//             StorageMgr.DefaultValue(bOnlyDailyRefresh, settings);
//         } else {
//             StorageMgr._settingsByClass.forEach(settings => {
//                 StorageMgr.DefaultValue(bOnlyDailyRefresh, settings);
//             });
//         }
//         StorageMgr.DailyRefreshDate = Date.now().toString();
//     }

//     /**
//      * 设置默认值
//      * @param bOnlyDailyRefresh 每日刷新
//      * @param settings 
//      */
//     public static DefaultValue(bOnlyDailyRefresh: boolean, settings: GameStorageSetting[]) {
//         if (!settings) return;
//         settings.forEach(rSetting => {
//             if (bOnlyDailyRefresh && !rSetting.DailyRefresh) {
//                 return;
//             }

//             if (rSetting.DefaultValue !== undefined) {
//                 if (typeof rSetting.DefaultValue === "function") {
//                     rSetting.ClassType[rSetting.FieldName] = rSetting.DefaultValue();
//                 } else {
//                     rSetting.ClassType[rSetting.FieldName] = rSetting.DefaultValue;
//                 }
//             }
//         });
//     }

//     /**
//      * 清除指定类的存储数据
//      * @param classType 数据类类型
//      * @returns 是否成功清除
//      */
//     public ClearClassData(classType: Class): boolean {
//         const storageKey = StorageMgr.GetClassStorageKey(classType);
//         if (storageKey) {
//             localStorage.removeItem(storageKey);
//             LogMgr.Ins.info(`[StorageMgr] 已清除类 ${classType.name} 的存储数据`);
//         }

//         // 重置为默认值
//         const settings = StorageMgr._settingsByClass.get(classType) || [];
//         for (const setting of settings) {
//             if (setting.DefaultValue !== undefined) {
//                 if (typeof setting.DefaultValue === "function") {
//                     setting.ClassType[setting.FieldName] = setting.DefaultValue();
//                 } else {
//                     setting.ClassType[setting.FieldName] = setting.DefaultValue;
//                 }
//             }
//         }
//         return true;
//     }

//     /**
//      * 清除所有存储数据
//      */
//     public ClearAllData(): void {
//         // 清除所有注册类的数据
//         StorageMgr._registeredClasses.forEach((info, classType) => {
//             this.ClearClassData(classType);
//         });

//         // 清除全局数据
//         localStorage.removeItem(StorageMgr.kStorageNameBase);
//         localStorage.removeItem(StorageMgr.VersionName);
//         localStorage.removeItem(StorageMgr.DailyRefreshDateName);

//         // 应用默认值
//         StorageMgr.ApplyDefaultValue(false);
//         LogMgr.Ins.info(`[StorageMgr] 已清除所有存储数据`);
//     }

//     /** 当前日期对象 */
//     private static NowDate = new Date();
//     /** 上次刷新日期对象 */
//     private static DailyDate = new Date();

//     /**
//      * 检查是否需要每日刷新
//      */
//     private static CheckDailyRefresh(): void {
//         let now = Date.now();
//         if (!StorageMgr.DailyRefreshDate) {
//             StorageMgr.DailyRefreshDate = now.toString();
//         } else {
//             StorageMgr.NowDate.setTime(now);
//             StorageMgr.DailyDate.setTime(parseInt(StorageMgr.DailyRefreshDate));
//             if (StorageMgr.Num_Time(StorageMgr.NowDate) > StorageMgr.Num_Time(StorageMgr.DailyDate)) {
//                 LogMgr.Ins.info(`[StorageMgr] 触发每日刷新`);
//                 game.emit(SDKEvent.次日刷新)
//                 StorageMgr.ApplyDefaultValue(true);
//             }
//         }
//     }

//     /**
//      * 日期转为数字格式
//      */
//     private static Num_Time(date: Date) {
//         const year = date.getFullYear();
//         const month = date.getMonth() + 1;
//         const day = date.getDate();
//         return year * 10000 + month * 100 + day;
//     }

//     /**
//      * 获取所有存储键
//      * @returns 所有以GameSave_开头的localStorage键
//      */
//     public static getStorageKeys(): string[] {
//         const keys: string[] = [];
//         for (let i = 0; i < localStorage.length; i++) {
//             const key = localStorage.key(i);
//             if (key && key.startsWith("GameSave_")) {
//                 keys.push(key);
//             }
//         }
//         return keys;
//     }

//     /**
//      * 获取指定键的数据
//      * @param key 存储键名
//      * @returns 数据对象
//      */
//     public static getStorageData(key: string): any {
//         const str = localStorage.getItem(key);
//         if (!str) {
//             return null;
//         }

//         try {
//             return JSON.parse(str);
//         } catch (error) {
//             LogMgr.Ins.error(`[StorageMgr] 解析数据失败: ${key}`, error);
//             return null;
//         }
//     }

//     /**
//      * 调试打印所有存储数据
//      */
//     public static debugPrintStorage(): void {
//         console.group("===== 存储数据调试信息 =====");

//         const keys = this.getStorageKeys();
//         console.log(`找到 ${keys.length} 个存储项:`);

//         keys.forEach(key => {
//             console.group(`📦 ${key}`);
//             const data = this.getStorageData(key);
//             console.log(data);
//             console.groupEnd();
//         });

//         console.groupEnd();
//     }

//     /**
//      * 调试查看单个类的存储数据
//      * @param classType 类构造函数
//      */
//     public static debugPrintClassData(classType: Class): void {
//         const storageKey = this.GetClassStorageKey(classType);
//         console.group(`===== ${classType.name} 存储数据 =====`);

//         const data = this.getStorageData(storageKey);
//         if (data) {
//             console.log(data);
//         } else {
//             console.warn(`未找到类 ${classType.name} 的存储数据`);
//         }

//         console.groupEnd();
//     }

//     /**
//      * 释放管理器资源
//      */
//     public release(): void {
//         if (!this._initialized) return;

//         // 保存一次数据
//         this.Save();

//         // 停止自动保存
//         this.stopAutoSave();

//         this._initialized = false;
//         LogMgr.Ins.info(`[StorageMgr] 资源已释放`);
//     }
// }

// /**
//  * 生成字段装饰器
//  */
// function GeneratorFieldDecorators<T>(defaultValue: T | Function, dailyRefresh: boolean, lowUpdate: boolean): FFieldDecoratorsProtocol {
//     return (target: any, propertyName: string) => {
//         var rStorageSetting: GameStorageSetting = {
//             ClassType: target,
//             FieldName: propertyName,
//             DefaultValue: defaultValue,
//             LowUpdate: lowUpdate,
//             DailyRefresh: dailyRefresh,
//         };
//         StorageMgr.RegisterSetting(rStorageSetting);
//     };
// }

// /**
//  * GSave装饰器
//  * 标记需要保存的属性
//  * 
//  * @param defaultValue 默认值
//  * @param dailyRefresh 每日刷新
//  * @param lowUpdate 低频率保存(默认实时保存 false)
//  * @param nMin 最小值
//  * @param nMax 最大值
//  * @returns 字段装饰器
//  */
// export default function GSave<T>(defaultValue?: T | Function, dailyRefresh?: boolean, lowUpdate?: boolean): FFieldDecoratorsProtocol {
//     return GeneratorFieldDecorators(defaultValue, dailyRefresh, lowUpdate);
// }

// /**
//  * 数据类装饰器
//  * 用于标记和注册需要单独存储的数据类
//  * 
//  * @param key 存储键名(可选)
//  * @param autoSave 是否自动保存(默认true)
//  * @returns 类装饰器
//  */
// export function GDataClass(key?: string, autoSave: boolean = true): ClassDecorator {
//     return function (target: any): void {
//         // 注册类到管理器
//         StorageMgr.RegisterClass(target, key || target.name, autoSave);
//     };
// }