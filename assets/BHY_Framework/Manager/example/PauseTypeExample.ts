import { _decorator, Component, Node, Button, Label, Sprite, Color } from "cc";
import { GameStateMgr, GameState, PauseType } from "../GameStateMgr";
import { EventMgr } from "../EventMgr";
import { FrameEvents } from "../../FrameConfig/FrameEvents";
import { LogMgr } from "../LogMgr";

const { ccclass, property } = _decorator;

/**
 * 暂停类型使用示例
 * 展示不同暂停类型的使用场景和效果
 */
@ccclass('PauseTypeExample')
export class PauseTypeExample extends Component {
    @property(Button)
    scenePauseButton: Button = null;
    
    @property(Button)
    globalPauseButton: Button = null;
    
    @property(Button)
    customPauseButton: Button = null;
    
    @property(Button)
    resumeButton: Button = null;
    
    @property(Label)
    pauseTypeLabel: Label = null;
    
    @property(Label)
    descriptionLabel: Label = null;
    
    @property(Sprite)
    playerSprite: Sprite = null;
    
    @property(Node)
    uiPanel: Node = null;
    
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
        // 注册事件监听
        this.registerEvents();
        
        // 初始化UI
        this.initUI();
        
        // 确保游戏状态为PLAYING，这样才能进行暂停操作
        if (GameStateMgr.Ins.getCurrentState() !== GameState.PLAYING) {
            GameStateMgr.Ins.startGame();
        }
        
        LogMgr.Ins.info('[PauseTypeExample] 暂停类型示例初始化完成');
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
        
        if (this.customPauseButton) {
            this.customPauseButton.node.on(Button.EventType.CLICK, this.onCustomPauseClicked, this);
        }
        
        if (this.resumeButton) {
            this.resumeButton.node.on(Button.EventType.CLICK, this.onResumeClicked, this);
        }

        this.updateDescription();
    }

    /**
     * 游戏暂停事件处理
     */
    private onGamePaused(pauseType: PauseType): void {
        this.updatePauseTypeLabel(pauseType);
        this.updateDescription();
        
        // 根据暂停类型改变玩家精灵颜色
        if (this.playerSprite) {
            switch (pauseType) {
                case PauseType.SCENE:
                    this.playerSprite.color = Color.YELLOW; // 黄色表示场景暂停
                    break;
                case PauseType.GLOBAL:
                    this.playerSprite.color = Color.RED; // 红色表示全局暂停
                    break;
                case PauseType.CUSTOM:
                    this.playerSprite.color = Color.BLUE; // 蓝色表示自定义暂停
                    break;
            }
        }
        
        LogMgr.Ins.debug(`[PauseTypeExample] 游戏暂停，类型: ${pauseType}`);
    }

    /**
     * 游戏恢复事件处理
     */
    private onGameResumed(): void {
        // 恢复玩家精灵颜色
        if (this.playerSprite) {
            this.playerSprite.color = Color.WHITE;
        }
        
        this.updatePauseTypeLabel(null);
        this.updateDescription();
        
        LogMgr.Ins.debug('[PauseTypeExample] 游戏恢复');
    }

    /**
     * 游戏状态改变事件处理
     */
    private onGameStateChanged(newState: GameState, oldState: GameState): void {
        this.updateButtonStates();
        LogMgr.Ins.debug(`[PauseTypeExample] 游戏状态改变: ${oldState} -> ${newState}`);
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
     * 自定义暂停按钮点击事件
     */
    private onCustomPauseClicked(): void {
        if (GameStateMgr.Ins.canPause()) {
            GameStateMgr.Ins.pauseCustom();
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
     * 更新暂停类型标签
     */
    private updatePauseTypeLabel(pauseType: PauseType | null): void {
        if (this.pauseTypeLabel) {
            if (pauseType) {
                this.pauseTypeLabel.string = `暂停类型: ${this.getPauseTypeText(pauseType)}`;
            } else {
                this.pauseTypeLabel.string = "暂停类型: 无";
            }
        }
    }

    /**
     * 更新描述文本
     */
    private updateDescription(): void {
        if (this.descriptionLabel) {
            const pauseType = GameStateMgr.Ins.getCurrentPauseType();
            const description = this.getPauseTypeDescription(pauseType);
            this.descriptionLabel.string = description;
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
        
        if (this.customPauseButton) {
            this.customPauseButton.interactable = canPause;
        }
        
        if (this.resumeButton) {
            this.resumeButton.interactable = canResume;
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
                return "未知";
        }
    }

    /**
     * 获取暂停类型描述
     */
    private getPauseTypeDescription(pauseType: PauseType): string {
        switch (pauseType) {
            case PauseType.SCENE:
                return "场景暂停：\n• 暂停游戏逻辑和物理\n• UI可以继续响应\n• 音频继续播放\n• 适合游戏内暂停菜单";
            case PauseType.GLOBAL:
                return "全局暂停：\n• 暂停所有游戏内容\n• 包括渲染和音频\n• UI也无法响应\n• 适合应用切换时";
            case PauseType.CUSTOM:
                return "自定义暂停：\n• 只暂停特定系统\n• 可扩展自定义逻辑\n• 适合特殊需求";
            default:
                return "游戏运行中";
        }
    }

    update(deltaTime: number) {
        // 只在游戏进行中更新玩家移动
        if (GameStateMgr.Ins.isGamePlaying()) {
            this.updatePlayerMovement(deltaTime);
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
        
        // 更新位置 - 创建新的Vec3对象
        const newX = currentPos.x + moveDistance * this._playerDirection;
        this.playerSprite.node.setPosition(newX, currentPos.y, currentPos.z);
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
     * 测试自定义暂停（用于演示）
     */
    public testCustomPause(): void {
        this.onCustomPauseClicked();
    }

    /**
     * 测试恢复（用于演示）
     */
    public testResume(): void {
        this.onResumeClicked();
    }
} 