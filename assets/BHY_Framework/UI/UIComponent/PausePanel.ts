import { _decorator, Component, Node, Button, Label, Animation, tween, Vec3 } from "cc";
import { GameStateMgr, GameState } from "../../Manager/GameStateMgr";
import { EventMgr } from "../../Manager/EventMgr";
import { FrameEvents } from "../../FrameConfig/FrameEvents";
import { LogMgr } from "../../Manager/LogMgr";

const { ccclass, property } = _decorator;

/**
 * 暂停面板组件
 * 提供游戏暂停时的UI界面和交互功能
 */
@ccclass('PausePanel')
export class PausePanel extends Component {
    
    @property(Button)
    resumeButton: Button = null;
    
    @property(Button)
    restartButton: Button = null;
    
    @property(Button)
    settingsButton: Button = null;
    
    @property(Button)
    quitButton: Button = null;
    
    @property(Label)
    titleLabel: Label = null;
    
    @property(Node)
    backgroundNode: Node = null;
    
    @property(Animation)
    panelAnimation: Animation = null;
    
    private _isVisible: boolean = false;
    private _isAnimating: boolean = false;

    onLoad() {
        this.initUI();
        this.registerEvents();
    }

    onDestroy() {
        this.unregisterEvents();
    }

    /**
     * 初始化UI
     */
    private initUI(): void {
        // 设置初始状态为隐藏
        this.node.active = false;
        this._isVisible = false;
        
        // 设置标题
        if (this.titleLabel) {
            this.titleLabel.string = "游戏暂停";
        }
        
        // 初始化按钮状态
        this.updateButtonStates();
    }

    /**
     * 注册事件监听
     */
    private registerEvents(): void {
        // 监听游戏状态变化
        EventMgr.Ins.on(FrameEvents.GAME_PAUSED, this.onGamePaused, this);
        EventMgr.Ins.on(FrameEvents.GAME_RESUMED, this.onGameResumed, this);
        EventMgr.Ins.on(FrameEvents.GAME_STATE_CHANGED, this.onGameStateChanged, this);
    }

    /**
     * 取消事件监听
     */
    private unregisterEvents(): void {
        EventMgr.Ins.off(FrameEvents.GAME_PAUSED, this.onGamePaused, this);
        EventMgr.Ins.off(FrameEvents.GAME_RESUMED, this.onGameResumed, this);
        EventMgr.Ins.off(FrameEvents.GAME_STATE_CHANGED, this.onGameStateChanged, this);
    }

    /**
     * 游戏暂停事件处理
     */
    private onGamePaused(): void {
        this.show();
    }

    /**
     * 游戏恢复事件处理
     */
    private onGameResumed(): void {
        this.hide();
    }

    /**
     * 游戏状态改变事件处理
     */
    private onGameStateChanged(newState: GameState, oldState: GameState): void {
        if (newState === GameState.PAUSED) {
            this.show();
        } else if (oldState === GameState.PAUSED) {
            this.hide();
        }
    }

    /**
     * 显示暂停面板
     */
    public show(): void {
        if (this._isVisible || this._isAnimating) {
            return;
        }

        this._isAnimating = true;
        this.node.active = true;
        
        // 播放显示动画
        if (this.panelAnimation) {
            this.panelAnimation.play('show');
            this.panelAnimation.once(Animation.EventType.FINISHED, () => {
                this._isVisible = true;
                this._isAnimating = false;
            });
        } else {
            // 如果没有动画，直接显示
            this._isVisible = true;
            this._isAnimating = false;
        }
        
        this.updateButtonStates();
        LogMgr.Ins.debug('[PausePanel] 暂停面板显示');
    }

    /**
     * 隐藏暂停面板
     */
    public hide(): void {
        if (!this._isVisible || this._isAnimating) {
            return;
        }

        this._isAnimating = true;
        
        // 播放隐藏动画
        if (this.panelAnimation) {
            this.panelAnimation.play('hide');
            this.panelAnimation.once(Animation.EventType.FINISHED, () => {
                this.node.active = false;
                this._isVisible = false;
                this._isAnimating = false;
            });
        } else {
            // 如果没有动画，直接隐藏
            this.node.active = false;
            this._isVisible = false;
            this._isAnimating = false;
        }
        
        LogMgr.Ins.debug('[PausePanel] 暂停面板隐藏');
    }

    /**
     * 更新按钮状态
     */
    private updateButtonStates(): void {
        const canResume = GameStateMgr.Ins.canResume();
        const canRestart = GameStateMgr.Ins.isGamePlaying() || GameStateMgr.Ins.isGamePaused();
        
        if (this.resumeButton) {
            this.resumeButton.interactable = canResume;
        }
        
        if (this.restartButton) {
            this.restartButton.interactable = canRestart;
        }
    }

    /**
     * 恢复游戏按钮点击事件
     */
    public onResumeButtonClicked(): void {
        if (!GameStateMgr.Ins.canResume()) {
            LogMgr.Ins.warn('[PausePanel] 当前状态无法恢复游戏');
            return;
        }
        
        GameStateMgr.Ins.resumeGame();
        LogMgr.Ins.debug('[PausePanel] 点击恢复游戏按钮');
    }

    /**
     * 重新开始按钮点击事件
     */
    public onRestartButtonClicked(): void {
        if (!GameStateMgr.Ins.isGamePlaying() && !GameStateMgr.Ins.isGamePaused()) {
            LogMgr.Ins.warn('[PausePanel] 当前状态无法重新开始游戏');
            return;
        }
        
        GameStateMgr.Ins.restartGame();
        LogMgr.Ins.debug('[PausePanel] 点击重新开始按钮');
    }

    /**
     * 设置按钮点击事件
     */
    public onSettingsButtonClicked(): void {
        // 这里可以打开设置面板
        EventMgr.Ins.emit(FrameEvents.OPEN_PANEL, 'SettingsPanel');
        LogMgr.Ins.debug('[PausePanel] 点击设置按钮');
    }

    /**
     * 退出按钮点击事件
     */
    public onQuitButtonClicked(): void {
        // 这里可以退出到主菜单或退出游戏
        EventMgr.Ins.emit('QUIT_TO_MAIN_MENU');
        LogMgr.Ins.debug('[PausePanel] 点击退出按钮');
    }

    /**
     * 检查面板是否可见
     */
    public isVisible(): boolean {
        return this._isVisible;
    }

    /**
     * 检查面板是否正在动画中
     */
    public isAnimating(): boolean {
        return this._isAnimating;
    }
} 