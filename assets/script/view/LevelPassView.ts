import { _decorator, Component, Node, Label, find, Button, Layout, Sprite } from 'cc';
import { GameCustomEvent } from '../manager/GameCustomEvent';
import { GameEventName } from '../manager/GameEventName';
import { heroStructure } from '../data/GlobalStructure';
import { GlobalData } from '../data/GlobalData';
import { LoadImgTool } from '../tool/LoadImgTool';
import { Layer } from '../manager/Layer';
import { AudioMG } from '../sound/AudioMG';
const { ccclass, property } = _decorator;

/**
 * 关卡通关界面
 */
@ccclass('LevelPassView')
export class LevelPassView extends Component {
    /**
     * 组件
    */
    private lab_doubleHit:Label;
    private lab_allHarm:Label;
    private btn_continue:Button;
    private lay_hero:Layout;
    protected onLoad(): void {
        this._initObect();
        this._onEvent();
    }

    private _initObect() {
        this.lab_doubleHit = find('lab_doubleHit', this.node).getComponent(Label);
        this.lab_allHarm = find('lab_allHarm', this.node).getComponent(Label);
        this.btn_continue = find('btn_continue', this.node).getComponent(Button);
        this.lay_hero = find('lay_hero', this.node).getComponent(Layout);
    }

    private _onEvent() {
        this.btn_continue.node.on(Node.EventType.TOUCH_END, this.continueWaveFun, this);
        GameCustomEvent.Instance.addCustomEvent(GameEventName.LEVER_PASS_EVENT,this.freshLevelPass,this);
    }

    start() {
        //预加载
        let pathAward = Layer.Instance.getGamePrePath("award");
        LoadImgTool.Instance.loadPrefab("award",pathAward,Layer.Instance.layerView,false);
    }

    //刷新通关显示
    freshLevelPass(lpEvent: GameEventName)
    {
        AudioMG.Instance.playSoundAudio("battle_win","battle_win");
        
        this.hideAllHero();

        this.lab_doubleHit.string = "" + lpEvent.getCustomProperty().doubleHit;
        // this.lab_allHarm.string = "连击伤害 " + lpEvent.getCustomProperty().allHarm;
        var heroPromoteArr:Array<heroStructure> = [];
        for(var h:number = 0;h < lpEvent.getCustomProperty().heroArr.length;h++)
        {
            if(lpEvent.getCustomProperty().heroArr[h].heroType != 0)
            {
                heroPromoteArr.push(lpEvent.getCustomProperty().heroArr[h]);
            }
        }

        //增加翻牌的英雄数
        var heroChangeCount:number = 0;
        //第一个关卡通关时，没有上一关卡数据
        if(GlobalData.Instance.gameRecord.levelHeroArr.length <= 0)
        {
            //当前关卡的英雄数据
            for(var hpa:number = 0;hpa < heroPromoteArr.length;hpa++)
            {
                if(heroPromoteArr[hpa].promoteTotal != 0)
                {
                    heroChangeCount++;
                    this.lay_hero.node.getChildByName("hero"+heroChangeCount).active = true;
                    //英雄名
                    this.lay_hero.node.getChildByName("hero"+heroChangeCount).getChildByName("lab_heroName").getComponent(Label).string = heroPromoteArr[hpa].heroName;
                    //英雄翻牌次数变化
                    this.lay_hero.node.getChildByName("hero"+heroChangeCount).getChildByName("lab_promote").getComponent(Label).string = 
                        "0→" + heroPromoteArr[hpa].promoteTotal;
                    //英雄头像
                    LoadImgTool.Instance.loadSpriteFrame(heroPromoteArr[hpa].heroHeadImgPath,
                        this.lay_hero.node.getChildByName("hero"+heroChangeCount).getChildByName("icon_heroHead").getComponent(Sprite).node);
                }
            }
        }else{
            //当前关卡的英雄数据
            for(var hpa:number = 0;hpa < heroPromoteArr.length;hpa++)
            {
                //上一关卡的英雄数据
                for(var lha:number = 0;lha < GlobalData.Instance.gameRecord.levelHeroArr.length;lha++)
                {
                    //无翻牌增加时，不做记录
                    if(heroPromoteArr[hpa].heroID == GlobalData.Instance.gameRecord.levelHeroArr[lha].heroID && 
                        heroPromoteArr[hpa].promoteTotal > GlobalData.Instance.gameRecord.levelHeroArr[lha].promoteTotal)
                    {
                        heroChangeCount++;
                        this.lay_hero.node.getChildByName("hero"+heroChangeCount).active = true;
                        //英雄名
                        this.lay_hero.node.getChildByName("hero"+heroChangeCount).getChildByName("lab_heroName").getComponent(Label).string = heroPromoteArr[hpa].heroName;
                        //英雄翻牌次数变化
                        this.lay_hero.node.getChildByName("hero"+heroChangeCount).getChildByName("lab_promote").getComponent(Label).string = 
                            "" + GlobalData.Instance.gameRecord.levelHeroArr[lha].promoteTotal + "→" + heroPromoteArr[hpa].promoteTotal;
                        console.log("原翻牌次数：",GlobalData.Instance.gameRecord.levelHeroArr[lha].promoteTotal,
                            "新增翻牌次数：",heroPromoteArr[hpa].promoteTotal);
                        //英雄头像
                        LoadImgTool.Instance.loadSpriteFrame(heroPromoteArr[hpa].heroHeadImgPath,
                            this.lay_hero.node.getChildByName("hero"+heroChangeCount).getChildByName("icon_heroHead").getComponent(Sprite).node);
                        break;
                    }
                }
            }
        }
    }

    //隐藏所有英雄显示
    hideAllHero()
    {
        for(var hideHero:number = 1;hideHero < 8;hideHero++)
        {
            this.lay_hero.node.getChildByName("hero"+hideHero).active = false;
        }
    }

    continueWaveFun()
    {
        //弹出奖励页面
        Layer.Instance.show("award",Layer.Instance.layerView);
        //发送奖励列表
        let aEvent = new GameEventName({ openState: 1, awardList:[] });
        GameCustomEvent.Instance.node.emit(GameEventName.AWARD_EVENT,aEvent);

        this.closeView();
    }

    closeView()
    {
        this.node.active = false;
    }

    update(deltaTime: number) {
        
    }
}


