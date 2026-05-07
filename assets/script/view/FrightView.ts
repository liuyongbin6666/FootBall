import { _decorator, Component, Node, Sprite, Label, Button, find, Prefab, instantiate, ProgressBar, tween, Vec3, Color, UIOpacity } from 'cc';
import { bulletStructure, enemyStructure, heroStructure, soccerStructure, waveStructure } from '../data/GlobalStructure';
import { LoadImgTool } from '../tool/LoadImgTool';
import { OperationTool } from '../tool/OperationTool';
import { GameCustomEvent } from '../manager/GameCustomEvent';
import { GameEventName } from '../manager/GameEventName';
import { Layer } from '../manager/Layer';
import { GlobalData } from '../data/GlobalData';
import { SDK } from '../../BHY_Framework/Sdk/SDK';
import { ResMgr } from '../../BHY_Framework/Manager/ResMgr';
const { ccclass, property } = _decorator;

/**
 * 战斗界面
 */
@ccclass('FrightView')
export class FrightView extends Component {
    /**
     * 组件
    */
    @property(Prefab)
    private heroItemPre: Prefab = null;

    @property(Prefab)
    private enemyItemPre: Prefab = null;

    @property(Prefab)
    private soccerItemPre: Prefab = null;
    
    @property(Prefab)
    private bulletItemPre: Prefab = null;

    @property(Prefab)
    private harmItemPre: Prefab = null;

    private btn_close:Button;
    //静态背景
    private img_soccerField:Sprite;
    //动态背景
    private img_frightBg:Sprite;
    //衔接背景
    private img_frightLinkUpBg:Sprite;
    private node_enemy:Node;
    private node_soccer:Node;
    private node_hero:Node;
    //掉落金币
    private lab_gold:Label;
    private lab_level:Label;
    private lab_wave:Label;
    //HP血条
    private pro_HP:ProgressBar = null;
    //HP比例
    private lab_HPProportion:Label;
    //EXP经验条
    private pro_EXP:ProgressBar = null;
    //EXP比例
    private lab_EXPProportion:Label;
    private btn_prop1:Button;
    private btn_prop2:Button;
    private btn_prop3:Button;
    private btn_prop4:Button;
    private btn_prop5:Button;
    //设置
    private btn_set:Button;
    //广告
    private btn_adv:Button;

    /**
     * 数据
    */
    //英雄
    private heroArr:Array<heroStructure> = [];
    //敌人
    private enemyArr:Array<enemyStructure> = [];
    //回收敌人
    private recycleEnemyArr:Array<enemyStructure> = [];
    //足球
    private soccerArr:Array<soccerStructure> = [];
    //子弹
    private bulletArr:Array<bulletStructure> = [];
    //游戏状态
    private soccerGameState:number = 0;
    //玩家等级
    private playerLevel:number = 1;
    //第几波
    private wave:number = 0;
    //通关波数
    private maxWave:number = 5;
    //当前血量
    private HP:number = 100;
    //上限血量
    private maxHP:number = 0;
    //当前经验
    private EXP:number = 0;
    //升级所需经验
    private maxEXP:number = 200;
    //溢出经验
    private overflowEXP:number = 0;
    //英雄槽
    private heroGrooveArr:Array<any>;
    //道具槽
    private propGrooveArr:Array<any>;
    //计时器时间
    private timeHS:number = 0.01;
    //地图移动速度
    private mapMoveSpeed:number = 0.2;
    private frightBgY:number = 0;
    private frightLinkUpBgY:number = 0;
    //敌人停止走动发动攻击为止
    private enemyStopY:number = 6;
    //敌人子弹速度
    private bulletSpeed:number = 5;
    //敌人产生间隔
    private enemyIntervalTime:number = 100;

    //暂存波次
    private saveWave:waveStructure = null;
    protected onLoad(): void {
        this._initObect();
        this._onEvent();
    }

    private _initObect() {
        this.btn_close = find('node_top/btn_close', this.node).getComponent(Button);
        this.img_soccerField = find('img_soccerField', this.node).getComponent(Sprite);
        this.img_frightBg = find('img_frightBg', this.node).getComponent(Sprite);
        this.img_frightLinkUpBg = find('img_frightLinkUpBg', this.node).getComponent(Sprite);
        this.node_enemy = find('node_enemy', this.node);
        this.node_soccer = find('node_soccer', this.node);
        this.node_hero = find('node_hero', this.node);
        this.lab_gold = find('node_top/lab_gold', this.node).getComponent(Label);
        this.lab_level = find('node_top/lab_level', this.node).getComponent(Label);
        this.lab_wave = find('node_top/lab_wave', this.node).getComponent(Label);
        this.pro_HP = find('node_bottom/pro_HP', this.node).getComponent(ProgressBar);
        this.lab_HPProportion = find('node_bottom/lab_HPProportion', this.node).getComponent(Label);
        this.pro_EXP = find('node_bottom/pro_EXP', this.node).getComponent(ProgressBar);
        this.lab_EXPProportion = find('node_bottom/lab_EXPProportion', this.node).getComponent(Label);
        this.btn_prop1 = find('node_bottom/lay_propGroove/btn_prop1', this.node).getComponent(Button);
        this.btn_prop2 = find('node_bottom/lay_propGroove/btn_prop2', this.node).getComponent(Button);
        this.btn_prop3 = find('node_bottom/lay_propGroove/btn_prop3', this.node).getComponent(Button);
        this.btn_prop4 = find('node_bottom/lay_propGroove/btn_prop4', this.node).getComponent(Button);
        this.btn_prop5 = find('node_bottom/lay_propGroove/btn_prop5', this.node).getComponent(Button);
        this.btn_set = find('node_bottom/btn_set', this.node).getComponent(Button);
        this.btn_adv = find('node_bottom/btn_adv', this.node).getComponent(Button);
    }

    private _onEvent() {
        this.btn_close.node.on(Node.EventType.TOUCH_END, this.closeView, this);
        this.btn_prop1.node.on(Node.EventType.TOUCH_END, this.conjure, this);
        this.btn_prop2.node.on(Node.EventType.TOUCH_END, this.conjure, this);
        this.btn_prop3.node.on(Node.EventType.TOUCH_END, this.conjure, this);
        this.btn_prop4.node.on(Node.EventType.TOUCH_END, this.conjure, this);
        this.btn_prop5.node.on(Node.EventType.TOUCH_END, this.conjure, this);
        this.btn_set.node.on(Node.EventType.TOUCH_END, this.openSet, this);
        GameCustomEvent.Instance.addCustomEvent(GameEventName.FRIGHT_SUBTRACT_BOOLD_EVENT,this.frightControllerFun,this);
        GameCustomEvent.Instance.addCustomEvent(GameEventName.AMPLIFICATION_CARD_RESULT_EVENT,this.heroAmplificationFun,this);
    }

    start() {
        this.resetGame();
        // this.readRecord();
        //模拟数据
        var es1:enemyStructure = {enemyID:1,heroHeadImgPath:"",enemyName:"敌人1",enemyIntroduce:"敌人介绍",experience:100,enemyType:1,enemyOccupation:1,
            maxHP:50,moveSpeed:0.2,attackSpeed:1,attackDistance:10,harm:1,EXP:1,gold:1,prop:1,skillProbability:10,speak:"杀光他们！",enemyItem:null,
            HP:10,attakState:0};
        var es2:enemyStructure = {enemyID:2,heroHeadImgPath:"",enemyName:"敌人2",enemyIntroduce:"敌人介绍",experience:100,enemyType:1,enemyOccupation:1,
            maxHP:30,moveSpeed:0.3,attackSpeed:1,attackDistance:10,harm:1,EXP:1,gold:1,prop:1,skillProbability:10,speak:"冲啊！",enemyItem:null,
            HP:10,attakState:0};
        var es3:enemyStructure = {enemyID:3,heroHeadImgPath:"",enemyName:"敌人3",enemyIntroduce:"敌人介绍",experience:100,enemyType:1,enemyOccupation:1,
            maxHP:80,moveSpeed:0.4,attackSpeed:1,attackDistance:10,harm:1,EXP:4,gold:1,prop:1,skillProbability:10,speak:"Biu~Biu~",enemyItem:null,
            HP:10,attakState:0};
        this.enemyArr.push(es1);
        this.enemyArr.push(es2);
        this.enemyArr.push(es3);
        var he1:heroStructure = {heroID:1,heroImgPath:"",heroHeadImgPath:"",heroName:"英雄1",heroIntroduce:"英雄介绍",heroType:1,quality:1,restrainType:1,
            maxHP:30,skillArr:[],speed:1,harm:10,criticalChance:20,breakOutHarmChance:30,heroItem:null,heroIndex:0,HP:10,catchSoccerID:0,unlock:true,
            join:true,harmLevel:0,criticalLevel:0,breakOutLevel:0,HPLevel:0,propertyTopArr:[],skillTopArr:[]};
        var he2:heroStructure = {heroID:2,heroImgPath:"",heroHeadImgPath:"",heroName:"英雄2",heroIntroduce:"英雄介绍",heroType:1,quality:1,restrainType:1,
            maxHP:20,skillArr:[],speed:2,harm:20,criticalChance:15,breakOutHarmChance:20,heroItem:null,heroIndex:1,HP:10,catchSoccerID:0,unlock:true,
            join:true,harmLevel:0,criticalLevel:0,breakOutLevel:0,HPLevel:0,propertyTopArr:[],skillTopArr:[]};
        var he3:heroStructure = {heroID:3,heroImgPath:"",heroHeadImgPath:"",heroName:"英雄3",heroIntroduce:"英雄介绍",heroType:1,quality:1,restrainType:1,
            maxHP:50,skillArr:[],speed:3,harm:30,criticalChance:10,breakOutHarmChance:15,heroItem:null,heroIndex:2,HP:10,catchSoccerID:0,unlock:true,
            join:true,harmLevel:0,criticalLevel:0,breakOutLevel:0,HPLevel:0,propertyTopArr:[],skillTopArr:[]};
        // var he4:heroStructure = {heroID:4,heroImgPath:"",heroHeadImgPath:"",heroName:"英雄4",heroIntroduce:"英雄介绍",heroType:1,quality:1,restrainType:1,
        //     maxHP:30,skillArr:[],speed:1,harm:10,criticalChance:20,breakOutHarmChance:30,heroItem:null,heroIndex:3,HP:10,catchSoccerID:0,unlock:true,
        //     join:true,harmLevel:0,criticalLevel:0,breakOutLevel:0,HPLevel:0,propertyTopArr:[],skillTopArr:[]};
        // var he5:heroStructure = {heroID:5,heroImgPath:"",heroHeadImgPath:"",heroName:"英雄5",heroIntroduce:"英雄介绍",heroType:1,quality:1,restrainType:1,
        //     maxHP:20,skillArr:[],speed:2,harm:20,criticalChance:15,breakOutHarmChance:20,heroItem:null,heroIndex:4,HP:10,catchSoccerID:0,unlock:true,
        //     join:true,harmLevel:0,criticalLevel:0,breakOutLevel:0,HPLevel:0,propertyTopArr:[],skillTopArr:[]};
        // var he6:heroStructure = {heroID:6,heroImgPath:"",heroHeadImgPath:"",heroName:"英雄6",heroIntroduce:"英雄介绍",heroType:1,quality:1,restrainType:1,
        //     maxHP:50,skillArr:[],speed:3,harm:30,criticalChance:10,breakOutHarmChance:15,heroItem:null,heroIndex:5,HP:10,catchSoccerID:0,unlock:true,
        //     join:true,harmLevel:0,criticalLevel:0,breakOutLevel:0,HPLevel:0,propertyTopArr:[],skillTopArr:[]};
        // var he7:heroStructure = {heroID:7,heroImgPath:"",heroHeadImgPath:"",heroName:"英雄7",heroIntroduce:"英雄介绍",heroType:1,quality:1,restrainType:1,
        //     maxHP:30,skillArr:[],speed:1,harm:10,criticalChance:20,breakOutHarmChance:30,heroItem:null,heroIndex:6,HP:10,catchSoccerID:0,unlock:true,
        //     join:true,harmLevel:0,criticalLevel:0,breakOutLevel:0,HPLevel:0,propertyTopArr:[],skillTopArr:[]};
        this.heroArr.push(he1);
        this.heroArr.push(he2);
        this.heroArr.push(he3);
        // this.heroArr.push(he4);
        // this.heroArr.push(he5);
        // this.heroArr.push(he6);
        // this.heroArr.push(he7);
        console.log(this.heroArr);

        this.createHero();
        this.createAllEnemy();
        this.createSoccer();//1,-250,-300
        this.updatePlayerMaxEXP();
        this.freshHP();
        this.freshEXP();
        this.soccerGameState = gameState.start;
        this.schedule(this.soccerGame,this.timeHS);
    }

    openSet()
    {
          Layer.Instance.show("set",Layer.Instance.layerView);
          //分享
        // SDK.ShareGame(()=>{
        //     Layer.Instance.show("set",Layer.Instance.layerView);
        // })

        //看视频
        // SDK.ShowVideoAd(1,end=>{
        //     if(end){

        //         Layer.Instance.show("set",Layer.Instance.layerView);
        //     }
        // })
    }

    //游戏重置
    resetGame()
    {
        //清除所有子item
        this.node_soccer.removeAllChildren();

        this.soccerGameState = gameState.wait;
        this.HP = 0;
        this.EXP = 0;
        // this.maxHP = 0;
        // this.maxEXP = 0;
    }

    readRecord()
    {
        for(var findChapter:number = 0;findChapter < GlobalData.Instance.chapterTableArr.length;findChapter++)
        {
            //当前章节
            if(GlobalData.Instance.chapterTableArr[findChapter].chapterID == GlobalData.Instance.gameRecord.chapterID)
            {
                //初始英雄数组
                this.readHeroData(GlobalData.Instance.chapterTableArr[findChapter].initialHeroArr);
                break;
            }
        }
        
        for(var findLevel:number = 0;findLevel < GlobalData.Instance.levelTableArr.length;findLevel++){
            //当前关卡
            if(GlobalData.Instance.levelTableArr[findLevel].levelID == GlobalData.Instance.gameRecord.levelID)
            {
                if(this.wave == 0 && GlobalData.Instance.levelTableArr[findLevel].waveArr.length > 0)
                {
                    //不做波数存储，默认第1波
                    this.wave = GlobalData.Instance.levelTableArr[findLevel].waveArr[0];
                }else{
                    for(var findWave:number = 0;findWave < GlobalData.Instance.waveTableArr.length;findWave++)
                    {
                        if(this.wave == GlobalData.Instance.levelTableArr[findLevel].waveArr[findWave])
                        {
                            //怪物
                            this.saveWave = GlobalData.Instance.waveTableArr[findWave];
                            break;
                        }
                    }
                }
                break;
            }
        }
    }

    //读取下一个章节
    readNextChapter()
    {
        for(var findChapter:number = 0;findChapter < GlobalData.Instance.chapterTableArr.length;findChapter++)
        {
            //当前章节
            if(GlobalData.Instance.chapterTableArr[findChapter].chapterID == GlobalData.Instance.gameRecord.chapterID)
            {
                if(GlobalData.Instance.chapterTableArr[findChapter].nextChapterID != 0)
                {
                    GlobalData.Instance.gameRecord.chapterID = GlobalData.Instance.chapterTableArr[findChapter].nextChapterID;
                }else{
                    //已到最后一章
                }
                break;
            }
        }
    }

    //读取下一个关卡
    readNextLevel()
    {
        for(var findChapter:number = 0;findChapter < GlobalData.Instance.chapterTableArr.length;findChapter++)
        {
            //当前章节
            if(GlobalData.Instance.chapterTableArr[findChapter].chapterID == GlobalData.Instance.gameRecord.chapterID)
            {
                //所有关卡 
                for(var findChapterLevel:number = 0;findChapterLevel < GlobalData.Instance.chapterTableArr[findChapter].levelArr.length;findChapterLevel++){
                    if(GlobalData.Instance.chapterTableArr[findChapter].levelArr[findChapterLevel] == GlobalData.Instance.gameRecord.levelID)
                    {
                        if(findChapterLevel + 1 < GlobalData.Instance.chapterTableArr[findChapter].levelArr.length)
                        {
                            GlobalData.Instance.gameRecord.levelID = GlobalData.Instance.chapterTableArr[findChapter].levelArr[findChapterLevel + 1];
                        }else{
                            //已到该章节最后一关，读取下一章节
                            this.readNextChapter();
                        }
                        break;
                    }
                }
                break;
            }
        }
    }

    //读取下一波
    readNextWave()
    {
        //
        for(var findLevel:number = 0;findLevel < GlobalData.Instance.levelTableArr.length;findLevel++){
            //当前关卡
            if(GlobalData.Instance.levelTableArr[findLevel].levelID == GlobalData.Instance.gameRecord.levelID)
            {
                for(var findWave:number = 0;findWave < GlobalData.Instance.waveTableArr.length;findWave++)
                {
                    if(findWave + 1 < GlobalData.Instance.levelTableArr[findLevel].waveArr.length)
                    {
                        //下一个波数
                        this.wave = GlobalData.Instance.levelTableArr[findLevel].waveArr[findWave + 1]
                    }else{
                        //已到该关卡最后一波，读取下一关卡
                        this.readNextLevel();
                    }
                    break;
                }
                break;
            }
        }
    }

    //英雄数据
    readHeroData(iHeroArr:Array<number>)
    {
        //创建7个英雄站位，当英雄不满7个时，为其余英雄站位为空
        for(var ch:number = 0;ch < 7;ch++)
        {
            //在配表中找到该关卡的初始英雄，英雄ID从101开始
            var csHeroID:number = ch;
            if(ch < iHeroArr.length)
            {
                csHeroID = GlobalData.Instance.chapterTableArr[GlobalData.Instance.gameRecord.chapterID].initialHeroArr[ch];
                break;
            }
            this.joinHeroToBattle(csHeroID,ch);
        }
    }

    //英雄显示
    createHero()
    {
        //清除所有子item
        this.node_hero.removeAllChildren();
        
        for(var he:number = 0;he < this.heroArr.length;he++)
        {
            let item = instantiate(this.heroItemPre);
            this.heroIndexPos(item,this.heroArr[he].heroIndex);
            console.log(he,item.getPosition().x,item.getPosition().y);
            item["heroID"] = this.heroArr[he].heroID;
            if(this.heroArr[he].heroType == 0)
            {
                item["temp"] = true;
            }else{
                item["temp"] = false;
            }
            this.heroArr[he].HP = this.heroArr[he].maxHP;
            this.maxHP += this.heroArr[he].maxHP;
            this.HP += this.heroArr[he].maxHP;
            // item.getChildByName("lab_nickname").getComponent(Label).string = "" + this.heroArr[he].heroName;
            // LoadImgTool.Instance.loadSpriteFrame(this.heroArr[he].heroImgPath, item.getChildByName("mask_head").getChildByName("icon_head").getComponent(Sprite).node);
            if(this.heroArr[he].skillArr.length > 0)
            {
                //根据ID查找在技能表中查找技能
            }

            this.heroArr[he].heroItem = item;
            this.node_hero.addChild(item);
        }
    }

    //上阵英雄
    joinHeroToBattle(hID:number,hIndex:number)
    {
        var hero:heroStructure = {heroID:hID,heroImgPath:"img/hero/hero1",heroHeadImgPath:"img/hero/heroHead/icon_heroHead_1",
            heroName:"英雄1",heroIntroduce:"英雄介绍",heroType:0,quality:1,restrainType:1,maxHP:30,skillArr:[],speed:1,harm:10,
            criticalChance:20,breakOutHarmChance:30,heroItem:null,heroIndex:hIndex,HP:10,catchSoccerID:0,unlock:true,
            join:true,harmLevel:0,criticalLevel:0,breakOutLevel:0,HPLevel:0,propertyTopArr:[],skillTopArr:[]};
        for(var ht:number = 0;ht < GlobalData.Instance.heroTableArr.length;ht++)
        {
            if(GlobalData.Instance.heroTableArr[ht].heroID == hID)
            {
                //赋予静态属性
                hero.heroID = GlobalData.Instance.heroTableArr[ht].heroID;
                hero.heroImgPath = GlobalData.Instance.heroTableArr[ht].heroImgPath;
                hero.heroHeadImgPath = GlobalData.Instance.heroTableArr[ht].heroHeadImgPath;
                hero.heroName = GlobalData.Instance.heroTableArr[ht].heroName;
                hero.heroIntroduce = GlobalData.Instance.heroTableArr[ht].heroIntroduce;
                hero.heroType = GlobalData.Instance.heroTableArr[ht].heroType;
                hero.quality = GlobalData.Instance.heroTableArr[ht].quality;
                hero.restrainType = GlobalData.Instance.heroTableArr[ht].restrainType;
                hero.maxHP = GlobalData.Instance.heroTableArr[ht].maxHP;
                hero.skillArr = GlobalData.Instance.heroTableArr[ht].skillArr;
                hero.speed = GlobalData.Instance.heroTableArr[ht].speed;
                hero.harm = GlobalData.Instance.heroTableArr[ht].harm;
                hero.criticalChance = GlobalData.Instance.heroTableArr[ht].criticalChance;
                hero.breakOutHarmChance = GlobalData.Instance.heroTableArr[ht].breakOutHarmChance;
                hero.unlock = true;
            }
        }
        this.heroArr.push(hero);
    }

    //位置站位
    heroIndexPos(hItem:Node,heroIndex:number)
    {
        // if(heroIndex == 0)
        // {
        //     hItem.setPosition(-297,-217);
        // }else{
        //     hItem.setPosition(-297 + heroIndex * 98,-217);//-170
        // }
        //暂定位置：5 3 1 0 2 4 6
        //         0 1 2 3 4 5 6
        switch(heroIndex)
        {
            case 0:
                hItem.setPosition(-297 + 3 * 98,-217);
                break;
            case 1:
                hItem.setPosition(-297 + 2 * 98,-217);
                break;
            case 2:
                hItem.setPosition(-297 + 4 * 98,-217);
                break;
            case 3:
                hItem.setPosition(-297 + 98,-217);
                break;
            case 4:
                hItem.setPosition(-297 + 5 * 98,-217);
                break;
            case 5:
                hItem.setPosition(-297,-217);
                break;
            case 6:
                hItem.setPosition(-297 + 6 * 98,-217);
                break;
        }
    }

    //初始化创建敌人
    createAllEnemy()
    {
        //清除所有子item
        this.node_enemy.removeAllChildren();
        
        for(var en:number = 0;en < this.enemyArr.length;en++)
        {
            let item = instantiate(this.enemyItemPre);
            //随机位置
            item.setPosition(-200 + Math.floor(Math.random() * 410),355);
            console.log(item.getPosition().x,item.getPosition().y);
            item["enemyID"] = this.enemyArr[en].enemyID;
            this.enemyArr[en].HP = this.enemyArr[en].maxHP;
            item.getChildByName("pro_blood").getComponent(ProgressBar).progress = OperationTool.Instance.retainDecimal(2,this.enemyArr[en].HP/this.enemyArr[en].maxHP);
            this.enemyArr[en].enemyItem = item;
            this.node_enemy.addChild(item);
        }
    }
    
    //创建敌人
    createEnemy()
    {
        if(this.saveWave.total > 0)
        {
            this.saveWave.total--;
            //怪物种类
            var enemyOutline:number = 0;
            //怪物权重数组
            var enemyPer:Array<number> = [];
            //根据小怪种类，定权重范围
            for(var en:number = 0;en < this.saveWave.enemyAriseArr.length;en++)
            {
                if(en == 0)
                {
                    this.saveWave.enemyAriseArr[0].percent;
                }else{
                    enemyPer.push(this.saveWave.enemyAriseArr[en].percent + this.saveWave.enemyAriseArr[en - 1].percent);
                }
            }
            //根据权重随机产生怪物
            var raEn:number = Math.floor(Math.random() * 100);
            for(var ce:number = 0;ce < enemyPer.length;ce++)
            {
                if(ce == 0 && raEn < enemyPer[ce])
                {
                    enemyOutline = ce;
                    break;
                }else if(ce > 0 && enemyPer[ce - 1] <= raEn && raEn < enemyPer[ce])
                {
                    enemyOutline = ce;
                    break;
                }
            }
            //根据怪物ID创建怪物
            for(var eta:number = 0;eta < GlobalData.Instance.enemyTableArr.length;en++)
            {
                if(this.saveWave.enemyAriseArr[enemyOutline].ID == GlobalData.Instance.enemyTableArr[eta].enemyID)
                {
                    //判断是否有回收怪物
                    if(this.recycleEnemyArr.length > 0)
                    {
                        //从回收敌人数组中，拿出已创建过敌人重新赋值复用
                        this.recycleEnemyArr[this.recycleEnemyArr.length - 1].enemyID = GlobalData.Instance.enemyTableArr[eta].enemyID;
                        this.recycleEnemyArr[this.recycleEnemyArr.length - 1].heroHeadImgPath = GlobalData.Instance.enemyTableArr[eta].heroHeadImgPath;
                        this.recycleEnemyArr[this.recycleEnemyArr.length - 1].enemyName = GlobalData.Instance.enemyTableArr[eta].enemyName;
                        this.recycleEnemyArr[this.recycleEnemyArr.length - 1].enemyIntroduce = GlobalData.Instance.enemyTableArr[eta].enemyIntroduce;
                        this.recycleEnemyArr[this.recycleEnemyArr.length - 1].experience = GlobalData.Instance.enemyTableArr[eta].experience;
                        this.recycleEnemyArr[this.recycleEnemyArr.length - 1].enemyType = GlobalData.Instance.enemyTableArr[eta].enemyType;
                        this.recycleEnemyArr[this.recycleEnemyArr.length - 1].enemyOccupation = GlobalData.Instance.enemyTableArr[eta].enemyOccupation;
                        this.recycleEnemyArr[this.recycleEnemyArr.length - 1].maxHP = GlobalData.Instance.enemyTableArr[eta].maxHP;
                        this.recycleEnemyArr[this.recycleEnemyArr.length - 1].moveSpeed = GlobalData.Instance.enemyTableArr[eta].moveSpeed;
                        this.recycleEnemyArr[this.recycleEnemyArr.length - 1].attackSpeed = GlobalData.Instance.enemyTableArr[eta].attackSpeed;
                        this.recycleEnemyArr[this.recycleEnemyArr.length - 1].attackDistance = GlobalData.Instance.enemyTableArr[eta].attackDistance;
                        this.recycleEnemyArr[this.recycleEnemyArr.length - 1].harm = GlobalData.Instance.enemyTableArr[eta].harm;
                        this.recycleEnemyArr[this.recycleEnemyArr.length - 1].EXP = GlobalData.Instance.enemyTableArr[eta].EXP;
                        this.recycleEnemyArr[this.recycleEnemyArr.length - 1].gold = GlobalData.Instance.enemyTableArr[eta].gold;
                        this.recycleEnemyArr[this.recycleEnemyArr.length - 1].prop = GlobalData.Instance.enemyTableArr[eta].prop;
                        this.recycleEnemyArr[this.recycleEnemyArr.length - 1].skillProbability = GlobalData.Instance.enemyTableArr[eta].skillProbability;
                        this.recycleEnemyArr[this.recycleEnemyArr.length - 1].speak = GlobalData.Instance.enemyTableArr[eta].speak;

                        this.recycleEnemyArr[this.recycleEnemyArr.length - 1].HP = this.recycleEnemyArr[this.recycleEnemyArr.length - 1].maxHP;
                        this.recycleEnemyArr[this.recycleEnemyArr.length - 1].attakState = 0;

                        //随机位置
                        this.recycleEnemyArr[this.recycleEnemyArr.length - 1].enemyItem.setPosition(-200 + Math.floor(Math.random() * 410),355);
                        this.recycleEnemyArr[this.recycleEnemyArr.length - 1].enemyItem["enemyID"] = GlobalData.Instance.enemyTableArr[eta].enemyID;
                        this.recycleEnemyArr[this.recycleEnemyArr.length - 1].enemyItem.getChildByName("pro_blood").getComponent(ProgressBar).progress = 
                        OperationTool.Instance.retainDecimal(2,this.recycleEnemyArr[this.recycleEnemyArr.length - 1].HP/
                            this.recycleEnemyArr[this.recycleEnemyArr.length - 1].maxHP);
                        this.node_enemy.addChild(this.recycleEnemyArr[this.recycleEnemyArr.length - 1].enemyItem);
                        //怪物spine

                        this.enemyArr.push(this.recycleEnemyArr[this.recycleEnemyArr.length - 1]);
                        //回收数组移除怪物
                        this.recycleEnemyArr.splice(this.recycleEnemyArr.length - 1, 0);
                    }else{
                        //创建新敌人数据
                        var es:enemyStructure = {enemyID:1,heroHeadImgPath:"",enemyName:"敌人1",enemyIntroduce:"敌人介绍",experience:10,enemyType:1,enemyOccupation:1,
                            maxHP:50,moveSpeed:0.2,attackSpeed:1,attackDistance:10,harm:1,EXP:1,gold:1,prop:1,skillProbability:10,speak:"杀光他们！",
                            enemyItem:null,HP:10,attakState:0};
                        
                        es.enemyID = GlobalData.Instance.enemyTableArr[eta].enemyID;
                        es.heroHeadImgPath = GlobalData.Instance.enemyTableArr[eta].heroHeadImgPath;
                        es.enemyName = GlobalData.Instance.enemyTableArr[eta].enemyName;
                        es.enemyIntroduce = GlobalData.Instance.enemyTableArr[eta].enemyIntroduce;
                        es.experience = GlobalData.Instance.enemyTableArr[eta].experience;
                        es.enemyType = GlobalData.Instance.enemyTableArr[eta].enemyType;
                        es.enemyOccupation = GlobalData.Instance.enemyTableArr[eta].enemyOccupation;
                        es.maxHP = GlobalData.Instance.enemyTableArr[eta].maxHP;
                        es.moveSpeed = GlobalData.Instance.enemyTableArr[eta].moveSpeed;
                        es.attackSpeed = GlobalData.Instance.enemyTableArr[eta].attackSpeed;
                        es.attackDistance = GlobalData.Instance.enemyTableArr[eta].attackDistance;
                        es.harm = GlobalData.Instance.enemyTableArr[eta].harm;
                        es.EXP = GlobalData.Instance.enemyTableArr[eta].EXP;
                        es.gold = GlobalData.Instance.enemyTableArr[eta].gold;
                        es.prop = GlobalData.Instance.enemyTableArr[eta].prop;
                        es.skillProbability = GlobalData.Instance.enemyTableArr[eta].skillProbability;
                        es.speak = GlobalData.Instance.enemyTableArr[eta].speak;

                        es.HP = es.maxHP;

                        let item = instantiate(this.enemyItemPre);
                        //随机位置
                        item.setPosition(-200 + Math.floor(Math.random() * 410),355);
                        item["enemyID"] = GlobalData.Instance.enemyTableArr[eta].enemyID;
                        item.getChildByName("pro_blood").getComponent(ProgressBar).progress = OperationTool.Instance.retainDecimal(2,this.enemyArr[en].HP/this.enemyArr[en].maxHP);
                        es.enemyItem = item;
                        //怪物spine

                        this.node_enemy.addChild(item);

                        this.enemyArr.push(es);
                    }
                }
            }
        }
    }

    //创建Boss
    createBoss()
    {}

    //创建足球
    createSoccer()
    {
        //随机一个英雄发球
        var newHeroIndex:number = Math.floor(Math.random() * this.heroArr.length);
        //获取该英雄的x,y，使球起始位置在英雄脚下
        let item = instantiate(this.soccerItemPre);
        item.setPosition(this.heroArr[newHeroIndex].heroItem.getPosition().x,this.heroArr[newHeroIndex].heroItem.getPosition().y - 20);
        item["soccerID"] = this.soccerArr.length + 1;
        var newSoccer:soccerStructure = {soccerID:this.soccerArr.length + 1,soccerImgPath:"",soccerType:1,speed:5,soccerItem:item,soccerState:0,
            xDirection:-1,yDirection:1,relevanceHeroID:this.heroArr[newHeroIndex].heroID,goalEnemyID:1,goalHeroID:0,speedWallX:0,moveTotal:0};
        this.soccerArr.push(newSoccer);
        this.node_soccer.addChild(item);
    }

    //创建子弹 enemyNode 发射子弹的敌人
    createBullet(enemyNode:Node)
    {
        let item = instantiate(this.bulletItemPre);
        //在敌人的手部生成子弹
        item.setPosition(enemyNode.getPosition().x,enemyNode.getPosition().y + 20);
        item["bulletID"] = this.bulletArr.length + 1;
        //随机一个英雄做为攻击目标
        var attackHeroIndex:number = Math.floor(Math.random() * this.heroArr.length);
        var newBullet:bulletStructure = {bulletID:this.bulletArr.length + 1,bulletImgPath:"",goalHeroID:this.heroArr[attackHeroIndex].heroID};
        this.bulletArr.push(newBullet);
    }

    soccerAdd()
    {
        //根据本局的英雄个数，逐渐增加球
        if(this.heroArr.length < 3 && this.soccerArr.length < 1)
        {
            //1个球
            this.createSoccer();
        }else if(this.heroArr.length > 3 && this.heroArr.length < 6 && this.soccerArr.length < 2)
        {
            //2个球
            this.createSoccer();
        }else if(this.heroArr.length > 5 && this.soccerArr.length < 3)
        {
            //3个球
            this.createSoccer();
        }
    }

    //刷新血量显示
    freshHP()
    {
        this.lab_HPProportion.string = this.HP + "/" + this.maxHP;
        this.pro_HP.progress = this.HP/this.maxHP;
        console.log("HP：",this.HP,this.maxEXP);
    }

    //刷新经验显示
    freshEXP()
    {
        this.lab_EXPProportion.string = this.EXP + "/" + this.maxEXP;
        this.pro_EXP.progress = this.EXP/this.maxEXP;
        console.log("EXP：",this.EXP,this.maxEXP);
    }

    //移动英雄站位
    moveHeroStance(heroIndex:number)
    {
            // if(this.heroArr[he].heroIndex == 1)
            // {
            //     item.setPosition(-250,-300);
            // }else{
            //     item.setPosition(-250 + this.heroArr[he].heroIndex * 90,-300);
            // }
    }

    //技能释放
    conjure(e)
    {
    }

    //查找位置最前面且血量大于0的敌人ID
    findFrontEnemyID():number
    {
        if(this.enemyArr.length <= 0)
        {
            return -1;
        }
        var frontEnemyID:number = this.enemyArr[0].enemyID;
        var frontHP:number = this.enemyArr[0].HP;
        for(var findEnemy:number = 1;findEnemy < this.enemyArr.length;findEnemy++)
        {
            if((this.enemyArr[findEnemy - 1].HP <= 0 && this.enemyArr[findEnemy].HP > 0) || 
            (this.enemyArr[findEnemy].enemyItem.getPosition().y < this.enemyArr[findEnemy - 1].enemyItem.getPosition().y && this.enemyArr[findEnemy].HP > 0))
            {
                frontEnemyID = this.enemyArr[findEnemy].enemyID;
                frontHP = this.enemyArr[findEnemy].HP;
            }
        }
        if(frontHP <= 0)
        {
            return -1;
        }else{
            return frontEnemyID;
        }
    }

    //敌人死亡
    enemyDead()
    {
        for(var findDeadEnemy:number = 0;findDeadEnemy < this.enemyArr.length;findDeadEnemy++)
        {
            if(this.enemyArr[findDeadEnemy].HP <= 0)
            {
                //经验条增加经验
                this.EXP += this.enemyArr[findDeadEnemy].EXP;
                //判断是否升级
                if(this.EXP >= this.maxEXP)
                {
                    //本级升级溢出的经验添，加到下一级升级的经验中
                    this.overflowEXP = this.EXP - this.maxEXP;
                    this.EXP = this.overflowEXP;
                    //升级
                    this.playerLevel++;
                    this.updatePlayerMaxEXP();
                    //显示酒馆选牌界面
                    this.soccerGameState = gameState.result;
                    // let pathAmplificationCard = Layer.Instance.getGamePrePath("amplificationCard");
                    // LoadImgTool.Instance.loadPrefab("amplificationCard",pathAmplificationCard,Layer.Instance.layerView,false);
                    Layer.Instance.show("amplificationCard",Layer.Instance.layerView);
                }
                this.freshEXP();
                //不能直接移除显示材质，因为为共享资源，移除时会进行资源释放，导致其他同类材质显示不正常
                //移除敌人显示
                // this.node_enemy.removeChild(this.node_enemy.children[findDeadEnemy]);
                //将敌人移除到屏幕外的位置
                // console.log("移除敌人ID：",this.enemyArr[findDeadEnemy].enemyID);
                this.enemyArr[findDeadEnemy].enemyItem.setPosition(0,1334);
                //添加到敌人回收数据
                this.recycleEnemyArr.push(this.enemyArr[findDeadEnemy]);
                //移除敌人数据
                this.enemyArr.splice(findDeadEnemy,1);
            }
        }
        // for(var f:number = 0;f < this.enemyArr.length;f++)
        // {
        //     console.log("剩余敌人：",this.enemyArr[f]);
        // }
    }

    heroAmplificationFun(amplificationEvent: GameEventName)
    {}

    frightControllerFun(controllerEvent: GameEventName)
    {
        switch(controllerEvent.getCustomProperty().eventCode)
        {
            case 1:
                //球碰到敌人
                for(var fhp:number = 0;fhp < this.enemyArr.length;fhp++)
                {
                    console.log("剩余敌人HP：",this.enemyArr[fhp].HP);
                }
                var rHeroID:number = 0;
                var gEnemyID:number = 0;
                //球下标
                var fSoccer:number = 0;
                //目标英雄下标
                var newHeroIndex:number;
                //根据足球ID找到足球
                for(var findSoccer:number = 0;findSoccer < this.soccerArr.length;findSoccer++)
                {
                    if(this.soccerArr[findSoccer].soccerID == controllerEvent.getCustomProperty().soccerID)
                    {
                        fSoccer = findSoccer;
                        //找到赋予球属性的英雄ID
                        rHeroID = this.soccerArr[findSoccer].relevanceHeroID;
                        gEnemyID = this.soccerArr[findSoccer].goalEnemyID;
                        //目标敌人ID归0
                        this.soccerArr[findSoccer].goalEnemyID = 0;
                        //球状态变为回球
                        this.soccerArr[findSoccer].soccerState = 2;
                        //球随机一个英雄返回
                        newHeroIndex = Math.floor(Math.random() * this.heroArr.length);
                        //若随机的英雄已经在接球中，重选其他英雄
                        // while(this.heroArr[newHeroIndex].catchSoccerID != 0){
                        //     newHeroIndex = Math.floor(Math.random() * this.heroArr.length);
                        // }
                        //
                        //目标英雄
                        this.soccerArr[findSoccer].goalHeroID = this.heroArr[newHeroIndex].heroID;
                        // console.log("新英雄ID：",this.soccerArr[findSoccer].goalHeroID);
                        //英雄状态变为接球
                        this.heroArr[newHeroIndex].catchSoccerID = this.soccerArr[findSoccer].soccerID;
                        break;
                    }
                }
                
                //基础伤害
                var baseHarm:number = 0;
                //是否会心
                var isBreakOutHarm:boolean = false;
                //是否暴击
                var isCritical:boolean = false;
                //根据英雄ID查找英雄
                for(var findHero:number = 0;findHero < this.heroArr.length;findHero++)
                {
                    if(this.heroArr[findHero].heroID == rHeroID)
                    {
                        //基础伤害
                        baseHarm = this.heroArr[findHero].harm;
                        isBreakOutHarm = this.drawALotteryOrRaffle(this.heroArr[findHero].breakOutHarmChance);
                        if(isBreakOutHarm == false){
                            isCritical = this.drawALotteryOrRaffle(this.heroArr[findHero].criticalChance);
                        }
                        break;
                    }
                }
                
                //最终伤害值 = 基础伤害 * 技能倍数
                var lastHarm:number = 0;
                var harmType:number = 1;
                if(isBreakOutHarm)
                {
                    lastHarm = baseHarm * 3;
                    harmType = 3;
                }else if(isCritical)
                {
                    lastHarm = baseHarm * 2;
                    harmType = 2;
                }else{
                    lastHarm = baseHarm;
                }
                //根据敌人ID查找敌人
                for(var findEnemy:number = 0;findEnemy < this.enemyArr.length;findEnemy++)
                {
                    console.log("碰撞敌人ID",controllerEvent.getCustomProperty().enemyID,"敌人ID：",this.enemyArr[findEnemy].enemyID,
                    "敌人HP：",this.enemyArr[findEnemy].HP,this.enemyArr.length);
                    if(this.enemyArr[findEnemy].enemyID == controllerEvent.getCustomProperty().enemyID)
                    {
                        //若敌人处于近距离，则根据y选择近距离的英雄
                        if(this.enemyArr[findEnemy].enemyItem.getPosition().y < this.enemyStopY)
                        {
                            var nHeroArr:Array<heroStructure> = this.findNearHero(this.enemyArr[findEnemy].enemyItem.getPosition().x);
                            //将原来发球相关属性复原
                            this.heroArr[newHeroIndex].catchSoccerID = 0;
                            //球重新随机一个英雄返回
                            newHeroIndex = Math.floor(Math.random() * nHeroArr.length);
                            //目标英雄
                            this.soccerArr[fSoccer].goalHeroID = nHeroArr[newHeroIndex].heroID;
                            //英雄状态变为接球
                            this.heroArr[newHeroIndex].catchSoccerID = this.soccerArr[fSoccer].soccerID;
                        }

                        var newHP:number = this.enemyArr[findEnemy].HP - lastHarm;
                        //敌人受到伤害，并扣除血量，如扣除后的血量低于0，敌人消失
                        this.enemyArr[findEnemy].HP = newHP;
                        console.log("扣血敌人ID：",controllerEvent.getCustomProperty().enemyID,"受到伤害：",lastHarm,"剩余血量：",
                        this.enemyArr[findEnemy].HP,"血条比例：",this.enemyArr[findEnemy].HP/this.enemyArr[findEnemy].maxHP);
                        
                        //不能在材质里创建带有系统字的label材质，会导致外层的系统字label显示冲突而消失，可改用图片形式的艺术字
                        //创建一个扣血文本
                        let textItem = instantiate(this.harmItemPre);
                        this.enemyArr[findEnemy].enemyItem.getChildByName("pro_blood").getComponent(ProgressBar).progress = 
                            OperationTool.Instance.retainDecimal(2,this.enemyArr[findEnemy].HP/this.enemyArr[findEnemy].maxHP);
                        textItem.getChildByName("lab_harm").getComponent(Label).string = "-" + lastHarm;
                        textItem.getChildByName("lab_harm").getComponent(Label).color = new Color(this.color16Code(harmType));
                        this.enemyArr[findEnemy].enemyItem.getChildByName("node_harmText").addChild(textItem);
                        var _this = this;
                        var _harmNode = this.enemyArr[findEnemy].enemyItem.getChildByName("node_harmText");
                        tween(textItem).to(0.3,{position:new Vec3(0,50,0)}).delay(0.7).call(()=>{
                            //文本消失
                            _harmNode.removeChild(textItem);
                            _this.enemyDead();
                        }).start();
                        
                        // if(this.enemyArr[findEnemy].HP <= 0)
                        // {
                            // 该英雄不再做为下一次可选目标
                            // this.enemyArr[findEnemy].HP = 0;
                            // tween(textItem).to(0.3,{position:new Vec3(0,50,0)}).delay(0.7).call(()=>{
                            // }).start();
                            // this.node_enemy.removeChild(this.enemyArr[findEnemy].enemyItem);
                            // return;
                        // }
                        break;
                    }
                }
                break;
            case 2:
                //球碰到英雄
                for(var soccerBack:number = 0;soccerBack < this.soccerArr.length;soccerBack++)
                {
                    if(this.soccerArr[soccerBack].soccerState == 0 || this.soccerArr[soccerBack].soccerState == 2)
                    {
                        //找到位置最前面的敌人发球
                        console.log("找到位置最前面且血量大于0的敌人发球",soccerBack);
                        this.soccerArr[soccerBack].goalEnemyID = this.findFrontEnemyID();
                        //如果敌人已进入攻击状态，则选最近的攻击状态的敌人
                        if(this.soccerArr[soccerBack].goalEnemyID == -1)
                        {
                            //所有怪物已死亡，进入结算
                            console.log("所有怪物已死亡，进入结算");
                            // return;
                        }
                        console.log("目标敌人",this.soccerArr[soccerBack].goalEnemyID);
                        if(this.soccerArr[soccerBack].soccerState == 2)
                        {
                            //根据英雄ID查找英雄
                            for(var findHero:number = 0;findHero < this.heroArr.length;findHero++)
                            {
                                if(this.heroArr[findHero].heroID == controllerEvent.getCustomProperty().heroID)
                                {
                                    //英雄状态变为空闲
                                    this.heroArr[findHero].catchSoccerID = 0;
                                }
                                break;
                            }
                            //目标英雄ID变为赋予球属性英雄的ID
                            this.soccerArr[soccerBack].relevanceHeroID = this.soccerArr[soccerBack].goalHeroID;
                            //目标英雄ID归0
                            this.soccerArr[soccerBack].goalHeroID = 0;
                        }
                        //球状态变为发球
                        this.soccerArr[soccerBack].soccerState = 1;
                        break;
                    }
                }
                break;
            case 3:
                //子弹碰到英雄，子弹消失，总血条扣血
                if(this.HP <= 0)
                {
                    //游戏失败，重新开始
                }
                break;
        }
    }

    //查找离敌人最近的所有英雄
    findNearHero(heroX:number):Array<heroStructure>
    {
        var nearHeroArr:Array<heroStructure> = [];
        for(var findHero:number = 0;findHero < this.heroArr.length;findHero++)
        {
            //敌人和英雄x轴相差距离小于130
            if(Math.abs(heroX - this.heroArr[findHero].heroItem.getPosition().x) <= 110)
            {
                nearHeroArr.push(this.heroArr[findHero]);
            }
        }
        return nearHeroArr;
    }

    soccerGame()
    {
        if(this.soccerGameState == gameState.start)
        {
            // if(this.enemyIntervalTime < 0)
            // {
            //     this.enemyIntervalTime--;
            // }else{
            //     //创建怪物
            //     this.createEnemy();
            //     this.enemyIntervalTime = this.saveWave.intervalTime * 1000;
            // }
            //检测敌人是否死亡
            // this.enemyDead();
            //背景移动
            // this.frightBgY = this.img_frightBg.node.getPosition().y - this.mapMoveSpeed;
            // this.frightLinkUpBgY = this.img_frightLinkUpBg.node.getPosition().y - this.mapMoveSpeed;
            // if(this.img_frightBg.node.getPosition().y < -667)
            // {
            //     this.img_frightBg.node.setPosition(this.img_frightBg.node.getPosition().x,this.frightLinkUpBgY + 1334);
            // }else{
            //     this.img_frightBg.node.setPosition(this.img_frightBg.node.getPosition().x,this.img_frightBg.node.getPosition().y - this.mapMoveSpeed);
            // }
            // if(this.img_frightLinkUpBg.node.getPosition().y < -667)
            // {
            //     this.img_frightLinkUpBg.node.setPosition(this.img_frightLinkUpBg.node.getPosition().x,this.frightBgY + 1334);
            // }else{
            //     this.img_frightLinkUpBg.node.setPosition(this.img_frightLinkUpBg.node.getPosition().x,this.img_frightLinkUpBg.node.getPosition().y - this.mapMoveSpeed);
            // }

            //敌人移动
            for(var moveEnemy:number = 0;moveEnemy < this.enemyArr.length;moveEnemy++)
            {
                if(this.enemyArr[moveEnemy].enemyItem != null)
                {
                    //如果走到了发动攻击位置，y不再变，向英雄投射子弹
                    if(this.enemyArr[moveEnemy].enemyItem.getPosition().y < this.enemyStopY)
                    {
                        //判断敌人状态
                        if(this.enemyArr[moveEnemy].attakState == 0 || this.enemyArr[moveEnemy].attakState == 2)
                        {
                            //投射子弹
                            this.createBullet(this.enemyArr[moveEnemy].enemyItem);
                            this.enemyArr[moveEnemy].attakState = 1;
                        }
                    }else{
                        this.enemyArr[moveEnemy].enemyItem.setPosition(this.enemyArr[moveEnemy].enemyItem.getPosition().x,
                        this.enemyArr[moveEnemy].enemyItem.getPosition().y - this.enemyArr[moveEnemy].moveSpeed);
                    }
                }
            }
            
            //球滚动动画
            for(var ballRoll:number = 0;ballRoll < this.soccerArr.length;ballRoll++)
            {
                if(this.soccerArr[ballRoll].soccerItem.getChildByName("soccer_1").getComponent(UIOpacity).opacity == 255)
                {
                    this.soccerArr[ballRoll].soccerItem.getChildByName("soccer_1").getComponent(UIOpacity).opacity = 1;
                    // getComponent(Sprite).node.active = false;
                    this.soccerArr[ballRoll].soccerItem.getChildByName("soccer_2").getComponent(UIOpacity).opacity = 255;
                    // this.soccerArr[ballRoll].soccerItem.getChildByName("soccer_2").getComponent(Sprite).node.active = true;
                }else if(this.soccerArr[ballRoll].soccerItem.getChildByName("soccer_2").getComponent(UIOpacity).opacity == 255)
                {
                    this.soccerArr[ballRoll].soccerItem.getChildByName("soccer_2").getComponent(UIOpacity).opacity = 1;
                    this.soccerArr[ballRoll].soccerItem.getChildByName("soccer_3").getComponent(UIOpacity).opacity = 255;
                }else if(this.soccerArr[ballRoll].soccerItem.getChildByName("soccer_3").getComponent(UIOpacity).opacity == 255)
                {
                    this.soccerArr[ballRoll].soccerItem.getChildByName("soccer_3").getComponent(UIOpacity).opacity = 1;
                    this.soccerArr[ballRoll].soccerItem.getChildByName("soccer_4").getComponent(UIOpacity).opacity = 255;
                }else if(this.soccerArr[ballRoll].soccerItem.getChildByName("soccer_4").getComponent(UIOpacity).opacity == 255)
                {
                    this.soccerArr[ballRoll].soccerItem.getChildByName("soccer_4").getComponent(UIOpacity).opacity = 1;
                    this.soccerArr[ballRoll].soccerItem.getChildByName("soccer_5").getComponent(UIOpacity).opacity = 255;
                }else if(this.soccerArr[ballRoll].soccerItem.getChildByName("soccer_5").getComponent(UIOpacity).opacity == 255)
                {
                    this.soccerArr[ballRoll].soccerItem.getChildByName("soccer_5").getComponent(UIOpacity).opacity = 1;
                    this.soccerArr[ballRoll].soccerItem.getChildByName("soccer_6").getComponent(UIOpacity).opacity = 255;
                }else if(this.soccerArr[ballRoll].soccerItem.getChildByName("soccer_6").getComponent(UIOpacity).opacity == 255)
                {
                    this.soccerArr[ballRoll].soccerItem.getChildByName("soccer_6").getComponent(UIOpacity).opacity = 1;
                    this.soccerArr[ballRoll].soccerItem.getChildByName("soccer_1").getComponent(UIOpacity).opacity = 255;
                }
            }
        
            //球移动
            for(var so:number = 0;so < this.soccerArr.length;so++)
            {
                //是否为出球状态
                if(this.soccerArr[so].soccerState == 1)
                {
                    //是否有目标敌人，若失去进攻敌人，变为漏球碰墙
                    if(this.soccerArr[so].goalEnemyID == 0)
                    {
                        //没有目标敌人时，以之前的x,y速度向墙运动，墙边界 y 0 上 1334 下 x 0 左 750 右
                        console.log("失去进攻敌人，漏球碰墙1：");
                        let lastWallX:number = 0;
                        let lastWallY:number = 0;
                        lastWallX = this.soccerArr[so].soccerItem.getPosition().x - this.soccerArr[so].speedWallX;
                        lastWallY = this.soccerArr[so].soccerItem.getPosition().y + this.soccerArr[so].speed;
                        this.soccerArr[so].soccerItem.setPosition(lastWallX,lastWallY);
                    }else{
                        //查找目标敌人在当前的位置
                        for(var findEnemy:number = 0;findEnemy < this.enemyArr.length;findEnemy++)
                        {
                            // console.log("敌人ID：",this.enemyArr[findEnemy].enemyID,"目标敌人ID：",this.soccerArr[so].goalEnemyID,this.enemyArr.length,findEnemy);
                            if(this.enemyArr[findEnemy].enemyID == this.soccerArr[so].goalEnemyID)
                            {
                                //敌人纵向行走，x位置不变，y位置向前变动
                                let lastX:number = 0;
                                let lastY:number = 0;
                                //x相差距离 = 敌人x - 足球x
                                var xEquation:number = this.enemyArr[findEnemy].enemyItem.getPosition().x - this.soccerArr[so].soccerItem.getPosition().x;
                                // y相差距离 = 敌人y - 足球y
                                var yEquation:number = this.enemyArr[findEnemy].enemyItem.getPosition().y - this.soccerArr[so].soccerItem.getPosition().y;
                                //相差速度 = 足球移动速度 - 敌人移动速度
                                var speedEquation:number = this.soccerArr[so].speed - this.enemyArr[findEnemy].moveSpeed;
                                var lastSpeedX:number = xEquation * speedEquation / yEquation;
                                if(lastSpeedX)
                                {
                                    this.soccerArr[so].speedWallX = lastSpeedX;
                                }
                                //暂定保留两位小数点
                                // lastSpeedX = OperationTool.Instance.retainDecimal(2,lastSpeedX);
                                lastX = this.soccerArr[so].soccerItem.getPosition().x + lastSpeedX;
                                // if(this.enemyArr[findEnemy].enemyItem.getPosition().x > this.soccerArr[so].soccerItem.getPosition().x)
                                // {
                                // }else{
                                //     lastX = this.soccerArr[so].soccerItem.getPosition().x - lastSpeedX;
                                // }
                                lastY = this.soccerArr[so].soccerItem.getPosition().y + this.soccerArr[so].speed;
                                if(lastX && lastX != Infinity && !Number.isNaN(lastX) && lastX != null)
                                {
                                    this.soccerArr[so].soccerItem.setPosition(lastX,lastY);
                                }else{
                                    this.soccerArr[so].soccerItem.setPosition(this.soccerArr[so].soccerItem.getPosition().x,lastY);
                                }
                                break;
                            }
                        }
                    }
                    break;
                }else if(this.soccerArr[so].soccerState == 2){
                    //是否有目标英雄
                    if(this.soccerArr[so].goalHeroID == 0)
                    {
                        //没有目标英雄时，取墙的x,y
                        console.log("墙2：");
                        let lastWallX:number = 0;
                        let lastWallY:number = 0;
                        lastWallX = this.soccerArr[so].soccerItem.getPosition().x - this.soccerArr[so].speedWallX;
                        lastWallY = this.soccerArr[so].soccerItem.getPosition().y + this.soccerArr[so].speed;
                        this.soccerArr[so].soccerItem.setPosition(lastWallX,lastWallY);
                    }else{
                        //查找目标英雄在当前的位置
                        for(var findHero:number = 0;findHero < this.heroArr.length;findHero++)
                        {
                            if(this.heroArr[findHero].heroID == this.soccerArr[so].goalHeroID)
                            {
                                //英雄x和y位置都不变
                                let lastX:number = 0;
                                let lastY:number = 0;
                                //x相差距离 = 英雄x - 足球x
                                var xEquation:number = this.heroArr[findHero].heroItem.getPosition().x - this.soccerArr[so].soccerItem.getPosition().x;
                                //y相差距离 = 英雄y - 足球y
                                var yEquation:number = this.heroArr[findHero].heroItem.getPosition().y - this.soccerArr[so].soccerItem.getPosition().y;
                                //相差速度 = 足球移动速度 - 英雄移动速度
                                var speedEquation:number = this.soccerArr[so].speed - 0;
                                var lastSpeedX:number = xEquation * speedEquation / yEquation;
                                if(lastSpeedX)
                                {
                                    this.soccerArr[so].speedWallX = lastSpeedX;
                                }
                                //暂定保留两位小数点
                                // lastSpeedX = OperationTool.Instance.retainDecimal(2,lastSpeedX);
                                lastX = this.soccerArr[so].soccerItem.getPosition().x - lastSpeedX;
                                // if(this.heroArr[findHero].heroItem.getPosition().x > this.soccerArr[so].soccerItem.getPosition().x)
                                // {
                                // }else{
                                //     lastX = this.soccerArr[so].soccerItem.getPosition().x - lastSpeedX;
                                // }
                                lastY = this.soccerArr[so].soccerItem.getPosition().y - this.soccerArr[so].speed;

                                // if(this.heroArr[findHero].heroItem.getPosition().y > this.soccerArr[so].soccerItem.getPosition().y)
                                // {
                                //     lastY = this.soccerArr[so].soccerItem.getPosition().y + this.soccerArr[so].speed;
                                // }else{
                                // }
                                if(lastX && lastX != Infinity && !Number.isNaN(lastX) && lastX != null)//计算算式x相差为0时会导致结果为NaN
                                {
                                    this.soccerArr[so].soccerItem.setPosition(lastX,lastY);
                                }else{
                                    this.soccerArr[so].soccerItem.setPosition(this.soccerArr[so].soccerItem.getPosition().x,lastY);
                                }
                                break;
                            }
                        }
                    }
                    break;
                }
            }
        }else if(this.soccerGameState == gameState.result)
        {
            //打开抽卡（酒馆）界面
        }
    }

    //更新玩家当前等级升下一级需要的经验值
    updatePlayerMaxEXP()
    {
        if(this.playerLevel < 6)
        {
            this.maxEXP = this.playerLevel * 10;
            
        }else{
            this.maxEXP = 100;
        }
    }

    //抽卡属性增加成功
    propertylevelUp(promote)
    {
        switch(promote)
        {
            case 1:
                //攻击力
            case 4:
                //HP
                //x + x * multiple /100
                break;
            case 2:
                //暴击
            case 3:
                //会心
                //multiple /100
                break;
            case 5:
                //技能
                break;
        }
    }

    //几率结果(按百分比100%)
    drawALotteryOrRaffle(probability:number):boolean
    {
        var result:number = Math.floor(Math.random() * 100);
        if(result < probability)
        {
            return true;
        }else{
            return false;
        }
    }

    //字体颜色16进制编码
    color16Code(quality:number):string
    {
        switch(quality)
        {
            case 1:
                //白色
                return "#ffffff";
            case 2:
                //红色 暴击
                return "#ff0000";
            case 3:
                //黄色 会心
                return "#febf00";
            case 4:
                //绿色 加血
                return "#36ff00";
            case 5:
                //浅蓝色
                return "#49c8fd";
            case 6:
                //橙色
                return "#fd8d49";
            case 7:
                //黑色
                return "#000000";
        }
    }

    closeView()
    {
        //取消计时器
        this.unschedule(this.soccerGame);
        // this.timeState = false;
        this.node.active = false;
    }

    update(deltaTime: number) {
    }
}

//游戏状态
enum gameState{
    wait,//等待
    start,//开始
    stop,//暂停
    result,//结算
    over//结束
}
