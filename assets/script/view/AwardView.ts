import { _decorator, Button, Component, find, Node, Layout, instantiate, Label, Prefab, Sprite } from 'cc';
import { GameCustomEvent } from '../manager/GameCustomEvent';
import { GameEventName } from '../manager/GameEventName';
import { LoadImgTool } from '../tool/LoadImgTool';
import { GlobalData } from '../data/GlobalData';
const { ccclass, property } = _decorator;

/**
 * 奖励界面
 */
@ccclass('AwardView')
export class AwardView extends Component {
    /**
     * 组件
    */
    @property(Prefab)
    private rankItemPre: Prefab = null;
    private btn_ok:Button;
    //打开方式 0 普通打开 1 通关关卡页面打开
    private openState:number = 0;
    private con_lay_award:Layout;
    protected onLoad(): void {
        this._initObect();
        this._onEvent();
    }
    
    private _initObect() {
        this.con_lay_award = find('scr_award/view/con_lay_award', this.node).getComponent(Layout);
        this.btn_ok = find('btn_ok', this.node).getComponent(Button);
    }

    private _onEvent() {
        this.btn_ok.node.on(Node.EventType.TOUCH_END, this.okFun, this);
        GameCustomEvent.Instance.addCustomEvent(GameEventName.AWARD_EVENT,this.freshAward,this);
    }

    start() {

    }

    //刷新奖励
    freshAward(aEvent: GameEventName)
    {
        this.openState = aEvent.getCustomProperty().openState;
        console.log("收到openState",this.openState);
        switch(aEvent.getCustomProperty().openState)
        {
            case 0:
                break;
            case 1:
                //先加金币
                this.con_lay_award.node.getChildByName("awardItem1").getChildByName("lab_count").getComponent(Label).string = 
                    "x" + aEvent.getCustomProperty().gold;//GlobalData.Instance.gameRecord.getGold
                //再加道具
                //移除所有奖励
                // this.con_lay_award.node.removeAllChildren();
                // for(var a:number = 0;a < aEvent.getCustomProperty().awardList;a++)
                // {
                //     let item = instantiate(this.rankItemPre);
                //     item.getChildByName("lab_awardName").getComponent(Label).string = aEvent.getCustomProperty().awardList[a].awardName;
                //     item.getChildByName("lab_count").getComponent(Label).string = "x" + aEvent.getCustomProperty().awardList[a].count;
                //     //奖励图标
                //     LoadImgTool.Instance.loadSpriteFrame(aEvent.getCustomProperty().awardList[a].awardImgPath,
                //         item.getChildByName("icon_award").getComponent(Sprite).node);
                //     this.con_lay_award.node.addChild(item);
                // }
                break;
        }
    }

    okFun()
    {
        if(this.openState == 1)
        {
            let cwEvent = new GameEventName({ eventCode: 6 });
            GameCustomEvent.Instance.node.emit(GameEventName.FIGHT_OTHER_VIEW_EVENT,cwEvent);
        }
        this.closeView();
    }

    closeView()
    {
        this.node.active = false;
    }

    update(deltaTime: number) {
    }
}


