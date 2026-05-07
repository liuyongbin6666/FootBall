import { _decorator, Component, Node, Button, Label, Sprite, Color } from "cc";
import { GameStateMgr, GameState } from "../GameStateMgr";
import { GameController } from "../GameController";
import { EventMgr } from "../EventMgr";
import { FrameEvents } from "../../FrameConfig/FrameEvents";
import { LogMgr } from "../LogMgr";

const { ccclass, property } = _decorator;

/**
 * 游戏暂停系统使用示例
 * 展示如何在游戏中使用暂停功能
 */
@ccclass('GamePauseExample')
export class GamePauseExample extends Component {
    
    @property(Button)
    pauseButton: Button = null;
    
    @property(Button)
    resumeButton: Button = null;
    
    @property(Button)
    restartButton: Button = null;
    
    @property(Label)
    gameTimeLabel: Label = null;
    
    @property(Label)
    gameStateLabel: Label = null;
    
    @property(Sprite)
    playerSprite: Sprite = null;
    
    @property(Node)
    pausePanel: Node = null;
    
    private _gameController: GameController = null;
    private _playerSpeed: number = 100;
    private _playerDirection: number = 1;

    onLoad() {
        this.init();
    }

    onDestroy() {
        this.cleanup();
    }

    /**
     * 初始化示例
     */
    private init(): void {
        // 获取游戏控制器组件
        this._gameController = this.getComponent(GameController);
        if (!this._gameController) {
            this._gameController = this.addComponent(GameController);
        }

        // 注册事件监听
        this.registerEvents();
        
        // 初始化UI
        this.initUI();
        
        // 确保游戏状态为PLAYING，这样才能进行暂停操作
        if (GameStateMgr.Ins.getCurrentState() !== GameState.PLAYING) {
            GameStateMgr.Ins.startGame();
        }
        
        LogMgr.Ins.info('[GamePauseExample] 游戏暂停示例初始化完成');
    }

    /**
     * 注册事件监听
     */
    private registerEvents(): void {
        EventMgr.Ins.on(FrameEvents.GAME_STATE_CHANGED, this.onGameStateChanged, this);
        EventMgr.Ins.on(FrameEvents.GAME_PAUSED, this.onGamePaused, this);
        EventMgr.Ins.on(FrameEvents.GAME_RESUMED, this.onGameResumed, this);
    }

    /**
     * 清理资源
     */
    private cleanup(): void {
        EventMgr.Ins.off(FrameEvents.GAME_STATE_CHANGED, this.onGameStateChanged, this);
        EventMgr.Ins.off(FrameEvents.GAME_PAUSED, this.onGamePaused, this);
        EventMgr.Ins.off(FrameEvents.GAME_RESUMED, this.onGameResumed, this);
    }

    /**
     * 初始化UI
     */
    private initUI(): void {
        // 设置按钮点击事件
        if (this.pauseButton) {
            this.pauseButton.node.on(Button.EventType.CLICK, this.onPauseButtonClicked, this);
        }
        
        if (this.resumeButton) {
            this.resumeButton.node.on(Button.EventType.CLICK, this.onResumeButtonClicked, this);
        }
        
        if (this.restartButton) {
            this.restartButton.node.on(Button.EventType.CLICK, this.onRestartButtonClicked, this);
        }

        // 初始化暂停面板
        if (this.pausePanel) {
            this.pausePanel.active = false;
        }
    }

    /**
     * 游戏状态改变事件处理
     */
    private onGameStateChanged(newState: GameState, oldState: GameState): void {
        this.updateGameStateLabel();
        this.updateButtonStates();
        
        LogMgr.Ins.debug(`[GamePauseExample] 游戏状态改变: ${oldState} -> ${newState}`);
    }

    /**
     * 游戏暂停事件处理
     */
    private onGamePaused(): void {
        if (this.pausePanel) {
            this.pausePanel.active = true;
        }
        
        // 改变玩家精灵颜色表示暂停状态
        if (this.playerSprite) {
            this.playerSprite.color = Color.GRAY;
        }
        
        LogMgr.Ins.debug('[GamePauseExample] 游戏暂停');
    }

    /**
     * 游戏恢复事件处理
     */
    private onGameResumed(): void {
        if (this.pausePanel) {
            this.pausePanel.active = false;
        }
        
        // 恢复玩家精灵颜色
        if (this.playerSprite) {
            this.playerSprite.color = Color.WHITE;
        }
        
        LogMgr.Ins.debug('[GamePauseExample] 游戏恢复');
    }

    /**
     * 暂停按钮点击事件
     */
    private onPauseButtonClicked(): void {
        if (GameStateMgr.Ins.canPause()) {
            GameStateMgr.Ins.pauseGame();
        }
    }

    /**
     * 恢复按钮点击事件
     */
    private onResumeButtonClicked(): void {
        if (GameStateMgr.Ins.canResume()) {
            GameStateMgr.Ins.resumeGame();
        }
    }

    /**
     * 重新开始按钮点击事件
     */
    private onRestartButtonClicked(): void {
        if (GameStateMgr.Ins.isGamePlaying() || GameStateMgr.Ins.isGamePaused()) {
            GameStateMgr.Ins.restartGame();
        }
    }

    /**
     * 更新游戏状态标签
     */
    private updateGameStateLabel(): void {
        if (this.gameStateLabel) {
            const state = GameStateMgr.Ins.getCurrentState();
            this.gameStateLabel.string = `游戏状态: ${this.getStateText(state)}`;
        }
    }

    /**
     * 更新按钮状态
     */
    private updateButtonStates(): void {
        if (this.pauseButton) {
            this.pauseButton.interactable = GameStateMgr.Ins.canPause();
        }
        
        if (this.resumeButton) {
            this.resumeButton.interactable = GameStateMgr.Ins.canResume();
        }
        
        if (this.restartButton) {
            this.restartButton.interactable = GameStateMgr.Ins.isGamePlaying() || GameStateMgr.Ins.isGamePaused();
        }
    }

    /**
     * 获取状态文本
     */
    private getStateText(state: GameState): string {
        switch (state) {
            case GameState.UNINITIALIZED:
                return "未初始化";
            case GameState.LOADING:
                return "加载中";
            case GameState.PLAYING:
                return "游戏中";
            case GameState.PAUSED:
                return "暂停中";
            case GameState.GAME_OVER:
                return "游戏结束";
            case GameState.VICTORY:
                return "胜利";
            default:
                return "未知状态";
        }
    }

    update(deltaTime: number) {
        // 更新游戏时间显示
        this.updateGameTimeLabel();
        
        // 只在游戏进行中更新玩家移动
        if (GameStateMgr.Ins.isGamePlaying()) {
            this.updatePlayerMovement(deltaTime);
        }
    }

    /**
     * 更新游戏时间标签
     */
    private updateGameTimeLabel(): void {
        if (this.gameTimeLabel && this._gameController) {
            const playTime = this._gameController.getGamePlayTimeSeconds();
            const minutes = Math.floor(playTime / 60);
            const seconds = playTime % 60;
            this.gameTimeLabel.string = `游戏时间: ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
    }

    /**
     * 更新玩家移动
     */
    private updatePlayerMovement(deltaTime: number): void {
        if (!this.playerSprite) {
            return;
        }

        // 简单的左右移动示例
        const currentPos = this.playerSprite.node.position;
        const moveDistance = this._playerSpeed * deltaTime;
        
        // 检查边界，改变方向
        if (currentPos.x > 200) {
            this._playerDirection = -1;
        } else if (currentPos.x < -200) {
            this._playerDirection = 1;
        }
        
        // 更新位置
        const newX = currentPos.x + moveDistance * this._playerDirection;
        this.playerSprite.node.setPosition(newX, currentPos.y, currentPos.z);
    }

    /**
     * 手动暂停游戏（用于测试）
     */
    public manualPause(): void {
        this.onPauseButtonClicked();
    }

    /**
     * 手动恢复游戏（用于测试）
     */
    public manualResume(): void {
        this.onResumeButtonClicked();
    }

    /**
     * 手动重新开始游戏（用于测试）
     */
    public manualRestart(): void {
        this.onRestartButtonClicked();
    }
} 