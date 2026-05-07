import { ClsSingleton } from "../Singleton/ClsSingleton";

/**
 * 简化的日志管理器，只保留是否启用日志的核心功能
 */
export class LogMgr extends ClsSingleton<LogMgr> {

    public Name = "LogMgr"

    /** 是否启用日志输出 */
    private _enabled: boolean = true;

    /** 日志前缀 */
    private _prefix: string = "[BHY]";

    public async init(debug?: boolean) {
        if (this._initialized) {
            console.error(`[${this.Name}] 重复初始化`);
            return
        }
        this._initialized = true;
        this.setEnabled(debug);
        console.log(`[${this.Name}] 初始化日志管理器`);
    }

    /**
     * 释放日志管理器资源
     */
    public release(): void {
        console.log('[LogMgr] 日志管理器释放资源');
    }

    /** 提供类型安全的单例访问 */
    public static get Ins(): LogMgr {
        return this.getInstance<LogMgr>();
    }

    /**
     * 启用/禁用日志输出
     * @param enabled 是否启用
     */
    public setEnabled(enabled: boolean): void {
        this._enabled = enabled;
        console.log(`[LogMgr] 日志输出${enabled ? '启用' : '禁用'}`);
    }

    /**
     * 检查日志是否启用
     * @returns 是否启用
     */
    public isEnabled(): boolean {
        return this._enabled;
    }

    /**
     * 设置日志前缀
     * @param prefix 前缀
     */
    public setPrefix(prefix: string): void {
        this._prefix = prefix;
    }

    /**
     * 输出调试日志
     * @param message 日志消息
     * @param tag 标签
     */
    public debug(message: string, tag?: string): void {
        this._log('log', message, tag);
    }

    /**
     * 输出信息日志
     * @param message 日志消息
     * @param tag 标签
     */
    public info(message: string, tag?: string): void {
        this._log('info', message, tag);
    }

    /**
     * 输出警告日志
     * @param message 日志消息
     * @param tag 标签
     */
    public warn(message: string, tag?: string): void {
        this._log('warn', message, tag);
    }

    /**
     * 输出错误日志
     * @param message 日志消息
     * @param tag 标签
     */
    public error(message: string, tag?: string): void {
        this._log('error', message, tag);
    }

    /**
     * 输出日志（兼容console.log）
     * @param message 日志消息
     * @param tag 标签
     */
    public log(message: string, tag?: string): void {
        this._log('log', message, tag);
    }

    /**
     * 内部日志输出方法
     * @param level 日志级别
     * @param message 日志消息
     * @param tag 标签
     */
    private _log(level: 'log' | 'info' | 'warn' | 'error', message: string, tag?: string): void {
        // 如果日志被禁用，直接返回
        if (!this._enabled) {
            return;
        }

        // 构建日志消息
        const tagStr = tag ? `[${tag}]` : '';
        const fullMessage = `${this._prefix}${tagStr} ${message}`;

        // 直接输出到控制台
        console[level](fullMessage);
    }
} 