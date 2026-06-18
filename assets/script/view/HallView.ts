import { _decorator, Button, Component, find, Label, Layout, Node, sp, Sprite } from 'cc';
import { Layer } from '../manager/Layer';
import { GlobalData } from '../data/GlobalData';
import { LoadImgTool } from '../tool/LoadImgTool';
import { GameEventName } from '../manager/GameEventName';
import { GameCustomEvent } from '../manager/GameCustomEvent';
import { chapterStructure } from '../data/GlobalStructure';
import { AudioMG } from '../sound/AudioMG';
const { ccclass, property } = _decorator;

/**
 * 大厅界面
 */
@ccclass('HallView')
export class HallView extends Component {
    /**
     * 组件
    */
    private node_grocery:Node;
    private node_farm:Node;

    private node_journey:Node;
    private lay_recommendedLineup:Layout;
    //章节序列名
    private lab_chapter:Label;
    //章节名
    private lab_chapterTitle:Label;
    private img_cartoon:Sprite;
    //上一章
    private btn_previousChapter:Button;
    //下一章
    private btn_nextChapter:Button;
    //踏上征程
    private btn_fight:Button;
    //新的征程
    private btn_newFight:Button;
    //继续征程
    private btn_goOnFight:Button;
    //继续征程关卡记录显示
    private lab_lv:Label;

    //杂货铺
    private btn_grocery:Button;
    //农场
    private btn_farm:Button;
    //征途
    private btn_journey:Button;
    /**
     * 数据
    */
    //章节更换
    private chapterChangeCount:number = 0;
    //正在进行的章节
    private saveChapter:chapterStructure;
    protected onLoad(): void {
        this._initObect();
        this._onEvent();
    }

    private _initObect() {
        this.node_grocery = find('node_grocery', this.node);
        this.node_farm = find('node_farm', this.node);
        
        this.node_journey = find('node_journey', this.node);
        this.lay_recommendedLineup = find('node_journey/lay_recommendedLineup', this.node).getComponent(Layout);
        this.lab_chapter = find('node_journey/lab_chapter', this.node).getComponent(Label);
        this.lab_chapterTitle = find('node_journey/lab_chapterTitle', this.node).getComponent(Label);
        this.img_cartoon = find('node_journey/img_journeyBg/img_cartoon', this.node).getComponent(Sprite);
        this.btn_previousChapter = find('node_journey/btn_previousChapter', this.node).getComponent(Button);
        this.btn_nextChapter = find('node_journey/btn_nextChapter', this.node).getComponent(Button);
        this.btn_fight = find('node_journey/btn_fight', this.node).getComponent(Button);
        this.btn_newFight = find('node_journey/btn_newFight', this.node).getComponent(Button);
        this.btn_goOnFight = find('node_journey/btn_goOnFight', this.node).getComponent(Button);
        this.lab_lv = find('node_journey/btn_goOnFight/lab_lv', this.node).getComponent(Label);


        this.btn_grocery = find('node_bottom/lay_toggleButton/btn_grocery', this.node).getComponent(Button);
        this.btn_farm = find('node_bottom/lay_toggleButton/btn_farm', this.node).getComponent(Button);
        this.btn_journey = find('node_bottom/lay_toggleButton/btn_journey', this.node).getComponent(Button);

    }

    private _onEvent() {
        this.btn_previousChapter.node.on(Node.EventType.TOUCH_START, this.reduceChapterIndexFun, this);
        this.btn_nextChapter.node.on(Node.EventType.TOUCH_START, this.increaseChapterIndexFun, this);
        this.btn_fight.node.on(Node.EventType.TOUCH_START, this.openFight, this);
        this.btn_newFight.node.on(Node.EventType.TOUCH_START, this.newFightFun, this);
        this.btn_goOnFight.node.on(Node.EventType.TOUCH_START, this.goOnFightFun, this);
        this.btn_grocery.node.on(Node.EventType.TOUCH_START, this.changePage, this);
        this.btn_farm.node.on(Node.EventType.TOUCH_START, this.changePage, this);
        this.btn_journey.node.on(Node.EventType.TOUCH_START, this.changePage, this);
        GameCustomEvent.Instance.addCustomEvent(GameEventName.HALL_EVENT,this.freshHallFun,this);
    }

    start() {
        let pathfight = Layer.Instance.getGamePrePath("fightMoveHero");
        LoadImgTool.Instance.loadPrefab("fightMoveHero",pathfight,Layer.Instance.layerView,false);
        // let pathfight = Layer.Instance.getGamePrePath("fight");
        // LoadImgTool.Instance.loadPrefab("fight",pathfight,Layer.Instance.layerView,false);
        // let pathAward = Layer.Instance.getGamePrePath("award");
        // LoadImgTool.Instance.loadPrefab("award",pathAward,Layer.Instance.layerView,false);
        
        //默认页面征程
        this.freshChapter();
        
        AudioMG.Instance.playMusicAudio("hall_bgyy");
    }

    //更换页面
    changePage(e)
    {
        switch(e.target.name)
        {
            case 'btn_grocery':
                this.node_grocery.active = true;
                this.btn_grocery.node.getChildByName("img_toggle_selected").getComponent(Sprite).node.active = true;
                this.node_farm.active = false;
                this.btn_farm.node.getChildByName("img_toggle_selected").getComponent(Sprite).node.active = false;
                this.node_journey.active = false;
                this.btn_journey.node.getChildByName("img_toggle_selected").getComponent(Sprite).node.active = false;
                break;
            case "btn_farm":
                this.node_grocery.active = false;
                this.btn_grocery.node.getChildByName("img_toggle_selected").getComponent(Sprite).node.active = false;
                this.node_farm.active = true;
                this.btn_farm.node.getChildByName("img_toggle_selected").getComponent(Sprite).node.active = true;
                this.node_journey.active = false;
                this.btn_journey.node.getChildByName("img_toggle_selected").getComponent(Sprite).node.active = false;
                break;
            case "btn_journey":
                this.node_grocery.active = false;
                this.btn_grocery.node.getChildByName("img_toggle_selected").getComponent(Sprite).node.active = false;
                this.node_farm.active = false;
                this.btn_farm.node.getChildByName("img_toggle_selected").getComponent(Sprite).node.active = false;
                this.node_journey.active = true;
                this.btn_journey.node.getChildByName("img_toggle_selected").getComponent(Sprite).node.active = true;
                break;
            case 4:
                break;
            case 5:
                break;
        }
    }

    reduceChapterIndexFun()
    {
        if(GlobalData.Instance.gameRecord.chapterID + this.chapterChangeCount - 1 > 0)
        {
            this.chapterChangeCount--;
            this.freshChapter();
        }
    }

    increaseChapterIndexFun()
    {
        if(GlobalData.Instance.gameRecord.chapterID + this.chapterChangeCount + 1 <= GlobalData.Instance.chapterTableArr.length)
        {
            //判断是否已解锁
            this.chapterChangeCount++;
            this.freshChapter();
        }
    }

    //刷新征途战斗按钮
    freshFightBtnFun(cstate:number)
    {
        if(cstate == 2)
        {
            this.btn_newFight.node.active = true;
            this.btn_goOnFight.node.active = true;
            this.btn_fight.node.active = false;
        }else if(cstate == 1){
            this.btn_newFight.node.active = false;
            this.btn_goOnFight.node.active = false;
            this.btn_fight.node.active = true;
        }else{
            this.btn_newFight.node.active = false;
            this.btn_goOnFight.node.active = false;
            this.btn_fight.node.active = false;
        }
    }

    //开启战斗
    openFight()
    {
        // Layer.Instance.show("fight",Layer.Instance.layerView);
        Layer.Instance.show("fightMoveHero",Layer.Instance.layerView);

        //将关卡设为0，0为重置标识
        GlobalData.Instance.gameRecord.levelID = 0;

        //向战斗界面传递当前选择的章节号，读取数据
        let fightEvent = new GameEventName({ eventCode: 2,chapterID: GlobalData.Instance.gameRecord.chapterID + this.chapterChangeCount });
        GameCustomEvent.Instance.node.emit(GameEventName.FIGHT_OTHER_VIEW_EVENT,fightEvent);
        this.closeView();
    }

    //新战斗
    newFightFun()
    {
        //从本章节第一个关卡开始
        // this.fightSelectOver();
        Layer.Instance.show("fightMoveHero",Layer.Instance.layerView);
        GlobalData.Instance.gameRecord.levelID = 0;
        //发送重新开始消息
        let newFightEvent = new GameEventName({ eventCode: 8 });
        GameCustomEvent.Instance.node.emit(GameEventName.FIGHT_OTHER_VIEW_EVENT,newFightEvent);
        // let fightEvent = new GameEventName({ eventCode: 5,chapterID: GlobalData.Instance.gameRecord.chapterID + this.chapterChangeCount });
        // GameCustomEvent.Instance.node.emit(GameEventName.FIGHT_OTHER_VIEW_EVENT,fightEvent);
        this.closeView();
    }

    //继续战斗
    goOnFightFun()
    {
        //读取上一次的关卡进度
        Layer.Instance.show("fightMoveHero",Layer.Instance.layerView);
        let goOnEvent = new GameEventName({ eventCode: 7 ,chapterID: GlobalData.Instance.gameRecord.chapterID + this.chapterChangeCount});
        GameCustomEvent.Instance.node.emit(GameEventName.FIGHT_OTHER_VIEW_EVENT,goOnEvent);
        this.closeView();
    }

    //读取记录
    freshChapter()
    {
        for(var findChapter:number = 0;findChapter < GlobalData.Instance.chapterTableArr.length;findChapter++)
        {
            //显示当前章节（若第一次显示第一章）
            if(GlobalData.Instance.chapterTableArr[findChapter].chapterID == GlobalData.Instance.gameRecord.chapterID + this.chapterChangeCount)
            {
                //初始英雄
                // this.freshInitialHero(GlobalData.Instance.chapterTableArr[findChapter].initialHeroArr);
                //推荐英雄
                this.freshRecommendedLineupArr(GlobalData.Instance.chapterTableArr[findChapter].recommendedLineupArr);
                //章节序列号
                this.lab_chapter.string = GlobalData.Instance.chapterTableArr[findChapter].chapterSequence;
                this.lab_chapterTitle.string = GlobalData.Instance.chapterTableArr[findChapter].chapterName;
                //记录正在进行的章节总关卡
                this.saveChapter = GlobalData.Instance.chapterTableArr[findChapter];
                this.freshGoOnFightLv();
                //章节漫画图片
                LoadImgTool.Instance.loadSpriteFrame(GlobalData.Instance.chapterTableArr[findChapter].chapterCartoonPath,this.img_cartoon.node);
                //章节按钮状态 0 未解锁 1 新征程 2 继续征程
                var chapterBtnstate:number = 0;
                //判断是否解锁
                for(var uca:number = 0;uca < GlobalData.Instance.gameRecord.unlockChapterArr.length;uca++)
                {
                    console.log(GlobalData.Instance.gameRecord.unlockChapterArr[uca],GlobalData.Instance.chapterTableArr[findChapter].chapterID);
                    if(GlobalData.Instance.gameRecord.unlockChapterArr[uca] == GlobalData.Instance.chapterTableArr[findChapter].chapterID)
                    {
                        chapterBtnstate = 1;
                        if(this.findLevelIndex(GlobalData.Instance.gameRecord.levelID,GlobalData.Instance.chapterTableArr[findChapter].levelArr) > 0)
                        {
                            chapterBtnstate = 2;
                            break;
                        }
                    }
                }
                console.log(chapterBtnstate);
                this.freshFightBtnFun(chapterBtnstate);
                break;
            }
        }
    }
    
    //读取下一个章节
    readNextChapter():boolean
    {
        for(var findChapter:number = 0;findChapter < GlobalData.Instance.chapterTableArr.length;findChapter++)
        {
            //当前章节
            if(GlobalData.Instance.chapterTableArr[findChapter].chapterID == GlobalData.Instance.gameRecord.chapterID)
            {
                if(GlobalData.Instance.chapterTableArr[findChapter].nextChapterID != 0)
                {
                    GlobalData.Instance.gameRecord.chapterID = GlobalData.Instance.chapterTableArr[findChapter].nextChapterID;
                    return true;
                }else{
                    //已到最后一章
                }
                break;
            }
        }
        return false;
    }

    //查找关卡是章节的第几个关卡
    findLevelIndex(lid:number,lvArr:Array<number>):number
    {
        for(var findLv:number = 0;findLv < lvArr.length;findLv++)
        {
            if(lid == lvArr[findLv])
            {
                return findLv;
            }
        }
        return -1;
    }

    //刷新大厅显示
    freshHallFun()
    {
        this.freshGoOnFightLv();
        this.freshChapter();
    }

    //刷新继续征程关卡进度
    freshGoOnFightLv()
    {
        var findIndex:number = 0;
        for(var fi:number = 0;fi < this.saveChapter.levelArr.length;fi++)
        {
            if(GlobalData.Instance.gameRecord.levelID == this.saveChapter.levelArr[fi])
            {
                findIndex = fi + 1;
            }
        }
        this.lab_lv.string = "第 " + findIndex + "/" + this.saveChapter.levelArr.length + " 关";
    }

    //刷新关卡初始英雄模型
    freshInitialHero(initialHeroArr:Array<number>)
    {
        //根据ID找到英雄对应的动画模型并更新
        // for(var ih:number = 0;ih < initialHeroArr.length;ih++)
        // {
        //     for(var h:number = 0;h < GlobalData.Instance.heroTableArr.length;h++)
        //     {
        //         if(initialHeroArr[ih] == GlobalData.Instance.heroTableArr[h].heroID)
        //         {
        //             this.lay_initialHero.node.getChildByName("initialHero" + (ih+1)).active = true;
        //             LoadImgTool.Instance.loadSkeletonData(GlobalData.Instance.heroTableArr[h].heroSkePath,
        //                 this.lay_initialHero.node.getChildByName("initialHero" + (ih+1)).getChildByName("ske_hero").getComponent(sp.Skeleton),"dance");
        //             break;
        //         }
        //     }
        // }
    }

    //刷新关卡推荐英雄模型
    freshRecommendedLineupArr(recommendedLineupArr:Array<number>)
    {
        //根据ID找到英雄对应的动画模型并更新
        for(var ih:number = 0;ih < recommendedLineupArr.length;ih++)
        {
            for(var h:number = 0;h < GlobalData.Instance.heroTableArr.length;h++)
            {
                if(recommendedLineupArr[ih] == GlobalData.Instance.heroTableArr[h].heroID)
                {
                    this.lay_recommendedLineup.node.getChildByName("hero" + (ih+1)).active = true;
                    LoadImgTool.Instance.loadSkeletonData(GlobalData.Instance.heroTableArr[h].heroSkePath,
                        this.lay_recommendedLineup.node.getChildByName("hero" + (ih+1)).getChildByName("ske_hero").getComponent(sp.Skeleton),"dance");
                    break;
                }
            }
        }
    }

    closeView()
    {
        this.node.active = false;
    }

    update(deltaTime: number) {
        
    }
}


