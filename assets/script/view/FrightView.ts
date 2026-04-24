import { _decorator, Component, Node, Sprite, Label, Button, find, Prefab, instantiate, ProgressBar, tween, Vec3, Color } from 'cc';
import { enemyStructure, heroStructure, soccerStructure } from '../data/GlobalStructure';
import { LoadImgTool } from '../tool/LoadImgTool';
import { OperationTool } from '../tool/OperationTool';
import { GameCustomEvent } from '../manager/GameCustomEvent';
import { GameEventName } from '../manager/GameEventName';
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
    private harmItemPre: Prefab = null;

    // private btn_close:Button;
    //背景
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
    private btn_skill1:Button;
    private btn_skill2:Button;
    private btn_skill3:Button;
    private btn_skill4:Button;
    private btn_skill5:Button;

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
    //关卡
    private level:number = 1;
    //第几波
    private wave:number = 1;
    //通关波数
    private maxWave:number = 5;
    //当前血量
    private HP:number = 100;
    //上限血量
    private maxHP:number = 100;
    //当前经验
    private EXP:number = 0;
    //升级所需经验
    private maxEXP:number = 200;
    //英雄槽
    private heroGrooveArr:Array<any>;
    //技能槽
    private skillGrooveArr:Array<any>;
    //计时器时间
    private timeHS:number = 0.01;
    //地图移动速度
    private mapMoveSpeed:number = 0.2;
    private frightBgY:number = 0;
    private frightLinkUpBgY:number = 0;
    //游戏状态
    private soccerGameState:number = 0;
    protected onLoad(): void {
        this._initObect();
        this._onEvent();
    }

    private _initObect() {
        // this.btn_close = find('top/btn_close', this.node).getComponent(Button);
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
        this.btn_skill1 = find('node_bottom/lay_skillGroove/mask_skill1/btn_skill1', this.node).getComponent(Button);
        this.btn_skill2 = find('node_bottom/lay_skillGroove/mask_skill2/btn_skill2', this.node).getComponent(Button);
        this.btn_skill3 = find('node_bottom/lay_skillGroove/mask_skill3/btn_skill3', this.node).getComponent(Button);
        this.btn_skill4 = find('node_bottom/lay_skillGroove/mask_skill4/btn_skill4', this.node).getComponent(Button);
        this.btn_skill5 = find('node_bottom/lay_skillGroove/mask_skill5/btn_skill5', this.node).getComponent(Button);
    }

    private _onEvent() {
        // this.btn_close.node.on(Node.EventType.TOUCH_END, this.closeView, this);
        this.btn_skill1.node.on(Node.EventType.TOUCH_END, this.conjure, this);
        this.btn_skill2.node.on(Node.EventType.TOUCH_END, this.conjure, this);
        this.btn_skill3.node.on(Node.EventType.TOUCH_END, this.conjure, this);
        this.btn_skill4.node.on(Node.EventType.TOUCH_END, this.conjure, this);
        this.btn_skill5.node.on(Node.EventType.TOUCH_END, this.conjure, this);
        GameCustomEvent.Instance.addCustomEvent(GameEventName.FRIGHT_SUBTRACT_BOOLD_EVENT,this.frightControllerFun,this);
    }

    start() {
        this.resetGame();
        //模拟数据
        var es1:enemyStructure = {enemyID:1,heroHeadImgPath:"",enemyName:"敌人1",enemyIntroduce:"敌人介绍",experience:100,enemyType:1,enemyOccupation:1,
            maxHP:50,moveSpeed:0.6,attackSpeed:1,attackDistance:10,harm:1,EXP:1,gold:1,prop:1,skillProbability:10,enemyItem:null,HP:10,speak:"杀光他们！"};
        var es2:enemyStructure = {enemyID:2,heroHeadImgPath:"",enemyName:"敌人2",enemyIntroduce:"敌人介绍",experience:100,enemyType:1,enemyOccupation:1,
            maxHP:100,moveSpeed:0.5,attackSpeed:1,attackDistance:10,harm:1,EXP:1,gold:1,prop:1,skillProbability:10,enemyItem:null,HP:10,speak:"冲啊！"};
        var es3:enemyStructure = {enemyID:3,heroHeadImgPath:"",enemyName:"敌人3",enemyIntroduce:"敌人介绍",experience:100,enemyType:1,enemyOccupation:1,
            maxHP:80,moveSpeed:0.4,attackSpeed:1,attackDistance:10,harm:1,EXP:1,gold:1,prop:1,skillProbability:10,enemyItem:null,HP:10,speak:"Biu~Biu~"};
        this.enemyArr.push(es1);
        this.enemyArr.push(es2);
        this.enemyArr.push(es3);
        var he1:heroStructure = {heroID:1,heroImgPath:"",heroHeadImgPath:"",heroName:"英雄1",heroIntroduce:"英雄介绍",heroType:1,quality:1,
            maxHP:300,skillArr:[],speed:1,harm:10,criticalChance:20,breakOutHarmChance:30,heroItem:null,heroIndex:0,HP:100,catchSoccerID:0};
        var he2:heroStructure = {heroID:2,heroImgPath:"",heroHeadImgPath:"",heroName:"英雄2",heroIntroduce:"英雄介绍",heroType:1,quality:1,
            maxHP:200,skillArr:[],speed:2,harm:20,criticalChance:15,breakOutHarmChance:20,heroItem:null,heroIndex:1,HP:120,catchSoccerID:0};
        var he3:heroStructure = {heroID:2,heroImgPath:"",heroHeadImgPath:"",heroName:"英雄3",heroIntroduce:"英雄介绍",heroType:1,quality:1,
            maxHP:250,skillArr:[],speed:3,harm:30,criticalChance:10,breakOutHarmChance:15,heroItem:null,heroIndex:2,HP:110,catchSoccerID:0};
        var he4:heroStructure = {heroID:4,heroImgPath:"",heroHeadImgPath:"",heroName:"英雄4",heroIntroduce:"英雄介绍",heroType:1,quality:1,
            maxHP:300,skillArr:[],speed:1,harm:10,criticalChance:20,breakOutHarmChance:30,heroItem:null,heroIndex:3,HP:100,catchSoccerID:0};
        var he5:heroStructure = {heroID:5,heroImgPath:"",heroHeadImgPath:"",heroName:"英雄5",heroIntroduce:"英雄介绍",heroType:1,quality:1,
            maxHP:200,skillArr:[],speed:2,harm:20,criticalChance:15,breakOutHarmChance:20,heroItem:null,heroIndex:4,HP:120,catchSoccerID:0};
        var he6:heroStructure = {heroID:2,heroImgPath:"",heroHeadImgPath:"",heroName:"英雄6",heroIntroduce:"英雄介绍",heroType:1,quality:1,
            maxHP:250,skillArr:[],speed:3,harm:30,criticalChance:10,breakOutHarmChance:15,heroItem:null,heroIndex:5,HP:110,catchSoccerID:0};
        var he7:heroStructure = {heroID:7,heroImgPath:"",heroHeadImgPath:"",heroName:"英雄7",heroIntroduce:"英雄介绍",heroType:1,quality:1,
            maxHP:300,skillArr:[],speed:1,harm:10,criticalChance:20,breakOutHarmChance:30,heroItem:null,heroIndex:6,HP:100,catchSoccerID:0};
        this.heroArr.push(he1);
        this.heroArr.push(he2);
        this.heroArr.push(he3);
        this.heroArr.push(he4);
        console.log(this.heroArr);
        this.heroArr.push(he5);
        this.heroArr.push(he6);
        this.heroArr.push(he7);

        this.createHero();
        this.createAllEnemy();
        this.createSoccer();//1,-250,-300
        this.lab_HPProportion.string = this.HP + "/" + this.maxHP;
        this.pro_HP.progress = this.HP/this.maxHP;
        this.lab_EXPProportion.string = this.EXP + "/" + this.maxEXP;
        this.pro_EXP.progress = this.EXP/this.maxEXP;
        this.soccerGameState = gameState.start;
        this.schedule(this.soccerGame,this.timeHS);
    }

    //游戏重置
    resetGame()
    {
        //清除所有子item
        this.node_soccer.removeAllChildren();

        this.soccerGameState = gameState.wait;
        this.HP = 0;
        this.EXP = 0;
        this.maxHP = 0;
        this.maxEXP = 0;
    }

    //创建英雄
    createHero()
    {
        //清除所有子item
        this.node_hero.removeAllChildren();
        
        for(var he:number = 0;he < this.heroArr.length;he++)
        {
            let item = instantiate(this.heroItemPre);
            if(this.heroArr[he].heroIndex == 0)
            {
                item.setPosition(-250,-300);
            }else{
                item.setPosition(-250 + this.heroArr[he].heroIndex * 90,-300);
            }
            console.log(he,item.getPosition().x,item.getPosition().y);
            item["heroID"] = this.heroArr[he].heroID;
            this.heroArr[he].HP = this.heroArr[he].maxHP;
            this.maxHP += this.heroArr[he].maxHP;
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

    //初始化创建敌人
    createAllEnemy()
    {
        //清除所有子item
        this.node_enemy.removeAllChildren();
        
        for(var en:number = 0;en < this.enemyArr.length;en++)
        {
            let item = instantiate(this.enemyItemPre);
            //随机位置
            item.setPosition(-270 + Math.floor(Math.random() * 540),500);
            console.log(item.getPosition().x,item.getPosition().y);
            item["enemyID"] = this.enemyArr[en].enemyID;
            // var es:enemyStructure = {enemyID:1,enemyImgPath:"",enemyName:"敌人"+(en+1),enemyIntroduce:"敌人介绍",experience:100,enemyType:1,
            //     maxHP:1,moveSpeed:1,attackSpeed:1,harm:1,skillID:1,enemyItem:item,HP:100};
            // this.enemyArr.push(es);
            this.enemyArr[en].HP = this.enemyArr[en].maxHP;
            item.getChildByName("pro_blood").getComponent(ProgressBar).progress = OperationTool.Instance.retainDecimal(2,this.enemyArr[en].HP/this.enemyArr[en].maxHP);
            this.enemyArr[en].enemyItem = item;
            this.node_enemy.addChild(item);
        }
    }
    
    //创建敌人
    createEnemy()
    {
        if(this.recycleEnemyArr.length > 0)
        {
            //从回收敌人数组中，拿出已创建过敌人重新赋值复用
        }else{
            //创建新敌人
        }
    }

    //创建足球
    createSoccer()
    {
        //随机一个英雄发球
        var newHeroIndex:number = Math.floor(Math.random() * this.heroArr.length);
        //获取该英雄的x,y，使球起始位置在英雄脚下
        let item = instantiate(this.soccerItemPre);
        item.setPosition(this.heroArr[newHeroIndex].heroItem.getPosition().x,this.heroArr[newHeroIndex].heroItem.getPosition().y - 20);
        item["soccerID"] = this.soccerArr.length + 1;
        var newSoccer:soccerStructure = {soccerID:this.soccerArr.length + 1,soccerImgPath:"",soccerType:1,speed:10,soccerItem:item,soccerState:0,
            xDirection:-1,yDirection:1,relevanceHeroID:this.heroArr[newHeroIndex].heroID,goalEnemyID:1,goalHeroID:0,wallX:0,wallY:0,moveTotal:0};
        this.soccerArr.push(newSoccer);
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
                //根据足球ID找到足球
                for(var findSoccer:number = 0;findSoccer < this.soccerArr.length;findSoccer++)
                {
                    if(this.soccerArr[findSoccer].soccerID == controllerEvent.getCustomProperty().soccerID)
                    {
                        //找到赋予球属性的英雄ID
                        rHeroID = this.soccerArr[findSoccer].relevanceHeroID;
                        gEnemyID = this.soccerArr[findSoccer].goalEnemyID;
                        //目标敌人ID归0
                        this.soccerArr[findSoccer].goalEnemyID = 0;
                        //球状态变为回球
                        this.soccerArr[findSoccer].soccerState = 2;
                        //球随机一个英雄返回
                        var newHeroIndex:number = Math.floor(Math.random() * this.heroArr.length);
                        //若随机的英雄已经在接球中，重选其他英雄
                        // while(this.heroArr[newHeroIndex].catchSoccerID != 0){
                        //     newHeroIndex = Math.floor(Math.random() * this.heroArr.length);
                        // }
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
                if(isBreakOutHarm)
                {
                    lastHarm = baseHarm * 3;
                }else if(isBreakOutHarm)
                {
                    lastHarm = baseHarm * 2;
                }else{
                    lastHarm = baseHarm;
                }
                //根据敌人ID查找敌人
                for(var findEnemy:number = 0;findEnemy < this.enemyArr.length;findEnemy++)
                {
                    console.log("碰撞敌人ID",controllerEvent.getCustomProperty().enemyID,"敌人ID：",this.enemyArr[findEnemy].enemyID,"敌人HP：",this.enemyArr[findEnemy].HP,this.enemyArr.length);
                    if(this.enemyArr[findEnemy].enemyID == controllerEvent.getCustomProperty().enemyID)
                    {
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
                        // textItem.getChildByName("lab_harm").getComponent(Label).string = "-" + lastHarm;
                        // textItem.getChildByName("lab_harm").getComponent(Label).color = new Color(this.color16Code(1));
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
                break;
        }
    }

    //敌人死亡
    enemyDead()
    {
        for(var findDeadEnemy:number = 0;findDeadEnemy < this.enemyArr.length;findDeadEnemy++)
        {
            if(this.enemyArr[findDeadEnemy].HP <= 0)
            {
                //不能直接移除显示材质，因为为共享资源，移除时会进行释放，导致其他同类材质显示不正常
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

    soccerGame()
    {
        if(this.soccerGameState == gameState.start)
        {
            //检测敌人是否死亡
            // this.enemyDead();
            //背景移动
            this.frightBgY = this.img_frightBg.node.getPosition().y - this.mapMoveSpeed;
            this.frightLinkUpBgY = this.img_frightLinkUpBg.node.getPosition().y - this.mapMoveSpeed;
            if(this.img_frightBg.node.getPosition().y < -667)
            {
                this.img_frightBg.node.setPosition(this.img_frightBg.node.getPosition().x,this.frightLinkUpBgY + 1334);
            }else{
                this.img_frightBg.node.setPosition(this.img_frightBg.node.getPosition().x,this.img_frightBg.node.getPosition().y - this.mapMoveSpeed);
            }
            if(this.img_frightLinkUpBg.node.getPosition().y < -667)
            {
                this.img_frightLinkUpBg.node.setPosition(this.img_frightLinkUpBg.node.getPosition().x,this.frightBgY + 1334);
            }else{
                this.img_frightLinkUpBg.node.setPosition(this.img_frightLinkUpBg.node.getPosition().x,this.img_frightLinkUpBg.node.getPosition().y - this.mapMoveSpeed);
            }

            //敌人移动
            for(var moveEnemy:number = 0;moveEnemy < this.enemyArr.length;moveEnemy++)
            {
                if(this.enemyArr[moveEnemy].enemyItem != null)
                {
                    //如果走到了发动攻击位置，y不再变，向英雄投射子弹
                    if(this.enemyArr[moveEnemy].enemyItem.getPosition().y < -130)
                    {
                        //投射子弹
                    }else{
                        this.enemyArr[moveEnemy].enemyItem.setPosition(this.enemyArr[moveEnemy].enemyItem.getPosition().x,
                        this.enemyArr[moveEnemy].enemyItem.getPosition().y - this.enemyArr[moveEnemy].moveSpeed);
                    }
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
                                //暂定保留两位小数点
                                // lastSpeedX = OperationTool.Instance.retainDecimal(2,lastSpeedX);
                                lastX = this.soccerArr[so].soccerItem.getPosition().x + lastSpeedX;
                                // if(this.enemyArr[findEnemy].enemyItem.getPosition().x > this.soccerArr[so].soccerItem.getPosition().x)
                                // {
                                // }else{
                                //     lastX = this.soccerArr[so].soccerItem.getPosition().x - lastSpeedX;
                                // }
                                lastY = this.soccerArr[so].soccerItem.getPosition().y + this.soccerArr[so].speed;
                                this.soccerArr[so].soccerItem.setPosition(lastX,lastY);
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
                                this.soccerArr[so].soccerItem.setPosition(lastX,lastY);
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
                //橙色
                return "#fd8d49";
            case 2:
                //红色 暴击
                return "#ff0000";
            case 3:
                //淡黄色 会心
                return "#fdea49";
            case 4:
                //浅蓝色
                return "#49c8fd";
            case 5:
                //黑色
                return "#000000";
            case 6:
                //白色
                return "#ffffff";
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
