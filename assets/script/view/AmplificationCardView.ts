import { _decorator, Button, Component, find, Label, Node, Sprite } from 'cc';
import { GameCustomEvent } from '../manager/GameCustomEvent';
import { GameEventName } from '../manager/GameEventName';
import { GlobalData } from '../data/GlobalData';
import { ampCardProTableStructure, heroStructure, cardAddProStructure, heroProTopStructure } from '../data/GlobalStructure';
import { LoadImgTool } from '../tool/LoadImgTool';
import { OperationTool } from '../tool/OperationTool';
import { CharacterTool } from '../tool/CharacterTool';
const { ccclass, property } = _decorator;

/**
 * 酒馆界面
 */
@ccclass('AmplificationCardView')
export class AmplificationCardView extends Component {
    private btn_card1:Button;
    private btn_card2:Button;
    private btn_card3:Button;
    private btn_getAll:Button;
    private btn_fresh:Button;

    //已经生成上阵的英雄（避免3张牌同时出现同1个英雄上阵）
    private cardjoinHeroArr:Array<number> = [];
    //已经生成提升的英雄属性（避免3张牌同时出现提升同1个英雄同1个属性）
    private cardProHeroArr:Array<cardAddProStructure> = [];
    //酒馆等级对应的抽奖概率
    private saveAmpCardPro:ampCardProTableStructure = null;
    //临时存储随机生成的卡数据
    private produceCardArr:Array<cardAddProStructure> = [];
    protected onLoad(): void {
        this._initObect();
        this._onEvent();
    }
    private _initObect() {
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
        GameCustomEvent.Instance.addCustomEvent(GameEventName.AMPLIFICATION_CARD_FRESH_EVENT,this.freshThreeCard,this);
    }

    start() {
        //初始化卡牌结构，模拟数据
        var cap1:cardAddProStructure = {heroID:0,newJoin:false,quality:3,promote:1,level:0,multiple:0,skillID:0,isTop:false};
        var cap2:cardAddProStructure = {heroID:0,newJoin:false,quality:3,promote:1,level:0,multiple:0,skillID:0,isTop:false};
        var cap3:cardAddProStructure = {heroID:0,newJoin:false,quality:3,promote:1,level:0,multiple:0,skillID:0,isTop:false};
        this.produceCardArr.push(cap1);
        this.produceCardArr.push(cap2);
        this.produceCardArr.push(cap3);

        this.drawHeroCard(this.btn_card1.node,0);
        this.drawHeroCard(this.btn_card2.node,1);
        this.drawHeroCard(this.btn_card3.node,2);
    }

    selectHeroCard(e)
    {
        let ampCardEvent;
        switch(e.target.name)
        {
            case "btn_card1":
                ampCardEvent = new GameEventName({ eventCode: 1,pcArr:[this.produceCardArr[0]] });
                break;
            case "btn_card2":
                ampCardEvent = new GameEventName({ eventCode: 1,pcArr:[this.produceCardArr[1]] });
                break;
            case "btn_card3":
                ampCardEvent = new GameEventName({ eventCode: 1,pcArr:[this.produceCardArr[2]] });
                break;
        }
        this.cardTopPromoteOrSkill();
        //发送单个英雄属性提升选择
        GameCustomEvent.Instance.node.emit(GameEventName.FIGHT_OTHER_VIEW_EVENT,ampCardEvent);
        this.closeView();
    }

    //获得全部卡牌
    getAllCard()
    {
        //看广告
        //发送3个英雄属性提升
        this.cardTopPromoteOrSkill();
        let ampCardEvent = new GameEventName({ eventCode: 1,pcArr: this.produceCardArr });
        GameCustomEvent.Instance.node.emit(GameEventName.FIGHT_OTHER_VIEW_EVENT,ampCardEvent);
        this.closeView();
    }

    //刷新卡牌
    freshCard()
    {
        //看广告
//         SDK.ShowVideoAd(1,end=>{
//             if(end){
        this.freshThreeCard();
//             }
//         })
       
    }

    freshThreeCard()
    {
        this.cardjoinHeroArr = [];
        //清空已生成的临时数据
        this.cardProHeroArr = [];
        this.drawHeroCard(this.btn_card1.node,0);
        this.drawHeroCard(this.btn_card2.node,1);
        this.drawHeroCard(this.btn_card3.node,2);
    }

    //英雄抽卡
    drawHeroCard(cardNode:Node,cardIndex:number)
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
        var heroQualityArr:Array<heroStructure> = [];
        //前几张牌已生成的上阵英雄，且与已上阵的英雄与不同
        var pCJoinHeroCount:number = 0;
        for(var pcjhc:number = 0;pcjhc < this.cardjoinHeroArr.length;pcjhc++)
        {
            //生成的英雄，是否在上阵列表中
            for(var joh:number = 0;joh < GlobalData.Instance.joinHeroArr.length;joh++)
            {
                if(this.cardjoinHeroArr[pcjhc] == GlobalData.Instance.joinHeroArr[joh].heroID)
                {
                    pCJoinHeroCount++;
                    break;
                }
            }
        } 
        //如果7个位置已满(上阵英雄+已经生成的新上阵英雄 >= 7)，只能选择在7个英雄中同品级的提升
        if(GlobalData.Instance.joinHeroArr.length + pCJoinHeroCount >= 7)
        {
            for(var addHeroPro:number = 0;addHeroPro < GlobalData.Instance.joinHeroArr.length;addHeroPro++)
            {
                if(GlobalData.Instance.joinHeroArr[addHeroPro].quality == heroQuality)
                {
                    heroQualityArr.push(GlobalData.Instance.unlockHeroArr[addHeroPro]);
                }
            }
            if(heroQualityArr.length == 0)
            {
                //若没有同品级的，不再找品级，默认随机提升该7个英雄的属性
                heroQualityArr = GlobalData.Instance.joinHeroArr;
            }
        }else{
            //7个位置未满时，找到该品级已解锁所有英雄（目前版本默认全解锁）
            heroQualityArr = this.findAllLevelHero(heroQuality);
            while(heroQualityArr.length <= 0 && heroQuality > 1)
            {
                //查找上一个品级的英雄解锁情况
                heroQuality--;
                heroQualityArr = [];
                heroQualityArr = this.findAllLevelHero(heroQuality);
            }
            this.produceCardArr[cardIndex].quality = heroQuality;
            console.log("提升品质",this.produceCardArr[cardIndex].quality);
            //该品级的满级英雄
            var isTopFull:boolean = true;
            console.log("该品级的所有英雄",heroQuality,heroQualityArr);
            //把前几张牌已上阵的英雄也过滤掉
            for(var sz:number = 0;sz < this.cardjoinHeroArr.length;sz++)
            {
                for(var hq:number = 0;hq < heroQualityArr.length;hq++)
                {
                    if(this.cardjoinHeroArr[sz] == heroQualityArr[hq].heroID)
                    {
                        heroQualityArr.splice(hq,1);
                        break;
                    }
                }
            }
        }
        // console.log("该品级的满级英雄已满",isTopFull,heroQuality);
        // while(isTopFull && heroQuality > 1)
        // {
        //    var topHeroTotal:number = 0;
        //     //检查该品级的所有英雄属性和技能是否都已叠满
        //     for(var tps:number = 0;tps < heroQualityArr.length;tps++)
        //     {
        //         if(heroQualityArr[tps].propertyTopArr.length > 5)
        //         {
        //             topHeroTotal++;
        //         }
        //     }
        //     if(topHeroTotal >= heroQualityArr.length)
        //     {
        //         isTopFull = true;
        //         //查找上一个品级的英雄解锁情况
        //         heroQuality--;
        //         heroQualityArr = [];
        //         heroQualityArr = this.findAllLevelHero(heroQuality);
        //     }else{
        //         isTopFull = false;
        //     }
        // }
        // if(topHeroTotal >= heroQualityArr.length && heroQuality == 1)
        // {
        //     //若所有白色英雄已满级，且未解锁更高等级的英雄，酒馆显示暂无已上阵英雄可提升
        //     console.log("暂无已上阵英雄可提升");
        //     return;
        // }
        if(heroQualityArr.length <= 0)
        {
            //酒馆显示暂无已上阵英雄可提升
            console.log("暂无已上阵英雄可提升");
            return;
        }
    
        //提升属性的上阵英雄
        var proJoinHero:heroStructure;
        var isJoin:boolean = false;
        //该品级英雄下标
        var rqHero:number = -1;
        //是否更换英雄
        var isChangeHero:boolean = true;
        //不能提升的属性
        var forbiddenProArr:Array<number> = [];
        while(isChangeHero)
        {
            isChangeHero = false;
            forbiddenProArr = [];
            //随机该品级英雄
            rqHero = Math.floor(Math.random() * heroQualityArr.length);
            //英雄已满级几个属性
            var heroProTopTotal:number = 0;
            for(var hpt:number = 0;hpt < GlobalData.Instance.heroProTopArr.length;hpt)
            {
                if(GlobalData.Instance.heroProTopArr[hpt].heroID == heroQualityArr[rqHero].heroID)
                {
                    //判断所有属性和技能是否已叠满
                    if(GlobalData.Instance.heroProTopArr[hpt].propertyTopArr.length >= 5)
                    {
                        //更换英雄ID
                        isChangeHero = true;
                    }else{
                        //有则记录已满级的属性总数和ID
                        heroProTopTotal = GlobalData.Instance.heroProTopArr[hpt].propertyTopArr.length;
                        forbiddenProArr = GlobalData.Instance.heroProTopArr[hpt].propertyTopArr;
                    }
                    break;
                }
            }
            //同一英雄在已生成的卡牌中属性种类累计
            var cardSamePro:number = 0;
            for(var pcsy:number = 0;pcsy < this.produceCardArr.length;pcsy++)
            {
                //如果之前的卡牌生成过该英雄
                if(heroQualityArr[rqHero] && this.produceCardArr[pcsy].heroID == heroQualityArr[rqHero].heroID)
                {
                    cardSamePro++;
                }
            }
            //该英雄是否有剩余不同的属性(总属性5 - 英雄已满级属性 - 英雄已生成卡牌属性)
            if(5 - heroProTopTotal - cardSamePro > 0)
            {
                //有则记录已有的属性ID
                for(var jlpc:number = 0;jlpc < this.produceCardArr.length;jlpc++)
                {
                    if(heroQualityArr[rqHero] && this.produceCardArr[jlpc].heroID == heroQualityArr[rqHero].heroID)
                    {
                        forbiddenProArr.push(this.produceCardArr[jlpc].promote);
                    }
                }
            }else{
                //更换英雄ID
                isChangeHero = true;
            }
        }
        this.produceCardArr[cardIndex].heroID = heroQualityArr[rqHero].heroID;
        console.log("英雄ID",this.produceCardArr[cardIndex].heroID);
        //英雄名
        cardNode.getChildByName("lab_heroName").getComponent(Label).string = heroQualityArr[rqHero].heroName;
        //英雄头像
        LoadImgTool.Instance.loadSpriteFrame(heroQualityArr[rqHero].heroHeadImgPath,cardNode.getChildByName("mask_headPortrait").getChildByName("icon_heroHead").getComponent(Sprite).node);
        //判断该英雄是否已上阵
        for(var findJoinHero:number = 0;findJoinHero < GlobalData.Instance.joinHeroArr.length;findJoinHero++)
        {
            if(GlobalData.Instance.joinHeroArr[findJoinHero].heroID == heroQualityArr[rqHero].heroID)
            {
                isJoin = true;
                proJoinHero = GlobalData.Instance.joinHeroArr[findJoinHero];
                break;
            }
        }
        if(isJoin)
        {
            this.produceCardArr[cardIndex].newJoin = false;
            cardNode.getChildByName("icon_newHero").getComponent(Sprite).node.active = false;
            //提升范围 白色英雄没有技能
            var proMaxArr:Array<number> = [1,2,3,4];
            if(heroQuality > 1)
            {
                proMaxArr.push(5);
            }
            //过滤掉已满级和已生成的属性
            for(var qhs:number = 0;qhs < forbiddenProArr.length;qhs++)
            {
                proMaxArr = proMaxArr.filter(num => num !== forbiddenProArr[qhs]);
            }
            //提升属性 1 攻击 2 暴击 3 会心 4 HP 5 解锁/升级技能
            var promoteNum:number = 1;
            //随机一个能提升的属性
            var promoteIndex = Math.floor(Math.random() * proMaxArr.length);
            promoteNum = proMaxArr[promoteIndex];
            switch(promoteNum)
            {
                case 1:
                    //伤害成长
                    for(var hpgu:number = 0;hpgu < GlobalData.Instance.heroProGrowUpTableArr.length;hpgu++)
                    {
                        if(GlobalData.Instance.heroProGrowUpTableArr[hpgu].propertyType == promoteNum)
                        {
                            this.cardComposing(cardNode,GlobalData.Instance.heroProGrowUpTableArr[hpgu].propertyIconPath,
                                GlobalData.Instance.heroProGrowUpTableArr[hpgu].propertyName);
                            //英雄属性增幅描述
                            for(var gu:number = 0;gu < GlobalData.Instance.heroProGrowUpTableArr[hpgu].growUpArr.length;gu++)
                            {
                                //查找下一级属性等级，所有属性默认初始等级0
                                if((proJoinHero.harmLevel + 1) == GlobalData.Instance.heroProGrowUpTableArr[hpgu].growUpArr[gu].level)
                                {
                                    var muStr:string = ""+ OperationTool.Instance.retainDecimal(1,(100+GlobalData.Instance.heroProGrowUpTableArr[hpgu].growUpArr[gu].multiple)/100);
                                    var newDesStr:string = CharacterTool.Instance.replaceCharacter(GlobalData.Instance.heroProGrowUpTableArr[hpgu].describe,"{0}", muStr);
                                    cardNode.getChildByName("lab_describe").getComponent(Label).string = newDesStr;
                                    this.produceCardArr[cardIndex].level = GlobalData.Instance.heroProGrowUpTableArr[hpgu].growUpArr[gu].level;
                                    this.produceCardArr[cardIndex].multiple = GlobalData.Instance.heroProGrowUpTableArr[hpgu].growUpArr[gu].multiple;
                                    var saveHeroPro4:cardAddProStructure;
                                    //若为最后一级提升的属性
                                    if(proJoinHero.harmLevel + 1 >= GlobalData.Instance.heroProGrowUpTableArr[hpgu].growUpArr.length)
                                    {
                                        saveHeroPro4 = {heroID:heroQualityArr[rqHero].heroID,promote:promoteNum,newJoin:false,quality:0,
                                            level:this.produceCardArr[cardIndex].level,multiple:this.produceCardArr[cardIndex].multiple,skillID:0,isTop:true};
                                    }else{
                                        saveHeroPro4 = {heroID:heroQualityArr[rqHero].heroID,promote:promoteNum,newJoin:false,quality:0,
                                            level:this.produceCardArr[cardIndex].level,multiple:this.produceCardArr[cardIndex].multiple,skillID:0,isTop:false};
                                    }
                                    this.cardProHeroArr.push(saveHeroPro4);
                                    this.updateCardProHeroArr(cardNode,saveHeroPro4);
                                    break;
                                }
                            }
                            break;
                        }
                    }
                    break;
                case 2:
                    //暴击成长
                    for(var hpgu:number = 0;hpgu < GlobalData.Instance.heroProGrowUpTableArr.length;hpgu++)
                    {
                        if(GlobalData.Instance.heroProGrowUpTableArr[hpgu].propertyType == promoteNum)
                        {
                            this.cardComposing(cardNode,GlobalData.Instance.heroProGrowUpTableArr[hpgu].propertyIconPath,
                                GlobalData.Instance.heroProGrowUpTableArr[hpgu].propertyName);
                            //英雄属性增幅描述
                            for(var gu:number = 0;gu < GlobalData.Instance.heroProGrowUpTableArr[hpgu].growUpArr.length;gu++)
                            {
                                //查找下一级属性等级，所有属性默认初始等级0
                                if((proJoinHero.criticalLevel + 1) == GlobalData.Instance.heroProGrowUpTableArr[hpgu].growUpArr[gu].level)
                                {
                                    var muStr:string = ""+ GlobalData.Instance.heroProGrowUpTableArr[hpgu].growUpArr[gu].multiple;
                                    var newDesStr:string = CharacterTool.Instance.replaceCharacter(GlobalData.Instance.heroProGrowUpTableArr[hpgu].describe,"{0}", muStr);
                                    cardNode.getChildByName("lab_describe").getComponent(Label).string = newDesStr;
                                    this.produceCardArr[cardIndex].level = GlobalData.Instance.heroProGrowUpTableArr[hpgu].growUpArr[gu].level;
                                    this.produceCardArr[cardIndex].multiple = GlobalData.Instance.heroProGrowUpTableArr[hpgu].growUpArr[gu].multiple;
                                    var saveHeroPro4:cardAddProStructure;
                                    if(proJoinHero.criticalLevel + 1 >= GlobalData.Instance.heroProGrowUpTableArr[hpgu].growUpArr.length)
                                    {
                                        saveHeroPro4 = {heroID:heroQualityArr[rqHero].heroID,promote:promoteNum,newJoin:false,quality:0,
                                            level:this.produceCardArr[cardIndex].level,multiple:this.produceCardArr[cardIndex].multiple,skillID:0,isTop:true};
                                    }else{
                                        saveHeroPro4 = {heroID:heroQualityArr[rqHero].heroID,promote:promoteNum,newJoin:false,quality:0,
                                            level:this.produceCardArr[cardIndex].level,multiple:this.produceCardArr[cardIndex].multiple,skillID:0,isTop:false};
                                    }
                                    this.cardProHeroArr.push(saveHeroPro4);
                                    this.updateCardProHeroArr(cardNode,saveHeroPro4);
                                    break;
                                }
                            }
                            break;
                        }
                    }
                    break;
                case 3:
                    //会心成长
                    for(var hpgu:number = 0;hpgu < GlobalData.Instance.heroProGrowUpTableArr.length;hpgu++)
                    {
                        if(GlobalData.Instance.heroProGrowUpTableArr[hpgu].propertyType == promoteNum)
                        {
                            this.cardComposing(cardNode,GlobalData.Instance.heroProGrowUpTableArr[hpgu].propertyIconPath,
                                GlobalData.Instance.heroProGrowUpTableArr[hpgu].propertyName);
                            //英雄属性增幅描述
                            for(var gu:number = 0;gu < GlobalData.Instance.heroProGrowUpTableArr[hpgu].growUpArr.length;gu++)
                            {
                                //查找下一级属性等级，所有属性默认初始等级0
                                if((proJoinHero.breakOutLevel + 1) == GlobalData.Instance.heroProGrowUpTableArr[hpgu].growUpArr[gu].level)
                                {
                                    var muStr:string = ""+ GlobalData.Instance.heroProGrowUpTableArr[hpgu].growUpArr[gu].multiple;
                                    var newDesStr:string = CharacterTool.Instance.replaceCharacter(GlobalData.Instance.heroProGrowUpTableArr[hpgu].describe,"{0}", muStr);
                                    cardNode.getChildByName("lab_describe").getComponent(Label).string = newDesStr;
                                    this.produceCardArr[cardIndex].level = GlobalData.Instance.heroProGrowUpTableArr[hpgu].growUpArr[gu].level;
                                    this.produceCardArr[cardIndex].multiple = GlobalData.Instance.heroProGrowUpTableArr[hpgu].growUpArr[gu].multiple;
                                    var saveHeroPro4:cardAddProStructure;
                                    if(proJoinHero.breakOutLevel + 1 >= GlobalData.Instance.heroProGrowUpTableArr[hpgu].growUpArr.length)
                                    {
                                        saveHeroPro4 = {heroID:heroQualityArr[rqHero].heroID,promote:promoteNum,newJoin:false,quality:0,
                                            level:this.produceCardArr[cardIndex].level,multiple:this.produceCardArr[cardIndex].multiple,skillID:0,isTop:true};
                                    }else{
                                        saveHeroPro4 = {heroID:heroQualityArr[rqHero].heroID,promote:promoteNum,newJoin:false,quality:0,
                                            level:this.produceCardArr[cardIndex].level,multiple:this.produceCardArr[cardIndex].multiple,skillID:0,isTop:false};
                                    }
                                    this.cardProHeroArr.push(saveHeroPro4);
                                    this.updateCardProHeroArr(cardNode,saveHeroPro4);
                                    break;
                                }
                            }
                            break;
                        }
                    }
                    break;
                case 4:
                    //HP成长
                    for(var hpgu:number = 0;hpgu < GlobalData.Instance.heroProGrowUpTableArr.length;hpgu++)
                    {
                        if(GlobalData.Instance.heroProGrowUpTableArr[hpgu].propertyType == promoteNum)
                        {
                            this.cardComposing(cardNode,GlobalData.Instance.heroProGrowUpTableArr[hpgu].propertyIconPath,
                                GlobalData.Instance.heroProGrowUpTableArr[hpgu].propertyName);
                            //英雄属性增幅描述
                            for(var gu:number = 0;gu < GlobalData.Instance.heroProGrowUpTableArr[hpgu].growUpArr.length;gu++)
                            {
                                //查找下一级属性等级，所有属性默认初始等级0
                                if((proJoinHero.HPLevel + 1) == GlobalData.Instance.heroProGrowUpTableArr[hpgu].growUpArr[gu].level)
                                {
                                    var muStr:string = ""+ OperationTool.Instance.retainDecimal(1,(100+GlobalData.Instance.heroProGrowUpTableArr[hpgu].growUpArr[gu].multiple)/100);
                                    var newDesStr:string = CharacterTool.Instance.replaceCharacter(GlobalData.Instance.heroProGrowUpTableArr[hpgu].describe,"{0}", muStr);
                                    cardNode.getChildByName("lab_describe").getComponent(Label).string = newDesStr;
                                    this.produceCardArr[cardIndex].level = GlobalData.Instance.heroProGrowUpTableArr[hpgu].growUpArr[gu].level;
                                    this.produceCardArr[cardIndex].multiple = GlobalData.Instance.heroProGrowUpTableArr[hpgu].growUpArr[gu].multiple;
                                    var saveHeroPro4:cardAddProStructure;
                                    if(proJoinHero.HPLevel + 1 >= GlobalData.Instance.heroProGrowUpTableArr[hpgu].growUpArr.length)
                                    {
                                        saveHeroPro4 = {heroID:heroQualityArr[rqHero].heroID,promote:promoteNum,newJoin:false,quality:0,
                                            level:this.produceCardArr[cardIndex].level,multiple:this.produceCardArr[cardIndex].multiple,skillID:0,isTop:true};
                                    }else{
                                        saveHeroPro4 = {heroID:heroQualityArr[rqHero].heroID,promote:promoteNum,newJoin:false,quality:0,
                                            level:this.produceCardArr[cardIndex].level,multiple:this.produceCardArr[cardIndex].multiple,skillID:0,isTop:false};
                                    }
                                    this.cardProHeroArr.push(saveHeroPro4);
                                    //替换掉原来位置的数组
                                    this.updateCardProHeroArr(cardNode,saveHeroPro4);
                                    break;
                                }
                            }
                            break;
                        }
                    }
                    break;
                case 5:
                    //检查配表是否正确
                    if(proJoinHero.skillProArr.length < 1)
                    {
                        console.log("该角色为绿品质及以上，缺少技能请修改json表:",heroQualityArr[rqHero].heroID,proJoinHero.skillProArr);
                        return;
                    }
                    //当英雄拥有两个或两个以上的技能
                    var skillIndex:number = 0;
                    if(proJoinHero.skillProArr.length > 1)
                    {
                        skillIndex = Math.floor(Math.random() * proJoinHero.skillProArr.length);
                    }
                    console.log("技能数组:",proJoinHero.skillProArr);
                    //在技能表中找到技能
                    for(var hs:number = 0;hs < GlobalData.Instance.heroSkillTableArr.length;hs++)
                    {
                        if(GlobalData.Instance.heroSkillTableArr[hs].skillID == proJoinHero.skillProArr[skillIndex].ID)
                        {
                            this.cardComposing(cardNode,GlobalData.Instance.heroSkillTableArr[hs].skillIconPath,
                                GlobalData.Instance.heroSkillTableArr[hs].skillName);
                            for(var sl:number = 0;sl < GlobalData.Instance.heroSkillTableArr[hs].skillArr.length;sl++)
                            {
                                //查找下一级技能等级，所有技能默认初始等级0
                                if((proJoinHero.skillProArr[skillIndex].level + 1) == GlobalData.Instance.heroSkillTableArr[hs].skillArr[sl].level)
                                {
                                    //技能文字描述，是否有替换字符{0}和{1}
                                    if(GlobalData.Instance.heroSkillTableArr[hs].describe.includes("{0}"))
                                    {
                                        // var efStr:string = ""+ OperationTool.Instance.retainDecimal(1,(100+GlobalData.Instance.heroSkillTableArr[hs].skillArr[sl])/100);
                                        var efStr:string = ""+ GlobalData.Instance.heroSkillTableArr[hs].skillArr[sl].effect;
                                        var newDesStr:string = CharacterTool.Instance.replaceCharacter(GlobalData.Instance.heroSkillTableArr[hs].describe,"{0}", efStr);
                                        cardNode.getChildByName("lab_describe").getComponent(Label).string = newDesStr;
                                        if(GlobalData.Instance.heroSkillTableArr[hs].describe.includes("{1}"))
                                        {
                                            var scStr:string = ""+ GlobalData.Instance.heroSkillTableArr[hs].skillArr[sl].effect;
                                            var lastDesStr:string = CharacterTool.Instance.replaceCharacter(newDesStr,"{1}", scStr);
                                            cardNode.getChildByName("lab_describe").getComponent(Label).string = lastDesStr;
                                        }
                                    }else{
                                        cardNode.getChildByName("lab_describe").getComponent(Label).string = GlobalData.Instance.heroSkillTableArr[hs].describe;
                                    }

                                    this.produceCardArr[cardIndex].skillID = GlobalData.Instance.heroSkillTableArr[hs].skillID;
                                    this.produceCardArr[cardIndex].level = GlobalData.Instance.heroSkillTableArr[hs].skillArr[sl].level;
                                    
                                    var saveHeroPro5:cardAddProStructure;
                                    //若为最后一级提升的技能
                                    if((proJoinHero.skillProArr[skillIndex].level + 1) >= GlobalData.Instance.heroSkillTableArr[hs].skillArr.length)
                                    {
                                        saveHeroPro5 = {heroID:heroQualityArr[rqHero].heroID,promote:promoteNum,skillID:this.produceCardArr[cardIndex].skillID,
                                            newJoin:true,quality:0,level:0,multiple:0,isTop:true};
                                    }else{
                                        saveHeroPro5 = {heroID:heroQualityArr[rqHero].heroID,promote:promoteNum,skillID:this.produceCardArr[cardIndex].skillID,
                                            newJoin:true,quality:0,level:0,multiple:0,isTop:false};
                                    }
                                    this.cardProHeroArr.push(saveHeroPro5);
                                    this.updateCardProHeroArr(cardNode,saveHeroPro5);
                                    break;
                                }
                            }
                        }
                    }
                    break;
            }
        }else{
            //若未上阵，上阵该英雄
            cardNode.getChildByName("icon_newHero").getComponent(Sprite).node.active = true;
            cardNode.getChildByName("icon_skill").getComponent(Sprite).node.active = false;
            cardNode.getChildByName("lab_skillName").getComponent(Label).string = "上阵此英雄";
            //无描述
            cardNode.getChildByName("lab_describe").getComponent(Label).string = "";
            this.produceCardArr[cardIndex].newJoin = true;
            this.cardjoinHeroArr.push(heroQualityArr[rqHero].heroID);
        }
        this.cardQuality(heroQuality,cardNode.getChildByName("img_cardQuality").getComponent(Sprite).node);
    }

    //有属性/技能的显示排布
    cardComposing(cardNode:Node,iconPath:string,psName:string)
    {
        //英雄属性/技能图标
        LoadImgTool.Instance.loadSpriteFrame(iconPath,cardNode.getChildByName("icon_skill").getComponent(Sprite).node);
        cardNode.getChildByName("icon_skill").getComponent(Sprite).node.active = true;
        //英雄属性名
        cardNode.getChildByName("lab_skillName").getComponent(Label).string = psName;
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

    //更新临时存储数组
    updateCardProHeroArr(cardNode:Node,cad:cardAddProStructure)
    {
        switch(cardNode.name)
        {
            case "btn_card1":
                this.produceCardArr.splice(0,1,cad);
                break;
            case "btn_card2":
                this.produceCardArr.splice(1,1,cad);
                break;
            case "btn_card3":
                this.produceCardArr.splice(2,1,cad);
                break;
        }
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

    //卡牌背景品级颜色
    cardQuality(heroQuality:number,cardQualityNode:Node)
    {
        switch (heroQuality) {
            case 1:
                LoadImgTool.Instance.loadSpriteFrame("img/amplificationCard/img_whiteCard",cardQualityNode);
                break;
            case 2:
                LoadImgTool.Instance.loadSpriteFrame("img/amplificationCard/img_greenCard",cardQualityNode);
                break;
            case 3:
                LoadImgTool.Instance.loadSpriteFrame("img/amplificationCard/img_blueCard",cardQualityNode);
                break;
            case 4:
                LoadImgTool.Instance.loadSpriteFrame("img/amplificationCard/img_purpleCard",cardQualityNode);
                break;
            case 5:
                LoadImgTool.Instance.loadSpriteFrame("img/amplificationCard/img_redCard",cardQualityNode);
                break;
            case 6:
                LoadImgTool.Instance.loadSpriteFrame("img/amplificationCard/img_yellowCard",cardQualityNode);
                break;
        }
    }

    //选牌后，添加满级属性或技能记录
    cardTopPromoteOrSkill()
    {
        for(var adps:number = 0;adps < this.produceCardArr.length;adps++)
        {
            if(this.produceCardArr[adps].isTop)
            {
                this.addHeroProTop(this.produceCardArr[adps].heroID,this.produceCardArr[adps].promote,this.produceCardArr[adps].skillID);
            }
        }
        //清空临时生成的卡牌数组
        this.cardjoinHeroArr = [];
    }

    //添加英雄属性满级记录
    addHeroProTop(hid:number,proNum:number,skillID:number = 0,skillsTotal:number = 0)
    {
        var isOldHeroTop:boolean = false;
        for(var ahpt:number = 0;ahpt < GlobalData.Instance.heroProTopArr.length;ahpt++)
        {
            if(GlobalData.Instance.heroProTopArr[ahpt].heroID == hid)
            {
                if(proNum < 5)
                {
                    isOldHeroTop = true;
                    //该项属性已叠满，增加到满级属性中
                    GlobalData.Instance.heroProTopArr[ahpt].propertyTopArr.push(proNum);
                }else if(proNum == 5){
                    isOldHeroTop = true;
                    //该项技能已叠满，增加到满级技能组中
                    GlobalData.Instance.heroProTopArr[ahpt].skillTopArr.push(skillID);
                    //如果该技能满级后，其余技能都已满级，则技能组属性满级
                    if(GlobalData.Instance.heroProTopArr[ahpt].skillTopArr.length >= skillsTotal)
                    {
                        GlobalData.Instance.heroProTopArr[ahpt].propertyTopArr.push(proNum);
                    }
                }
                //如果该英雄5项属性全满，添加到满级英雄中，不再抽取
            }
        }
        if(isOldHeroTop == false)
        {
            var newHeroProTop:heroProTopStructure;
            if(skillID == 0)
            {
                newHeroProTop = {heroID:hid,propertyTopArr:[proNum],skillTopArr:[]};
            }else{
                newHeroProTop = {heroID:hid,propertyTopArr:[proNum],skillTopArr:[skillID]};
                GlobalData.Instance.heroProTopArr.push(newHeroProTop);
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