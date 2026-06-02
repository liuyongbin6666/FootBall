import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

/**
 * 事件名
*/
@ccclass('GameEventName')
export class GameEventName {
    /** 大厅事件 */
    static HALL_EVENT = "hall_event";

    /** 战斗中碰撞事件 */
    static FIGHT_COLLISION_EVENT = "fight_collision_event";
    /** 战斗中其他界面传递事件 */
    static FIGHT_OTHER_VIEW_EVENT = "fight_other_view_event";
    /** 任务面板事件 */
    static TASK_EVENT = "task_event";

    /** 刷新酒馆选卡 */
    static AMPLIFICATION_CARD_FRESH_EVENT = "amplification_card_fresh_event";
    /** 奖励页面 */
    static AWARD_EVENT = "award_event";
    /** 通关关卡界面 */
    static LEVER_PASS_EVENT = "level_pass_event";
    /** 通关章节结算排行界面 */
    static CHAPTER_RANK_EVENT = "chapter_rank_event";
    /** 英雄动作 */
    static HERO_SKE_EVENT = "hero_ske_event";

    /** 注册事件 */
    static REGISTER_EVENT = "register_event";

    /** 弹窗事件 */
    static TIPS_EVENT = "tips_event";
    /** 提示事件 */
    static TIPS_STRIP_EVENT = "tips_strip_event";
    
    /** 新手引导 */
    static GUIDANCE_NEW_HAND_OPEN_EVENT = "guidance_new_hand_open_event";
    static GUIDANCE_NEW_HAND_CLOSE_EVENT = "guidance_new_hand_close_event";
    
    /** 英雄相关事件 */
    static BATTLE_HERO_STATE_HERO_UPDATE_EVENT = "battle_hero_state_hero_update_event";
    
    private customProperty:any;
    constructor(customProperty:any){
        // super(customProperty);
        this.customProperty = customProperty;
    }

    getCustomProperty():any
    {
        return this.customProperty;
    }
}


