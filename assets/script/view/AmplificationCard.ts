import { _decorator, Button, Component, find, Label, Node, Sprite } from 'cc';
import { GameCustomEvent } from '../manager/GameCustomEvent';
import { GameEventName } from '../manager/GameEventName';
import { GlobalData } from '../data/GlobalData';
import { ampCardProTableStructure, heroStructure } from '../data/GlobalStructure';
const { ccclass, property } = _decorator;

@ccclass('AmplificationCard')
export class AmplificationCard extends Component {
    private btn_card1:Button;
    private btn_card2:Button;
    private btn_card3:Button;
    private btn_getAll:Button;
    private btn_fresh:Button;

    private saveAmpCardPro:ampCardProTableStructure = null;
    protected onLoad(): void {
        this._initObect();
        this._onEvent();
    }
    private _initObect() {
        // this.img_frightBg = find('img_frightBg', this.node).getComponent(Sprite);
        // this.node_enemy = find('node_enemy', this.node);
        this.btn_card1 = find('lay_card/btn_card1', this.node).getComponent(Button);
        this.btn_card2 = find('lay_card/btn_card2', this.node).getComponent(Button);
        this.btn_card3 = find('lay_card/btn_card3', this.node).getComponent(Button);
        this.btn_getAll = find('btn_getAll', this.node).getComponent(Button);
        this.btn_fresh = find('btn_fresh', this.node).getComponent(Button);
    }
    
    private _onEvent() {
        // this.btn_close.node.on(Node.EventType.TOUCH_END, this.closeView, this);
        this.btn_getAll.node.on(Node.EventType.TOUCH_END, this.getAllCard, this);
        this.btn_fresh.node.on(Node.EventType.TOUCH_END, this.freshCard, this);
    }

    start() {
        this.drawHeroCard(this.btn_card1.node);
        this.drawHeroCard(this.btn_card2.node);
        this.drawHeroCard(this.btn_card3.node);
    }

    //英雄抽卡
    drawHeroCard(cardNode:Node)
    {
        if(this.saveAmpCardPro == null)
        {
            this.updateAmpCardLevelData();
        }
        //随机品级
        var qualityProbability:number = Math.floor(Math.random() * 100);
        var heroQuality:number = 1;
        var white:number = this.saveAmpCardPro.qualityWhite;
        var green:number = this.saveAmpCardPro.qualityWhite + this.saveAmpCardPro.qualityGreen;
        var blue:number = this.saveAmpCardPro.qualityWhite + this.saveAmpCardPro.qualityGreen + this.saveAmpCardPro.qualityBlue;
        var purple:number = this.saveAmpCardPro.qualityWhite + this.saveAmpCardPro.qualityGreen + this.saveAmpCardPro.qualityBlue + this.saveAmpCardPro.qualityPurple;
        var red:number = this.saveAmpCardPro.qualityWhite + this.saveAmpCardPro.qualityGreen + this.saveAmpCardPro.qualityBlue
            + this.saveAmpCardPro.qualityPurple + this.saveAmpCardPro.qualityRed;
        var yellow:number = this.saveAmpCardPro.qualityWhite + this.saveAmpCardPro.qualityGreen + this.saveAmpCardPro.qualityBlue
            + this.saveAmpCardPro.qualityPurple + this.saveAmpCardPro.qualityRed + this.saveAmpCardPro.qualityYellow;
        if(qualityProbability < white)
        {
            heroQuality = 1;
        }else if(qualityProbability < white && qualityProbability < green)
        {
            heroQuality = 2;
        }else if(qualityProbability >= green && qualityProbability < blue)
        {
            heroQuality = 3;
        }else if(qualityProbability >= blue && qualityProbability < purple && this.saveAmpCardPro.qualityPurple > 0)
        {
            heroQuality = 4;
        }else if(qualityProbability >= purple && qualityProbability < red && this.saveAmpCardPro.qualityRed > 0)
        {
            heroQuality = 5;
        }else if(qualityProbability >= red && qualityProbability < yellow && this.saveAmpCardPro.qualityYellow > 0)
        {
            heroQuality = 6;
        }
        var heroQuaArr:Array<heroStructure> = [];
        //判断是否有该品级的英雄
        for(var addHeroPro:number = 0;addHeroPro < GlobalData.Instance.unlockHeroArr.length;addHeroPro++)
        {
            if(GlobalData.Instance.unlockHeroArr[addHeroPro].quality == heroQuality)
            {
                heroQuaArr.push(GlobalData.Instance.unlockHeroArr[addHeroPro]);
            }
        }
        if(heroQuaArr.length > 0)
        {
            var isJoin:boolean = false;
            //随机该品级英雄
            var rqHero:number = Math.floor(Math.random() * heroQuaArr.length);
            //判断该英雄是否已上阵
            for(var findJoinHero:number = 0;findJoinHero < GlobalData.Instance.joinHeroArr.length;findJoinHero++)
            {
                if(GlobalData.Instance.joinHeroArr[findJoinHero].heroID == heroQuaArr[rqHero].heroID)
                {
                    isJoin = true;
                    break;
                }
            }
            if(isJoin)
            {
                //随机提升攻击、暴击、会心或解锁升级技能
            }else{
                //若未上阵，上阵该英雄
                cardNode.getChildByName("layout_skill").getChildByName("icon_skill").getComponent(Sprite).node.active = false;
                cardNode.getChildByName("layout_skill").getChildByName("node_temp").active = true;
                cardNode.getChildByName("layout_skill").getChildByName("lab_describe").getComponent(Label).string = "上阵此英雄";
            }
        }else{}
    }

    //获得全部卡牌
    getAllCard()
    {
        //看广告
    }

    //刷新卡牌
    freshCard()
    {
        //看广告
        this.drawHeroCard(this.btn_card1.node);
        this.drawHeroCard(this.btn_card2.node);
        this.drawHeroCard(this.btn_card3.node);
    }

    //更新当前抽卡概率数据
    updateAmpCardLevelData()
    {
        //根据酒馆等级，确定最终品级随机概率
        for(var ampLevel:number = 0;ampLevel < GlobalData.Instance.ampCardProTableArr.length;ampLevel++)
        {
            if(GlobalData.Instance.amplificationCardLevel == GlobalData.Instance.ampCardProTableArr[ampLevel].level)
            {
                this.saveAmpCardPro = GlobalData.Instance.ampCardProTableArr[ampLevel];
                break;
            }
        
        }
    }

    update(deltaTime: number) {
        
    }
}


