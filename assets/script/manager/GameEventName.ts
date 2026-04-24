import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

/**
 * 事件名
*/
@ccclass('GameEventName')
export class GameEventName extends Event {

    /** 敌人扣血事件 */
    static FRIGHT_SUBTRACT_BOOLD_EVENT = "fright_subtract_boold_event";

    /** 注册事件 */
    static REGISTER_EVENT = "register_event";
    static GAME_START_EVENT = "game_start_event";

    /** 弹窗事件 */
    static TIPS_EVENT = "tips_event";
    /** 提示事件 */
    static TIPS_STRIP_EVENT = "tips_strip_event";
    
    /** 新手引导 */
    static GUIDANCE_NEW_HAND_OPEN_EVENT = "guidance_new_hand_open_event";
    static GUIDANCE_NEW_HAND_CLOSE_EVENT = "guidance_new_hand_close_event";

    /** 通关结算播放 */
    static CHAPTER_RESULT_PLAY_EVENT = "chapter_result_play_event";
    /** 关闭通关结算界面 */
    static CHAPTER_RESULT_CLOSE_EVENT = "chapter_result_close_event";
    /** 通关结算播放完毕 */ 
    static CHAPTER_RESULT_PLAY_OVER_EVENT = "chapter_result_play_over";
    
    private customProperty:any;
    constructor(customProperty:any){
        super(customProperty);
        this.customProperty = customProperty;
    }

    getCustomProperty():any
    {
        return this.customProperty;
    }
}


