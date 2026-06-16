import { _decorator, Component, Node, Sprite, Label, Button, find, Prefab, instantiate, ProgressBar, tween, Vec3, Color, UIOpacity, sp, v3, AudioClip, AudioSource } from 'cc';
import { bulletStructure, enemyStructure, heroStructure, relevanceProStructure, soccerStructure, waveStructure } from '../data/GlobalStructure';
import { LoadImgTool } from '../tool/LoadImgTool';
import { OperationTool } from '../tool/OperationTool';
import { GameCustomEvent } from '../manager/GameCustomEvent';
import { GameEventName } from '../manager/GameEventName';
import { Layer } from '../manager/Layer';
import { GlobalData } from '../data/GlobalData';
import { SDK } from '../../BHY_Framework/Sdk/SDK';
import { AudioMG } from '../sound/AudioMG';
const { ccclass, property } = _decorator;

/**
 * 战斗界面-英雄静止版
 */
@ccclass('FightView')
export class FightView extends Component {
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

    @property(Prefab)
    private strikeItemPre: Prefab = null;

    private btn_close:Button;
    //静态背景
    private img_soccerField:Sprite;
    //动态背景
    private img_fightBg:Sprite;
    //衔接背景
    private img_fightLinkUpBg:Sprite;
    //雾
    private img_fog:Sprite;
    //上墙
    private topWall:Node;
    //下墙
    private bottomWall:Node;
    //左墙
    private leftWall:Node;
    //右墙
    private rightWall:Node;
    private node_enemy:Node;
    private node_soccer:Node;
    private node_hero:Node;
    //掉落金币
    private lab_gold:Label;
    private lab_level:Label;
    private lab_wave:Label;
    
    //通关波数时提示
    private img_danger:Sprite;
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
    //足球爆炸
    private strikeArr:Array<any> = [];
    //子弹
    private bulletArr:Array<bulletStructure> = [];
    //游戏状态
    private soccerGameState:number = 0;
    //选择的章节
    private selectChapter:number = 1;
    //玩家等级
    private playerLevel:number = 1;
    //第几波
    private wave:number = 1;
    //当前波次ID
    private waveID:number = 0;
    //最大波数
    private maxWave:number = 1;
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
    //敌人编号（因为能创建同一个类型，需要用编号来区分）
    private enemySerialNum:number = 10000;
    //敌人停止走动发动攻击为止
    private enemyStopY:number = 6;
    //敌人子弹速度
    private bulletSpeed:number = 5;
    //敌人产生间隔
    private enemyIntervalTime:number = -1;
    //漏球次数
    private leakSoccer:number = 0;

    //足球外观大小
    private soccerScale:number = 1;
    //足球外观每次缩小/增大的值
    private soccerBigSmall:number = 0.005;
    //足球会到的下一个x位置
    private nextSoccerX:number = 0;
    //足球会到的下一个y位置
    private nextSoccerY:number = 0;

    //暂存波次
    private saveWave:waveStructure = null;
    protected onLoad(): void {
        this._initObect();
        this._onEvent();
    }

    private _initObect() {
        this.btn_close = find('node_top/btn_close', this.node).getComponent(Button);
        this.img_soccerField = find('img_soccerField', this.node).getComponent(Sprite);
        this.img_fightBg = find('img_fightBg', this.node).getComponent(Sprite);
        this.img_fightLinkUpBg = find('img_fightLinkUpBg', this.node).getComponent(Sprite);
        this.img_fog = find('img_fog', this.node).getComponent(Sprite);
        this.topWall = find('node_wall/topWall', this.node);
        this.bottomWall = find('node_wall/bottomWall', this.node);
        this.leftWall = find('node_wall/leftWall', this.node);
        this.rightWall = find('node_wall/rightWall', this.node);
        this.node_enemy = find('node_enemy', this.node);
        this.node_soccer = find('node_soccer', this.node);
        this.node_hero = find('node_hero', this.node);
        this.lab_gold = find('node_top/lab_gold', this.node).getComponent(Label);
        this.lab_level = find('node_top/lab_level', this.node).getComponent(Label);
        this.lab_wave = find('node_top/lab_wave', this.node).getComponent(Label);
        this.img_danger = find('node_middle/img_danger', this.node).getComponent(Sprite);
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
        GameCustomEvent.Instance.addCustomEvent(GameEventName.FIGHT_COLLISION_EVENT,this.fightControllerFun,this);
        GameCustomEvent.Instance.addCustomEvent(GameEventName.FIGHT_OTHER_VIEW_EVENT,this.otherViewEveFun,this);
    }

    start() {
        this.topWall["wallID"] = 1;
        this.bottomWall["wallID"] = 2;
        this.leftWall["wallID"] = 3;
        this.rightWall["wallID"] = 4;
        // var es1:enemyStructure = {enemyID:1,enemyHeadImgPath:"",enemyName:"敌人1",enemyIntroduce:"敌人介绍",outline:1,enemyType:1,enemyOccupation:1,
        //     maxHP:50,moveSpeed:0.2,attackSpeed:1,attackDistance:10,harm:1,EXP:1,gold:1,prop:1,skillProbability:10,speak:"杀光他们！",enemyItem:null,
        //     HP:10,attakState:0};
        // var es2:enemyStructure = {enemyID:2,enemyHeadImgPath:"",enemyName:"敌人2",enemyIntroduce:"敌人介绍",outline:2,enemyType:1,enemyOccupation:1,
        //     maxHP:30,moveSpeed:0.3,attackSpeed:1,attackDistance:10,harm:1,EXP:1,gold:1,prop:1,skillProbability:10,speak:"冲啊！",enemyItem:null,
        //     HP:10,attakState:0};
        // var es3:enemyStructure = {enemyID:3,enemyHeadImgPath:"",enemyName:"敌人3",enemyIntroduce:"敌人介绍",outline:3,enemyType:1,enemyOccupation:1,
        //     maxHP:80,moveSpeed:0.4,attackSpeed:1,attackDistance:10,harm:1,EXP:4,gold:1,prop:1,skillProbability:10,speak:"Biu~Biu~",enemyItem:null,
        //     HP:10,attakState:0};
        // this.enemyArr.push(es1);
        // this.enemyArr.push(es2);
        // this.enemyArr.push(es3);
        // var he1:heroStructure = {heroID:1,heroImgPath:"",heroHeadImgPath:"",heroName:"英雄1",heroIntroduce:"英雄介绍",heroType:1,quality:1,restrainType:1,
        //     maxHP:30,skillArr:[],speed:1,harm:10,criticalChance:20,breakOutHarmChance:30,heroItem:null,heroIndex:0,HP:10,catchSoccerID:0,unlock:true,
        //     join:true,harmLevel:0,criticalLevel:0,breakOutLevel:0,HPLevel:0,propertyTopArr:[],skillTopArr:[]};
        // var he2:heroStructure = {heroID:2,heroImgPath:"",heroHeadImgPath:"",heroName:"英雄2",heroIntroduce:"英雄介绍",heroType:1,quality:1,restrainType:1,
        //     maxHP:20,skillArr:[],speed:2,harm:20,criticalChance:15,breakOutHarmChance:20,heroItem:null,heroIndex:1,HP:10,catchSoccerID:0,unlock:true,
        //     join:true,harmLevel:0,criticalLevel:0,breakOutLevel:0,HPLevel:0,propertyTopArr:[],skillTopArr:[]};
        // var he3:heroStructure = {heroID:3,heroImgPath:"",heroHeadImgPath:"",heroName:"英雄3",heroIntroduce:"英雄介绍",heroType:1,quality:1,restrainType:1,
        //     maxHP:50,skillArr:[],speed:3,harm:30,criticalChance:10,breakOutHarmChance:15,heroItem:null,heroIndex:2,HP:10,catchSoccerID:0,unlock:true,
        //     join:true,harmLevel:0,criticalLevel:0,breakOutLevel:0,HPLevel:0,propertyTopArr:[],skillTopArr:[]};
        // var he4:heroStructure = {heroID:4,heroImgPath:"",heroHeadImgPath:"",heroName:"英雄4",heroIntroduce:"英雄介绍",heroType:1,quality:1,restrainType:1,
        //     maxHP:30,skillArr:[],speed:1,harm:10,criticalChance:20,breakOutHarmChance:30,heroItem:null,heroIndex:3,HP:10,catchSoccerID:0,unlock:true,
        //     join:true,harmLevel:0,criticalLevel:0,breakOutLevel:0,HPLevel:0,propertyTopArr:[],skillTopArr:[]};
        // this.heroArr.push(he4);
        // this.heroArr.push(he5);
        // this.heroArr.push(he6);
        // this.heroArr.push(he7);
    }

    //初始化战斗
    initFight()
    {
        // this.img_danger.node.active = false;

        //创建每波第一个敌人（怪物产生间隔从第二个开始）
        this.ariseEnemy();

        this.heroShow();
        this.createSoccer();
        this.updatePlayerMaxEXP();
        this.freshWave();
        this.freshHP();
        this.freshEXP();
        this.soccerGameState = gameState.start;

        AudioMG.Instance.playMusicAudio("hall_bgyy");
        
        Layer.Instance.show("battleHeroState",Layer.Instance.layerView);

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
        this.node_hero.removeAllChildren();
        this.node_enemy.removeAllChildren();
        this.node_soccer.removeAllChildren();

        this.soccerGameState = gameState.wait;
        this.HP = 0;
        this.EXP = 0;
        // this.maxHP = 0;
        // this.maxEXP = 0;
    }

    readRecord(cid:number)
    {
        for(var findChapter:number = 0;findChapter < GlobalData.Instance.chapterTableArr.length;findChapter++)
        {
            //当前章节
            if(GlobalData.Instance.chapterTableArr[findChapter].chapterID == GlobalData.Instance.gameRecord.chapterID)
            {
                //如果记录为0，为重置该关卡，默认从第一个关卡开始
                if(GlobalData.Instance.gameRecord.levelID == 0)
                {
                    GlobalData.Instance.gameRecord.levelID = GlobalData.Instance.chapterTableArr[findChapter].levelArr[0];
                }
                //初始化英雄数组
                this.readHeroData(GlobalData.Instance.chapterTableArr[findChapter].initialHeroArr);
                break;
            }
        }
        
        for(var findLevel:number = 0;findLevel < GlobalData.Instance.levelTableArr.length;findLevel++){
            //当前关卡
            if(GlobalData.Instance.levelTableArr[findLevel].levelID == GlobalData.Instance.gameRecord.levelID)
            {
                this.freshLevel(GlobalData.Instance.levelTableArr[findLevel].levelName);
                this.maxWave = GlobalData.Instance.levelTableArr[findLevel].waveArr.length;
                if(this.waveID <= 0 && GlobalData.Instance.levelTableArr[findLevel].waveArr.length > 0)
                {
                    //第一次加载默认第1波
                    this.waveID = GlobalData.Instance.levelTableArr[findLevel].waveArr[0];
                }
                //根据波次获取怪物产出数据
                for(var findWave:number = 0;findWave < GlobalData.Instance.waveTableArr.length;findWave++)
                {
                    if(this.waveID == GlobalData.Instance.waveTableArr[findWave].waveID)
                    {
                        var waveOne:waveStructure = {waveID:GlobalData.Instance.waveTableArr[findWave].waveID,
                            enemyAriseArr:GlobalData.Instance.waveTableArr[findWave].enemyAriseArr,
                            total:GlobalData.Instance.waveTableArr[findWave].total,
                            intervalTime:GlobalData.Instance.waveTableArr[findWave].intervalTime,
                            BossID:GlobalData.Instance.waveTableArr[findWave].BossID,
                            BossBornTime:GlobalData.Instance.waveTableArr[findWave].BossBornTime}
                        this.saveWave = waveOne;//GlobalData.Instance.waveTableArr[findWave]
                        //按10毫秒一次算
                        this.saveWave.intervalTime *= 100;
                        this.enemyIntervalTime = this.saveWave.intervalTime;
                        this.saveWave.BossBornTime *= 100;
                        break;
                    }
                }
                break;
            }
        }
    }

    //读取下一个关卡
    readNextLevel():boolean
    {
        // var isLastLv:boolean = false;
        for(var findChapter:number = 0;findChapter < GlobalData.Instance.chapterTableArr.length;findChapter++)
        {
            //当前章节
            if(GlobalData.Instance.chapterTableArr[findChapter].chapterID == GlobalData.Instance.gameRecord.chapterID)
            {
                //该章节所有的关卡 
                for(var findChapterLevel:number = 0;findChapterLevel < GlobalData.Instance.chapterTableArr[findChapter].levelArr.length;findChapterLevel++)
                {
                    if(GlobalData.Instance.chapterTableArr[findChapter].levelArr[findChapterLevel] == GlobalData.Instance.gameRecord.levelID)
                    {
                        //判断是否为该章节最后一关
                        if(findChapterLevel + 1 < GlobalData.Instance.chapterTableArr[findChapter].levelArr.length)
                        {
                            GlobalData.Instance.gameRecord.levelID = GlobalData.Instance.chapterTableArr[findChapter].levelArr[findChapterLevel + 1];
                            return true;
                        }
                        break;
                    }
                }
                break;
            }
        }

        //目前章节为主页面选取，暂不自动读取下一章
        // if(isLastLv == false)
        // {
        //     //已到该章节最后一关，读取下一章节
        //     var readNextChaOver:boolean = this.readNextChapter();
        //     if(readNextChaOver)
        //     {
        //         //重新加载一次关卡
        //         this.readNextLevel();
        //     }
        // }
        return false;
    }

    //读取下一波
    readNextWave()
    {
        var isLastWave:boolean = false;
        //先查找关卡
        for(var findLevel:number = 0;findLevel < GlobalData.Instance.levelTableArr.length;findLevel++)
        {
            //当前关卡
            if(GlobalData.Instance.levelTableArr[findLevel].levelID == GlobalData.Instance.gameRecord.levelID)
            {
                //在关卡所有的波数数组中，找到下一个波数数组
                for(var nw:number = 0;nw < GlobalData.Instance.levelTableArr[findLevel].waveArr.length;nw++)
                {
                    if(this.waveID == GlobalData.Instance.levelTableArr[findLevel].waveArr[nw])
                    {
                        //判断是否为该关卡最后一波
                        if(nw + 1 < GlobalData.Instance.levelTableArr[findLevel].waveArr.length)
                        {
                            this.waveID = GlobalData.Instance.levelTableArr[findLevel].waveArr[nw + 1];
                            //波数+1，更新显示
                            this.wave++;
                            this.freshWave();
                            //根据新波次获取怪物产出数据
                            for(var findWave:number = 0;findWave < GlobalData.Instance.waveTableArr.length;findWave++)
                            {
                                if(this.waveID == GlobalData.Instance.waveTableArr[findWave].waveID)
                                {
                                    //下一个波次ID
                                    var waveOne:waveStructure = {waveID:GlobalData.Instance.waveTableArr[findWave].waveID,
                                        enemyAriseArr:GlobalData.Instance.waveTableArr[findWave].enemyAriseArr,
                                        total:GlobalData.Instance.waveTableArr[findWave].total,
                                        intervalTime:GlobalData.Instance.waveTableArr[findWave].intervalTime,
                                        BossID:GlobalData.Instance.waveTableArr[findWave].BossID,
                                        BossBornTime:GlobalData.Instance.waveTableArr[findWave].BossBornTime}
                                    this.saveWave = waveOne;
                                    //按10毫秒一次算
                                    this.saveWave.intervalTime *= 100;
                                    this.enemyIntervalTime = this.saveWave.intervalTime;
                                    this.saveWave.BossBornTime *= 100;
                                    this.passWaveAni();
                                    isLastWave = true;
                                    break;
                                }
                            }
                        }
                        break;
                    }
                }
                break;
            }
        }

        if(isLastWave == false)
        {
            //已到该关卡最后一波，读取下一关卡
            var readNextLvOver:boolean = this.readNextLevel();
            if(readNextLvOver)
            {
                //波次重置
                this.wave = 1;
                this.fogAni();
                setTimeout(() => {
                    //重新加载一次波数
                    this.readNewWave();
                }, 4500);
            }else{
                //回到主页面
            }
        }
    }

    readNewWave()
    {
        //先查找关卡
        for(var findLevel:number = 0;findLevel < GlobalData.Instance.levelTableArr.length;findLevel++)
        {
            //当前关卡
            if(GlobalData.Instance.levelTableArr[findLevel].levelID == GlobalData.Instance.gameRecord.levelID)
            {
                this.freshLevel(GlobalData.Instance.levelTableArr[findLevel].levelName);
                this.maxWave = GlobalData.Instance.levelTableArr[findLevel].waveArr.length;
                this.freshWave();
                //波次重置时，默认为新关卡第一波
                this.waveID = GlobalData.Instance.levelTableArr[findLevel].waveArr[0];
                //根据波次获取怪物产出数据
                for(var findWave:number = 0;findWave < GlobalData.Instance.waveTableArr.length;findWave++)
                {
                    if(this.waveID == GlobalData.Instance.waveTableArr[findWave].waveID)
                    {
                        var waveOne:waveStructure = {waveID:GlobalData.Instance.waveTableArr[findWave].waveID,
                            enemyAriseArr:GlobalData.Instance.waveTableArr[findWave].enemyAriseArr,
                            total:GlobalData.Instance.waveTableArr[findWave].total,
                            intervalTime:GlobalData.Instance.waveTableArr[findWave].intervalTime,
                            BossID:GlobalData.Instance.waveTableArr[findWave].BossID,
                            BossBornTime:GlobalData.Instance.waveTableArr[findWave].BossBornTime}
                        this.saveWave = waveOne;
                        //按10毫秒一次算
                        this.saveWave.intervalTime *= 100;
                        this.enemyIntervalTime = this.saveWave.intervalTime;
                        this.saveWave.BossBornTime *= 100;
                        this.passWaveAni();
                        break;
                    }
                }
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
                csHeroID = iHeroArr[ch];
            }
            this.createHeroOrTemp(csHeroID,ch);
        }
    }

    //英雄显示
    heroShow()
    {
        for(var he:number = 0;he < this.heroArr.length;he++)
        {
            let item = instantiate(this.heroItemPre);
            this.heroIndexPos(item,this.heroArr[he].heroIndex);
            item["heroID"] = this.heroArr[he].heroID;
            if(this.heroArr[he].heroType == 0)
            {
                item["temp"] = true;
                item.getChildByName("ske_hero").active = false;
            }else{
                item["temp"] = false;
                // item.getChildByName("lab_nickname").getComponent(Label).string = "" + this.heroArr[he].heroName;
                // LoadImgTool.Instance.loadSpriteFrame(this.heroArr[he].heroImgPath, item.getChildByName("mask_head").getChildByName("icon_head").getComponent(Sprite).node);
                item.getChildByName("btn_hero").getComponent(Button).node.active = true;
                if(this.heroArr[he].skillArr.length > 0)
                {
                    //根据ID查找在技能表中查找技能
                }
            }

            this.heroArr[he].heroItem = item;
            this.node_hero.addChild(item);
        }
    }

    //创建英雄或英雄空位
    createHeroOrTemp(hid:number,hIndex:number)
    {
        var hero:heroStructure = {heroID:hid,heroImgPath:"hero/hero1",heroHeadImgPath:"hero/heroHead/icon_heroHead_1",
            heroName:"空位",heroIntroduce:"英雄介绍",heroType:0,quality:1,restrainType:1,maxHP:30,skillArr:[],speed:1,harm:10,
            criticalChance:20,breakOutHarmChance:30,heroItem:null,heroIndex:hIndex,HP:10,catchSoccerID:0,unlock:true,
            join:false,harmLevel:0,criticalLevel:0,breakOutLevel:0,HPLevel:0,skillProArr:[]};
        for(var ht:number = 0;ht < GlobalData.Instance.heroTableArr.length;ht++)
        {
            if(GlobalData.Instance.heroTableArr[ht].heroID == hid)
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
                hero.HP = GlobalData.Instance.heroTableArr[ht].maxHP;
                this.maxHP += GlobalData.Instance.heroTableArr[ht].maxHP;
                this.HP += GlobalData.Instance.heroTableArr[ht].maxHP;
                hero.skillArr = GlobalData.Instance.heroTableArr[ht].skillArr;
                for(var asl:number = 0;asl < GlobalData.Instance.heroTableArr[ht].skillArr.length;asl++)
                {
                    var newSkillLevel:relevanceProStructure = {ID:GlobalData.Instance.heroTableArr[ht].skillArr[asl],level:0,multiple:0,percent:0,seconds:0};
                    hero.skillProArr.push(newSkillLevel);
                }
                hero.speed = GlobalData.Instance.heroTableArr[ht].speed;
                hero.harm = GlobalData.Instance.heroTableArr[ht].harm;
                hero.criticalChance = GlobalData.Instance.heroTableArr[ht].criticalChance;
                hero.breakOutHarmChance = GlobalData.Instance.heroTableArr[ht].breakOutHarmChance;
                hero.join = true;
                hero.unlock = true;
                if(hero.heroType > 0)
                {
                    //如果不为空位，将英雄添加到已上阵数组
                    GlobalData.Instance.joinHeroArr.push(hero);
                }
                break;
            }
        }
        this.heroArr.push(hero);
    }
    //上阵英雄
    joinHeroToBattle(hid:number,hIndex:number)
    {
        for(var ht:number = 0;ht < GlobalData.Instance.heroTableArr.length;ht++)
        {
            if(GlobalData.Instance.heroTableArr[ht].heroID == hid)
            {
                //修改空位为英雄属性
                //如果有球正在飞往空位ID，需要替换为英雄ID
                for(var sote:number = 0;sote < this.soccerArr.length;sote++)
                {
                    if(this.soccerArr[sote].goalHeroID == this.heroArr[hIndex].heroID)
                    {
                        this.soccerArr[sote].goalHeroID = GlobalData.Instance.heroTableArr[ht].heroID;
                        break;
                    }
                }
                this.heroArr[hIndex].heroID = GlobalData.Instance.heroTableArr[ht].heroID;
                this.heroArr[hIndex].heroImgPath = GlobalData.Instance.heroTableArr[ht].heroImgPath;
                this.heroArr[hIndex].heroHeadImgPath = GlobalData.Instance.heroTableArr[ht].heroHeadImgPath;
                this.heroArr[hIndex].heroName = GlobalData.Instance.heroTableArr[ht].heroName;
                this.heroArr[hIndex].heroIntroduce = GlobalData.Instance.heroTableArr[ht].heroIntroduce;
                this.heroArr[hIndex].heroType = GlobalData.Instance.heroTableArr[ht].heroType;
                this.heroArr[hIndex].quality = GlobalData.Instance.heroTableArr[ht].quality;
                this.heroArr[hIndex].restrainType = GlobalData.Instance.heroTableArr[ht].restrainType;
                this.heroArr[hIndex].maxHP = GlobalData.Instance.heroTableArr[ht].maxHP;
                this.heroArr[hIndex].HP = GlobalData.Instance.heroTableArr[ht].maxHP;
                //将最大HP添加到总HP中
                this.maxHP += GlobalData.Instance.heroTableArr[ht].maxHP;
                this.HP += this.heroArr[hIndex].maxHP;
                this.heroArr[hIndex].skillArr = GlobalData.Instance.heroTableArr[ht].skillArr;
                for(var asl:number = 0;asl < GlobalData.Instance.heroTableArr[ht].skillArr.length;asl++)
                {
                    var newSkillLevel:relevanceProStructure = {ID:GlobalData.Instance.heroTableArr[ht].skillArr[asl],level:0,multiple:0,percent:0,seconds:0};
                    this.heroArr[hIndex].skillProArr.push(newSkillLevel);
                }
                this.heroArr[hIndex].speed = GlobalData.Instance.heroTableArr[ht].speed;
                this.heroArr[hIndex].harm = GlobalData.Instance.heroTableArr[ht].harm;
                this.heroArr[hIndex].criticalChance = GlobalData.Instance.heroTableArr[ht].criticalChance;
                this.heroArr[hIndex].breakOutHarmChance = GlobalData.Instance.heroTableArr[ht].breakOutHarmChance;
                this.heroArr[hIndex].join = true;
                this.heroArr[hIndex].heroItem["temp"] = false;
                this.heroArr[hIndex].heroItem.getChildByName("ske_hero").active = true;
                //将英雄添加到上阵数组中
                GlobalData.Instance.joinHeroArr.push(this.heroArr[hIndex]);
                break;
            }
        }
    }

    findSoccerToTempToHero()
    {
    }

    //下阵英雄
    eradicateHero()
    {
        //扣掉原英雄maxHP和HP
        //下阵
        // this.heroArr[hIndex].join = false;
    }

    //查找英雄空位下标（按空位优先级顺序下标最小的返回）
    findTempHeroIndex():number
    {
        var tempHeroIndex:number = -1;
        for(var thsi:number = 0;thsi < this.heroArr.length;thsi++)
        {
            if(this.heroArr[thsi].heroType == 0)
            {
                tempHeroIndex = thsi;
                break;
            }
        }
        return tempHeroIndex;
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
                hItem.setPosition(-210 + 3 * 68,-262);
                break;
            case 1:
                hItem.setPosition(-210 + 2 * 68,-262);
                break;
            case 2:
                hItem.setPosition(-210 + 4 * 68,-262);
                break;
            case 3:
                hItem.setPosition(-210 + 68,-262);
                break;
            case 4:
                hItem.setPosition(-210 + 5 * 68,-262);
                break;
            case 5:
                hItem.setPosition(-210,-262);
                break;
            case 6:
                hItem.setPosition(-210 + 6 * 68,-262);
                break;
        }
    }

    //创建敌人 eid 敌人类型
    createEnemy(eid:number)
    {
        //根据怪物类型ID创建怪物
        for(var eta:number = 0;eta < GlobalData.Instance.enemyTableArr.length;eta++)
        {
            if(eid == GlobalData.Instance.enemyTableArr[eta].enemyID)
            {
                //判断是否有回收怪物
                // if(this.recycleEnemyArr.length > 0)
                // {
                //     //从回收敌人数组中，拿出已创建过敌人重新赋值复用
                //     this.recycleEnemyArr[this.recycleEnemyArr.length - 1].enemyID = GlobalData.Instance.enemyTableArr[eta].enemyID;
                //     this.recycleEnemyArr[this.recycleEnemyArr.length - 1].enemyHeadImgPath = GlobalData.Instance.enemyTableArr[eta].enemyHeadImgPath;
                //     this.recycleEnemyArr[this.recycleEnemyArr.length - 1].enemyName = GlobalData.Instance.enemyTableArr[eta].enemyName;
                //     this.recycleEnemyArr[this.recycleEnemyArr.length - 1].enemyIntroduce = GlobalData.Instance.enemyTableArr[eta].enemyIntroduce;
                //     this.recycleEnemyArr[this.recycleEnemyArr.length - 1].enemyType = GlobalData.Instance.enemyTableArr[eta].enemyType;
                //     this.recycleEnemyArr[this.recycleEnemyArr.length - 1].enemyOccupation = GlobalData.Instance.enemyTableArr[eta].enemyOccupation;
                //     this.recycleEnemyArr[this.recycleEnemyArr.length - 1].maxHP = GlobalData.Instance.enemyTableArr[eta].maxHP;
                //     this.recycleEnemyArr[this.recycleEnemyArr.length - 1].moveSpeed = GlobalData.Instance.enemyTableArr[eta].moveSpeed;
                //     this.recycleEnemyArr[this.recycleEnemyArr.length - 1].attackSpeed = GlobalData.Instance.enemyTableArr[eta].attackSpeed * 100;
                //     this.recycleEnemyArr[this.recycleEnemyArr.length - 1].attackSpeedTime = GlobalData.Instance.enemyTableArr[eta].attackSpeed;
                //     this.recycleEnemyArr[this.recycleEnemyArr.length - 1].attackDistance = GlobalData.Instance.enemyTableArr[eta].attackDistance;
                //     this.recycleEnemyArr[this.recycleEnemyArr.length - 1].harm = GlobalData.Instance.enemyTableArr[eta].harm;
                //     this.recycleEnemyArr[this.recycleEnemyArr.length - 1].EXP = GlobalData.Instance.enemyTableArr[eta].EXP;
                //     this.recycleEnemyArr[this.recycleEnemyArr.length - 1].gold = GlobalData.Instance.enemyTableArr[eta].gold;
                //     this.recycleEnemyArr[this.recycleEnemyArr.length - 1].prop = GlobalData.Instance.enemyTableArr[eta].prop;
                //     this.recycleEnemyArr[this.recycleEnemyArr.length - 1].skillProbability = GlobalData.Instance.enemyTableArr[eta].skillProbability;
                //     this.recycleEnemyArr[this.recycleEnemyArr.length - 1].speak = GlobalData.Instance.enemyTableArr[eta].speak;

                //     this.recycleEnemyArr[this.recycleEnemyArr.length - 1].HP = this.recycleEnemyArr[this.recycleEnemyArr.length - 1].maxHP;
                //     this.recycleEnemyArr[this.recycleEnemyArr.length - 1].attakState = 0;

                //     //随机位置
                //     this.recycleEnemyArr[this.recycleEnemyArr.length - 1].enemyItem.setPosition(-200 + Math.floor(Math.random() * 410),280);
                //     this.recycleEnemyArr[this.recycleEnemyArr.length - 1].enemyItem["enemyID"] = GlobalData.Instance.enemyTableArr[eta].enemyID;
                //     this.recycleEnemyArr[this.recycleEnemyArr.length - 1].enemyItem.getChildByName("pro_blood").getComponent(ProgressBar).progress = 
                //     OperationTool.Instance.retainDecimal(2,this.recycleEnemyArr[this.recycleEnemyArr.length - 1].HP/
                //         this.recycleEnemyArr[this.recycleEnemyArr.length - 1].maxHP);
                //     this.node_enemy.addChild(this.recycleEnemyArr[this.recycleEnemyArr.length - 1].enemyItem);
                //     //怪物spine

                //     this.enemyArr.push(this.recycleEnemyArr[this.recycleEnemyArr.length - 1]);
                //     //回收数组移除怪物
                //     this.recycleEnemyArr.splice(this.recycleEnemyArr.length - 1, 0);
                // }else{
                    //创建新敌人数据
                    var es:enemyStructure = {enemyID:1,enemyHeadImgPath:"",enemyName:"敌人1",enemyIntroduce:"敌人介绍",outline:1,enemyType:1,enemyOccupation:1,
                        maxHP:50,moveSpeed:0.2,attackSpeed:1,attackDistance:10,harm:1,EXP:1,gold:1,prop:1,skillProbability:10,speak:"杀光他们！",
                        enemyItem:null,HP:10,attackSpeedTime:0};
                    
                    es.enemyID = GlobalData.Instance.enemyTableArr[eta].enemyID;
                    es.enemyHeadImgPath = GlobalData.Instance.enemyTableArr[eta].enemyHeadImgPath;
                    es.enemyName = GlobalData.Instance.enemyTableArr[eta].enemyName;
                    es.enemyIntroduce = GlobalData.Instance.enemyTableArr[eta].enemyIntroduce;
                    es.enemyType = GlobalData.Instance.enemyTableArr[eta].enemyType;
                    es.enemyOccupation = GlobalData.Instance.enemyTableArr[eta].enemyOccupation;
                    es.maxHP = GlobalData.Instance.enemyTableArr[eta].maxHP;
                    es.moveSpeed = GlobalData.Instance.enemyTableArr[eta].moveSpeed;
                    //按10毫秒一次算
                    es.attackSpeed = GlobalData.Instance.enemyTableArr[eta].attackSpeed * 100;
                    es.attackSpeedTime = es.attackSpeed;
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
                    item.setPosition(-163 + Math.floor(Math.random() * 324),280);
                    this.enemySerialNum++;
                    item["enemySerialNum"] = this.enemySerialNum;//GlobalData.Instance.enemyTableArr[eta].enemyID
                    console.log("创建敌人赋予item编号",item["enemySerialNum"]);
                    item.getChildByName("pro_blood").getComponent(ProgressBar).progress = OperationTool.Instance.retainDecimal(2,es.HP/es.maxHP);
                    es.enemyItem = item;
                    //怪物spine

                    this.node_enemy.addChild(item);

                    this.enemyArr.push(es);
                // }
                break;
            }
        }
    }
    
    //敌人权重
    ariseEnemy()
    {
        //生产怪物是否达到上限个数
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
            
            this.createEnemy(this.saveWave.enemyAriseArr[enemyOutline].ID);
        }else{
            this.enemyIntervalTime = -1;
        }
    }

    //创建足球
    createSoccer()
    {
        //非空英雄位
        var noTempheroArr:Array<heroStructure> = [];
        //查找非空位的英雄
        for(var fh:number = 0;fh < this.heroArr.length;fh++)
        {
            if(this.heroArr[fh].heroItem["temp"] == false)
            {
                noTempheroArr.push(this.heroArr[fh]);
            }
        }
        //随机一个英雄发球
        var newHeroIndex:number = Math.floor(Math.random() * noTempheroArr.length);
        //获取该英雄的x,y，使球起始位置在英雄脚下
        let item = instantiate(this.soccerItemPre);
        item.setPosition(noTempheroArr[newHeroIndex].heroItem.getPosition().x,noTempheroArr[newHeroIndex].heroItem.getPosition().y - 20);
        item["soccerID"] = this.soccerArr.length + 1;
        var newSoccer:soccerStructure = {soccerID:this.soccerArr.length + 1,soccerImgPath:"",soccerType:1,speed:5,soccerItem:item,soccerState:0,
            relevanceHeroID:noTempheroArr[newHeroIndex].heroID,goalEnemySerialNum:0,goalHeroID:0,goalWallX:0,speedWallX:0,moveTotal:0};
        this.soccerArr.push(newSoccer);
        this.node_soccer.addChild(item);
    }

    //创建足球撞击特性 socX 足球x socY 足球y
    createStrike(socX:number,socY:number)
    {
        //获取该英雄的x,y，使球起始位置在英雄脚下
        let item = instantiate(this.strikeItemPre);
        item.setPosition(socX,socY);
        item["strikeID"] = this.strikeArr.length + 1;
        var newStrike:any = {strikeID:this.strikeArr.length + 1,strikeItem:item};
        this.strikeArr.push(newStrike);
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

    //刷新关卡显示
    freshLevel(lvName:string)
    {
        this.lab_level.string = lvName;
    }

    //刷新波次显示
    freshWave()
    {
        this.lab_wave.string = this.wave + "/" + this.maxWave;
    }

    //刷新血量显示
    freshHP()
    {
        this.lab_HPProportion.string = this.HP + "/" + this.maxHP;
        this.pro_HP.progress = this.HP/this.maxHP;
    }

    //刷新经验显示
    freshEXP()
    {
        this.lab_EXPProportion.string = this.EXP + "/" + this.maxEXP;
        this.pro_EXP.progress = this.EXP/this.maxEXP;
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

    //查找位置最前面且血量大于0的敌人编号
    findFrontEnemySerialNum():number
    {
        if(this.enemyArr.length <= 0)
        {
            return -1;
        }
        var frontEnemySerialNum:number = this.enemyArr[0].enemyItem["enemySerialNum"];
        var frontHP:number = this.enemyArr[0].HP;
        for(var findEnemy:number = 1;findEnemy < this.enemyArr.length;findEnemy++)
        {
            if((this.enemyArr[findEnemy - 1].HP <= 0 && this.enemyArr[findEnemy].HP > 0) || 
            (this.enemyArr[findEnemy].enemyItem.getPosition().y < this.enemyArr[findEnemy - 1].enemyItem.getPosition().y && this.enemyArr[findEnemy].HP > 0))
            {
                frontEnemySerialNum = this.enemyArr[findEnemy].enemyItem["enemySerialNum"];
                frontHP = this.enemyArr[findEnemy].HP;
            }
        }
        if(frontHP <= 0)
        {
            return -1;
        }else{
            return frontEnemySerialNum;
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
    }

    otherViewEveFun(ovEvent: GameEventName)
    {
        switch(ovEvent.getCustomProperty().eventCode)
        {
            case 1:
                //酒馆选卡结果
                console.log("英雄属性提升：",ovEvent);
                for(var ae:number = 0;ae < ovEvent.getCustomProperty().pcArr.length;ae++)
                {
                    var addPro:boolean = false;
                    for(var proHero:number= 0;proHero < this.heroArr.length;proHero++)
                    {
                        if(this.heroArr[proHero].heroID == ovEvent.getCustomProperty().pcArr[ae].heroID && ovEvent.getCustomProperty().pcArr[ae].newJoin == false)
                        {
                            //品质提升
                            this.heroArr[proHero].quality = ovEvent.getCustomProperty().pcArr[ae].quality;
                            //根据提升类型找到相关属性
                            if(ovEvent.getCustomProperty().pcArr[ae].promote == 1)
                            {
                                this.heroArr[proHero].harmLevel++;
                                //x + x * multiple /100
                                var addHarmPro:number = this.heroArr[proHero].harm * ovEvent.getCustomProperty().pcArr[ae].multiple / 100;
                                this.heroArr[proHero].harm += addHarmPro;
                            }else if(ovEvent.getCustomProperty().pcArr[ae].promote == 2){
                                this.heroArr[proHero].criticalLevel++;
                                //multiple /100
                                var lastCriticalPro:number = ovEvent.getCustomProperty().pcArr[ae].multiple / 100;
                                this.heroArr[proHero].harm = lastCriticalPro;
                            }else if(ovEvent.getCustomProperty().pcArr[ae].promote == 3){
                                this.heroArr[proHero].breakOutLevel++;
                                var lastbreakOutPro:number = ovEvent.getCustomProperty().pcArr[ae].multiple / 100;
                                this.heroArr[proHero].breakOutHarmChance = lastbreakOutPro;
                            }else if(ovEvent.getCustomProperty().pcArr[ae].promote == 4){
                                this.heroArr[proHero].HPLevel++;
                                var addHPPro:number = this.heroArr[proHero].maxHP * ovEvent.getCustomProperty().pcArr[ae].multiple / 100;
                                this.heroArr[proHero].maxHP += addHPPro;
                                this.heroArr[proHero].HP += addHPPro;
                                this.freshHP();
                            }else if(ovEvent.getCustomProperty().pcArr[ae].promote == 5)
                            {
                                //根据技能ID找到技能，再对其等级进行提升
                                for(var sk:number = 0;sk < this.heroArr[proHero].skillProArr.length;sk++)
                                {
                                    if(ovEvent.getCustomProperty().pcArr[ae].skillID == this.heroArr[proHero].skillProArr[sk].ID)
                                    {
                                        this.heroArr[proHero].skillProArr[sk].level++;
                                        break;
                                    }
                                }
                            }
                            addPro = true;
                            break;
                        }
                    }
                    if(addPro == false)
                    {
                        //查找空位
                        var thIndex:number = this.findTempHeroIndex();
                        if(thIndex >= 0)
                        {
                            this.joinHeroToBattle(ovEvent.getCustomProperty().pcArr[ae].heroID,thIndex);
                        }
                    }
                }
                this.soccerGameState = gameState.start;
                break;
            case 2:
                //战斗开始
                this.resetGame();
                this.selectChapter = ovEvent.getCustomProperty().chapterIDchapterID;
                //读取选中的章节
                this.readRecord(this.selectChapter);
                this.initFight();
                break;
            case 3:
                //暂停
                this.soccerGameState = gameState.stop;
                break;
            case 4:
                //继续
                this.soccerGameState = gameState.start;
                break;
            case 5:
                //重新开始
                this.resetGame();
                //读取选中的章节
                this.readRecord(this.selectChapter);
                this.initFight();
                break;
        }
    }

    //查找球状态
    findSoccerState(sid:number):number
    {
        for(var findSoccer:number = 0;findSoccer < this.soccerArr.length;findSoccer++)
        {
            if(this.soccerArr[findSoccer].soccerID == sid)
            {
                return this.soccerArr[findSoccer].soccerState;
            }
        }
        return 0;
    }

    //改变球状态
    changeSoccerState(sid:number,state:number)
    {
        //根据足球ID找到足球
        for(var findSoccer:number = 0;findSoccer < this.soccerArr.length;findSoccer++)
        {
            if(this.soccerArr[findSoccer].soccerID == sid)
            {
                this.soccerArr[findSoccer].soccerState = state;
            }
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

    //震动-普攻
    earthquakeAttack()
    {
        tween(this.img_soccerField.node).to(0.05,{position:new Vec3(-1,-1,0)}).to(0.05,{position:new Vec3(0,1,0)})
            .to(0.05,{position:new Vec3(-1,-1,0)}).to(0.05,{position:new Vec3(0,1,0)})
            .to(0.05,{position:new Vec3(0,0,0)}).start();
    }

    //震动-暴击
    earthquakeCritical()
    {
        tween(this.img_soccerField.node).to(0.05,{position:new Vec3(-2,-2,0)}).to(0.05,{position:new Vec3(0,2,0)})
            .to(0.05,{position:new Vec3(-2,-2,0)}).to(0.05,{position:new Vec3(0,2,0)})
            .to(0.05,{position:new Vec3(0,0,0)}).start();
    }
    //震动-会心
    earthquakeBreakOut()
    {
        tween(this.img_soccerField.node).to(0.05,{position:new Vec3(-3,-3,0)}).to(0.05,{position:new Vec3(0,3,0)})
            .to(0.05,{position:new Vec3(-3,-3,0)}).to(0.05,{position:new Vec3(0,3,0)})
            .to(0.05,{position:new Vec3(0,0,0)}).start();
    }

    fogAni()
    {
        var _this = this;
        tween(this.img_fog.node).to(2,{position:new Vec3(0,0,0)}).delay(0.5).to(2,{position:new Vec3(750,0,0)}).start();
    }

    passWaveAni()
    {
        this.img_danger.node.active = true;
        this.img_danger.node.setPosition(800,92);
        // tween(this.icon_danger.node).to(0.5,{scale:v3(0.8,0.8,0)}).to(0.5,{scale:v3(1,1,0)}).to(0.5,{scale:v3(0.8,0.8,0)}).to(0.5,{scale:v3(1,1,0)}).start();
        tween(this.img_danger.node).to(0.3,{position:new Vec3(0,92,0)}).delay(1.4).to(0.3,{position:new Vec3(-800,0,0)}).start();

        setTimeout(() => {
            this.img_danger.node.active = false;
            this.passWave();
            this.soccerGameState = gameState.start;
        }, 2000);
    }

    passWave()
    {
        //清零所有怪物
        // this.node_enemy.removeAllChildren();
        // this.enemyArr = [];
        // this.recycleEnemyArr = [];
        //如果是章节结算，清零所有英雄
        //每波第一个敌人（怪物产生间隔从第二个开始）
        this.ariseEnemy();
        //球重新发球
        //非空英雄位
        var noTempheroArr:Array<heroStructure> = [];
        //查找非空位的英雄
        for(var fh:number = 0;fh < this.heroArr.length;fh++)
        {
            if(this.heroArr[fh].heroItem["temp"] == false)
            {
                noTempheroArr.push(this.heroArr[fh]);
            }
        }
        //球回到英雄发球位
        for(var soc:number = 0;soc < this.soccerArr.length;soc++)
        {
            //多个球时，从第一个开始发球
            if(soc == 0)
            {
                //随机一个英雄发球
                var newHeroIndex:number = Math.floor(Math.random() * noTempheroArr.length);
                //获取该英雄的x,y，使球起始位置在英雄脚下
                this.soccerArr[0].soccerItem.setPosition(noTempheroArr[newHeroIndex].heroItem.getPosition().x,
                    noTempheroArr[newHeroIndex].heroItem.getPosition().y - 20);
                //球状态改为发球
                this.soccerArr[0].soccerState = 1;
                //继承新发球的英雄属性
                this.soccerArr[0].relevanceHeroID = noTempheroArr[newHeroIndex].heroID;
                //找到最前面的敌人
                this.soccerArr[0].goalEnemySerialNum = this.findFrontEnemySerialNum();
                this.soccerArr[0].goalHeroID = 0;
            }else{
                //后面的球隐藏，等待发球
            }
        }
    }

    fightControllerFun(controllerEvent: GameEventName)
    {
        if(this.soccerGameState != gameState.start)
        {
            return;
        }
        switch(controllerEvent.getCustomProperty().eventCode)
        {
            case 1:
                //球碰到敌人
                var soState:number = this.findSoccerState(controllerEvent.getCustomProperty().soccerID);
                console.log("球与敌人碰撞状态",soState);
                //判断球的状态
                if(soState == 4)
                {
                    ///球从上往下，背面碰撞，运动轨迹不变，均无折返
                    //背面碰撞无伤害，回击除外
                    //判断是否带有回击BUFF
                    console.log("球与敌人背面碰撞");
                }else if(soState == 1 || soState == 3){
                    console.log("球与敌人正面碰撞",controllerEvent.getCustomProperty().enemySerialNum);
                    AudioMG.Instance.playSoundAudio("soccer_kick","soccer_kick");
                    //球从下往上，正面碰撞，运动轨迹改变，均向英雄折返
                    var rHeroID:number = 0;
                    var gSerialNum:number = 0;
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
                            this.createStrike(this.soccerArr[findSoccer].soccerItem.getPosition().x,this.soccerArr[findSoccer].soccerItem.getPosition().y);
                            //找到赋予球属性的英雄ID
                            rHeroID = this.soccerArr[findSoccer].relevanceHeroID;
                            gSerialNum = this.soccerArr[findSoccer].goalEnemySerialNum;
                            //目标敌人ID归0
                            this.soccerArr[findSoccer].goalEnemySerialNum = 0;
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
                                this.soccerArr[findSoccer].soccerItem.getChildByName("soccerNode").getChildByName("sp_tail").angle = 
                                    OperationTool.Instance.calculateAngle(this.soccerArr[findSoccer].soccerItem.getPosition().x, this.soccerArr[findSoccer].soccerItem.getPosition().y,
                                        this.heroArr[newHeroIndex].heroItem.getPosition().x, this.heroArr[newHeroIndex].heroItem.getPosition().y);
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
                            if(soState == 1)
                            {
                                //漏球时正面碰撞敌人，不算暴击和会心、技能
                                isBreakOutHarm = this.drawALotteryOrRaffle(this.heroArr[findHero].breakOutHarmChance);
                                if(isBreakOutHarm == false){
                                    isCritical = this.drawALotteryOrRaffle(this.heroArr[findHero].criticalChance);
                                }
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
                        this.earthquakeBreakOut();
                    }else if(isCritical)
                    {
                        lastHarm = baseHarm * 2;
                        harmType = 2;
                        this.earthquakeCritical();
                    }else{
                        lastHarm = baseHarm;
                    }
                    //取整，避免小数点
                    lastHarm = Math.floor(lastHarm);
                    //根据敌人ID查找敌人
                    for(var findEnemy:number = 0;findEnemy < this.enemyArr.length;findEnemy++)
                    {
                        // console.log("碰撞敌人ID",controllerEvent.getCustomProperty().enemyID,"敌人ID：",this.enemyArr[findEnemy].enemyID,
                        // "敌人HP：",this.enemyArr[findEnemy].HP,this.enemyArr.length);
                        if(this.enemyArr[findEnemy].enemyItem["enemySerialNum"] == controllerEvent.getCustomProperty().enemySerialNum)
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

                            //球状态变为回球
                            this.soccerArr[fSoccer].soccerState = 2;
                            this.leakSoccer = 0;

                            var newHP:number = this.enemyArr[findEnemy].HP - lastHarm;
                            //敌人受到伤害，并扣除血量，如扣除后的血量低于0，敌人消失
                            this.enemyArr[findEnemy].HP = newHP;
                            // console.log("扣血敌人ID：",controllerEvent.getCustomProperty().enemyID,"受到伤害：",lastHarm,"剩余血量：",
                            // this.enemyArr[findEnemy].HP,"血条比例：",this.enemyArr[findEnemy].HP/this.enemyArr[findEnemy].maxHP);
                            
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
                }
                break;
            case 2:
                //空位，球向英雄运动时判断空位，球碰墙向上折返时路过空位不改变状态
                if(controllerEvent.getCustomProperty().temp)
                {
                    if(this.findSoccerState(controllerEvent.getCustomProperty().soccerID) == 2)
                    {
                        //漏球，攻击力仍然为上一个英雄的值
                        this.changeSoccerState(controllerEvent.getCustomProperty().soccerID,5);
                    }else{
                        this.changeSoccerState(controllerEvent.getCustomProperty().soccerID,3);
                    }
                    return;
                }
                //球碰到英雄
                for(var soccerBack:number = 0;soccerBack < this.soccerArr.length;soccerBack++)
                {
                    if(this.soccerArr[soccerBack].soccerID == controllerEvent.getCustomProperty().soccerID)
                    {
                        //找到位置最前面的敌人发球
                        this.soccerArr[soccerBack].goalEnemySerialNum = this.findFrontEnemySerialNum();
                        //如果敌人已进入攻击状态，则选最近的攻击状态的敌人
                        console.log("目标敌人",this.soccerArr[soccerBack].goalEnemySerialNum);
                        //如果没有目标敌人（比如第一个死亡，第二个怪还没出），固定中心墙点（10,316）踢球
                        if(this.soccerArr[soccerBack].goalEnemySerialNum >= 0)
                        {
                            //球角度
                            //查找目标敌人在当前的位置
                            for(var findEnemy:number = 0;findEnemy < this.enemyArr.length;findEnemy++)
                            {
                                if(this.enemyArr[findEnemy].enemyItem["enemySerialNum"] == this.soccerArr[soccerBack].goalEnemySerialNum)
                                {
                                    this.soccerArr[soccerBack].soccerItem.getChildByName("soccerNode").getChildByName("sp_tail").angle = 
                                    OperationTool.Instance.calculateAngle(this.soccerArr[soccerBack].soccerItem.getPosition().x, this.soccerArr[soccerBack].soccerItem.getPosition().y,
                                        this.enemyArr[findEnemy].enemyItem.getPosition().x, this.enemyArr[findEnemy].enemyItem.getPosition().y);
                                }
                            }
                        }
                        
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
                        if(this.soccerArr[soccerBack].soccerState > 0)
                        {
                            //接球发球(碰墙时目标英雄为0,不继承属性)
                            if(this.soccerArr[soccerBack].goalHeroID != 0)
                            {
                                //目标英雄ID变为球新继承的属性英雄ID
                                this.soccerArr[soccerBack].relevanceHeroID = this.soccerArr[soccerBack].goalHeroID;
                                //目标英雄ID归0
                                this.soccerArr[soccerBack].goalHeroID = 0;
                            }
                        }else{
                            //初始发球时，需要让球继承英雄属性
                            this.soccerArr[soccerBack].relevanceHeroID = controllerEvent.getCustomProperty().heroID;
                        }
                        //球不论任何状态，碰到英雄均视为发球，球状态改变
                        this.soccerArr[soccerBack].soccerState = 1;
                        this.leakSoccer = 0;
                        AudioMG.Instance.playSoundAudio("soccer_kick","soccer_kick");
                        break;
                    }
                }
                let heroAttackSkeEvent = new GameEventName({ heroID:controllerEvent.getCustomProperty().heroID, aniName:"animation_tacck", aniLoop: false });
                GameCustomEvent.Instance.node.emit(GameEventName.HERO_SKE_EVENT, heroAttackSkeEvent);
                setTimeout(() => {
                    let heroIdleSkeEvent = new GameEventName({ heroID:controllerEvent.getCustomProperty().heroID, aniName:"animation_move", aniLoop: true });
                    GameCustomEvent.Instance.node.emit(GameEventName.HERO_SKE_EVENT, heroIdleSkeEvent);
                }, 700);
                break;
            case 3:
                //球碰到墙壁
                this.findSoccerState(controllerEvent.getCustomProperty().soccerID);
                //根据足球ID找到足球
                for(var findSoccer:number = 0;findSoccer < this.soccerArr.length;findSoccer++)
                {
                    if(this.soccerArr[findSoccer].soccerID == controllerEvent.getCustomProperty().soccerID)
                    {
                        if(controllerEvent.getCustomProperty().wallID == 1)
                        {
                            //漏球次数增加
                            if(this.leakSoccer < 2)
                            {
                                //y向下，随机一个英雄返回
                                // var newBSpeed:number = 0 - Math.abs(this.soccerArr[findSoccer].speed);
                                // this.soccerArr[findSoccer].speed = newBSpeed;
                                this.leakSoccer ++;
                                //改变球角度
                                // var newBAngle:number = 0 - Math.abs(this.soccerArr[findSoccer].soccerItem.getChildByName("sp_tail").angle);
                                // this.soccerArr[findSoccer].soccerItem.getChildByName("sp_tail").angle = newBAngle + 180;
                                //改变球状态
                                this.changeSoccerState(controllerEvent.getCustomProperty().soccerID,5);
                                // console.log("足球碰墙，球向下，状态5",this.soccerArr[findSoccer].speed);
                            }else{
                                //漏球达到2次，返回英雄
                                //根据足球ID找到足球
                                for(var findSoccer:number = 0;findSoccer < this.soccerArr.length;findSoccer++)
                                {
                                    if(this.soccerArr[findSoccer].soccerID == controllerEvent.getCustomProperty().soccerID)
                                    {
                                        //目标敌人ID归0
                                        this.soccerArr[findSoccer].goalEnemySerialNum = 0;
                                        //球状态变为回球
                                        this.soccerArr[findSoccer].soccerState = 2;
                                        //球随机一个英雄返回
                                        var newWtoHIndex = Math.floor(Math.random() * this.heroArr.length);
                                        //若随机的英雄已经在接球中，重选其他英雄
                                        // while(this.heroArr[newWtoHIndex].catchSoccerID != 0){
                                        //     newWtoHIndex = Math.floor(Math.random() * this.heroArr.length);
                                        // }
                                        //
                                        //目标英雄
                                        this.soccerArr[findSoccer].goalHeroID = this.heroArr[newWtoHIndex].heroID;
                                            this.soccerArr[findSoccer].soccerItem.getChildByName("soccerNode").getChildByName("sp_tail").angle = 
                                                OperationTool.Instance.calculateAngle(this.soccerArr[findSoccer].soccerItem.getPosition().x, this.soccerArr[findSoccer].soccerItem.getPosition().y,
                                                    this.heroArr[newWtoHIndex].heroItem.getPosition().x, this.heroArr[newWtoHIndex].heroItem.getPosition().y);
                                        // console.log("新英雄ID：",this.soccerArr[findSoccer].goalHeroID);
                                        //英雄状态变为接球
                                        this.heroArr[newWtoHIndex].catchSoccerID = this.soccerArr[findSoccer].soccerID;
                                        break;
                                    }
                                }
                                this.leakSoccer = 0;
                            }
                        }else if(controllerEvent.getCustomProperty().wallID == 2)
                        {
                            //y向上，随机一个x点，如果中途穿过英雄，赋予英雄属性，如果中途穿过敌人，造成1/5的伤害
                            // var newTSpeed:number = Math.abs(this.soccerArr[findSoccer].speed);
                            // this.soccerArr[findSoccer].speed = newTSpeed;
                            // var newTAngle:number = this.soccerArr[findSoccer].soccerItem.getChildByName("sp_tail").angle - 180;
                            // this.soccerArr[findSoccer].soccerItem.getChildByName("sp_tail").angle = newTAngle;
                            //改变球状态
                            this.changeSoccerState(controllerEvent.getCustomProperty().soccerID,3);
                            // console.log("足球碰墙，球向上，状态3",this.soccerArr[findSoccer].speed);
                        }else if(controllerEvent.getCustomProperty().wallID == 3 || controllerEvent.getCustomProperty().wallID == 4)
                        {
                            //改变球x轴方向的速度，向右左，y上下
                            this.soccerArr[findSoccer].speedWallX = 0 - this.soccerArr[findSoccer].speedWallX;
                            //角度左右翻转
                            // this.soccerArr[soccerBack].soccerItem.getChildByName("sp_tail").angle = 
                            //     OperationTool.Instance.calculateAngle(this.soccerArr[soccerBack].soccerItem.getPosition().x, this.soccerArr[soccerBack].soccerItem.getPosition().y,
                            //         this.enemyArr[findEnemy].enemyItem.getPosition().x, this.enemyArr[findEnemy].enemyItem.getPosition().y);
                            //改变球的角度
                            // var newLRAngle:number = 180 - this.soccerArr[findSoccer].soccerItem.getChildByName("sp_tail").angle;
                            // this.soccerArr[findSoccer].soccerItem.getChildByName("sp_tail").angle = newLRAngle;
                        }
                        break;
                    }
                }
                break;
            case 4:
                //子弹碰到英雄，子弹消失，总血条扣血
                if(this.HP <= 0)
                {
                    //游戏失败，重新开始
                }
                break;
        }
    }

    soccerGame()
    {
        if(this.soccerGameState == gameState.start)
        {
            //弹出界面互斥 游戏失败 > 升级选牌 > 通关
            //判断游戏是否失败
            if(this.HP <= 0)
            {
                this.soccerGameState = gameState.over;
                //弹出失败页面
                Layer.Instance.show("lose",Layer.Instance.layerView);
            }
            //判断是否升级
            else if(this.EXP >= this.maxEXP)
            {
                //本级升级溢出的经验，添加到下一级升级的经验中
                this.overflowEXP = this.EXP - this.maxEXP;
                this.EXP = this.overflowEXP;
                //升级
                this.playerLevel++;
                this.updatePlayerMaxEXP();
                this.freshEXP();
                //弹出酒馆选牌界面
                this.soccerGameState = gameState.stop;
                // let pathAmplificationCard = Layer.Instance.getGamePrePath("amplificationCard");
                // LoadImgTool.Instance.loadPrefab("amplificationCard",pathAmplificationCard,Layer.Instance.layerView,false);
                Layer.Instance.show("amplificationCard",Layer.Instance.layerView);
                //刷新卡牌
                GameCustomEvent.Instance.node.emit(GameEventName.AMPLIFICATION_CARD_FRESH_EVENT);
                return;
            }
            //判断波次是否通关
            else if(this.saveWave.BossID == 0)
            {
                //没有Boss的普通小怪关卡
                if(this.enemyArr.length == 0 && this.saveWave.total == 0)
                {
                    console.log("所有怪物已死亡，进入结算");
                    this.soccerGameState = gameState.result;
                    //读取下一波数据
                    this.readNextWave();
                }
            }else if(this.saveWave.BossID >= 0)
            {
                //判断Boss是否死亡
                //Boss死亡直接通关，不管其余小怪是否死亡
            }
            
            if(this.enemyIntervalTime > 0)
            {
                this.enemyIntervalTime--;
                if(this.enemyIntervalTime <= 0)
                {
                    this.enemyIntervalTime = this.saveWave.intervalTime;
                    //通过怪物权重创建怪物
                    this.ariseEnemy();
                }
            }
            //Boss在规定时间出现
            if(this.saveWave.BossID != 0 && this.saveWave.BossBornTime > 0)
            {
                this.saveWave.BossBornTime--;
                if(this.saveWave.BossBornTime <= 0)
                {
                    this.createEnemy(this.saveWave.BossID);
                }else if(this.enemyArr.length == 0 && this.saveWave.total == 0)
                {
                    //若所有小怪死亡，Boss提前出现
                    this.createEnemy(this.saveWave.BossID);
                    //不再进入Boss出现计时
                    this.saveWave.BossBornTime = -1;
                }
            }
            //检测敌人是否死亡
            // this.enemyDead();
            //背景移动
            // this.fightBgY = this.img_fightBg.node.getPosition().y - this.mapMoveSpeed;
            // this.fightLinkUpBgY = this.img_fightLinkUpBg.node.getPosition().y - this.mapMoveSpeed;
            // if(this.img_fightBg.node.getPosition().y < -667)
            // {
            //     this.img_fightBg.node.setPosition(this.img_fightBg.node.getPosition().x,this.fightLinkUpBgY + 1334);
            // }else{
            //     this.img_fightBg.node.setPosition(this.img_fightBg.node.getPosition().x,this.img_fightBg.node.getPosition().y - this.mapMoveSpeed);
            // }
            // if(this.img_fightLinkUpBg.node.getPosition().y < -667)
            // {
            //     this.img_fightLinkUpBg.node.setPosition(this.img_fightLinkUpBg.node.getPosition().x,this.fightBgY + 1334);
            // }else{
            //     this.img_fightLinkUpBg.node.setPosition(this.img_fightLinkUpBg.node.getPosition().x,this.img_fightLinkUpBg.node.getPosition().y - this.mapMoveSpeed);
            // }

            //敌人移动
            for(var moveEnemy:number = 0;moveEnemy < this.enemyArr.length;moveEnemy++)
            {
                if(this.enemyArr[moveEnemy].enemyItem != null)
                {
                    //如果走到了发动攻击位置，y不再变，攻击水晶
                    if(this.enemyArr[moveEnemy].enemyItem.getPosition().y < this.enemyStopY)
                    {
                        //敌人进入攻击计时
                        if(this.enemyArr[moveEnemy].attackSpeedTime > 0)
                        {
                            this.enemyArr[moveEnemy].attackSpeedTime--;
                            if(this.enemyArr[moveEnemy].attackSpeedTime <= 0)
                            {
                                this.enemyArr[moveEnemy].attackSpeedTime = this.enemyArr[moveEnemy].attackSpeed;
                                //水晶扣血
                                this.HP -= this.enemyArr[moveEnemy].harm;
                                this.freshHP();
                                console.log("扣血：",this.HP);
                            }
                            //投射子弹
                            // this.createBullet(this.enemyArr[moveEnemy].enemyItem);
                            // this.enemyArr[moveEnemy].attakState = 1;
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
                for(var bi:number = 0;bi < 6;bi++)
                {
                    if(bi < 5)
                    {
                        if(this.soccerArr[ballRoll].soccerItem.getChildByName("soccerNode").getChildByName("soccer_" + (bi + 1)).getComponent(UIOpacity).opacity == 255)
                        {
                            this.soccerArr[ballRoll].soccerItem.getChildByName("soccerNode").getChildByName("soccer_" + (bi + 1)).getComponent(UIOpacity).opacity = 1;
                            this.soccerArr[ballRoll].soccerItem.getChildByName("soccerNode").getChildByName("soccer_" + (bi + 2)).getComponent(UIOpacity).opacity = 255;
                            break;
                        }
                    }else if(bi == 5){
                        this.soccerArr[ballRoll].soccerItem.getChildByName("soccerNode").getChildByName("soccer_6").getComponent(UIOpacity).opacity = 1;
                        this.soccerArr[ballRoll].soccerItem.getChildByName("soccerNode").getChildByName("soccer_1").getComponent(UIOpacity).opacity = 255;
                    }
                }
            }
            
            //球撞击后爆炸动画
            for(var sa:number = 0;sa < this.strikeArr.length;sa++)
            {
                for(var si:number = 0;si < 15;si++)
                {
                    if(si < 14)
                    {
                        if(this.strikeArr[sa].strikeItem.getChildByName("strike_" + (si + 1)).getComponent(UIOpacity).opacity == 255)
                        {
                            this.strikeArr[sa].strikeItem.getChildByName("strike_" + (si + 1)).getComponent(UIOpacity).opacity = 1;
                            this.strikeArr[sa].strikeItem.getChildByName("strike_" + (si + 2)).getComponent(UIOpacity).opacity = 255;
                            break;
                        }
                    }else if(si == 14){
                        this.strikeArr[sa].strikeItem.getChildByName("strike_15").getComponent(UIOpacity).opacity = 1;
                        this.strikeArr.splice(sa,1);
                    }
                }
            }
        
            //球移动
            for(var so:number = 0;so < this.soccerArr.length;so++)
            {
                //是否为出球状态
                if(this.soccerArr[so].soccerState == 1)
                {
                    //出球时球外观变小
                    if(this.soccerScale > 0.5)
                    {
                        this.soccerScale -= this.soccerBigSmall;
                        this.soccerArr[so].soccerItem.getChildByName("soccerNode").scale = v3(this.soccerScale,this.soccerScale,0);
                    }
                    //是否有目标敌人，若失去进攻敌人，变为漏球碰墙
                    if(this.soccerArr[so].goalEnemySerialNum <= 0)
                    {
                        //没有目标敌人时，以之前的x,y速度向墙运动，墙边界 y 0 上 1334 下 x 0 左 750 右
                        console.log("失去进攻敌人，漏球碰墙：");
                        this.changeSoccerState(this.soccerArr[so].soccerID,3);
                        let lastWallX:number = 0;
                        let lastWallY:number = 0;
                        lastWallX = this.soccerArr[so].soccerItem.getPosition().x - this.soccerArr[so].speedWallX;
                        lastWallY = this.soccerArr[so].soccerItem.getPosition().y + this.soccerArr[so].speed;
                        this.soccerArr[so].soccerItem.setPosition(lastWallX,lastWallY);
                    }else{
                        //查找目标敌人在当前的位置
                        for(var findEnemy:number = 0;findEnemy < this.enemyArr.length;findEnemy++)
                        {
                            if(this.enemyArr[findEnemy].enemyItem["enemySerialNum"] == this.soccerArr[so].goalEnemySerialNum)
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
                                lastX = this.soccerArr[so].soccerItem.getPosition().x + lastSpeedX;
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
                    //回球时球外观变大
                    if(this.soccerScale < 1)
                    {
                        this.soccerScale += this.soccerBigSmall;
                        this.soccerArr[so].soccerItem.getChildByName("soccerNode").scale = v3(this.soccerScale,this.soccerScale,0);
                    }
                    //是否有目标英雄
                    if(this.soccerArr[so].goalHeroID == 0)
                    {
                        //没有目标英雄时，取墙的x,y
                        console.log("没有目标英雄时，向墙运动2：");
                        this.changeSoccerState(this.soccerArr[so].soccerID,3);
                        let lastWallX:number = 0;
                        let lastWallY:number = 0;
                        lastWallX = this.soccerArr[so].soccerItem.getPosition().x - this.soccerArr[so].speedWallX;
                        lastWallY = this.soccerArr[so].soccerItem.getPosition().y - this.soccerArr[so].speed;
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
                                lastX = this.soccerArr[so].soccerItem.getPosition().x - lastSpeedX;
                                lastY = this.soccerArr[so].soccerItem.getPosition().y - this.soccerArr[so].speed;

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
                }else if(this.soccerArr[so].soccerState >= 3 || this.soccerArr[so].soccerState <= 6){
                    if(this.soccerArr[so].soccerState == 3 || this.soccerArr[so].soccerState == 4)
                    {
                        //出球时球外观变小
                        if(this.soccerScale > 0.5)
                        {
                            this.soccerScale -= this.soccerBigSmall;
                            this.soccerArr[so].soccerItem.getChildByName("soccerNode").scale = v3(this.soccerScale,this.soccerScale,0);
                        }
                    }else if(this.soccerArr[so].soccerState == 5 || this.soccerArr[so].soccerState == 6)
                    {
                        //回球时球外观变大
                        if(this.soccerScale < 1)
                        {
                            this.soccerScale += this.soccerBigSmall;
                            this.soccerArr[so].soccerItem.getChildByName("soccerNode").scale = v3(this.soccerScale,this.soccerScale,0);
                        }
                    }
                    
                    let lastWallX:number = 0;
                    let lastWallY:number = 0;
                    lastWallX = this.soccerArr[so].soccerItem.getPosition().x - this.soccerArr[so].speedWallX;
                    if(this.soccerArr[so].soccerState == 3)
                    {
                        lastWallY = this.soccerArr[so].soccerItem.getPosition().y + this.soccerArr[so].speed;
                        this.nextSoccerY = lastWallY + this.soccerArr[so].speed;
                    }else if(this.soccerArr[so].soccerState == 5){
                        lastWallY = this.soccerArr[so].soccerItem.getPosition().y - this.soccerArr[so].speed;
                        this.nextSoccerY = lastWallY - this.soccerArr[so].speed;
                    }
                    this.nextSoccerX = lastWallX - this.soccerArr[so].speedWallX;
                    this.soccerArr[so].soccerItem.setPosition(lastWallX,lastWallY);
                    //碰墙改变角度
                    this.soccerArr[so].soccerItem.getChildByName("soccerNode").getChildByName("sp_tail").angle = 
                        OperationTool.Instance.calculateAngle(lastWallX,lastWallY,this.nextSoccerX,this.nextSoccerY);
                    // console.log("漏球没有目标,本次xy：",lastWallX,lastWallY,"漏球没有目标,下次xy：",this.nextSoccerX,this.nextSoccerY);
                }
            }
        }else if(this.soccerGameState == gameState.stop)
        {
            //打开抽卡（酒馆）界面
        }else if(this.soccerGameState == gameState.result)
        {
            //结算
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
    
    //帧动画 fraAniArr 动画数组 prefixName 前缀名 maxNum 最大的帧 loop 是否循环播放 aniItem 创建的装图片材质的node
    frameAnimation(fraAniArr:Array<any>,prefixName:string,maxNum:number,loop:boolean)
    {
        for(var sa:number = 0;sa < fraAniArr.length;sa++)
        {
            for(var si:number = 0;si < maxNum;si++)
            {
                if(si < maxNum - 1)
                {
                    if(fraAniArr[sa].aniItem.getChildByName(prefixName + (si + 1)).getComponent(UIOpacity).opacity == 255)
                    {
                        fraAniArr[sa].aniItem.getChildByName(prefixName + (si + 1)).getComponent(UIOpacity).opacity = 1;
                        fraAniArr[sa].aniItem.getChildByName(prefixName + (si + 2)).getComponent(UIOpacity).opacity = 255;
                        break;
                    }
                }else if(si == maxNum -1){
                    if(loop)
                    {
                        fraAniArr[sa].aniItem.getChildByName(prefixName + maxNum).getComponent(UIOpacity).opacity = 1;
                        fraAniArr[sa].aniItem.getChildByName(prefixName + 1).getComponent(UIOpacity).opacity = 255;
                    }else{
                        fraAniArr[sa].aniItem.getChildByName(prefixName + maxNum).getComponent(UIOpacity).opacity = 1;
                        fraAniArr.splice(sa,1);
                    }
                }
            }
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
