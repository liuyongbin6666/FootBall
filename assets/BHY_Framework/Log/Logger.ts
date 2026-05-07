import { LogMgr } from '../Manager/LogMgr';

/**
 * 便捷日志工具类
 * 提供简化的日志接口，方便在项目中使用
 */
export class Logger {
    
    /**
     * 输出调试日志
     * @param message 日志消息
     * @param tag 标签
     */
    public static log(message: string, tag?: string): void {
        LogMgr.Ins.debug(message, tag);
    }

    /**
     * 输出信息日志
     * @param message 日志消息
     * @param tag 标签
     */
    public static info(message: string, tag?: string): void {
        LogMgr.Ins.info(message, tag);
    }

    /**
     * 输出警告日志
     * @param message 日志消息
     * @param tag 标签
     */
    public static warn(message: string, tag?: string): void {
        LogMgr.Ins.warn(message, tag);
    }

    /**
     * 输出错误日志
     * @param message 日志消息
     * @param tag 标签
     */
    public static error(message: string, tag?: string): void {
        LogMgr.Ins.error(message, tag);
    }


    /**
     * 启用/禁用日志输出
     * @param enabled 是否启用
     */
    public static setEnabled(enabled: boolean): void {
        LogMgr.Ins.setEnabled(enabled);
    }

    /**
     * 获取日志管理器实例
     * @returns 日志管理器实例
     */
    public static getLogMgr(): LogMgr {
        return LogMgr.Ins;
    }
} 