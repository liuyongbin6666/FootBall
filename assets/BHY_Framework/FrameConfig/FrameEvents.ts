/**
 * 框架事件常量
 * 定义框架中使用的所有事件名称
 */
export class FrameEvents {
     /** 打开面板事件 */
     public static readonly OPEN_PANEL = 'OPEN_PANEL';
     /** 关闭面板事件 */
     public static readonly CLOSE_PANEL = 'CLOSE_PANEL';
     
     // 游戏状态相关事件
     /** 游戏开始事件 */
     public static readonly GAME_STARTED = 'GAME_STARTED';
     /** 游戏暂停事件 */
     public static readonly GAME_PAUSED = 'GAME_PAUSED';
     /** 游戏恢复事件 */
     public static readonly GAME_RESUMED = 'GAME_RESUMED';
     /** 游戏结束事件 */
     public static readonly GAME_ENDED = 'GAME_ENDED';
     /** 游戏胜利事件 */
     public static readonly GAME_VICTORY = 'GAME_VICTORY';
     /** 游戏重新开始事件 */
     public static readonly GAME_RESTARTED = 'GAME_RESTARTED';
     /** 游戏状态改变事件 */
     public static readonly GAME_STATE_CHANGED = 'GAME_STATE_CHANGED';
     
     // 暂停类型相关事件
     /** 场景暂停事件 */
     public static readonly GAME_SCENE_PAUSED = 'GAME_SCENE_PAUSED';
     /** 全局暂停事件 */
     public static readonly GAME_GLOBAL_PAUSED = 'GAME_GLOBAL_PAUSED';
         /** 自定义暂停事件 */
    public static readonly GAME_CUSTOM_PAUSED = 'GAME_CUSTOM_PAUSED';
    
    // 场景切换相关事件
    /** 场景切换准备完成事件 */
    public static readonly SCENE_CHANGE_PREPARED = 'SCENE_CHANGE_PREPARED';
    /** 场景切换完成事件 */
    public static readonly SCENE_CHANGED = 'SCENE_CHANGED';
    /** 场景切换后处理完成事件 */
    public static readonly SCENE_CHANGE_COMPLETED = 'SCENE_CHANGE_COMPLETED';
}