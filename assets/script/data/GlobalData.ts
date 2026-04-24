import { _decorator } from 'cc';
import { equipStructure,laborUnionStructure, taskTableStructure, userStructure, rolePropertyTableStructure, roleCharacterTableStructure, shopStructure, labelPageStructure, chapterTableStructure, roleTableStructure, chapterStructure, roleVariationPropertyStructure, bagPropStructure, speakRecordStructure, placeTableStructure, achievementTableStructure, taskOverStructure, gameRecordStructure, propTableStructure, chapterSpeakStructure, entranceCartoonStructure, mapTableStructure, drawStructure, cutRopeStructure, threadTableStructure, exploreTableStructure } from '../data/StructureData';
const { ccclass, property } = _decorator;

/**
 * 全局数据
 */
@ccclass('GlobalData')
export class GlobalData{
    private static _instance: GlobalData = null;
    public static get Instance() {
        if (this._instance == null) {
            this._instance = new GlobalData();
        }

        return this._instance;
    }

    width:number = 1080;
    height:number = 1920;

    /**
     * json数据读取存储或服务器发送的随机数据表
    */
    //入场漫画表
    public entranceCartooneArr:Array<entranceCartoonStructure> = [];
    //角色表
    public roleTableArr:Array<roleTableStructure> = [];
    //章节表
    public chapterTableArr:Array<chapterTableStructure> = [];
    //章节-对话表
    public speakTableArr:Array<chapterSpeakStructure> = [];
    //探索表
    public exploreTableArr:Array<exploreTableStructure> = [];
    //线索表
    public threadTableArr:Array<threadTableStructure> = [];
    //道具表
    public propTableArr:Array<propTableStructure> = [];
    //任务表
    public taskTableArr:Array<taskTableStructure> = [];
    //地点表
    public placeTableArr:Array<placeTableStructure> = [];
    //地图表
    public mapTableArr:Array<mapTableStructure> = [];
    //成就表
    public achievementTableArr:Array<achievementTableStructure> = [];

    //绘画表
    public drawTableArr:Array<drawStructure> = [];

    //属性
    public rolePropertyTableArr:Array<rolePropertyTableStructure> = [];
    //角色性格表
    public roleCharacterTableArr:Array<roleCharacterTableStructure> = [];
    //装备表
    public equipTableArr:Array<equipStructure> = [];
    //标签页合集
    public labelPage:labelPageStructure = {rolePropertyArr:[],taskTypeArr:[],shopTypeArr:[],friendTypeArr:[],rankTypeArr:[],achievementTypeArr:[],managerMemberTypeArr:[]};

    //用户账户
    public userAccount:string = "";
    //用户ID
    public userID:number = 0;
    //用户密钥
    public userVerify:number = 0;
    //用户信息
    public userInfo:userStructure = {userId:10001,nickName:"新用户abcdefg",gold:1000,diamond:1000,headIcon:"",friendsArr:[],friendsMax:100,applyForFriendsArr:[],
        recentGamesStrangerArr:[],userEmailArr:[],todayTaskArr:[],bagCellArr:[],bagPropArr:[],equipCellArr:[],equipArr:[],cityWideStrangerArr:[],blockStrangerArr:[],
        laborUnionId:0,roleArr:[],
        achievementArr:{achievementDot:0,achievementTotalDot:10000,type1Arr:[],type2Arr:[],type3Arr:[],type4Arr:[],type5Arr:[],type6Arr:[]}};
    //协会信息
    public laborUnion:laborUnionStructure = {laborUnionId:10001,laborUnionName:"菜狗工会哈哈哈",headIcon:"",gold:1000,lv:1,president:"菜得抠脚",nextLvGold:10000,
        active:100,announcement:"会长很懒，还没写公告",membersArr:[],memberMax:100,applyForMemberArr:[],blockStrangerArr:[],laborUnionTaskArr:[]};
    //商城商品售卖列表
    public shopCommodity:shopStructure = {propSaleArr:[],equipSaleArr:[],conversionArr:{propConversionArr:[],equipConversionArr:[]}};

    //游戏当前记录
    public gameRecord:gameRecordStructure = {gameRecordID:1,saveTime:"2001-3-1 11:09",teamRoles:[],chapterArr:[],chapterID:0,speakID:10001,
        speakOverArr:[],speakRecordArr:[],roleVPArr:[],bagPropArr:[],propGainArr:[],taskID:0,taskOverID:0,taskCompleteness:0,
        taskReceiveArr:[],taskConcludeArr:[],mapID:10011,destinationID:0,placeReachArr:[],resurgenceCount:[]};
    //游戏所有存档记录
    public gameSaveArr:Array<gameRecordStructure> = [];

    /**
     * 临时数据，下线清零
    */
    //选中的章节ID
    public selectChapterID:number = 0;
    //通关当前章节的评分
    public chapterScore:number = 0;
    
    //音乐是否开启
    public musicState:boolean = true;
    //音效是否开启
    public soundState:boolean = true;
}