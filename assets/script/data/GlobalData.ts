import { _decorator } from 'cc';
import { heroStructure, ampCardProTableStructure, enemyStructure, userStructure } from './GlobalStructure';//,chapterTableStructure,gameRecordStructure, propTableStructure, mapTableStructure
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

    width:number = 750;
    height:number = 1334;

    /**
     * json数据读取存储或服务器发送的随机数据表
    */
    //抽卡概率表
    public ampCardProTableArr:Array<ampCardProTableStructure> = [];

    //英雄表
    public heroTableArr:Array<heroStructure> = [];
    //怪物表
    public taskTableArr:Array<enemyStructure> = [];
    //章节表
    // public chapterTableArr:Array<chapterTableStructure> = [];
    //道具表
    // public propTableArr:Array<propTableStructure> = [];
    //地图表
    // public mapTableArr:Array<mapTableStructure> = [];

    //解锁英雄表
    public unlockHeroArr:Array<heroStructure> = [];
    //上阵英雄表
    public joinHeroArr:Array<heroStructure> = [];

    //酒馆等级
    public amplificationCardLevel:number = 1;

    //用户账户
    public userAccount:string = "";
    //用户ID
    public userID:number = 0;
    //用户密钥
    public userVerify:number = 0;
    //用户信息
    public userInfo:userStructure = {userId:10001,nickName:"玩家abc",gold:1000,headIcon:""};

    //游戏当前记录
    // public gameRecord:gameRecordStructure = {gameRecordID:1,saveTime:"2001-3-1 11:09",teamRoles:[],chapterArr:[],chapterID:0,speakID:10001,
    //     speakOverArr:[],speakRecordArr:[],roleVPArr:[],bagPropArr:[],propGainArr:[],taskID:0,taskOverID:0,taskCompleteness:0,
    //     taskReceiveArr:[],taskConcludeArr:[],mapID:10011,destinationID:0,placeReachArr:[],resurgenceCount:[]};

    /**
     * 临时数据，下线清零
    */
    //通关当前章节的评分
    public chapterScore:number = 0;
    
    //音乐是否开启
    public musicState:boolean = true;
    //音效是否开启
    public soundState:boolean = true;
}