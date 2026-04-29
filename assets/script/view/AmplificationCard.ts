import { _decorator, Button, Component, find, Label, Node, Sprite } from 'cc';
import { GameCustomEvent } from '../manager/GameCustomEvent';
import { GameEventName } from '../manager/GameEventName';
import { GlobalData } from '../data/GlobalData';
import { ampCardProTableStructure, heroStructure } from '../data/GlobalStructure';
import { LoadImgTool } from '../tool/LoadImgTool';
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
        this.btn_card1.node.on(Node.EventType.TOUCH_END, this.selectHeroCard, this);
        this.btn_card2.node.on(Node.EventType.TOUCH_END, this.selectHeroCard, this);
        this.btn_card3.node.on(Node.EventType.TOUCH_END, this.selectHeroCard, this);
        this.btn_getAll.node.on(Node.EventType.TOUCH_END, this.getAllCard, this);
        this.btn_fresh.node.on(Node.EventType.TOUCH_END, this.freshCard, this);
    }

    start() {
        this.drawHeroCard(this.btn_card1.node);
        this.drawHeroCard(this.btn_card2.node);
        this.drawHeroCard(this.btn_card3.node);
    }

    selectHeroCard(e)
    {
        //发送单个英雄选择
        // let ampCardEvent = new GameEventName({ eventCode: 1,result:sHeroarr[0] });
        // GameCustomEvent.Instance.node.emit(GameEventName.AMPLIFICATION_CARD_RESULT_EVENT,ampCardEvent);
        this.closeView();
    }

    //获得全部卡牌
    getAllCard()
    {
        //看广告
        //发送全部英雄选择
        // let ampCardEvent = new GameEventName({ eventCode: 1,result:sHeroarr });
        // GameCustomEvent.Instance.node.emit(GameEventName.AMPLIFICATION_CARD_RESULT_EVENT,ampCardEvent);
        this.closeView();
    }

    //刷新卡牌
    freshCard()
    {
        //看广告
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
        //该品级已解锁所有英雄（目前版本默认全解锁）
        var heroQualityArr:Array<heroStructure> = this.findAllLevelHero(heroQuality);
        while(heroQualityArr.length <= 0 && heroQuality > 1)
        {
            //查找上一个品级的英雄解锁情况
            heroQuality--;
            heroQualityArr = [];
            heroQualityArr = this.findAllLevelHero(heroQuality);
        }
        //该品级的满级英雄
        var isTopFull:boolean = true;
        while(isTopFull && heroQuality > 1)
        {
           var topHeroTotal:number = 0;
            //检查该品级的所有英雄属性和技能是否都已叠满
            for(var tps:number = 0;tps < heroQualityArr.length;tps++)
            {
                if(heroQualityArr[tps].propertyTopArr.length > 5)
                {
                    topHeroTotal++;
                }
            }
            if(topHeroTotal >= heroQualityArr.length)
            {
                isTopFull = true;
                //查找上一个品级的英雄解锁情况
                heroQuality--;
                heroQualityArr = [];
                heroQualityArr = this.findAllLevelHero(heroQuality);
            }else{
                isTopFull = false;
            }
        }
        if(topHeroTotal >= heroQualityArr.length && heroQuality == 1)
        {
            //若所有白色英雄已满级，且未解锁更高等级的英雄，酒馆显示暂无已上阵英雄可提升
            return;
        }
    
        //提升属性的上阵英雄
        var proJoinHero:heroStructure;
        var isJoin:boolean = false;
        //随机该品级英雄
        var rqHero:number = Math.floor(Math.random() * heroQualityArr.length);
        // if(heroQualityArr[rqHero].propertyTopArr.length > 5)
        // {
        //     //若所有属性和技能都已叠满，添加到满级英雄中记录
        //     GlobalData.Instance.topHeroArr.push(rqHero);
        // }
        //判断该英雄是否已上阵
        for(var findJoinHero:number = 0;findJoinHero < GlobalData.Instance.joinHeroArr.length;findJoinHero++)
        {
            if(GlobalData.Instance.joinHeroArr[findJoinHero].heroID == heroQualityArr[rqHero].heroID)
            {
                isJoin = true;
                if(GlobalData.Instance.joinHeroArr[findJoinHero].propertyTopArr.length > 5)
                {
                    //若所有属性和技能都已叠满，重新随机其他英雄
                }
                proJoinHero = GlobalData.Instance.joinHeroArr[findJoinHero];
                //英雄名
                cardNode.getChildByName("lab_heroName").getComponent(Label).string = proJoinHero.heroName;
                //英雄头像
                LoadImgTool.Instance.loadSpriteFrame(proJoinHero.heroImgPath,
                    cardNode.getChildByName("mask_headPortrait").getChildByName("headPortrait").getComponent(Sprite).node);
                break;
            }
        }
        if(isJoin)
        {
            //提升范围 白色英雄没有技能
            var proMax:number = 4;
            if(heroQuality > 1)
            {
                proMax = 5;
            }
            //已经提升到顶级的属性/技能
            var topPromote:boolean = true;
            //随机提升 1 攻击 2 暴击 3 会心 4 HP 5 解锁/升级技能
            var promote:number = 1;
            while(topPromote == false)
            {
                topPromote = false;
                promote = Math.floor(Math.random() * proMax) + 1;
                for(var tp:number = 0;tp < proJoinHero.propertyTopArr.length;tp++)
                {
                    if(proJoinHero.propertyTopArr[tp] == promote)
                    {
                        topPromote = true;
                        break;
                    }
                }
            }
            if(promote < 5)
            {
                //属性成长
                for(var hpgu:number = 0;hpgu < GlobalData.Instance.heroProGrowUpTableArr.length;hpgu++)
                {
                    if(GlobalData.Instance.heroProGrowUpTableArr[hpgu].propertyType == promote)
                    {
                        this.cardComposing(cardNode,GlobalData.Instance.heroProGrowUpTableArr[hpgu].propertyIconPath,
                            GlobalData.Instance.heroProGrowUpTableArr[hpgu].propertyName);
                        var proPass:boolean = false;
                        //英雄属性增幅描述
                        for(var gu:number = 0;gu < GlobalData.Instance.heroProGrowUpTableArr[hpgu].growUpArr.length;gu++)
                        {
                            //查找下一级属性等级，所有属性默认初始等级0
                            if((proJoinHero.harmLevel + 1) == GlobalData.Instance.heroProGrowUpTableArr[hpgu].growUpArr[gu].level)
                            {
                                cardNode.getChildByName("layout_skill").getChildByName("lab_describe").getComponent(Label).string = 
                                    GlobalData.Instance.heroProGrowUpTableArr[hpgu].describe;
                                proPass = true;
                                break;
                            }
                        }
                        //若该项属性已叠满，重新随机其他属性增加
                        if(proPass == false)
                        {
                            proJoinHero.propertyTopArr.push(promote);
                        }
                        //若所有属性已叠满，重新随机其他技能增加
                        break;
                    }
                }
            }else{
                //当英雄拥有两个或两个以上的技能
                var skillIndex:number = 0;
                if(proJoinHero.skillArr.length > 1)
                {
                    skillIndex = Math.floor(Math.random() * proJoinHero.skillArr.length);
                }
                var skiPass:boolean = false;
                //在技能表中找到技能
                for(var hs:number = 0;hs < GlobalData.Instance.heroSkillTableArr.length;hs++)
                {
                    if(GlobalData.Instance.heroSkillTableArr[hs].skillID == proJoinHero.skillArr[skillIndex])
                    {
                        this.cardComposing(cardNode,GlobalData.Instance.heroSkillTableArr[hs].skillIconPath,
                            GlobalData.Instance.heroSkillTableArr[hs].skillName
                        )
                        for(var sl:number = 0;sl < GlobalData.Instance.heroSkillTableArr[hs].effectArr.length;sl++)
                        {
                            //查找下一级技能等级，所有技能默认初始等级0
                            if((GlobalData.Instance.heroSkillTableArr[hs].skillLevel + 1) == GlobalData.Instance.heroSkillTableArr[hs].effectArr[sl].level)
                            {
                                skiPass = true;
                                break;
                            }
                        }
                        //描述
                        cardNode.getChildByName("layout_skill").getChildByName("lab_describe").getComponent(Label).string = GlobalData.Instance.heroSkillTableArr[hs].describe;
                    }
                }
                //若该项技能已叠满，重新随机其他技能增加
                if(skiPass == false)
                {
                    proJoinHero.skillTopArr.push(proJoinHero.skillArr[skillIndex]);
                }
                //若所有技能已叠满，重新随机其他技能增加
                proJoinHero.propertyTopArr.push(promote);
            }
        }else{
            //若未上阵，上阵该英雄
            cardNode.getChildByName("layout_skill").getChildByName("icon_skill").getComponent(Sprite).node.active = false;
            //间隔出现
            cardNode.getChildByName("layout_skill").getChildByName("node_temp").active = true;
            cardNode.getChildByName("layout_skill").getChildByName("lab_skillName").getComponent(Label).string = "上阵此英雄";
            //无描述
            cardNode.getChildByName("layout_skill").getChildByName("lab_describe").getComponent(Label).string = "";
        }
    }

    //有属性/技能的显示排布
    cardComposing(cardNode:Node,iconPath:string,psName:string)
    {
        //英雄属性/技能图标
        LoadImgTool.Instance.loadSpriteFrame(iconPath,cardNode.getChildByName("layout_skill").getChildByName("icon_skill").getComponent(Sprite).node);
        cardNode.getChildByName("layout_skill").getChildByName("icon_skill").getComponent(Sprite).node.active = true;
        //间隔隐藏（仅控制间距）
        cardNode.getChildByName("layout_skill").getChildByName("node_temp").getComponent(Sprite).node.active = false;
        //英雄属性名
        cardNode.getChildByName("layout_skill").getChildByName("lab_skillName").getComponent(Label).string = psName;
    }

    //查找当前品级的所有英雄
    findAllLevelHero(heroQua:number):Array<heroStructure>
    {
        var heroQuaArr:Array<heroStructure> = [];
        //判断是否有该品级的英雄
        for(var addHeroPro:number = 0;addHeroPro < GlobalData.Instance.unlockHeroArr.length;addHeroPro++)
        {
            if(GlobalData.Instance.unlockHeroArr[addHeroPro].quality == heroQua)
            {
                heroQuaArr.push(GlobalData.Instance.unlockHeroArr[addHeroPro]);
            }
        }
        return heroQuaArr;
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

    closeView()
    {
        this.node.active = false;
    }

    update(deltaTime: number) {
        
    }
}


