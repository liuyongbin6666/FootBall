import { _decorator, director, game, Node } from "cc";
import { ClsSingleton } from "../Singleton/ClsSingleton";
import { LogMgr } from "./LogMgr";
import { EventMgr } from "./EventMgr";

const { ccclass, property } = _decorator;

/**
 * 游戏状态枚举
 */
export enum GameState {
    /** 未初始化 */
    UNINITIALIZED = 'uninitialized',
    /** 正在加载 */
    LOADING = 'loading',
    /** 游戏中 */
    PLAYING = 'playing',
    /** 暂停中 */
    PAUSED = 'paused',
    /** 游戏结束 */
    GAME_OVER = 'game_over',
    /** 胜利 */
    VICTORY = 'victory'
}

/**
 * 暂停类型枚举
 */
export enum PauseType {
    /** 场景暂停 - 只暂停游戏逻辑，UI和音频继续 */
    SCENE = 'scene',
    /** 全局暂停 - 暂停所有内容，包括渲染和音频 */
    GLOBAL = 'global',
    /** 自定义暂停 - 只暂停特定系统 */
    CUSTOM = 'custom'
}

/**
 * 游戏状态管理器
 * 负责管理游戏的整体状态，包括暂停、开始、恢复等功能
 * 
 * 使用示例：
 * 0. 检查游戏是否暂停
 * GameStateMgr.Ins.isGamePaused();
 * 
 * 1. 场景暂停（推荐用于游戏内暂停）
 * GameStateMgr.Ins.pauseScene();

 * 2. 全局暂停（推荐用于应用切换）
 * GameStateMgr.Ins.pauseGlobal();

 * 3. 自定义暂停（可扩展）
 * GameStateMgr.Ins.pauseCustom();

 * 4. 恢复游戏
 * GameStateMgr.Ins.resumeGame();
 * 
 * 5. UI暂停
 * GameStateMgr.Ins.pauseUI();
 * 
 * 6. UI恢复
 * GameStateMgr.Ins.resumeUI();
 * 
 * 7. 获取UI暂停计数器  
 * GameStateMgr.Ins.getUIPauseCount();
 * 
 * 8. 检查是否处于UI暂停状态
 * GameStateMgr.Ins.isUIPaused();
 * 
 * 9. 强制重置UI暂停计数器  
 * GameStateMgr.Ins.resetUIPauseCount();
 * 
 * 10. 释放资源
 * GameStateMgr.Ins.release();
 */
@ccclass('GameStateMgr')
export class GameStateMgr extends ClsSingleton<GameStateMgr> {
    public Name = "GameStateMgr";

    /** 当前游戏状态 */
    private _currentState: GameState = GameState.UNINITIALIZED;
    
    /** 暂停前的状态，用于恢复 */
    private _previousState: GameState = GameState.UNINITIALIZED;
    
    /** 当前暂停类型 */
    private _currentPauseType: PauseType = PauseType.SCENE;
    
    /** UI暂停计数器 - 用于多层UI界面的暂停管理 */
    private _uiPauseCount: number = 0;
    
    /** 是否已初始化 */
    protected _initialized: boolean = false;

    /** 提供类型安全的单例访问 */
    public static get Ins(): GameStateMgr {
        return this.getInstance<GameStateMgr>();
    }

    /**
     * 初始化游戏状态管理器
     */
    public async init(): Promise<void> {
        if (this._initialized) {
            LogMgr.Ins.error(`[${this.Name}] 重复初始化`);
            return;
        }

        this._initialized = true;
        this._currentState = GameState.LOADING;
        
        LogMgr.Ins.info(`[${this.Name}] 游戏状态管理器初始化完成`);
    }

    /**
     * 开始游戏
     */
    public startGame(): void {
        if (this._currentState === GameState.PLAYING) {
            LogMgr.Ins.warn(`[${this.Name}] 游戏已经在进行中`);
            return;
        }

        this._previousState = this._currentState;
        this._currentState = GameState.PLAYING;
        
        // 确保游戏正常运行
        this.resumeGameSystems();
        
        // 发送游戏开始事件
        EventMgr.Ins.emit('GAME_STARTED');
        
        LogMgr.Ins.info(`[${this.Name}] 游戏开始`);
    }

    /**
     * 暂停游戏
     * @param pauseType 暂停类型，默认为场景暂停
     */
    public pauseGame(pauseType: PauseType = PauseType.SCENE): void {
        if (this._currentState === GameState.PAUSED) {
            LogMgr.Ins.warn(`[${this.Name}] 游戏已经处于暂停状态`);
            return;
        }

        if (this._currentState !== GameState.PLAYING) {
            LogMgr.Ins.warn(`[${this.Name}] 当前状态无法暂停游戏: ${this._currentState}`);
            return;
        }

        this._previousState = this._currentState;
        this._currentState = GameState.PAUSED;
        this._currentPauseType = pauseType;
        
        // 根据暂停类型执行相应的暂停操作
        this.pauseGameSystems(pauseType);
        
        // 发送游戏暂停事件
        EventMgr.Ins.emit('GAME_PAUSED', pauseType);
        
        LogMgr.Ins.info(`[${this.Name}] 游戏已暂停，类型: ${pauseType}`);
    }

    /**
     * 恢复游戏
     */
    public resumeGame(): void {
        if (this._currentState !== GameState.PAUSED) {
            LogMgr.Ins.warn(`[${this.Name}] 游戏未处于暂停状态，无法恢复`);
            return;
        }

        // 恢复游戏系统
        this.resumeGameSystems();
        
        // 恢复到PLAYING状态，确保游戏可以继续
        this._previousState = GameState.PAUSED;
        this._currentState = GameState.PLAYING;
        
        // 发送游戏恢复事件
        EventMgr.Ins.emit('GAME_RESUMED');
        
        LogMgr.Ins.info(`[${this.Name}] 游戏已恢复`);
    }

    /**
     * 暂停游戏系统
     * @param pauseType 暂停类型
     */
    private pauseGameSystems(pauseType: PauseType): void {
        switch (pauseType) {
            case PauseType.SCENE:
                // 场景暂停：只暂停游戏逻辑，UI和音频继续
                director.pause();
                LogMgr.Ins.debug(`[${this.Name}] 执行场景暂停`);
                break;
                
            case PauseType.GLOBAL:
                // 全局暂停：暂停所有内容
                game.pause();
                LogMgr.Ins.debug(`[${this.Name}] 执行全局暂停`);
                break;
                
            case PauseType.CUSTOM:
                // 自定义暂停：只暂停特定系统，这里可以根据需要扩展
                director.pause();
                // 可以在这里添加其他自定义暂停逻辑
                LogMgr.Ins.debug(`[${this.Name}] 执行自定义暂停`);
                break;
        }
    }

    /**
     * 恢复游戏系统
     */
    private  resumeGameSystems(): void {
        switch (this._currentPauseType) {
            case PauseType.SCENE:
                director.resume();
                LogMgr.Ins.debug(`[${this.Name}] 恢复场景`);
                break;
                
            case PauseType.GLOBAL:
                game.resume();
                LogMgr.Ins.debug(`[${this.Name}] 恢复全局`);
                break;
                
            case PauseType.CUSTOM:
                director.resume();
                // 可以在这里添加其他自定义恢复逻辑
                LogMgr.Ins.debug(`[${this.Name}] 恢复自定义暂停`);
                break;
        }
    }

    /**
     * 结束游戏
     */
    public endGame(): void {
        this._previousState = this._currentState;
        this._currentState = GameState.GAME_OVER;
        
        // 发送游戏结束事件
        EventMgr.Ins.emit('GAME_ENDED');
        
        LogMgr.Ins.info(`[${this.Name}] 游戏结束`);
    }

    /**
     * 游戏胜利
     */
    public victory(): void {
        this._previousState = this._currentState;
        this._currentState = GameState.VICTORY;
        
        // 发送游戏胜利事件
        EventMgr.Ins.emit('GAME_VICTORY');
        
        LogMgr.Ins.info(`[${this.Name}] 游戏胜利`);
    }

    /**
     * 重新开始游戏
     */
    public restartGame(): void {
        this._currentState = GameState.PLAYING;
        this._previousState = GameState.UNINITIALIZED;
        
        // 确保游戏正常运行
        this.resumeGameSystems();
        
        // 发送游戏重新开始事件
        EventMgr.Ins.emit('GAME_RESTARTED');
        
        LogMgr.Ins.info(`[${this.Name}] 游戏重新开始`);
    }

    /**
     * 获取当前游戏状态
     */
    public getCurrentState(): GameState {
        return this._currentState;
    }

    /**
     * 获取当前暂停类型
     */
    public getCurrentPauseType(): PauseType {
        return this._currentPauseType;
    }

    /**
     * 检查游戏是否暂停
     */
    public isGamePaused(): boolean {
        return this._currentState === GameState.PAUSED;
    }

    /**
     * 检查游戏是否正在进行
     */
    public isGamePlaying(): boolean {
        return this._currentState === GameState.PLAYING;
    }

    /**
     * 检查游戏是否结束
     */
    public isGameOver(): boolean {
        return this._currentState === GameState.GAME_OVER;
    }

    /**
     * 检查游戏是否胜利
     */
    public isGameVictory(): boolean {
        return this._currentState === GameState.VICTORY;
    }

    /**
     * 检查游戏是否可以暂停
     */
    public canPause(): boolean {
        return this._currentState === GameState.PLAYING;
    }

    /**
     * 检查游戏是否可以恢复
     */
    public canResume(): boolean {
        return this._currentState === GameState.PAUSED;
    }

    /**
     * 设置游戏状态
     * @param state 目标状态
     */
    public setState(state: GameState): void {
        if (this._currentState === state) {
            LogMgr.Ins.debug(`[${this.Name}] 游戏状态已经是: ${state}`);
            return;
        }

        this._previousState = this._currentState;
        this._currentState = state;
        
        // 根据状态调整游戏时间
        if (state === GameState.PAUSED) {
            this.pauseGameSystems(this._currentPauseType);
        } else if (state === GameState.PLAYING) {
            this.resumeGameSystems();
        }
        
        // 发送状态改变事件
        EventMgr.Ins.emit('GAME_STATE_CHANGED', state, this._previousState);
        
        LogMgr.Ins.info(`[${this.Name}] 游戏状态改变: ${this._previousState} -> ${state}`);
    }

    /**
     * 场景暂停（推荐用于游戏内暂停）
     */
    public pauseScene(): void {
        this.pauseGame(PauseType.SCENE);
    }

    /**
     * 全局暂停（推荐用于应用切换或系统级暂停）
     */
    public pauseGlobal(): void {
        this.pauseGame(PauseType.GLOBAL);
    }

    /**
     * 自定义暂停
     */
    public pauseCustom(): void {
        this.pauseGame(PauseType.CUSTOM);
    }

    /**
     * UI暂停 - 用于多层UI界面的暂停管理
     * 每次调用会增加计数器，当计数器为0时游戏恢复
     */
    public pauseUI(): void {
        this._uiPauseCount++;
        
        // 如果这是第一次UI暂停，且游戏正在运行，则暂停游戏
        if (this._uiPauseCount === 1 && this._currentState === GameState.PLAYING) {
            this.pauseGame(PauseType.SCENE);
        }
        
        LogMgr.Ins.debug(`[${this.Name}] UI暂停，计数器: ${this._uiPauseCount}`);
    }

    /**
     * UI恢复 - 用于多层UI界面的恢复管理
     * 每次调用会减少计数器，当计数器为0时游戏恢复
     */
    public resumeUI(): void {
        if (this._uiPauseCount <= 0) {
            LogMgr.Ins.warn(`[${this.Name}] UI暂停计数器已经是0，无法继续减少`);
            return;
        }
        
        this._uiPauseCount--;
        
        // 如果计数器归零，且游戏处于暂停状态，则恢复游戏
        if (this._uiPauseCount === 0 && this._currentState === GameState.PAUSED) {
            this.resumeGame();
        }
        
        LogMgr.Ins.debug(`[${this.Name}] UI恢复，计数器: ${this._uiPauseCount}`);
    }

    /**
     * 获取UI暂停计数器
     */
    public getUIPauseCount(): number {
        return this._uiPauseCount;
    }

    /**
     * 检查是否处于UI暂停状态
     */
    public isUIPaused(): boolean {
        return this._uiPauseCount > 0;
    }

    /**
     * 强制重置UI暂停计数器（用于异常情况）
     */
    public resetUIPauseCount(): void {
        const oldCount = this._uiPauseCount;
        this._uiPauseCount = 0;
        
        // 如果之前有UI暂停，且游戏处于暂停状态，则恢复游戏
        if (oldCount > 0 && this._currentState === GameState.PAUSED) {
            this.resumeGame();
        }
        
        LogMgr.Ins.warn(`[${this.Name}] UI暂停计数器已重置，原计数: ${oldCount}`);
    }

    /**
     * 释放资源
     */
    public release(): void {
        LogMgr.Ins.info(`[${this.Name}] 游戏状态管理器释放资源`);
        this._currentState = GameState.UNINITIALIZED;
        this._previousState = GameState.UNINITIALIZED;
        this._currentPauseType = PauseType.SCENE;
        this._uiPauseCount = 0;
        this._initialized = false;
    }
} 