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

//游戏记录
export interface gameRecordStructure{
    //章节ID
    chapterID:number;
    //关卡ID
    levelID:number;
    //中途退出关卡时的英雄数据（下次继续时，使用该数据）
    levelHeroArr:Array<heroStructure>;
}

//章节
export interface chapterStructure {
    //章节ID
    chapterID:number;
    //章节序列名
    chapterSequence:string;
    //章节名路径
    chapterNamePath:string;
    //章节是否解锁
    unlock:boolean;
    //章节关卡
    levelArr:Array<number>;
    //章节通关评分
    // passScore:number;
    //初始英雄
    initialHeroArr:Array<number>;
    //下一个章节ID
    nextChapterID:number;
}

//关卡
export interface levelStructure {
    //关卡ID
    levelID:number;
    //关卡名
    levelName:string;
    //关卡类型 1 常规关卡/割草关卡 2 障碍关卡 3 宝箱关卡 4 Boss关卡 5 奖杯关卡
    levelType:number;
    //地图是否静止
    stillLife:boolean;
    //最大时限
    maxTime:number;
    //可选择的下一个关卡
    nextLevelArr:Array<number>;
    //波次ID
    waveArr:Array<number>;
    //关卡背景路径
    levelImgPath:string;
    //关卡背景音乐路径
    levelMusicPath:string;
    //掉落金币
    dropGold:number;
    //掉落物品
    dropGoodsArr:Array<number>;
    //3个关卡评星任务
    taskArr:Array<number>;
}

//波数
export interface waveStructure {
    //波数ID
    waveID:number;
    //小怪池 敌人ID 敌人出现概率
    enemyAriseArr:Array<relevanceProStructure>;
    //小怪在本波数出现的上限个数 
    total:number;
    //小怪间隔时间(s)
    intervalTime:number;
    //BossID 0 无Boss
    BossID:number;
    //Boss出现时间
    BossBornTime:number;
    //同时生成的最少障碍/宝箱个数保持（直到总数不够时不再生成） 0 无限制
    minEnemy:number;
}

//英雄
export interface heroStructure {
    //英雄ID
    heroID:number;
    //英雄头像图片路径
    heroHeadImgPath:string;
    //英雄图片路径
    heroImgPath:string;
    //英雄spine动画路径
    heroSkePath:string;
    //英雄名
    heroName:string;
    //英雄介绍
    heroIntroduce:string;
    //英雄类型 0 空
    heroType:number;
    //属性克制
    restrainType:number;
    //速度
    speed:number;
    //初始伤害
    harm:number;
    //英雄技能
    skillArr:Array<number>;
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
    //解锁
    unlock:boolean;
    //上阵
    join:boolean;
    //伤害等级
    harmLevel:number;
    //暴击等级
    criticalLevel:number;
    //会心等级
    breakOutLevel:number;
    //HP等级
    HPLevel:number;
    //暴击率(初始为0，按升级叠加)
    criticalChance:number;
    //会心率(初始为0，按升级叠加)
    breakOutHarmChance:number;
    //英雄血量上限
    maxHP:number;
    //英雄品质
    quality:number;
    //英雄技能随等级成长
    skillProArr:Array<relevanceProStructure>;
    //英雄加强次数（一共抽过几次牌）
    promoteTotal:number;
}

//英雄满级
export interface heroProTopStructure {
    //英雄ID
    heroID:number;
    //属性满级记录数组
    propertyTopArr:Array<number>;
    //技能满级记录数组
    skillTopArr:Array<number>;
}

//敌人
export interface enemyStructure {
    /**
     * 静态属性
     */
    //敌人ID
    enemyID:number; 
    //敌人头像图片路径
    enemyHeadImgPath:string;
    //敌人spine动画路径
    enemySkePath:string;
    //敌人名
    enemyName:string;
    //敌人介绍
    enemyIntroduce:string;
    //敌人体型(区分外形大小) 1 小怪 2 中怪 3 大怪 4 boss 5 合体怪（奖杯）
    outline:number;
    //敌人类型（区分行走方向）1 从上到下 2 静止 3 从左到右
    enemyType:number;
    //敌人职业（区分功能，怪物的不同技能）
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
    // attackState:number;
    //敌人攻击计时
    attackSpeedTime:number;
}

//敌人子弹
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
    /**
     * 足球状态 0 等待发球 1 发球（有目标敌人） 2 回球（有目标英雄） 
     * 3 发球时漏球（向目标敌人运动，未到时敌人已死亡），保持运动轨迹 4 发球漏球后碰墙（触发前提为状态3），改变运动轨迹向英雄折返 
     * 5 回球时漏球（向英雄位置运动，该位置无放置英雄），保持运动轨迹 6 回球时漏球后碰墙（触发前提为状态5），随机x点返回
     */
    soccerState :number;
    //足球(y轴)速度
    speed:number;
    //踢出球后，决定球属性的英雄ID
    relevanceHeroID:number;
    //目标敌人编号，当目标敌人死亡后，暂时失去目标编号为0
    goalEnemySerialNum:number;
    //回球目标英雄ID，未碰到之前，属性仍然是前一个英雄的属性（该属性仅存在于英雄静止版本，在英雄移动版中去掉该属性）
    goalHeroID:number;
    //回球点x
    goalWallX:number;
    //球最后一次的x方向移速（失去目标飞向墙）
    speedWallX:number;
    //移动次数累计
    moveTotal:number;
    //向敌人发球时，漏球的x判断
    // lineX:number;
}

//技能
export interface heroSkillStructure {
    //技能ID
    skillID:number;
    //技能类型
    skillType:number;
    //技能名
    skillName:string; 
    //技能图标路径
    skillIconPath:string; 
    //技能描述
    describe:string; 
    //技能效果
    skillArr:Array<skillEffectStructure>;
}

//技能效果
export interface skillEffectStructure {
    //技能等级
    level:number;
    //效果
    effect:number;
    //作用范围
    scope:number;
    //持续秒数
    second:number;
    //技能冷却CD
    // CD:number;
    
}

//任务表
export interface taskTableStructure {
    //任务ID
    taskID:number;
    //任务类型 1 游戏中完成 2 游戏结算时完成
    taskType:number;
    //任务描述
    describe:string;
}

//道具
export interface propStructure {
    //道具ID
    propID:number;
    //道具名
    propName:string;
    //道具描述
    describe:string; 
    //道具图标
    propIconPath:number;
    //道具类型
    propType:number;
    //道具释放CD
    releaseCD:number;
    /**
     * 动态属性
     */
    //道具个数
    count:number;
}

//障碍/宝箱随机出现地点
export interface locationTableStructure {
    //地点编号
    locationID:number;
    //x位置
    locationX:number;
    //y位置
    locationY:number;
}

//宠物
export interface petStructure {
    //宠物ID
    petID:number;
    //宠物伤害
    harm:number;
}

//英雄BUFF
export interface heroBUFFTableStructure {
    //BuffID
    buffID:number;
    //Buff类型
    buffType:number;
    //Buff名
    buffName:string;
    //buff图标
    buffIconPath:number;
    //buff随等级变化的效果
    buffEffectArr:Array<relevanceProStructure>; 
}

//敌人BUFF
export interface enemyBUFFTableStructure {
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

//卡牌增幅属性数据记录
export interface cardAddProStructure {
    //提升英雄ID
    heroID:number;
    //新上阵
    newJoin:boolean;
    //品质
    quality:number;
    //提升类型 1 攻击 2 暴击 3 会心 4 HP 5 解锁/升级技能
    promote:number;
    //等级
    level:number;
    //倍数
    multiple:number;
    //技能ID
    skillID:number;
    //是否叠满
    isTop:boolean;
}

//英雄属性增幅
export interface heroPropertyTableStructure {
    //属性类型
    propertyType:number;
    //属性图标路径
    propertyIconPath,
    //属性名
    propertyName:string; 
    //属性描述
    describe:string; 
    //属性等级增幅效果
    growUpArr:Array<relevanceProStructure>; 
}

//关联属性（随着x属性变化，增加y属性,z属性……等）
export interface relevanceProStructure {
    //ID
    ID:number;
    //等级
    level:number;
    //倍数
    multiple:number;
    //权重百分比
    percent:number;
    //秒数
    seconds:number;
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