import { _decorator, Component, Node, input, Input, EventKeyboard, KeyCode, game } from "cc";
import { GameStateMgr, GameState } from "./GameStateMgr";
import { EventMgr } from "./EventMgr";
import { FrameEvents } from "../FrameConfig/FrameEvents";
import { LogMgr } from "./LogMgr";

const { ccclass, property } = _decorator;

/**
 * 游戏控制器
 * 负责管理游戏的整体逻辑和状态转换
 * 处理键盘输入、游戏循环等核心功能
 * example:
 * 1. 场景暂停（推荐用于游戏内暂停）
 * GameStateMgr.Ins.pauseScene();

 * 2. 全局暂停（推荐用于应用切换）
 * GameStateMgr.Ins.pauseGlobal();

 * 3. 自定义暂停（可扩展）
 * GameStateMgr.Ins.pauseCustom();

 * 4. 恢复游戏
 * GameStateMgr.Ins.resumeGame();
 */
@ccclass('GameController')
export class GameController extends Component {

    @property
    enableKeyboardControl: boolean = true;

    @property
    pauseKey: KeyCode = KeyCode.ESCAPE;

    @property
    restartKey: KeyCode = KeyCode.KEY_R;

    private _isInitialized: boolean = false;
    private _gameStartTime: number = 0;
    private _gamePlayTime: number = 0;
    private _lastUpdateTime: number = 0;

    onLoad() {
        this.init();
    }

    onDestroy() {
        this.cleanup();
    }

    /**
     * 初始化游戏控制器
     */
    private init(): void {
        if (this._isInitialized) {
            return;
        }

        this._isInitialized = true;
        this._gameStartTime = Date.now();
        this._lastUpdateTime = Date.now();

        // 注册键盘输入监听
        if (this.enableKeyboardControl) {
            this.registerKeyboardInput();
        }

        // 注册游戏状态事件监听
        this.registerGameStateEvents();

        // 开始游戏
        this.startGame();

        LogMgr.Ins.info('[GameController] 游戏控制器初始化完成');
    }

    /**
     * 注册键盘输入监听
     */
    private registerKeyboardInput(): void {
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
    }

    /**
     * 注册游戏状态事件监听
     */
    private registerGameStateEvents(): void {
        EventMgr.Ins.on(FrameEvents.GAME_STARTED, this.onGameStarted, this);
        EventMgr.Ins.on(FrameEvents.GAME_PAUSED, this.onGamePaused, this);
        EventMgr.Ins.on(FrameEvents.GAME_RESUMED, this.onGameResumed, this);
        EventMgr.Ins.on(FrameEvents.GAME_ENDED, this.onGameEnded, this);
        EventMgr.Ins.on(FrameEvents.GAME_VICTORY, this.onGameVictory, this);
    }

    /**
     * 清理资源
     */
    private cleanup(): void {
        if (this.enableKeyboardControl) {
            input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        }

        EventMgr.Ins.off(FrameEvents.GAME_STARTED, this.onGameStarted, this);
        EventMgr.Ins.off(FrameEvents.GAME_PAUSED, this.onGamePaused, this);
        EventMgr.Ins.off(FrameEvents.GAME_RESUMED, this.onGameResumed, this);
        EventMgr.Ins.off(FrameEvents.GAME_ENDED, this.onGameEnded, this);
        EventMgr.Ins.off(FrameEvents.GAME_VICTORY, this.onGameVictory, this);
    }

    /**
     * 键盘按下事件处理
     */
    private onKeyDown(event: EventKeyboard): void {
        const keyCode = event.keyCode;

        switch (keyCode) {
            case this.pauseKey:
                this.togglePause();
                break;
            case this.restartKey:
                this.restartGame();
                break;
            default:
                break;
        }
    }

    /**
     * 切换暂停状态
     */
    private togglePause(): void {
        if (GameStateMgr.Ins.isGamePaused()) {
            GameStateMgr.Ins.resumeGame();
        } else if (GameStateMgr.Ins.canPause()) {
            GameStateMgr.Ins.pauseGame();
        }
    }

    /**
     * 重新开始游戏
     */
    private restartGame(): void {
        if (GameStateMgr.Ins.isGamePlaying() || GameStateMgr.Ins.isGamePaused()) {
            GameStateMgr.Ins.restartGame();
        }
    }

    /**
     * 开始游戏
     */
    private startGame(): void {
        GameStateMgr.Ins.startGame();
        this._gameStartTime = Date.now();
        this._lastUpdateTime = Date.now();
        LogMgr.Ins.info('[GameController] 游戏开始');
    }

    /**
     * 游戏开始事件处理
     */
    private onGameStarted(): void {
        this._gameStartTime = Date.now();
        this._lastUpdateTime = Date.now();
        LogMgr.Ins.debug('[GameController] 游戏开始事件');
    }

    /**
     * 游戏暂停事件处理
     */
    private onGamePaused(): void {
        LogMgr.Ins.debug('[GameController] 游戏暂停事件');
    }

    /**
     * 游戏恢复事件处理
     */
    private onGameResumed(): void {
        this._lastUpdateTime = Date.now();
        LogMgr.Ins.debug('[GameController] 游戏恢复事件');
    }

    /**
     * 游戏结束事件处理
     */
    private onGameEnded(): void {
        LogMgr.Ins.info('[GameController] 游戏结束事件');
    }

    /**
     * 游戏胜利事件处理
     */
    private onGameVictory(): void {
        LogMgr.Ins.info('[GameController] 游戏胜利事件');
    }

    update(deltaTime: number) {
        if (!this._isInitialized) {
            return;
        }

        // 只在游戏进行中更新游戏时间
        if (GameStateMgr.Ins.isGamePlaying()) {
            const currentTime = Date.now();
            const delta = currentTime - this._lastUpdateTime;
            this._gamePlayTime += delta;
            this._lastUpdateTime = currentTime;
        }

        // 游戏逻辑更新
        this.updateGameLogic(deltaTime);
    }

    /**
     * 更新游戏逻辑
     */
    private updateGameLogic(deltaTime: number): void {
        // 这里可以添加具体的游戏逻辑更新
        // 例如：更新游戏对象、检查游戏条件等

        // 示例：检查游戏胜利条件
        this.checkVictoryCondition();

        // 示例：检查游戏失败条件
        this.checkGameOverCondition();
    }

    /**
     * 检查胜利条件
     */
    private checkVictoryCondition(): void {
        // 这里实现具体的胜利条件检查
        // 例如：达到特定分数、完成特定任务等
    }

    /**
     * 检查游戏失败条件
     */
    private checkGameOverCondition(): void {
        // 这里实现具体的失败条件检查
        // 例如：生命值归零、时间耗尽等
    }

    /**
     * 获取游戏进行时间（毫秒）
     */
    public getGamePlayTime(): number {
        return this._gamePlayTime;
    }

    /**
     * 获取游戏进行时间（秒）
     */
    public getGamePlayTimeSeconds(): number {
        return Math.floor(this._gamePlayTime / 1000);
    }

    /**
     * 获取游戏开始时间戳
     */
    public getGameStartTime(): number {
        return this._gameStartTime;
    }

    /**
     * 暂停游戏
     */
    public pauseGame(): void {
        if (GameStateMgr.Ins.canPause()) {
            GameStateMgr.Ins.pauseGame();
        }
    }

    /**
     * 恢复游戏
     */
    public resumeGame(): void {
        if (GameStateMgr.Ins.canResume()) {
            GameStateMgr.Ins.resumeGame();
        }
    }

    /**
     * 结束游戏
     */
    public endGame(): void {
        GameStateMgr.Ins.endGame();
    }

    /**
     * 游戏胜利
     */
    public victory(): void {
        GameStateMgr.Ins.victory();
    }

    /**
     * 检查游戏是否暂停
     */
    public isGamePaused(): boolean {
        return GameStateMgr.Ins.isGamePaused();
    }

    /**
     * 检查游戏是否正在进行
     */
    public isGamePlaying(): boolean {
        return GameStateMgr.Ins.isGamePlaying();
    }
} 