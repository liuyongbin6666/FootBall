import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;
/**
 * 时间管理工具
 */
@ccclass('TimeTool')
export class TimeTool{
    private static _instance: TimeTool = null;

    public static get Instance() {
        if (this._instance == null) {
            this._instance = new TimeTool();
        }

        return this._instance;
    }
    //获取本地时间 格式 时：分：秒 \n 月/日
    public getHMSMD():string
    {
        var currentLocalDate = new Date();
        var month = currentLocalDate.getMonth() + 1;
        var day = currentLocalDate.getDate();
        var hours = currentLocalDate.getHours();
        var minutes = currentLocalDate.getMinutes();
        var seconds = currentLocalDate.getSeconds();
        var lastTime:string = "" + this.dealPlusZero(hours) + ":" + this.dealPlusZero(minutes) + ":" + this.dealPlusZero(seconds) + "\n" 
        + this.dealPlusZero(month) +"/" + this.dealPlusZero(day);
        return lastTime;
    }

    //获取本地时间 格式 年/月/日 时:分
    public getYMDHM(separator:string = "/"):string
    {
        var currentLocalDate = new Date();
        var year = currentLocalDate.getFullYear() + 1;
        var month = currentLocalDate.getMonth() + 1;
        var day = currentLocalDate.getDate();
        var hours = currentLocalDate.getHours();
        var minutes = currentLocalDate.getMinutes();
        var lastTime:string = "" + year + separator + this.dealPlusZero(month) + separator + this.dealPlusZero(day) + " " 
        + this.dealPlusZero(hours) +":" + this.dealPlusZero(minutes);
        return lastTime;
    }

    //根据x秒或毫秒折算时间 格式 分:时 transitionSecond 需要转换为秒的总数值 secondSystem 秒按多少进制
    public getMS(transitionSecond:number,secondSystem:number)
    {
        //计算出有多少秒
        var seconds:number = Math.floor(transitionSecond/secondSystem);
        //转换为分钟
        var minutes:number = Math.floor(seconds/60);
        //除去分钟后剩余秒数
        var residueSecond:number = seconds - minutes * 60;
        var lastTime:string = "" + this.dealPlusZero(minutes) +":" + this.dealPlusZero(residueSecond); 
        return lastTime;
    }

    //数字小于10时，自动加一个字符0
    private dealPlusZero(num:number):string
    {
        if(num < 10)
        {
            return "0" + num;
        }else
        {
            return "" + num;
        }
    }
}


