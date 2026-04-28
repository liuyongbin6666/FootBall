import { _decorator, AudioClip, Component, Node, Prefab, Sprite, Vec2 } from 'cc';
const { ccclass, property } = _decorator;
/**
 * 类型结构类
 */
@ccclass('GlobalStructure')
export class GlobalStructure extends Component {
    public static Instance: GlobalStructure;
    protected onLoad(): void {
        GlobalStructure.Instance = this;
    }
}

//用户信息
export interface userStructure {
    //用户id
    userId:number;
    //用户昵称
    nickName:string;
    //用户金币
    gold:number;
    //用户头像
    headIcon:string;
}

//章节
export interface chapterStructure {
    //章节ID
    chapterID:number;
    //章节是否解锁
    unlock:boolean;
    //章节关卡
    levelArr:Array<number>;
    //章节通关评分
    // passScore:number;
}

//关卡
export interface levelStructure {
    //关卡ID
    levelID:number;
    //关卡类型 1 割草关卡 2 障碍关卡 3 常规关卡 4 Boss关卡 5 奖杯关卡
    levelType:number;
    //掉落金币
    dropGold:number;
    //掉落物品
    dropGoodsArr;
    //敌人ID 敌人出现概率 敌人在本波数出现上限个数 
    //关卡主角技能
    roleSkillArr:Array<number>;
}

//英雄
export interface heroStructure {
    //英雄ID
    heroID:number;
    //英雄头像图片路径
    heroHeadImgPath:string;
    //英雄图片路径
    heroImgPath:string;
    //英雄名
    heroName:string;
    //英雄介绍
    heroIntroduce:string;
    //英雄类型
    heroType:number;
    //英雄品质
    quality:number;
    //英雄血量上限
    maxHP:number; 
    //速度
    speed:number;
    //伤害
    harm:number;
    //英雄技能
    skillArr:Array<number>;
    //暴击率
    criticalChance:number;
    //会心率
    breakOutHarmChance:number;
    //克制类型
    // restrainType:number;

    // //碰墙回旋次数
    // circleRound:number;
    // //弹射个数
    // ricochet:number;
    // //爆炸范围
    // boom:number;
    // //灼烧伤害 
    // firing:number;
    // //灼烧伤害持续秒数
    // firingSecond:number;
    // //联锁伤害个数
    // interlock:number;
    // //穿透
    // piercing:number;
    // //减速
    // speedCut:number;
    // //减速持续秒数
    // speedCutSecond:number;
    
    /**
     * 动态属性
     */
    //英雄节点
    heroItem:Node;
    //英雄站位下标
    heroIndex:number;
    //英雄血量
    HP:number;
    //0 闲置状态，等待接球 >0 接球状态，目标球ID 
    catchSoccerID:number;
}

//敌人
export interface enemyStructure {
    /**
     * 静态属性
     */
    //敌人ID
    enemyID:number; 
    //敌人头像图片路径
    heroHeadImgPath:string;
    //敌人名
    enemyName:string;
    //敌人介绍
    enemyIntroduce:string;
    //敌人经验
    experience:number; 
    //敌人类型
    enemyType:number;
    //敌人职业
    enemyOccupation:number;
    //敌人血量上限
    maxHP:number;
    //敌人移动速度
    moveSpeed:number;
    //敌人攻击速度
    attackSpeed:number;
    //攻击距离
    attackDistance:number;
    //敌人伤害
    harm:number;
    //掉落经验
    EXP:number;
    //掉落金币
    gold:number;
    //掉落道具
    prop:number;
    //敌人技能发动概率
    skillProbability:number;
    //怪物冒泡对话
    speak:string;
    
    /**
     * 动态属性
     */
    //敌人节点
    enemyItem:Node;
    //敌人血量
    HP:number;
    //敌人攻击状态 0 闲置（未到发子弹地点） 1 发射子弹中 2 发射子弹完毕
    attakState:number;
}

//敌人
export interface bulletStructure {
    //子弹ID
    bulletID:number;
    //子弹图片路径
    bulletImgPath:string;
    //目标英雄ID
    goalHeroID:number;
}

//足球
export interface soccerStructure {
    //足球ID
    soccerID:number;
    //足球图片路径
    soccerImgPath:string;
    //足球类型
    soccerType:number;
    /**
     * 动态属性
     */
    //足球节点
    soccerItem:Node;
    //足球状态 0 等待发球 1 发球 2 回球 3 漏球-发球 4 漏球-回球
    soccerState :number;
    //足球(y轴)速度
    speed:number;
    //x轴方向 1 右 -1 左
    xDirection:number;
    //y轴方向 1 上 -1 下
    yDirection:number;
    //踢出球后，决定球属性的英雄ID
    relevanceHeroID:number;
    //目标敌人ID，当目标敌人死亡后，暂时失去目标ID为0
    goalEnemyID:number;
    //回球目标英雄ID，未碰到之前，属性仍然是前一个英雄的属性
    goalHeroID:number;
    //墙x
    wallX:number;
    //墙y
    wallY:number;
    //移动次数累计
    moveTotal:number;
}

//技能
export interface skillStructure {
    //技能ID
    skillID:number;
    //技能图标路径
    skillPath, 
    //技能类型
    skillType:number;
    //技能等级
    skillLevel:number; 
    //技能伤害
    harm:number;
    //技能持续秒数
    second:number;
    //技能作用范围
    scope:number;
    //技能冷却CD
    CD:number;
}

//宠物
export interface petStructure {
    //宠物ID
    petID:number;
    //宠物伤害
    harm:number;
}

//BUFF
export interface BUFFStructure {
}

//英雄BUFF
export interface heroBUFFStructure {
    //会心
    breakOutHarm:number;
    //无敌
    invincible:number;
}

//敌人BUFF
export interface enemyBUFFStructure {
    //沉默
    silence:number;
    //冰冻
    ice:number;
    //虚弱
    weakness:number;
    //暴走
    goBallistic:number;
    //护甲
    armor:number;
    //穿甲
    armourPiercing:number;
    //灼烧
    invincible:number;
    //中毒
    poisoning:number;
}

//天赋
export interface talentStructure {
    //天赋ID
    talentID:number; 
    //天赋类型
    talentType:number;
    //该次天赋加点消耗数
    dot:number;
    //天赋加点次数
    dotCount:number;
    //天赋加点数上限次数
    maxDotCount:number;
    //天赋效果
    effect:number;
}

//酒馆抽卡概率
export interface ampCardProTableStructure {
    //酒馆等级
    level:number;
    //白卡占比（按百分比%）
    qualityWhite:number;
    //绿卡占比
    qualityGreen:number;
    //蓝卡占比
    qualityBlue:number;
    //紫卡占比
    qualityPurple:number;
    //红卡占比
    qualityRed:number;
    //黄卡占比
    qualityYellow:number;
}

//材质类
export interface preStructure {
    //材质名
    preName:string;
    //生成为node后所在的层级
    layer:Node;
}

//材质类
export interface preItemStructure {
    //材质名
    preItemName:string;
    //已加载过的Prefab
    preItem:Prefab;
}

//音效类型
export interface soundStructure {
    //音效加载路径
    audioPath:string;
    //音效名
    name:string;
}

//已加载过的音效类型
export interface clipNameStructure {
    //音效名
    name:string;
    //已加载过的音效
    clip:AudioClip;
}