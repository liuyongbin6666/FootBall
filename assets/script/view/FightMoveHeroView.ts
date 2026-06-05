import { _decorator, Component, Node, Sprite, Label, Button, find, Prefab, instantiate, ProgressBar, tween, Vec3, Color, UIOpacity, sp, v3, AudioClip, AudioSource, UITransform } from 'cc';
import { bulletStructure, enemyStructure, heroStructure, levelStructure, locationTableStructure, relevanceProStructure, soccerStructure, waveStructure } from '../data/GlobalStructure';
import { LoadImgTool } from '../tool/LoadImgTool';
import { OperationTool } from '../tool/OperationTool';
import { GameCustomEvent } from '../manager/GameCustomEvent';
import { GameEventName } from '../manager/GameEventName';
import { Layer } from '../manager/Layer';
import { GlobalData } from '../data/GlobalData';
import { SDK } from '../../BHY_Framework/Sdk/SDK';
import { AudioMG } from '../sound/AudioMG';
import { TimeTool } from '../tool/TimeTool';
const { ccclass, property } = _decorator;

/**
 * 战斗界面-英雄移动版
 */
@ccclass('FightMoveHeroView')
export class FightMoveHeroView extends Component {
    /**
     * 组件
    */
    @property(Prefab)
    private heroItemPre: Prefab = null;

    @property(Prefab)
    private enemySmallItemPre: Prefab = null;

    @property(Prefab)
    private enemyMiddleItemPre: Prefab = null;

    @property(Prefab)
    private enemyBigItemPre: Prefab = null;

    @property(Prefab)
    private bossItemPre: Prefab = null;

    @property(Prefab)
    private trophyItem: Prefab = null;

    @property(Prefab)
    private soccerItemPre: Prefab = null;
    
    @property(Prefab)
    private bulletItemPre: Prefab = null;

    @property(Prefab)
    private harmItemPre: Prefab = null;

    @property(Prefab)
    private strikeItemPre: Prefab = null;

    //静态背景
    private img_soccerField:Sprite;
    //动态背景
    private img_fightBg:Sprite;
    //衔接背景
    private img_fightLinkUpBg:Sprite;
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
    private node_moveHero:Node;
    private btn_moveHero:Button;
    //掉落金币
    private lab_gold:Label;
    private lab_level:Label;
    private lab_wave:Label;
    //倒计时
    private img_sandClockBG:Sprite;
    private lab_countDown:Label;
    //boss
    private node_boss:Node;
    
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
    //暂停
    private btn_pause:Button;
    //广告
    // private btn_adv:Button;
    private lab_allHarm:Label;
    //连击
    private lab_doubleHit:Label;
    //连击伤害加层百分比
    private lab_addingStory:Label;
    
    private node_menu:Node;
    private btn_close:Button;
    private btn_cancel:Button;

    /**
     * 数据
    */
    //7个英雄（空位）数据
    private heroArr:Array<heroStructure> = [];
    //上阵过的英雄数据（已下阵不会清除掉已升级的英雄数据）
    private oldHeroArr:Array<heroStructure> = [];
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
    //当前总攻击力
    private allAttack:number = 0;
    //本章节内造成的伤害总和
    private harmTotal:number = 0;
    //连击次数统计
    private doubleHit:number = 0;
    //最高连击次数
    private maxDoubleHit:number = 0;

    //英雄槽
    private heroGrooveArr:Array<any>;
    //道具槽
    private propGrooveArr:Array<any>;
    //计时器时间
    private timeHS:number = 0.01;
    //地图移动速度
    private mapMoveSpeed:number = 0.2;
    //所有英雄固定y站位
    private heroImmobilizationY:number = -262;
    //英雄x轴间距
    private heroXInterval:number = 50;
    //英雄起始位置
    private heroInitialPosition:number = -150;

    //移动块和鼠标的x差值
    private moveIntervalX:number = 0;
    private lastMoveX:number = 0;
    //拖动左侧的最大x
    private moveLeftX:number = 0;
    //拖动右侧最大的x
    private moveRightX:number = 0;
    private lastMoveHeroX:number = 0;
    //是否在移动英雄
    private moveHeroState:boolean = false;
    //移动间隔时间
    private moveHeroIntervalTime:number = 0;

    //敌人编号（因为能创建同一个类型，需要用编号来区分）
    private enemySerialNum:number = 10000;
    //敌人子弹速度
    private bulletSpeed:number = 5;
    //敌人产生间隔
    private enemyIntervalTime:number = -1;
    //足球外观大小
    private soccerScale:number = 1;
    //足球外观每次缩小/增大的值
    private soccerBigSmall:number = 0.005;
    //足球会到的下一个x位置
    private nextSoccerX:number = 0;
    //足球会到的下一个y位置
    private nextSoccerY:number = 0;

    private changeHeroState:boolean = false;

    //暂存波次
    private saveWave:waveStructure = null;
    private saveLevel:levelStructure = null;
    //障碍/宝箱的随机出现位置
    private saveLocationArr:Array<locationTableStructure> = [];
    protected onLoad(): void {
        this._initObect();
        this._onEvent();
    }

    private _initObect() {
        this.img_soccerField = find('img_soccerField', this.node).getComponent(Sprite);
        this.img_fightBg = find('img_fightBg', this.node).getComponent(Sprite);
        this.img_fightLinkUpBg = find('img_fightLinkUpBg', this.node).getComponent(Sprite);
        this.topWall = find('node_wall/topWall', this.node);
        this.bottomWall = find('node_wall/bottomWall', this.node);
        this.leftWall = find('node_wall/leftWall', this.node);
        this.rightWall = find('node_wall/rightWall', this.node);
        this.node_enemy = find('node_enemy', this.node);
        this.node_soccer = find('node_soccer', this.node);
        this.node_hero = find('node_moveHero/node_hero', this.node);
        this.node_moveHero = find('node_moveHero', this.node);
        this.btn_moveHero = find('node_moveHero/btn_moveHero', this.node).getComponent(Button);
        this.lab_gold = find('node_top/lab_gold', this.node).getComponent(Label);
        this.lab_level = find('node_top/lab_level', this.node).getComponent(Label);
        this.lab_wave = find('node_top/lab_wave', this.node).getComponent(Label);
        this.img_sandClockBG = find('node_top/img_sandClockBG', this.node).getComponent(Sprite);
        this.lab_countDown = find('node_top/img_sandClockBG/lab_countDown', this.node).getComponent(Label);
        this.node_boss = find('node_top/node_boss', this.node);

        this.img_danger = find('node_middle/img_danger', this.node).getComponent(Sprite);
        this.lab_allHarm = find('node_middle/img_harmRecordBg/lab_allHarm', this.node).getComponent(Label);
        this.lab_doubleHit = find('node_middle/img_harmRecordBg/lab_doubleHit', this.node).getComponent(Label);
        this.lab_addingStory = find('node_middle/img_harmRecordBg/lab_addingStory', this.node).getComponent(Label);

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
        this.btn_pause = find('node_bottom/btn_pause', this.node).getComponent(Button);
        // this.btn_adv = find('node_bottom/btn_adv', this.node).getComponent(Button);

        this.node_menu = find('node_menu', this.node);
        this.btn_close = find('node_menu/img_pop_bg/btn_close', this.node).getComponent(Button);
        this.btn_cancel = find('node_menu/img_pop_bg/btn_cancel', this.node).getComponent(Button);
    }

    private _onEvent() {
        this.btn_moveHero.node.on(Node.EventType.TOUCH_START, this.startMoveHero, this);
        this.btn_moveHero.node.on(Node.EventType.TOUCH_MOVE, this.moveHero, this);
        // this.btn_prop1.node.on(Node.EventType.TOUCH_END, this.conjure, this);
        // this.btn_prop2.node.on(Node.EventType.TOUCH_END, this.conjure, this);
        // this.btn_prop3.node.on(Node.EventType.TOUCH_END, this.conjure, this);
        // this.btn_prop4.node.on(Node.EventType.TOUCH_END, this.conjure, this);
        // this.btn_prop5.node.on(Node.EventType.TOUCH_END, this.conjure, this);
        this.btn_set.node.on(Node.EventType.TOUCH_END, this.openSet, this);
        this.btn_pause.node.on(Node.EventType.TOUCH_END, this.openMenu, this);
        // this.btn_adv.node.on(Node.EventType.TOUCH_END, this.openAdv, this);
        this.btn_close.node.on(Node.EventType.TOUCH_END, this.closeView, this);
        this.btn_cancel.node.on(Node.EventType.TOUCH_END, this.closeMenu, this);
        GameCustomEvent.Instance.addCustomEvent(GameEventName.FIGHT_COLLISION_EVENT,this.fightControllerFun,this);
        GameCustomEvent.Instance.addCustomEvent(GameEventName.FIGHT_OTHER_VIEW_EVENT,this.otherViewEveFun,this);
    }

    start() {
        this.node_menu.active = false;
        this.node_boss.active = false;
        this.topWall["wallID"] = 1;
        this.bottomWall["wallID"] = 2;
        this.leftWall["wallID"] = 3;
        this.rightWall["wallID"] = 4;
    }

    //初始化战斗
    initFight()
    {
        this.copyLocation();
        this.lastMoveHeroX = this.node_moveHero.getPosition().x;

        this.img_danger.node.active = false;

        //首波敌人
        this.enemyFirstOutput();

        this.heroShow();
        this.createSoccer();
        this.updatePlayerMaxEXP();
        this.freshWave();
        this.freshHP();
        this.freshEXP();
        this.soccerGameState = gameState.start;

        AudioMG.Instance.changeMusicAudio("audio/battle_bgyy");
        
        Layer.Instance.show("battleHeroState",Layer.Instance.layerView);

        this.schedule(this.soccerGame,this.timeHS);

        //预加载
        let pathlevelPass = Layer.Instance.getGamePrePath("levelPass");
        LoadImgTool.Instance.loadPrefab("levelPass",pathlevelPass,Layer.Instance.layerView,false);
    }
    
    //看视频得奖励
    openAdv()
    {
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

        this.heroArr = [];
        this.oldHeroArr = [];
        this.enemyArr = [];
        this.soccerArr = [];

        this.soccerGameState = gameState.wait;
        this.HP = 0;
        this.EXP = 0;
        this.allAttack = 0;
        this.maxHP = 0;
        this.maxEXP = 0;

        //编号重置
        this.enemySerialNum = 10000;
        // this.recycleEnemyArr = [];
    }

    //重新开始
    restart()
    {
        this.img_danger.node.active = false;

        //首波敌人
        this.enemyFirstOutput();
        
        this.heroShow();
        this.createSoccer();
        //球变为发球状态
        this.soccerArr[0].soccerState = 1;
        this.updatePlayerMaxEXP();
        this.freshWave();
        this.freshHP();
        this.freshEXP();
        this.soccerGameState = gameState.start;
    }

    //障碍/宝箱位置
    copyLocation()
    {
        if(this.saveLocationArr.length != GlobalData.Instance.locationArr.length)
        {
            this.saveLocationArr = [];
            for(var la:number = 0;la < GlobalData.Instance.locationArr.length;la++)
            {
                var newLocation:locationTableStructure = {locationID:GlobalData.Instance.locationArr[la].locationID,
                    locationX:GlobalData.Instance.locationArr[la].locationX,locationY:GlobalData.Instance.locationArr[la].locationY
                }
                this.saveLocationArr.push(newLocation);
            }
        }
    }

    //复制英雄数据 hrArr 英雄数组 copyHrArr被复制的英雄数组
    copyHeroArrFun(hrArr:Array<heroStructure>,copyHrArr:Array<heroStructure>)
    {
        //不能直接=数组，会变成索引，修改该数组会影响原数组的值
        var hero:heroStructure = {heroID:0,heroImgPath:"img/hero/hero1",heroHeadImgPath:"img/hero/heroHead/icon_heroHead_1",heroSkePath:"spine/hero/hero101/hero101",
            heroName:"空位",heroIntroduce:"英雄介绍",heroType:0,quality:1,restrainType:1,maxHP:30,skillArr:[],speed:1,harm:10,
            criticalChance:20,breakOutHarmChance:30,heroItem:null,heroIndex:0,HP:10,catchSoccerID:0,unlock:true,
            join:false,harmLevel:0,criticalLevel:0,breakOutLevel:0,HPLevel:0,skillProArr:[],promoteTotal:0};
        //清空数组
        hrArr = [];
        for(var h:number = 0;h < copyHrArr.length;h++)
        {
            hero.heroID = copyHrArr[h].heroID;
            hero.heroImgPath = copyHrArr[h].heroImgPath;
            hero.heroHeadImgPath = copyHrArr[h].heroHeadImgPath;
            hero.heroSkePath = copyHrArr[h].heroSkePath;
            hero.heroName = copyHrArr[h].heroName;
            hero.heroIntroduce = copyHrArr[h].heroIntroduce;
            hero.heroType = copyHrArr[h].heroType;
            hero.quality = copyHrArr[h].quality;
            hero.restrainType = copyHrArr[h].restrainType;
            hero.maxHP = copyHrArr[h].maxHP;
            hero.HP = copyHrArr[h].maxHP;
            hero.skillArr = copyHrArr[h].skillArr;
            hero.skillProArr = copyHrArr[h].skillProArr;
            hero.promoteTotal = copyHrArr[h].promoteTotal;
            hero.speed = copyHrArr[h].speed;
            hero.harm = copyHrArr[h].harm;
            hero.criticalChance = copyHrArr[h].criticalChance;
            hero.breakOutHarmChance = copyHrArr[h].breakOutHarmChance;
            hero.join = copyHrArr[h].join;
            hero.unlock = copyHrArr[h].unlock;
            hrArr.push(hero);
        }
    }

    readRecord(cid:number)
    {
        // for(var findChapter:number = 0;findChapter < GlobalData.Instance.chapterTableArr.length;findChapter++)
        // {
        //     //选中的章节
        //     if(GlobalData.Instance.chapterTableArr[findChapter].chapterID == cid)
        //     {
        //         //初始英雄数组
        //         this.readHeroData(GlobalData.Instance.chapterTableArr[findChapter].initialHeroArr);
        //         break;
        //     }
        // }
        for(var findChapter:number = 0;findChapter < GlobalData.Instance.chapterTableArr.length;findChapter++)
        {
            //当前章节
            if(GlobalData.Instance.chapterTableArr[findChapter].chapterID == GlobalData.Instance.gameRecord.chapterID)
            {
                //如果记录为0，为重置该关卡，默认从第一个关卡开始
                if(GlobalData.Instance.gameRecord.levelID == 0)
                {
                    //首次进入游戏
                    GlobalData.Instance.gameRecord.levelID = GlobalData.Instance.chapterTableArr[findChapter].levelArr[0];
                    //初始化英雄数组
                    this.readHeroData(GlobalData.Instance.chapterTableArr[findChapter].initialHeroArr,true);
                }else{
                    //继续游戏时，英雄数据为之前所达成关卡的数据
                    this.copyHeroArrFun(this.oldHeroArr,GlobalData.Instance.gameRecord.levelHeroArr);
                    //初始化英雄数组
                    this.readHeroData(GlobalData.Instance.chapterTableArr[findChapter].initialHeroArr,false);
                }
                break;
            }
        }
        
        for(var findLevel:number = 0;findLevel < GlobalData.Instance.levelTableArr.length;findLevel++){
            //当前关卡
            if(GlobalData.Instance.levelTableArr[findLevel].levelID == GlobalData.Instance.gameRecord.levelID)
            {
                var LevelOne:levelStructure = {levelID:GlobalData.Instance.levelTableArr[findLevel].levelID,
                    levelName:GlobalData.Instance.levelTableArr[findLevel].levelName,
                    levelType:GlobalData.Instance.levelTableArr[findLevel].levelType,
                    stillLife:GlobalData.Instance.levelTableArr[findLevel].stillLife,
                    maxTime:GlobalData.Instance.levelTableArr[findLevel].maxTime,
                    nextLevelArr:GlobalData.Instance.levelTableArr[findLevel].nextLevelArr,
                    waveArr:GlobalData.Instance.levelTableArr[findLevel].waveArr,
                    levelImgPath:GlobalData.Instance.levelTableArr[findLevel].levelImgPath,
                    levelMusicPath:GlobalData.Instance.levelTableArr[findLevel].levelMusicPath,
                    dropGold:GlobalData.Instance.levelTableArr[findLevel].dropGold,
                    dropGoodsArr:GlobalData.Instance.levelTableArr[findLevel].dropGoodsArr,
                    taskArr:GlobalData.Instance.levelTableArr[findLevel].taskArr};
                this.saveLevel = LevelOne;
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
                            BossBornTime:GlobalData.Instance.waveTableArr[findWave].BossBornTime,
                            minEnemy:GlobalData.Instance.waveTableArr[findWave].minEnemy};
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
                                        BossBornTime:GlobalData.Instance.waveTableArr[findWave].BossBornTime,
                                        minEnemy:GlobalData.Instance.waveTableArr[findWave].minEnemy}
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
                this.levelPassFun();
            }else{
                //章节结算，最后一个关卡无关卡结算
                this.chapterResultFun();
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
                            BossBornTime:GlobalData.Instance.waveTableArr[findWave].BossBornTime,
                            minEnemy:GlobalData.Instance.waveTableArr[findWave].minEnemy}
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
    readHeroData(iHeroArr:Array<number>,isFrist:boolean)
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
            if(isFrist)
            {
                this.createNewHeroOrTemp(csHeroID,ch);
            }else{
                this.createOldHeroOrTemp(csHeroID,ch);
            }
        }
    }

    //首次游戏或第一关时，创建英雄或英雄空位（只需要读表数据）
    createNewHeroOrTemp(hid:number,hIndex:number)
    {
        var hero:heroStructure = {heroID:hid,heroImgPath:"img/hero/hero1",heroHeadImgPath:"img/hero/heroHead/icon_heroHead_1",heroSkePath:"spine/hero/hero101/hero101",
            heroName:"空位",heroIntroduce:"英雄介绍",heroType:0,quality:1,restrainType:1,maxHP:30,skillArr:[],speed:1,harm:10,
            criticalChance:20,breakOutHarmChance:30,heroItem:null,heroIndex:hIndex,HP:10,catchSoccerID:0,unlock:true,
            join:false,harmLevel:0,criticalLevel:0,breakOutLevel:0,HPLevel:0,skillProArr:[],promoteTotal:0};
        for(var ht:number = 0;ht < GlobalData.Instance.heroTableArr.length;ht++)
        {
            if(GlobalData.Instance.heroTableArr[ht].heroID == hid)
            {
                //赋予静态属性
                hero.heroID = GlobalData.Instance.heroTableArr[ht].heroID;
                hero.heroImgPath = GlobalData.Instance.heroTableArr[ht].heroImgPath;
                hero.heroHeadImgPath = GlobalData.Instance.heroTableArr[ht].heroHeadImgPath;
                hero.heroSkePath = GlobalData.Instance.heroTableArr[ht].heroSkePath;
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
                this.allAttack += hero.harm;
                hero.criticalChance = GlobalData.Instance.heroTableArr[ht].criticalChance;
                hero.breakOutHarmChance = GlobalData.Instance.heroTableArr[ht].breakOutHarmChance;
                hero.join = true;
                hero.unlock = true;
                if(hero.heroType > 0)
                {
                    //如果不为空位，将英雄添加到已上阵数组
                    this.joinHero(hero);
                }
                break;
            }
        }
        this.heroArr.push(hero);
        this.moveHeroStance(GlobalData.Instance.joinHeroArr.length);
    }

    //非首次或继续游戏时，创建英雄或英雄空位（需要保留已经升级的数据）
    createOldHeroOrTemp(hid:number,hIndex:number)
    {
        var hero:heroStructure = {heroID:hid,heroImgPath:"img/hero/hero1",heroHeadImgPath:"img/hero/heroHead/icon_heroHead_1",heroSkePath:"spine/hero/hero101/hero101",
            heroName:"空位",heroIntroduce:"英雄介绍",heroType:0,quality:1,restrainType:1,maxHP:30,skillArr:[],speed:1,harm:10,
            criticalChance:20,breakOutHarmChance:30,heroItem:null,heroIndex:hIndex,HP:10,catchSoccerID:0,unlock:true,
            join:false,harmLevel:0,criticalLevel:0,breakOutLevel:0,HPLevel:0,skillProArr:[],promoteTotal:0};
        for(var jh:number = 0;jh < this.oldHeroArr.length;jh++)
        {
            if(this.oldHeroArr[jh].heroID == hid)
            {
                hero.heroID = this.oldHeroArr[jh].heroID;
                hero.heroImgPath = this.oldHeroArr[jh].heroImgPath;
                hero.heroHeadImgPath = this.oldHeroArr[jh].heroHeadImgPath;
                hero.heroSkePath = this.oldHeroArr[jh].heroSkePath;
                hero.heroName = this.oldHeroArr[jh].heroName;
                hero.heroIntroduce = this.oldHeroArr[jh].heroIntroduce;
                hero.heroType = this.oldHeroArr[jh].heroType;
                hero.quality = this.oldHeroArr[jh].quality;
                hero.restrainType = this.oldHeroArr[jh].restrainType;
                hero.maxHP = this.oldHeroArr[jh].maxHP;
                hero.HP = this.oldHeroArr[jh].maxHP;
                this.maxHP += this.oldHeroArr[jh].maxHP;
                this.HP += this.oldHeroArr[jh].maxHP;
                hero.skillArr = this.oldHeroArr[jh].skillArr;
                hero.skillProArr = this.oldHeroArr[jh].skillProArr;
                hero.promoteTotal = this.oldHeroArr[jh].promoteTotal;
                hero.speed = this.oldHeroArr[jh].speed;
                hero.harm = this.oldHeroArr[jh].harm;
                this.allAttack += hero.harm;
                hero.criticalChance = this.oldHeroArr[jh].criticalChance;
                hero.breakOutHarmChance = this.oldHeroArr[jh].breakOutHarmChance;
                hero.join = true;
                hero.unlock = true;
            }
        }
        // for(var ht:number = 0;ht < GlobalData.Instance.heroTableArr.length;ht++)
        // {
        //     if(GlobalData.Instance.heroTableArr[ht].heroID == hid)
        //     {
        //         //赋予静态属性
        //         hero.heroID = GlobalData.Instance.heroTableArr[ht].heroID;
        //         hero.heroImgPath = GlobalData.Instance.heroTableArr[ht].heroImgPath;
        //         hero.heroHeadImgPath = GlobalData.Instance.heroTableArr[ht].heroHeadImgPath;
        //         hero.heroSkePath = GlobalData.Instance.heroTableArr[ht].heroSkePath;
        //         hero.heroName = GlobalData.Instance.heroTableArr[ht].heroName;
        //         hero.heroIntroduce = GlobalData.Instance.heroTableArr[ht].heroIntroduce;
        //         hero.heroType = GlobalData.Instance.heroTableArr[ht].heroType;
        //         hero.quality = GlobalData.Instance.heroTableArr[ht].quality;
        //         hero.restrainType = GlobalData.Instance.heroTableArr[ht].restrainType;
        //         hero.maxHP = GlobalData.Instance.heroTableArr[ht].maxHP;
        //         hero.HP = GlobalData.Instance.heroTableArr[ht].maxHP;
        //         this.maxHP += GlobalData.Instance.heroTableArr[ht].maxHP;
        //         this.HP += GlobalData.Instance.heroTableArr[ht].maxHP;
        //         hero.skillArr = GlobalData.Instance.heroTableArr[ht].skillArr;
        //         for(var asl:number = 0;asl < GlobalData.Instance.heroTableArr[ht].skillArr.length;asl++)
        //         {
        //             var newSkillLevel:relevanceProStructure = {ID:GlobalData.Instance.heroTableArr[ht].skillArr[asl],level:0,multiple:0,percent:0,seconds:0};
        //             hero.skillProArr.push(newSkillLevel);
        //         }
        //         hero.speed = GlobalData.Instance.heroTableArr[ht].speed;
        //         hero.harm = GlobalData.Instance.heroTableArr[ht].harm;
        //         this.allAttack += hero.harm;
        //         hero.criticalChance = GlobalData.Instance.heroTableArr[ht].criticalChance;
        //         hero.breakOutHarmChance = GlobalData.Instance.heroTableArr[ht].breakOutHarmChance;
        //         hero.join = true;
        //         hero.unlock = true;
        //         if(hero.heroType > 0)
        //         {
        //             //如果不为空位，将英雄添加到已上阵数组
        //             this.joinHero(hero);
        //         }
        //         break;
        //     }
        // }
        this.heroArr.push(hero);
        this.moveHeroStance(GlobalData.Instance.joinHeroArr.length);
        this.changeHeroState = false;
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
                item.getChildByName("img_shadow").getComponent(Sprite).node.active = false;
            }else{
                item["temp"] = false;
                // item.getChildByName("lab_nickname").getComponent(Label).string = "" + this.heroArr[he].heroName;
                // LoadImgTool.Instance.loadSpriteFrame(this.heroArr[he].heroImgPath, item.getChildByName("mask_head").getChildByName("icon_head").getComponent(Sprite).node);
                console.log("加载SkeletonData路径",this.heroArr[he].heroSkePath);
                item.getChildByName("ske_hero").active = true;
                LoadImgTool.Instance.loadSkeletonData(this.heroArr[he].heroSkePath,item.getChildByName("ske_hero").getComponent(sp.Skeleton),"idle");//"spine/hero/hero501/hero501"
                // item.getChildByName("btn_hero").getComponent(Button).node.active = true;
                item.getChildByName("img_shadow").getComponent(Sprite).node.active = true;
                if(this.heroArr[he].skillArr.length > 0)
                {
                    //根据ID查找在技能表中查找技能
                }
            }

            this.heroArr[he].heroItem = item;
            this.node_hero.addChild(item);
        }
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
                // for(var sote:number = 0;sote < this.soccerArr.length;sote++)
                // {
                //     if(this.soccerArr[sote].goalHeroID == this.heroArr[hIndex].heroID)
                //     {
                //         this.soccerArr[sote].goalHeroID = GlobalData.Instance.heroTableArr[ht].heroID;
                //         break;
                //     }
                // }
                this.heroArr[hIndex].heroID = GlobalData.Instance.heroTableArr[ht].heroID;
                this.heroArr[hIndex].heroImgPath = GlobalData.Instance.heroTableArr[ht].heroImgPath;
                this.heroArr[hIndex].heroHeadImgPath = GlobalData.Instance.heroTableArr[ht].heroHeadImgPath;
                this.heroArr[hIndex].heroSkePath = GlobalData.Instance.heroTableArr[ht].heroSkePath;
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
                this.allAttack += this.heroArr[hIndex].harm;
                this.heroArr[hIndex].criticalChance = GlobalData.Instance.heroTableArr[ht].criticalChance;
                this.heroArr[hIndex].breakOutHarmChance = GlobalData.Instance.heroTableArr[ht].breakOutHarmChance;
                this.heroArr[hIndex].join = true;
                this.heroArr[hIndex].heroItem["temp"] = false;
                this.heroArr[hIndex].heroItem.getChildByName("ske_hero").active = true;
                this.heroArr[hIndex].heroItem.getChildByName("img_shadow").getComponent(Sprite).node.active = true;
                //将英雄添加到上阵数组中
                this.joinHero(this.heroArr[hIndex]);
                LoadImgTool.Instance.loadSkeletonData(this.heroArr[hIndex].heroSkePath,this.heroArr[hIndex].heroItem.getChildByName("ske_hero").getComponent(sp.Skeleton),"idle");
                break;
            }
        }
        this.moveHeroStance(GlobalData.Instance.joinHeroArr.length);
    }

    //添加到上阵数组，且不重复添加
    joinHero(hs:heroStructure)
    {
        var isAddInto:boolean = false;
        for(var jh:number = 0;jh < GlobalData.Instance.joinHeroArr.length;jh++)
        {
            if(GlobalData.Instance.joinHeroArr[jh].heroID == hs.heroID)
            {
                isAddInto = true;
            }
        }
        if(isAddInto == false)
        {
            GlobalData.Instance.joinHeroArr.push(hs);
            GameCustomEvent.Instance.node.emit(GameEventName.BATTLE_HERO_STATE_HERO_UPDATE_EVENT);
        }
    }

    //下阵英雄（英雄下阵后加强数据全部移除，再次上阵需要重新读表） hid 下阵英雄ID
    eradicateHero(hid:number)
    {
        if(GlobalData.Instance.joinHeroArr.length < 1)
        {
            //只剩一个英雄时，不可下阵
            return;
        }
        
        this.changeHeroState = true;
        //从上阵数组中移除
        for(var yc:number = 0;yc < GlobalData.Instance.joinHeroArr.length;yc++)
        {
            if(GlobalData.Instance.joinHeroArr[yc].heroID == hid)
            {
                GlobalData.Instance.joinHeroArr.splice(yc,1);
            }
        }
        
        //剩余上阵英雄ID
        var residueHeroIDArr:Array<number> = this.findJoinHeroInBattle();
        this.saveOldHero();
        //下阵
        for(var xz:number = 0;xz < this.heroArr.length;xz++)
        {
            if(this.heroArr[xz].heroID == hid)
            {
                //扣掉原英雄maxHP和HP
                this.HP -= this.heroArr[xz].HP;
                this.maxHP -= this.heroArr[xz].maxHP;
                //扣掉总攻击力
                this.freshHP();
                this.heroArr[xz].join = false;
                this.heroArr[xz].heroItem["temp"] = false;
                this.heroArr[xz].heroItem.getChildByName("ske_hero").active = false;
                this.heroArr[xz].heroItem.getChildByName("img_shadow").getComponent(Sprite).node.active = true;
                break;
            }
        }
        this.node_hero.removeAllChildren();
        this.heroArr = [];
        this.HP = 0;
        this.maxHP = 0;
        this.allAttack = 0;
        //重新排序
        this.readHeroData(residueHeroIDArr,false);
        this.heroShow();
        this.moveHeroStance(GlobalData.Instance.joinHeroArr.length);
    }

    //将已经上阵的英雄数据，记录到旧英雄数组中
    saveOldHero()
    {
        for(var jh:number = 0;jh < this.heroArr.length;jh++)
        {
            if(this.heroArr[jh].heroType != 0)
            {
                //旧英雄数据中是否已存在该英雄
                var isHave:boolean = false;
                for(var oh:number = 0;oh < this.oldHeroArr.length;oh++)
                {
                    if(this.oldHeroArr[oh].heroID == this.heroArr[jh].heroID)
                    {
                        //新数据覆盖旧数据(动态数据)
                        // this.oldHeroArr[oh].heroID = this.heroArr[jh].heroID;
                        // this.oldHeroArr[oh].heroImgPath = this.heroArr[jh].heroImgPath;
                        // this.oldHeroArr[oh].heroHeadImgPath = this.heroArr[jh].heroHeadImgPath;
                        // this.oldHeroArr[oh].heroSkePath = this.heroArr[jh].heroSkePath;
                        // this.oldHeroArr[oh].heroName = this.heroArr[jh].heroName;
                        // this.oldHeroArr[oh].heroIntroduce = this.heroArr[jh].heroIntroduce;
                        // this.oldHeroArr[oh].heroType = this.heroArr[jh].heroType;
                        this.oldHeroArr[oh].quality = this.heroArr[jh].quality;
                        // this.oldHeroArr[oh].restrainType = this.heroArr[jh].restrainType;
                        this.oldHeroArr[oh].maxHP = this.heroArr[jh].maxHP;
                        this.oldHeroArr[oh].HP = this.heroArr[jh].maxHP;
                        // this.oldHeroArr[oh].skillArr = this.heroArr[jh].skillArr;
                        this.oldHeroArr[oh].skillProArr = this.heroArr[jh].skillProArr;
                        this.oldHeroArr[oh].speed = this.heroArr[jh].speed;
                        this.oldHeroArr[oh].harm = this.heroArr[jh].harm;
                        this.oldHeroArr[oh].criticalChance = this.heroArr[jh].criticalChance;
                        this.oldHeroArr[oh].breakOutHarmChance = this.heroArr[jh].breakOutHarmChance;
                        isHave = true;
                    }
                }
                if(isHave == false)
                {
                    this.oldHeroArr.push(this.heroArr[jh]);
                }
            }
        }
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

    //所有上阵英雄ID
    findJoinHeroInBattle():Array<number>
    {
        var residueHeroIDArr:Array<number> = [];
        for(var sy:number = 0;sy < GlobalData.Instance.joinHeroArr.length;sy++)
        {
            var heroID:number = GlobalData.Instance.joinHeroArr[sy].heroID;
            residueHeroIDArr.push(heroID);
        }
        return residueHeroIDArr;
    }

    //更新上阵数组数据 hid 英雄ID promote 提升项 addPromote 提升值 技能ID
    updataJoinHero(hid:number,promote:number,addPromote:number,sid:number = 0)
    {
        for(var proHero:number= 0;proHero < GlobalData.Instance.joinHeroArr.length;proHero++)
        {
            if(GlobalData.Instance.joinHeroArr[proHero].heroID == hid)
            {
                if(promote == 1)
                {
                    GlobalData.Instance.joinHeroArr[proHero].harm = addPromote;
                }else if(promote == 2){
                    GlobalData.Instance.joinHeroArr[proHero].criticalChance = addPromote;
                }else if(promote == 3){
                    GlobalData.Instance.joinHeroArr[proHero].breakOutHarmChance = addPromote;
                }else if(promote == 4){
                    GlobalData.Instance.joinHeroArr[proHero].maxHP = addPromote;
                    GlobalData.Instance.joinHeroArr[proHero].HP = addPromote;
                }else if(promote == 5)
                {
                    //根据技能ID找到技能，再对其等级进行提升
                    for(var sk:number = 0;sk < GlobalData.Instance.joinHeroArr[proHero].skillProArr.length;sk++)
                    {
                        if(sid == GlobalData.Instance.joinHeroArr[proHero].skillProArr[sk].ID)
                        {
                            GlobalData.Instance.joinHeroArr[proHero].skillProArr[sk].level++;
                            break;
                        }
                    }
                }
            }
        }
    }

    //位置站位
    heroIndexPos(hItem:Node,heroIndex:number)
    {
        // if(heroIndex == 0)
        // {
        //     hItem.setPosition(-297,-217);
        // }else{
        //     hItem.setPosition(-297 + heroIndex * 98,-217);
        // }
        //暂定位置：5 3 1 0 2 4 6
        //         0 1 2 3 4 5 6
        switch(heroIndex)
        {
            case 0:
                hItem.setPosition(this.heroInitialPosition + 3 * this.heroXInterval,this.heroImmobilizationY);
                break;
            case 1:
                hItem.setPosition(this.heroInitialPosition + 2 * this.heroXInterval,this.heroImmobilizationY);
                break;
            case 2:
                hItem.setPosition(this.heroInitialPosition + 4 * this.heroXInterval,this.heroImmobilizationY);
                break;
            case 3:
                hItem.setPosition(this.heroInitialPosition + this.heroXInterval,this.heroImmobilizationY);
                break;
            case 4:
                hItem.setPosition(this.heroInitialPosition + 5 * this.heroXInterval,this.heroImmobilizationY);
                break;
            case 5:
                hItem.setPosition(this.heroInitialPosition,this.heroImmobilizationY);
                break;
            case 6:
                hItem.setPosition(this.heroInitialPosition + 6 * this.heroXInterval,this.heroImmobilizationY);
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
                //     this.recycleEnemyArr[this.recycleEnemyArr.length - 1].outline = GlobalData.Instance.enemyTableArr[eta].outline;
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
                    // //怪物排序
                    // this.recycleEnemyArr[this.recycleEnemyArr.length - 1].enemyItem.setSiblingIndex(0);

                //     this.enemyArr.push(this.recycleEnemyArr[this.recycleEnemyArr.length - 1]);
                //     //回收数组移除怪物
                //     this.recycleEnemyArr.splice(this.recycleEnemyArr.length - 1, 0);
                // }else{
                    //创建新敌人数据
                    var es:enemyStructure = {enemyID:1,enemyHeadImgPath:"",enemySkePath:"",enemyName:"敌人1",enemyIntroduce:"敌人介绍",outline:1,enemyType:1,enemyOccupation:1,
                        maxHP:50,moveSpeed:0.2,attackSpeed:1,attackDistance:10,harm:1,EXP:1,gold:1,prop:1,skillProbability:10,speak:"杀光他们！",
                        enemyItem:null,HP:10,attackSpeedTime:0};
                    
                    es.enemyID = GlobalData.Instance.enemyTableArr[eta].enemyID;
                    es.enemyHeadImgPath = GlobalData.Instance.enemyTableArr[eta].enemyHeadImgPath;
                    es.enemyName = GlobalData.Instance.enemyTableArr[eta].enemyName;
                    es.enemyIntroduce = GlobalData.Instance.enemyTableArr[eta].enemyIntroduce;
                    es.outline = GlobalData.Instance.enemyTableArr[eta].outline;
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

                    let item;
                    switch(es.outline)
                    {
                        case 1:
                            item = instantiate(this.enemySmallItemPre);
                            // 更换其他同品级怪物动画
                            // LoadImgTool.Instance.loadSkeletonData(es.enemySkePath,//"spine/monster/small/unit_anim_ monster_01/unit_anim_ monster_01"
                            //     item.getChildByName("ske_small_monster").getComponent(sp.Skeleton),"animation_move");
                            break;
                        case 2:
                            item = instantiate(this.enemyMiddleItemPre);
                            LoadImgTool.Instance.loadSkeletonData(es.enemySkePath,item.getChildByName("ske_middle_monster").getComponent(sp.Skeleton),"move");
                            break;
                        case 3:
                            item = instantiate(this.enemyBigItemPre);
                            LoadImgTool.Instance.loadSkeletonData(es.enemySkePath,item.getChildByName("ske_big_monster").getComponent(sp.Skeleton),"move");
                            break;
                        case 4:
                            item = instantiate(this.bossItemPre);
                            LoadImgTool.Instance.loadSkeletonData(es.enemySkePath,item.getChildByName("ske_boss_monster").getComponent(sp.Skeleton),"move");
                            this.node_boss.active = true;
                            break;
                        case 5:
                            item = instantiate(this.trophyItem);
                            // LoadImgTool.Instance.loadSkeletonData(es.enemySkePath,item.getChildByName("ske_trophy_monster").getComponent(sp.Skeleton),"animation_move");
                            break;
                    }
                    switch(es.enemyType)
                    {
                        case 1:
                            //随机起始位置
                            item.setPosition(-163 + Math.floor(Math.random() * 324),280);
                            break;
                        case 2:
                            //指定起始位置
                            //随机的位置数组中抽取
                            var locIndex:number = Math.floor(Math.random() * this.saveLocationArr.length);
                            var newLoc:locationTableStructure = this.saveLocationArr[locIndex];
                            item.setPosition(newLoc.locationX,newLoc.locationY);
                            item["locationID"] = newLoc.locationID;
                            //从数组中移除，已抽取的位置不再抽取
                            this.saveLocationArr.splice(locIndex,1);
                            break;
                        case 3:
                            //固定起始位置
                            item.setPosition(-450,135);
                            break;
                    }
                    this.enemySerialNum++;
                    item["enemySerialNum"] = this.enemySerialNum;//GlobalData.Instance.enemyTableArr[eta].enemyID
                    console.log("创建敌人赋予item编号",item["enemySerialNum"]);
                    item.getChildByName("pro_blood").getComponent(ProgressBar).progress = OperationTool.Instance.retainDecimal(2,es.HP/es.maxHP);
                    es.enemyItem = item;

                    this.node_enemy.addChild(item);
                    
                    //怪物排序（添加到父节点后才能进行排序）
                    // this.node_enemy.insertChild(item,0)
                    item.setSiblingIndex(0);

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

    //怪物/障碍/宝箱/奖杯首次产出
    enemyFirstOutput()
    {
        if(this.saveLevel.levelType == 1 || this.saveLevel.levelType == 4)
        {
            //每波第一个怪物（怪物产生间隔从第二个开始）
            this.ariseEnemy();
        }else if(this.saveLevel.levelType == 2 || this.saveLevel.levelType == 3)
        {
            //根据首次要生成的最少个数障碍/宝箱
            for(var ce:number = 0;ce < this.saveWave.minEnemy;ce++)
            {
                this.ariseEnemy();
            }
        }else if(this.saveLevel.levelType == 5)
        {
            //奖杯
        }
    }

    //敌人停止纵向走动，发动攻击位置
    enemyStopYFun(outline:number):number
    {
        switch(outline)
        {
            case 1:
                return -119;
            case 2:
                return -105;
            case 3:
                return -80;
            case 4:
                return -45;
        }
        return -45;
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
                if(this.enemyArr[findEnemy].enemyType == 1 || this.enemyArr[findEnemy].enemyType == 2)
                {
                    frontEnemySerialNum = this.enemyArr[findEnemy].enemyItem["enemySerialNum"];
                    frontHP = this.enemyArr[findEnemy].HP;
                }
                //盗贼需要在有效范围内，才能进行选择 x小于-195或大于220时不在选择攻击范围
                else if(this.enemyArr[findEnemy].enemyType == 3 && this.enemyArr[findEnemy].enemyItem.getPosition().x > -195 
                && this.enemyArr[findEnemy].enemyItem.getPosition().x < 220)
                {
                    frontEnemySerialNum = this.enemyArr[findEnemy].enemyItem["enemySerialNum"];
                    frontHP = this.enemyArr[findEnemy].HP;
                }
            }
        }
        if(frontHP <= 0)
        {
            return -1;
        }else{
            return frontEnemySerialNum;
        }
    }

    //查询敌人某个类型的剩余个数
    findResidueEnemyType(reType:number):number
    {
        var reCount:number = 0;
        for(var re:number = 0;re < this.enemyArr.length;re++)
        {
            if(this.enemyArr[re].enemyType == reType)
            {
                reCount++;
            }
        }
        return reCount;
    }

    //查找敌人是否已死亡
    findEnemyDeadState(deadEnemySerialNum:number):boolean
    {
        var dead:boolean = false;
        for(var findDeadEnemy:number = 0;findDeadEnemy < this.enemyArr.length;findDeadEnemy++)
        {
            if(deadEnemySerialNum == this.enemyArr[findDeadEnemy].enemyItem["enemySerialNum"] && this.enemyArr[findDeadEnemy].HP <= 0)
            {
                dead = true;
                break;
            }
        }
        return dead;
    }

    //敌人死亡
    enemyDead()
    {
        for(var findDeadEnemy:number = 0;findDeadEnemy < this.enemyArr.length;findDeadEnemy++)
        {
            if(this.enemyArr[findDeadEnemy].HP <= 0)
            {
                var isNewEne:boolean = false;
                var loc:locationTableStructure = {locationID:0,locationX:0,locationY:0};
                if(this.enemyArr[findDeadEnemy].enemyType == 2 || this.enemyArr[findDeadEnemy].enemyType == 3)
                {
                    //根据ID找到对应的位置
                    for(var findLoc:number = 0;findLoc < GlobalData.Instance.locationArr.length;findLoc++)
                    {
                        if(this.enemyArr[findDeadEnemy].enemyItem["locationID"] == GlobalData.Instance.locationArr[findLoc].locationID)
                        {
                            //暂存随机出现位置
                            loc.locationID = GlobalData.Instance.locationArr[findLoc].locationID;
                            loc.locationX = GlobalData.Instance.locationArr[findLoc].locationX;
                            loc.locationY = GlobalData.Instance.locationArr[findLoc].locationY;
                            this.enemyArr[findDeadEnemy].enemyItem["locationID"] = -1;
                        }
                    }
                }
                //经验条增加经验
                this.EXP += this.enemyArr[findDeadEnemy].EXP;
                this.freshEXP();
                //移除敌人显示
                this.node_enemy.removeChild(this.enemyArr[findDeadEnemy].enemyItem);
                //将敌人移除到屏幕外的位置
                // this.enemyArr[findDeadEnemy].enemyItem.setPosition(0,1334);
                //添加到敌人回收数据
                // this.recycleEnemyArr.push(this.enemyArr[findDeadEnemy]);
                //移除敌人数据
                this.enemyArr.splice(findDeadEnemy,1);
                //障碍/宝箱在消除掉一个后，在有余量的情况下需要立即创建，以保证最少存在个数
                this.ariseEnemy();
                //新的障碍/宝箱生成后，再将之前占用的随机位置返还，避免新生成的位置刚好是之前消失的位置
                this.saveLocationArr.push(loc);

            }
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
        var newSoccer:soccerStructure = {soccerID:this.soccerArr.length + 1,soccerImgPath:"",soccerType:1,speed:7,soccerItem:item,soccerState:0,
            relevanceHeroID:noTempheroArr[newHeroIndex].heroID,goalEnemySerialNum:0,goalWallX:0,goalHeroID:0,speedWallX:0,moveTotal:0};
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

    //刷新关卡显示
    freshLevel(lvName:string)
    {
        this.lab_level.string = lvName;
        //刷新任务面板
        let taskEvent = new GameEventName({ eventCode: 1,taskArr: this.saveLevel.taskArr });
        GameCustomEvent.Instance.node.emit(GameEventName.TASK_EVENT,taskEvent);
    }

    //刷新波次显示
    freshWave()
    {
        this.lab_wave.string = this.wave + "/" + this.maxWave;
    }

    //刷新血量显示
    freshHP()
    {
        //HP取整不带小数
        this.HP = Math.floor(this.HP);
        this.maxHP = Math.floor(this.maxHP);
        this.lab_HPProportion.string = this.HP + "/" + this.maxHP;
        this.pro_HP.progress = this.HP/this.maxHP;
    }

    //刷新经验显示
    freshEXP()
    {
        this.lab_EXPProportion.string = this.EXP + "/" + this.maxEXP;
        this.pro_EXP.progress = this.EXP/this.maxEXP;
    }

    //刷新连击
    freshDoubleHit()
    {
        if(this.maxDoubleHit < this.doubleHit)
        {
            this.maxDoubleHit = this.doubleHit;
        }
        this.lab_doubleHit.string = "" + this.doubleHit;
        //刷新加层百分比
        this.lab_addingStory.string = "+" + this.doubleHit + "%";
        this.lab_allHarm.string = "" + this.harmTotal;
    }

    startMoveHero(e)
    {
        if(this.soccerGameState != gameState.start)
        {
            return;
        }
        //计算差值
        if(this.lastMoveX != 0)
        {
            if(this.lastMoveX < e.getLocationX())
            {
                this.moveIntervalX = e.getLocationX() - this.lastMoveX;
            }else{
                this.moveIntervalX = this.lastMoveX - e.getLocationX();
            }
        }else{
            this.moveIntervalX = e.getLocationX() - e.target.parent.getPosition().x;
        }
    }

    //移动英雄
    moveHero(e)
    {
        if(this.soccerGameState != gameState.start)
        {
            return;
        }
        if(e.getLocationX() - this.moveIntervalX >= this.moveLeftX && e.getLocationX() - this.moveIntervalX <= this.moveRightX)
        {
            this.node_moveHero.setPosition(e.getLocationX() - this.moveIntervalX,-360);
            // this.btn_moveHero.node.setPosition(e.getLocationX() - this.moveIntervalX,-360);
            //移动块最后位置(不在end中记录，因为鼠标可能移除屏幕外，导致没有end检测)
            this.lastMoveX = e.getLocationX() - this.moveIntervalX;
        }
    }

    //根据英雄个数，对拖动位置进行不同的限制
    moveHeroStance(heroCount:number)
    {
        //添加英雄时，英雄位置重置，防止新添加的英雄加到限制区域外
        this.node_moveHero.setPosition(0,-360);
        this.lastMoveX = 0;
        this.lastMoveHeroX = this.node_moveHero.getPosition().x;
        switch(heroCount)
        {
            case 1:
                this.moveLeftX = -294;
                this.moveRightX = 284;
                this.btn_moveHero.node.getComponent(UITransform).width = 95;
                break;
            case 2:
                this.moveLeftX = -244;
                this.moveRightX = 280;
                this.btn_moveHero.node.getComponent(UITransform).width = 140;
                break;
            case 3:
                this.moveLeftX = -244;
                this.moveRightX = 250;
                this.btn_moveHero.node.getComponent(UITransform).width = 185;
                break;
            case 4:
                this.moveLeftX = -194;
                this.moveRightX = 250;
                this.btn_moveHero.node.getComponent(UITransform).width = 250;
                break;
            case 5:
                this.moveLeftX = -194;
                this.moveRightX = 200;
                this.btn_moveHero.node.getComponent(UITransform).width = 300;
                break;
            case 6:
                this.moveLeftX = -144;
                this.moveRightX = 200;
                this.btn_moveHero.node.getComponent(UITransform).width = 350;
                break;
            case 7:
                this.moveLeftX = -144;
                this.moveRightX = 150;
                this.btn_moveHero.node.getComponent(UITransform).width = 400;
                break;
        }
    }

    //打开设置
    openSet()
    {
        Layer.Instance.show("set",Layer.Instance.layerView);
    }

    //暂停打开菜单
    openMenu()
    {
        this.soccerGameState = gameState.stop;
        this.node_menu.active = true;
    }

    //关闭菜单
    closeMenu()
    {
        this.soccerGameState = gameState.start;
        this.node_menu.active = false;
    }

    //技能释放
    conjure(e)
    {
    }

    otherViewEveFun(ovEvent: GameEventName)
    {
        console.log("接收到战斗中来自其他页面发送的事件",ovEvent.getCustomProperty().eventCode);
        switch(ovEvent.getCustomProperty().eventCode)
        {
            case 1:
                //酒馆选卡结果
                console.log("英雄属性提升：",ovEvent);
                for(var ae:number = 0;ae < ovEvent.getCustomProperty().pcArr.length;ae++)
                {
                    var addPro:boolean = false;
                    var addPromote:number = 0;
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
                                addPromote = this.heroArr[proHero].harm;
                            }else if(ovEvent.getCustomProperty().pcArr[ae].promote == 2){
                                this.heroArr[proHero].criticalLevel++;
                                //multiple /100
                                var lastCriticalPro:number = ovEvent.getCustomProperty().pcArr[ae].multiple;// / 100
                                this.heroArr[proHero].criticalChance = lastCriticalPro;
                                addPromote = this.heroArr[proHero].criticalChance;
                            }else if(ovEvent.getCustomProperty().pcArr[ae].promote == 3){
                                this.heroArr[proHero].breakOutLevel++;
                                var lastbreakOutPro:number = ovEvent.getCustomProperty().pcArr[ae].multiple;// / 100
                                this.heroArr[proHero].breakOutHarmChance = lastbreakOutPro;
                                addPromote = this.heroArr[proHero].breakOutHarmChance;
                            }else if(ovEvent.getCustomProperty().pcArr[ae].promote == 4){
                                this.heroArr[proHero].HPLevel++;
                                var addHPPro:number = this.heroArr[proHero].maxHP * ovEvent.getCustomProperty().pcArr[ae].multiple / 100;
                                this.heroArr[proHero].maxHP += addHPPro;
                                this.heroArr[proHero].HP += addHPPro;
                                this.HP += addHPPro;
                                this.maxHP += addHPPro;
                                this.freshHP();
                                addPromote = this.heroArr[proHero].maxHP;
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
                            this.heroArr[proHero].promoteTotal++;
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
                            console.log("添加英雄：",ovEvent.getCustomProperty().pcArr,ovEvent.getCustomProperty().pcArr[ae].heroID)
                            this.joinHeroToBattle(ovEvent.getCustomProperty().pcArr[ae].heroID,thIndex);
                        }else{
                            //变动数据更新到上阵数组中
                            if(ovEvent.getCustomProperty().pcArr[ae].promote == 5)
                            {
                                this.updataJoinHero(ovEvent.getCustomProperty().pcArr[ae].heroID,ovEvent.getCustomProperty().pcArr[ae].promote,
                                    0,ovEvent.getCustomProperty().pcArr[ae].skillID);
                            }else{
                                this.updataJoinHero(ovEvent.getCustomProperty().pcArr[ae].heroID,ovEvent.getCustomProperty().pcArr[ae].promote,addPromote);
                            }
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
                //章节从第一个关卡开始
                GlobalData.Instance.gameRecord.levelID = 0;
                this.selectChapter = 0;
                this.readRecord(this.selectChapter);
                this.restart();
                break;
            case 6:
                //通关关卡，下一波
                this.nextWaveFun();
                break;
            case 10:
                //下阵英雄
                this.eradicateHero(ovEvent.getCustomProperty().heroID);
                break;
        }
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

    //章节结算
    chapterResultFun()
    {
        //弹出章节结算页面
        // Layer.Instance.show("chapterResult",Layer.Instance.layerView);
        // GameCustomEvent.Instance.node.emit(GameEventName.CHAPTER_RESULT_EVENT);
    }

    //关卡通关
    levelPassFun()
    {
        //英雄庆贺跳舞
        let heroAttackSkeEvent = new GameEventName({ eventCode: 1, aniName:"dance", aniLoop: true });
        GameCustomEvent.Instance.node.emit(GameEventName.HERO_SKE_EVENT, heroAttackSkeEvent);
        setTimeout(() => {
            let heroIdleSkeEvent = new GameEventName({ eventCode: 1, aniName:"idle", aniLoop: true });
            GameCustomEvent.Instance.node.emit(GameEventName.HERO_SKE_EVENT, heroIdleSkeEvent);
            
            this.freshDoubleHit();
            // this.soccerGameState = gameState.stop;
            //弹出关卡通关页面
            Layer.Instance.show("levelPass",Layer.Instance.layerView);
            //向关卡通关页面发送数据
            let lpEvent = new GameEventName({ doubleHit:this.maxDoubleHit, allHarm: this.harmTotal, heroArr: this.heroArr });
            GameCustomEvent.Instance.node.emit(GameEventName.LEVER_PASS_EVENT,lpEvent);
            // var _this = this;
            // tween(this.img_fog.node).to(2,{position:new Vec3(0,0,0)}).delay(0.5).to(2,{position:new Vec3(750,0,0)}).start();
        }, 3000);
    }

    //关卡下一波
    nextWaveFun()
    {
        //存储本关卡英雄数据
        this.saveOldHero();
        this.copyHeroArrFun(GlobalData.Instance.gameRecord.levelHeroArr,this.oldHeroArr);
        //如果英雄在移动中，停止移动
        if(this.moveHeroState)
        {
            let heroAttackSkeEvent = new GameEventName({ eventCode: 1, aniName:"idle", aniLoop: true });
            GameCustomEvent.Instance.node.emit(GameEventName.HERO_SKE_EVENT, heroAttackSkeEvent);
            this.moveHeroState = false;
        }
        //是否为计时关卡
        if(this.saveLevel.levelType == 2 || this.saveLevel.levelType == 3)
        {
            this.img_sandClockBG.node.active = true;
        }else{
            this.img_sandClockBG.node.active = false;
        }
        //连击重置
        this.doubleHit = 0;
        this.freshDoubleHit();
        //波次重置
        this.wave = 1;
        // setTimeout(() => {
        //重新加载一次波数
        this.readNewWave();
        // }, 4500);
    }

    //下一波动画提示
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

        this.enemyFirstOutput();
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
                //获取该英雄的x,y，使球起始位置在英雄脚下，需要加上计算拖动的差距值
                this.soccerArr[0].soccerItem.setPosition(noTempheroArr[newHeroIndex].heroItem.getPosition().x + this.lastMoveX,
                    noTempheroArr[newHeroIndex].heroItem.getPosition().y - 20);
                //球状态改为发球
                this.soccerArr[0].soccerState = 1;
                //继承新发球的英雄属性
                this.soccerArr[0].relevanceHeroID = noTempheroArr[newHeroIndex].heroID;
                //找到最前面的敌人
                this.soccerArr[0].goalEnemySerialNum = this.findFrontEnemySerialNum();
                // this.soccerArr[0].goalHeroID = 0;
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
                    //判断敌人是否已死亡(有些敌人已死亡，但仍在播放死亡动画未消失，此时球无视碰撞继续向上)
                    if(this.findEnemyDeadState(controllerEvent.getCustomProperty().enemySerialNum))
                    {
                        return;
                    }
                    AudioMG.Instance.playSoundAudio("audio/soccer_kick","soccer_kick");
                    //球从下往上，正面碰撞，运动轨迹改变，均向英雄折返
                    var rHeroID:number = 0;
                    var gSerialNum:number = 0;
                    //球下标
                    var fSoccer:number = 0;
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
                            this.soccerArr[findSoccer].soccerState = 5;
                            //球随机一个点返回
                            //目标点x（-270 ~ 306），y统一为-325
                            var newDotX:number = Math.floor(Math.random() * 576) - 270;
                            console.log("随机返回点：",newDotX);
                            this.soccerArr[findSoccer].goalWallX = newDotX;
                            //目标位置拖尾角度
                            this.soccerArr[findSoccer].soccerItem.getChildByName("soccerNode").getChildByName("sp_tail").angle = 
                            // this.soccerArr[findSoccer].soccerItem.getChildByName("node_tail").angle = 
                                OperationTool.Instance.calculateAngle(this.soccerArr[findSoccer].soccerItem.getPosition().x, this.soccerArr[findSoccer].soccerItem.getPosition().y,
                                    newDotX, -325);
                            //英雄状态变为接球
                            // this.heroArr[newHeroIndex].catchSoccerID = this.soccerArr[findSoccer].soccerID;
                            break;
                        }
                    }
                    
                    //基础伤害
                    var baseHarm:number = this.allAttack;
                    //是否会心
                    var isBreakOutHarm:boolean = false;
                    //是否暴击
                    var isCritical:boolean = false;
                    //根据英雄ID查找英雄
                    for(var findHero:number = 0;findHero < this.heroArr.length;findHero++)
                    {
                        if(this.heroArr[findHero].heroID == rHeroID)
                        {
                            // baseHarm = this.heroArr[findHero].harm;
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
                        this.earthquakeAttack();
                    }
                    if(this.doubleHit > 0)
                    {
                        //连击加层伤害 = 原伤害 * doubleHit%
                        lastHarm = lastHarm + lastHarm * this.doubleHit / 100;
                    }
                    //取整，避免小数点
                    lastHarm = Math.floor(lastHarm);
                    this.harmTotal += lastHarm;

                    //根据敌人ID查找敌人
                    for(var findEnemy:number = 0;findEnemy < this.enemyArr.length;findEnemy++)
                    {
                        if(this.enemyArr[findEnemy].enemyItem["enemySerialNum"] == controllerEvent.getCustomProperty().enemySerialNum)
                        {
                            //若敌人处于近距离，则根据y选择近距离的英雄
                            if(this.enemyArr[findEnemy].enemyItem.getPosition().y <= this.enemyStopYFun(this.enemyArr[findEnemy].outline))
                            {
                                //球重新随机一个近距离的x（敌人附近相距绝对值110）点发射
                                newDotX = this.enemyArr[findEnemy].enemyItem.getPosition().x + (Math.floor(Math.random() * 220) - 110);
                            }

                            //球状态变为回球
                            this.soccerArr[fSoccer].soccerState = 5;

                            var newHP:number = this.enemyArr[findEnemy].HP - lastHarm;
                            //敌人受到伤害，并扣除血量，如扣除后的血量低于0，敌人消失
                            this.enemyArr[findEnemy].HP = newHP;

                            if(this.enemyArr[findEnemy].HP > 0)
                            {
                                let enemyHurtSkeEvent = new GameEventName({ eventCode: 2, enemySerialNum:controllerEvent.getCustomProperty().enemySerialNum, aniName:"hurt", aniLoop: false });
                                GameCustomEvent.Instance.node.emit(GameEventName.ENEMY_SKE_EVENT, enemyHurtSkeEvent);
                                setTimeout(() => {
                                    var aName:string = "idle";
                                    if(this.moveHeroState)
                                    {
                                        aName = "move";
                                    }
                                    let heroIdleSkeEvent = new GameEventName({ eventCode: 2, enemySerialNum:controllerEvent.getCustomProperty().enemySerialNum, aniName:aName, aniLoop: true });
                                    GameCustomEvent.Instance.node.emit(GameEventName.ENEMY_SKE_EVENT, heroIdleSkeEvent);
                                }, 700);
                            }else{
                                let enemyDeathSkeEvent = new GameEventName({ eventCode: 2, enemySerialNum:controllerEvent.getCustomProperty().enemySerialNum, aniName:"death", aniLoop: false });
                                GameCustomEvent.Instance.node.emit(GameEventName.ENEMY_SKE_EVENT, enemyDeathSkeEvent);
                            }
                            
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
                            tween(textItem).to(0.3,{position:new Vec3(0,50,0)}).delay(0.2).call(()=>{
                                //文本消失
                                _harmNode.removeChild(textItem);
                                _this.enemyDead();
                            }).start();
                            break;
                        }
                    }
                }
                break;
            case 2:
                //空位，球向英雄运动时判断空位，球碰墙向上折返时路过空位不改变状态
                if(controllerEvent.getCustomProperty().temp)
                {
                    // if(this.findSoccerState(controllerEvent.getCustomProperty().soccerID) == 2)
                    // {
                    //     //漏球，攻击力仍然为上一个英雄的值
                    //     this.changeSoccerState(controllerEvent.getCustomProperty().soccerID,5);
                    // }else{
                    //     this.changeSoccerState(controllerEvent.getCustomProperty().soccerID,3);
                    // }
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
                                    // this.soccerArr[soccerBack].soccerItem.getChildByName("soccerNode").getChildByName("node_tail").angle = 
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
                        // if(this.soccerArr[soccerBack].soccerState > 0)
                        // {
                            //接球发球(碰墙时目标英雄为0,不继承属性)
                            // if(this.soccerArr[soccerBack].goalHeroID != 0)
                            // {
                            //     //目标英雄ID变为球新继承的属性英雄ID
                            //     this.soccerArr[soccerBack].relevanceHeroID = this.soccerArr[soccerBack].goalHeroID;
                            //     //目标英雄ID归0
                            //     this.soccerArr[soccerBack].goalHeroID = 0;
                            // }
                        // }else{
                        //发球时让球继承英雄属性
                        // this.soccerArr[soccerBack].relevanceHeroID = controllerEvent.getCustomProperty().heroID;
                        // }
                        //球不论任何状态，碰到英雄均视为发球，球状态改变
                        this.soccerArr[soccerBack].soccerState = 1;
                        AudioMG.Instance.playSoundAudio("audio/soccer_kick","soccer_kick");
                        //接球一次加一次（不管怪物是否死亡漏球碰上墙）
                        this.doubleHit++;
                        //刷新连击显示
                        this.freshDoubleHit();
                        break;
                    }
                }
                //踢球时震动
                this.earthquakeAttack();
                let heroAttackSkeEvent = new GameEventName({ eventCode: 2, heroID:controllerEvent.getCustomProperty().heroID, aniName:"hit", aniLoop: false });
                GameCustomEvent.Instance.node.emit(GameEventName.HERO_SKE_EVENT, heroAttackSkeEvent);
                setTimeout(() => {
                    var aName:string = "idle";
                    if(this.moveHeroState)
                    {
                        aName = "move";
                    }
                    let heroIdleSkeEvent = new GameEventName({ eventCode: 2, heroID:controllerEvent.getCustomProperty().heroID, aniName:aName, aniLoop: true });
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
                            //y向下，随机一个点返回
                            var newDotX:number = Math.floor(Math.random() * 576) - 270;
                            this.soccerArr[findSoccer].goalWallX = newDotX;
                            //目标位置拖尾角度
                            this.soccerArr[findSoccer].soccerItem.getChildByName("soccerNode").getChildByName("sp_tail").angle = 
                            // this.soccerArr[findSoccer].soccerItem.getChildByName("soccerNode").getChildByName("node_tail").angle = 
                                OperationTool.Instance.calculateAngle(this.soccerArr[findSoccer].soccerItem.getPosition().x, this.soccerArr[findSoccer].soccerItem.getPosition().y,
                                    newDotX, -325);
                            //改变球状态
                            this.changeSoccerState(controllerEvent.getCustomProperty().soccerID,5);
                            // console.log("足球碰墙，球向下，状态5",this.soccerArr[findSoccer].speed);
                        }else if(controllerEvent.getCustomProperty().wallID == 2)
                        {
                            //y向上，随机一个x点，如果中途穿过英雄，赋予英雄属性，如果中途穿过敌人，造成1/5的伤害
                            // var newTSpeed:number = Math.abs(this.soccerArr[findSoccer].speed);
                            // this.soccerArr[findSoccer].speed = newTSpeed;
                            //未接到球（碰下墙），连击重置为0
                            this.doubleHit = 0;
                            this.freshDoubleHit();
                            //改变球状态
                            this.changeSoccerState(controllerEvent.getCustomProperty().soccerID,3);
                            // console.log("足球碰墙，球向上，状态3",this.soccerArr[findSoccer].speed);
                        }else if(controllerEvent.getCustomProperty().wallID == 3 || controllerEvent.getCustomProperty().wallID == 4)
                        {
                            //改变球x轴方向的速度，向右左，y上下
                            this.soccerArr[findSoccer].speedWallX = 0 - this.soccerArr[findSoccer].speedWallX;
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
            case 5:
                //足球碰到奖杯
                break;
        }
    }

    soccerGame()
    {
        if(this.soccerGameState == gameState.start)
        {
            //弹出界面互斥 游戏失败 > 升级选牌 > 通关
            //判断游戏是否失败
            if(this.HP <= 0 && this.changeHeroState == false)
            {
                console.log("血量：",this.HP,"：",this.changeHeroState)
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
                Layer.Instance.show("amplificationCard",Layer.Instance.layerView);
                //刷新卡牌
                GameCustomEvent.Instance.node.emit(GameEventName.AMPLIFICATION_CARD_FRESH_EVENT);
                return;
            }
            //判断波次是否通关，先找到本关卡的类型
            else if(this.saveLevel.levelType == 1)
            {
                //没有Boss的普通小怪关卡
                if(this.findResidueEnemyType(1) <= 0 && this.saveWave.total == 0)
                {
                    console.log("所有怪物已死亡，进入结算");
                    this.soccerGameState = gameState.result;
                    //读取下一波数据
                    this.readNextWave();
                }
            }
            else if(this.saveLevel.levelType == 2)
            {
                //所有障碍已消除或倒计时结束通关
                if(this.findResidueEnemyType(2) <= 0 && this.saveWave.total == 0)
                {
                    this.soccerGameState = gameState.result;
                    //下一波障碍
                    this.readNextWave();
                }else{
                    this.saveLevel.maxTime--;
                    this.lab_countDown.string = TimeTool.Instance.getMS(this.saveLevel.maxTime,100);
                    //倒计时结束，游戏失败
                    if(this.saveLevel.maxTime == 0)
                    {
                        this.soccerGameState = gameState.over;
                        //弹出失败页面
                        Layer.Instance.show("lose",Layer.Instance.layerView);
                    }
                }
            }
            else if(this.saveLevel.levelType == 3)
            {
                //只计算得分
                if(this.findResidueEnemyType(3) <= 0 && this.saveWave.total == 0)
                {
                    this.soccerGameState = gameState.result;
                    //本波通过，生成下一波宝箱
                    this.readNextWave();
                }
                this.saveLevel.maxTime--;
                this.lab_countDown.string = TimeTool.Instance.getMS(this.saveLevel.maxTime,100);
                //倒计时结束通关，无论是否打完宝箱，若提前打完宝箱，提前通过关卡
                if(this.saveLevel.maxTime == 0)
                {
                    this.soccerGameState = gameState.result;
                    this.readNextWave();
                }
            }
            else if(this.saveLevel.levelType == 4)
            {
                //判断Boss是否死亡
                if(this.findResidueEnemyType(4) <= 0 && this.saveWave.total == 0)
                {
                    //Boss死亡直接通关，不管其余小怪是否死亡
                    this.soccerGameState = gameState.result;
                    this.readNextWave();
                }
            }
            
            //怪物产出
            if(this.saveLevel.levelType == 1 || this.saveLevel.levelType == 4)
            {
                //怪物的产生方式
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

            //英雄是否有x轴的移动
            if(this.lastMoveHeroX != this.node_moveHero.getPosition().x)
            {
                if(this.moveHeroState == false && this.moveHeroIntervalTime <= 0)
                {
                    let heroAttackSkeEvent = new GameEventName({ eventCode: 1, aniName:"move", aniLoop: true });
                    GameCustomEvent.Instance.node.emit(GameEventName.HERO_SKE_EVENT, heroAttackSkeEvent);
                    this.moveHeroState = true;
                }
                //若一直在拖动，则一直刷新间隔检测时间
                this.moveHeroIntervalTime = 50;
            }else if(this.moveHeroIntervalTime > 0)
            {
                this.moveHeroIntervalTime--;
                if(this.lastMoveHeroX == this.node_moveHero.getPosition().x && this.moveHeroState == true && this.moveHeroIntervalTime <= 0)
                {
                    let heroAttackSkeEvent = new GameEventName({ eventCode: 1, aniName:"idle", aniLoop: true });
                    GameCustomEvent.Instance.node.emit(GameEventName.HERO_SKE_EVENT, heroAttackSkeEvent);
                    this.moveHeroState = false;
                }
            }
            this.lastMoveHeroX = this.node_moveHero.getPosition().x;

            //敌人移动
            for(var moveEnemy:number = 0;moveEnemy < this.enemyArr.length;moveEnemy++)
            {
                if(this.enemyArr[moveEnemy].enemyItem != null)
                {
                    if(this.enemyArr[moveEnemy].enemyType == 1)
                    {
                        //如果走到了发动攻击位置，y不再变，攻击水晶
                        if(this.enemyArr[moveEnemy].enemyItem.getPosition().y < this.enemyStopYFun(this.enemyArr[moveEnemy].outline))
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
                            //向下行走
                            this.enemyArr[moveEnemy].enemyItem.setPosition(this.enemyArr[moveEnemy].enemyItem.getPosition().x,
                            this.enemyArr[moveEnemy].enemyItem.getPosition().y - this.enemyArr[moveEnemy].moveSpeed);
                        }
                    }else if(this.enemyArr[moveEnemy].enemyType == 3)
                    {
                        //向右行走
                        var newEnemyX:number = this.enemyArr[moveEnemy].enemyItem.getPosition().x + 1;
                        this.enemyArr[moveEnemy].enemyItem.setPosition(newEnemyX,this.enemyArr[moveEnemy].enemyItem.getPosition().y);
                        //如果盗贼已经走出屏幕且存活，恢复血量，等待下一次行动
                        if(this.enemyArr[moveEnemy].enemyItem.getPosition().x > 450)
                        {
                            this.enemyArr[moveEnemy].HP = this.enemyArr[moveEnemy].maxHP;
                            //回到初始位置等待
                            this.enemyArr[moveEnemy].enemyItem.setPosition(-450,this.enemyArr[moveEnemy].enemyItem.getPosition().y);
                        }
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
                }
                else if(this.soccerArr[so].soccerState == 5 || this.soccerArr[so].soccerState == 6){
                    //是否有目标英雄
                    // if(this.soccerArr[so].goalWallX == 0)
                    // {
                    //     //没有目标英雄时，取墙的x,y
                    //     console.log("没有目标英雄时，向墙运动2：");
                    //     this.changeSoccerState(this.soccerArr[so].soccerID,3);
                    //     let lastWallX:number = 0;
                    //     let lastWallY:number = 0;
                    //     lastWallX = this.soccerArr[so].soccerItem.getPosition().x - this.soccerArr[so].speedWallX;
                    //     lastWallY = this.soccerArr[so].soccerItem.getPosition().y - this.soccerArr[so].speed;
                    //     this.soccerArr[so].soccerItem.setPosition(lastWallX,lastWallY);
                    // }else{
                        //查找目标英雄在当前的位置
                        // for(var findHero:number = 0;findHero < this.heroArr.length;findHero++)
                        // {
                        //     if(this.heroArr[findHero].heroID == this.soccerArr[so].goalHeroID)
                        //     {
                                //回球时球外观变大
                                if(this.soccerScale < 1)
                                {
                                    this.soccerScale += this.soccerBigSmall;
                                    this.soccerArr[so].soccerItem.getChildByName("soccerNode").scale = v3(this.soccerScale,this.soccerScale,0);
                                }
                                //英雄x和y位置都不变
                                let lastX:number = 0;
                                let lastY:number = 0;
                                //x相差距离 = 墙x - 足球x
                                var xEquation:number = this.soccerArr[so].goalWallX - this.soccerArr[so].soccerItem.getPosition().x;
                                //y相差距离 = 墙y - 足球y
                                var yEquation:number = -360 - this.soccerArr[so].soccerItem.getPosition().y;
                                //相差速度 = 足球移动速度 - 墙移动速度
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
                        //     }
                        // }
                    // }
                    // break;
                }
                else if(this.soccerArr[so].soccerState == 3 || this.soccerArr[so].soccerState == 4){
                    //出球时球外观变小
                    if(this.soccerScale > 0.5)
                    {
                        this.soccerScale -= this.soccerBigSmall;
                        this.soccerArr[so].soccerItem.getChildByName("soccerNode").scale = v3(this.soccerScale,this.soccerScale,0);
                    }
                    let lastWallX:number = 0;
                    let lastWallY:number = 0;
                    lastWallX = this.soccerArr[so].soccerItem.getPosition().x - this.soccerArr[so].speedWallX;
                    // if(this.soccerArr[so].soccerState == 3)
                    // {
                        lastWallY = this.soccerArr[so].soccerItem.getPosition().y + this.soccerArr[so].speed;
                        this.nextSoccerY = lastWallY + this.soccerArr[so].speed;
                    // }else if(this.soccerArr[so].soccerState == 5){
                    //     lastWallY = this.soccerArr[so].soccerItem.getPosition().y - this.soccerArr[so].speed;
                    //     this.nextSoccerY = lastWallY - this.soccerArr[so].speed;
                    // }
                    this.nextSoccerX = lastWallX - this.soccerArr[so].speedWallX;
                    this.soccerArr[so].soccerItem.setPosition(lastWallX,lastWallY);
                    //碰墙改变角度
                    this.soccerArr[so].soccerItem.getChildByName("soccerNode").getChildByName("sp_tail").angle = 
                    // this.soccerArr[so].soccerItem.getChildByName("soccerNode").getChildByName("node_tail").angle = 
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
        switch (this.playerLevel)
        {
            case 1:
                this.maxEXP = 1;
                break;
            case 2:
                this.maxEXP = 3;
                break;
            case 3:
                this.maxEXP = 5;
                break;
            case 4:
                this.maxEXP = 10;
                break;
            case 5:
                this.maxEXP = 20;
                break;
            default:
                this.maxEXP = 30;
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
        this.soccerGameState = gameState.stop;
        this.node_menu.active = false;
        this.node.active = false;
        //存储当前关卡数据
        GlobalData.Instance.gameRecord.levelID = this.saveLevel.levelID;
        Layer.Instance.show("hall",Layer.Instance.layerView);
        //刷新大厅显示
        GameCustomEvent.Instance.node.emit(GameEventName.HALL_EVENT);
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
