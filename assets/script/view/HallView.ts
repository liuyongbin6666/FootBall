import { _decorator, Button, Component, find, Label, Node, Sprite } from 'cc';
import { Layer } from '../manager/Layer';
import { GlobalData } from '../data/GlobalData';
import { LoadImgTool } from '../tool/LoadImgTool';
import { GameEventName } from '../manager/GameEventName';
import { GameCustomEvent } from '../manager/GameCustomEvent';
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
    //章节序列名
    private lab_chapter:Label;
    //章节名图片
    private img_chapterName:Sprite;
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
    //章节是否重新开始
    private restart:boolean = false;
    protected onLoad(): void {
        this._initObect();
        this._onEvent();
    }

    private _initObect() {
        this.node_grocery = find('node_grocery', this.node);
        this.node_farm = find('node_farm', this.node);
        
        this.node_journey = find('node_journey', this.node);
        this.lab_chapter = find('node_journey/lab_chapter', this.node).getComponent(Label);
        this.img_chapterName = find('node_journey/img_chapterName', this.node).getComponent(Sprite);
        this.btn_previousChapter = find('node_journey/btn_previousChapter', this.node).getComponent(Button);
        this.btn_nextChapter = find('node_journey/btn_nextChapter', this.node).getComponent(Button);
        this.btn_fight = find('node_journey/btn_fight', this.node).getComponent(Button);
        this.btn_newFight = find('node_journey/btn_newFight', this.node).getComponent(Button);
        this.btn_goOnFight = find('node_journey/btn_goOnFight', this.node).getComponent(Button);


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
    }

    start() {
        //预加载
        let pathfight = Layer.Instance.getGamePrePath("fightMoveHero");
        LoadImgTool.Instance.loadPrefab("fightMoveHero",pathfight,Layer.Instance.layerView,false);
        // let pathfight = Layer.Instance.getGamePrePath("fight");
        // LoadImgTool.Instance.loadPrefab("fight",pathfight,Layer.Instance.layerView,false);
        
        //默认页面征程
        this.freshChapter();
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
                // this.freshChapter();
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
            this.freshFightBtnFun();
        }
    }

    increaseChapterIndexFun()
    {
        if(GlobalData.Instance.gameRecord.chapterID + this.chapterChangeCount + 1 <= GlobalData.Instance.chapterTableArr.length)
        {
            //判断是否已解锁
            this.chapterChangeCount++;
            this.freshChapter();
            this.freshFightBtnFun();
        }
    }

    //刷新征途战斗按钮
    freshFightBtnFun()
    {
        if(this.chapterChangeCount == 0)
        {
            this.btn_newFight.node.active = true;
            this.btn_goOnFight.node.active = true;
            this.btn_fight.node.active = false;
        }else{
            this.btn_newFight.node.active = false;
            this.btn_goOnFight.node.active = false;
            this.btn_fight.node.active = true;
        }
    }

    //开启战斗
    openFight()
    {
        this.restart = true;
        this.fightSelectOver();
    }

    //新战斗
    newFightFun()
    {
        //从本章节第一个关卡开始
        this.restart = true;
        this.fightSelectOver();
    }

    //继续战斗
    goOnFightFun()
    {
        //读取上一次的关卡进度
        this.restart = false;
        this.fightSelectOver();
    }

    fightSelectOver()
    {
        // Layer.Instance.show("fight",Layer.Instance.layerView);
        Layer.Instance.show("fightMoveHero",Layer.Instance.layerView);

        if(this.chapterChangeCount != 0 || this.restart)
        {
            //如果不是上一次的章节，将关卡设为0，0为重置标识
            GlobalData.Instance.gameRecord.levelID = 0;
        }
        //向战斗界面传递当前选择的章节号，读取数据
        let fightEvent = new GameEventName({ eventCode: 2,chapterID: GlobalData.Instance.gameRecord.chapterID + this.chapterChangeCount });
        GameCustomEvent.Instance.node.emit(GameEventName.FIGHT_OTHER_VIEW_EVENT,fightEvent);
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
                //初始英雄数组
                // this.readHeroData(GlobalData.Instance.chapterTableArr[findChapter].initialHeroArr);
                //章节序列号
                this.lab_chapter.string = GlobalData.Instance.chapterTableArr[findChapter].chapterSequence;
                //章节名图片
                LoadImgTool.Instance.loadSpriteFrame(GlobalData.Instance.chapterTableArr[findChapter].chapterNamePath,this.img_chapterName.node);
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

    closeView()
    {
        this.node.active = false;
    }

    update(deltaTime: number) {
        
    }
}


