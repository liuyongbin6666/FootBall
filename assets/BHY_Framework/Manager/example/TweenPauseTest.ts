import { _decorator, Component, Node, Button, Label, Sprite, Color, tween, Vec3 } from "cc";
import { GameStateMgr, GameState, PauseType } from "../GameStateMgr";
import { EventMgr } from "../EventMgr";
import { FrameEvents } from "../../FrameConfig/FrameEvents";
import { LogMgr } from "../LogMgr";

const { ccclass, property } = _decorator;

/**
 * Tween动画暂停测试组件
 * 验证不同暂停类型对tween动画的影响
 */
@ccclass('TweenPauseTest')
export class TweenPauseTest extends Component {
    
    @property(Button)
    scenePauseButton: Button = null;
    
    @property(Button)
    globalPauseButton: Button = null;
    
    @property(Button)
    resumeButton: Button = null;
    
    @property(Button)
    startTweenButton: Button = null;
    
    @property(Label)
    statusLabel: Label = null;
    
    @property(Sprite)
    tweenSprite: Sprite = null;
    
    @property(Sprite)
    rotationSprite: Sprite = null;
    
    @property(Sprite)
    scaleSprite: Sprite = null;
    
    private _positionTween: any = null;
    private _rotationTween: any = null;
    private _scaleTween: any = null;
    private _isTweenRunning: boolean = false;

    onLoad() {
        this.init();
    }

    onDestroy() {
        this.cleanup();
    }

    /**
     * 初始化测试
     */
    private init(): void {
        // 注册事件监听
        this.registerEvents();
        
        // 初始化UI
        this.initUI();
        
        // 确保游戏状态为PLAYING，这样才能进行暂停操作
        if (GameStateMgr.Ins.getCurrentState() !== GameState.PLAYING) {
            GameStateMgr.Ins.startGame();
        }
        
        LogMgr.Ins.info('[TweenPauseTest] Tween暂停测试初始化完成');
    }

    /**
     * 注册事件监听
     */
    private registerEvents(): void {
        EventMgr.Ins.on(FrameEvents.GAME_PAUSED, this.onGamePaused, this);
        EventMgr.Ins.on(FrameEvents.GAME_RESUMED, this.onGameResumed, this);
        EventMgr.Ins.on(FrameEvents.GAME_STATE_CHANGED, this.onGameStateChanged, this);
    }

    /**
     * 清理资源
     */
    private cleanup(): void {
        EventMgr.Ins.off(FrameEvents.GAME_PAUSED, this.onGamePaused, this);
        EventMgr.Ins.off(FrameEvents.GAME_RESUMED, this.onGameResumed, this);
        EventMgr.Ins.off(FrameEvents.GAME_STATE_CHANGED, this.onGameStateChanged, this);
        
        // 停止所有tween
        this.stopAllTweens();
    }

    /**
     * 初始化UI
     */
    private initUI(): void {
        // 设置按钮点击事件
        if (this.scenePauseButton) {
            this.scenePauseButton.node.on(Button.EventType.CLICK, this.onScenePauseClicked, this);
        }
        
        if (this.globalPauseButton) {
            this.globalPauseButton.node.on(Button.EventType.CLICK, this.onGlobalPauseClicked, this);
        }
        
        if (this.resumeButton) {
            this.resumeButton.node.on(Button.EventType.CLICK, this.onResumeClicked, this);
        }
        
        if (this.startTweenButton) {
            this.startTweenButton.node.on(Button.EventType.CLICK, this.onStartTweenClicked, this);
        }

        this.updateStatusLabel();
    }

    /**
     * 游戏暂停事件处理
     */
    private onGamePaused(pauseType: PauseType): void {
        this.updateStatusLabel();
        
        // 根据暂停类型改变精灵颜色
        if (this.tweenSprite) {
            switch (pauseType) {
                case PauseType.SCENE:
                    this.tweenSprite.color = Color.YELLOW;
                    break;
                case PauseType.GLOBAL:
                    this.tweenSprite.color = Color.RED;
                    break;
            }
        }
        
        LogMgr.Ins.debug(`[TweenPauseTest] 游戏暂停，类型: ${pauseType}，Tween状态: ${this._isTweenRunning ? '运行中' : '已停止'}`);
    }

    /**
     * 游戏恢复事件处理
     */
    private onGameResumed(): void {
        // 恢复精灵颜色
        if (this.tweenSprite) {
            this.tweenSprite.color = Color.WHITE;
        }
        
        this.updateStatusLabel();
        
        LogMgr.Ins.debug('[TweenPauseTest] 游戏恢复，Tween将继续运行');
    }

    /**
     * 游戏状态改变事件处理
     */
    private onGameStateChanged(newState: GameState, oldState: GameState): void {
        this.updateButtonStates();
        LogMgr.Ins.debug(`[TweenPauseTest] 游戏状态改变: ${oldState} -> ${newState}`);
    }

    /**
     * 场景暂停按钮点击事件
     */
    private onScenePauseClicked(): void {
        if (GameStateMgr.Ins.canPause()) {
            GameStateMgr.Ins.pauseScene();
        }
    }

    /**
     * 全局暂停按钮点击事件
     */
    private onGlobalPauseClicked(): void {
        if (GameStateMgr.Ins.canPause()) {
            GameStateMgr.Ins.pauseGlobal();
        }
    }

    /**
     * 恢复按钮点击事件
     */
    private onResumeClicked(): void {
        if (GameStateMgr.Ins.canResume()) {
            GameStateMgr.Ins.resumeGame();
        }
    }

    /**
     * 开始Tween按钮点击事件
     */
    private onStartTweenClicked(): void {
        if (this._isTweenRunning) {
            this.stopAllTweens();
        } else {
            this.startAllTweens();
        }
    }

    /**
     * 开始所有Tween动画
     */
    private startAllTweens(): void {
        if (!this.tweenSprite || !this.rotationSprite || !this.scaleSprite) {
            LogMgr.Ins.warn('[TweenPauseTest] 缺少必要的Sprite组件');
            return;
        }

        // 位置动画 - 左右移动
        this._positionTween = tween(this.tweenSprite.node)
            .to(2, { position: new Vec3(200, 0, 0) })
            .to(2, { position: new Vec3(-200, 0, 0) })
            .union()
            .repeatForever()
            .start();

        // 旋转动画
        this._rotationTween = tween(this.rotationSprite.node)
            .by(3, { angle: 360 })
            .repeatForever()
            .start();

        // 缩放动画
        this._scaleTween = tween(this.scaleSprite.node)
            .to(1, { scale: new Vec3(1.5, 1.5, 1.5) })
            .to(1, { scale: new Vec3(0.5, 0.5, 0.5) })
            .union()
            .repeatForever()
            .start();

        this._isTweenRunning = true;
        this.updateStatusLabel();
        
        LogMgr.Ins.info('[TweenPauseTest] 开始所有Tween动画');
    }

    /**
     * 停止所有Tween动画
     */
    private stopAllTweens(): void {
        if (this._positionTween) {
            this._positionTween.stop();
            this._positionTween = null;
        }
        
        if (this._rotationTween) {
            this._rotationTween.stop();
            this._rotationTween = null;
        }
        
        if (this._scaleTween) {
            this._scaleTween.stop();
            this._scaleTween = null;
        }

        this._isTweenRunning = false;
        this.updateStatusLabel();
        
        LogMgr.Ins.info('[TweenPauseTest] 停止所有Tween动画');
    }

    /**
     * 更新状态标签
     */
    private updateStatusLabel(): void {
        if (this.statusLabel) {
            const gameState = GameStateMgr.Ins.getCurrentState();
            const pauseType = GameStateMgr.Ins.getCurrentPauseType();
            const tweenStatus = this._isTweenRunning ? '运行中' : '已停止';
            
            this.statusLabel.string = `游戏状态: ${this.getStateText(gameState)}\n暂停类型: ${this.getPauseTypeText(pauseType)}\nTween状态: ${tweenStatus}`;
        }
    }

    /**
     * 更新按钮状态
     */
    private updateButtonStates(): void {
        const canPause = GameStateMgr.Ins.canPause();
        const canResume = GameStateMgr.Ins.canResume();
        
        if (this.scenePauseButton) {
            this.scenePauseButton.interactable = canPause;
        }
        
        if (this.globalPauseButton) {
            this.globalPauseButton.interactable = canPause;
        }
        
        if (this.resumeButton) {
            this.resumeButton.interactable = canResume;
        }
        
        if (this.startTweenButton) {
            this.startTweenButton.interactable = true;
            this.startTweenButton.getComponentInChildren(Label).string = this._isTweenRunning ? '停止Tween' : '开始Tween';
        }
    }

    /**
     * 获取状态文本
     */
    private getStateText(state: GameState): string {
        switch (state) {
            case GameState.PLAYING:
                return "游戏中";
            case GameState.PAUSED:
                return "暂停中";
            default:
                return "其他状态";
        }
    }

    /**
     * 获取暂停类型文本
     */
    private getPauseTypeText(pauseType: PauseType): string {
        switch (pauseType) {
            case PauseType.SCENE:
                return "场景暂停";
            case PauseType.GLOBAL:
                return "全局暂停";
            case PauseType.CUSTOM:
                return "自定义暂停";
            default:
                return "无暂停";
        }
    }

    /**
     * 测试场景暂停（用于演示）
     */
    public testScenePause(): void {
        this.onScenePauseClicked();
    }

    /**
     * 测试全局暂停（用于演示）
     */
    public testGlobalPause(): void {
        this.onGlobalPauseClicked();
    }

    /**
     * 测试恢复（用于演示）
     */
    public testResume(): void {
        this.onResumeClicked();
    }

    /**
     * 测试开始Tween（用于演示）
     */
    public testStartTween(): void {
        this.onStartTweenClicked();
    }
} 