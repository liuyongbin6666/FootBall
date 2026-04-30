import { _decorator, Component, find, Label, Node, ProgressBar } from 'cc';
import { LoadTableTool } from '../tool/LoadTableTool';
import { OperationTool } from '../tool/OperationTool';
import { GlobalData } from '../data/GlobalData';
import { CharacterTool } from '../tool/CharacterTool';
import { chapterStructure } from '../data/GlobalStructure';
import { Layer } from '../manager/Layer';
import { LoadImgTool } from '../tool/LoadImgTool';
const { ccclass, property } = _decorator;
/**
 * 进度条加载界面（较多文件）
*/
@ccclass('LoadingView')
export class LoadingView extends Component {
    /**
     * 组件
    */
    //资源加载进度条
    private pro_loading:ProgressBar = null;
    //资源加载百分比
    private lab_loadingSchedule:Label;
    //游戏小技巧提示文字
    private lab_hint:Label;

    /**
     * 数据
    */
    private loadState:boolean = false;
    //资源初次加载总文件数量
    private loadTotalCount:number = 4;
    //资源已加载总文件数量
    private loadCount:number = 0;
    protected onLoad(): void {
        this._initObect();
        this._onEvent();

    }

    private _initObect() {
        this.pro_loading = find('pro_loading', this.node).getComponent(ProgressBar);
        this.lab_loadingSchedule = find('lab_loadingSchedule', this.node).getComponent(Label);
        this.lab_hint = find('lab_hint', this.node).getComponent(Label);

    }

    private _onEvent() {
    }

    start() {
        this.loadState = true;
        this.loadFile();
        this.schedule(this.loadPro, 1);
    }

    loadPro() {
        if(this.pro_loading.progress < 1 && this.loadState == true) {
            //进度只保留2位小数点
            var proNum:number = OperationTool.Instance.retainDecimal(2,this.loadCount/this.loadTotalCount);
            this.lab_loadingSchedule.string = "正在加载……" + proNum * 100 + "%";
            this.pro_loading.progress = proNum;
        } else if(this.pro_loading.progress >= 1 && this.loadState == true) {
            this.loadState = false;
            //加载完成，移除加载页监听
            this.unschedule(this.loadPro);
            //预加载登录界面
            // let pathLogin = Layer.Instance.getGamePrePath("login");
            // LoadImgTool.Instance.loadPrefab("login",pathLogin,Layer.Instance.layerView,true);
            //抽卡
            // let pathAmplificationCard = Layer.Instance.getGamePrePath("amplificationCard");
            // LoadImgTool.Instance.loadPrefab("amplificationCard",pathAmplificationCard,Layer.Instance.layerView,true);
            //预加载渐变过渡
            // let pathDynamicFigure = Layer.Instance.getGamePrePath("dynamicFigure");
            // LoadImgTool.Instance.loadPrefab("dynamicFigure",pathDynamicFigure,Layer.Instance.layerTips,false);
            //关闭加载首页
            Layer.Instance.close("loading",Layer.Instance.layerView);
        }

        //加载中随机显示提示语
        var hintNum:number = Math.floor(Math.random() * 3) + 1;
        this.hintText(hintNum);
    }
    
    //加载json表
    loadFile() {
        var _this = this;

        //加载英雄表
        LoadTableTool.Instance.loadTextFile("json/heroJson",(value)=>{
            var heroArr = JSON.parse(value);
            console.log("英雄：",heroArr);
            //找到图片路径
            // for(var r:number = 0;r < heroArr.length;r++)
            // {
            //     //用符号“\”替换符号“-”，“\”无法在JSON表里被读取，先用其他字符代替，读取后再替换回来
            //     var newImgPath:string = CharacterTool.Instance.pathCharacter(heroArr[r].heroHeadImgPath);
            //     heroArr[r].heroHeadImgPath = newImgPath;
            // }
            GlobalData.Instance.heroTableArr = heroArr;
            _this.loadCount++;
        });

        //加载英雄技能表
        LoadTableTool.Instance.loadTextFile("json/heroSkillJson",(value)=>{
            var heroSkillArr = JSON.parse(value);
            console.log("英雄技能表：",heroSkillArr);
            GlobalData.Instance.heroSkillTableArr = heroSkillArr;
            _this.loadCount++;
        });

        //加载英雄属性增幅表
        LoadTableTool.Instance.loadTextFile("json/heroPropertyJson",(value)=>{
            var heroProGrowUpArr = JSON.parse(value);
            console.log("英雄属性增幅表：",heroProGrowUpArr);
            GlobalData.Instance.heroProGrowUpTableArr = heroProGrowUpArr;
            _this.loadCount++;
        });

        //加载抽卡概率表
        LoadTableTool.Instance.loadTextFile("json/ampCardProJson",(value)=>{
            var ampCardProArr = JSON.parse(value);
            console.log("抽卡概率表：",ampCardProArr);
            GlobalData.Instance.ampCardProTableArr = ampCardProArr;
            _this.loadCount++;
        });

        //加载章节表
        // LoadTableTool.Instance.loadTextFile("json/chapterJson",(value)=>{
        //     var chapterArr = JSON.parse(value);
        //     console.log("章节：",chapterArr);
        //     GlobalData.Instance.chapterTableArr = chapterArr;
        //     _this.loadCount++;
        //     //根据当前章节，找到对应路径
        //     for(var f:number = 0;f < GlobalData.Instance.chapterTableArr.length;f++)
        //     {
        //         if(GlobalData.Instance.chapterTableArr[f].chapterID == GlobalData.Instance.gameRecord.chapterID)
        //         {
        //             //用符号“\”替换符号“-”，“\”无法在JSON表里被读取，先用其他字符代替，读取后再替换回来
        //             //转换读取json路径
        //             var newSpeakPath:string = CharacterTool.Instance.pathCharacter(GlobalData.Instance.chapterTableArr[f].speakPath);
        //             //加载目前章节对话
        //             LoadTableTool.Instance.loadTextFile(newSpeakPath,(value)=>{
        //                 var speakArr = JSON.parse(value);
        //                 console.log("对话：",speakArr);
        //                 for(var si:number = 0;si < speakArr.length;si++)
        //                 {
        //                     if(speakArr[si].speakImg != "" && speakArr[si].speakImg != "uniformity")
        //                     {
        //                         //转换图片路径
        //                         speakArr[si].speakImg = CharacterTool.Instance.pathCharacter(speakArr[si].speakImg);
        //                     }
        //                 }
        //                 // var newSpeakArr:chapterSpeakStructure = {chapterID:GlobalData.Instance.gameRecord.chapterID,speakArr:speakArr};
        //                 // GlobalData.Instance.speakTableArr.push(newSpeakArr);
        //                 _this.loadCount++;
        //             });
        //             break;
        //         }
        //     }
        // });
        
        //加载道具表
        // LoadTableTool.Instance.loadTextFile("json/propJson",(value)=>{
        //     var propArr = JSON.parse(value);
        //     console.log("道具：",propArr);
        //     for(var propReplace:number = 0;propReplace < propArr.length;propReplace++)
        //     {
        //         if(propArr[propReplace].propIcon != "")
        //         {
        //             //转换图片路径
        //             propArr[propReplace].propIcon = CharacterTool.Instance.pathCharacter(propArr[propReplace].propIcon);
        //         }
        //     }
        //     GlobalData.Instance.propTableArr = propArr;
        //     _this.loadCount++;
        // });

    }

    //提示语
    hintText(hintNum:number)
    {
        switch(hintNum)
        {
            case 1:
                this.lab_hint.string = "小技巧:游戏中记得及时保存，以免进度丢失";
                break;
            case 2:
                this.lab_hint.string = "小技巧:游戏中多对话NPC收集有效信息，利于通关";
                break;
            case 3:
                this.lab_hint.string = "小技巧:隐藏副本通关后，可获得额外奖励";
                break;
        }
    }

    update(deltaTime: number) {
        
    }
}


