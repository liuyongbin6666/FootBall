import { _decorator, Component, Node, Sprite, Label, find } from 'cc';
import { GameCustomEvent } from '../../manager/GameCustomEvent';
import { GameEventName } from '../../manager/GameEventName';
import { taskTableStructure } from '../../data/GlobalStructure';
import { GlobalData } from '../../data/GlobalData';
const { ccclass, property } = _decorator;

/**
 * 任务面板
 */
@ccclass('TaskUI')
export class TaskUI extends Component {
    private img_starLight1:Sprite;
    private img_starLight2:Sprite;
    private img_starLight3:Sprite;
    private lab_taskDes1:Label;
    private lab_taskDes2:Label;
    private lab_taskDes3:Label;
    private taskArr:Array<taskTableStructure> = [];
    protected onLoad(): void {
        this._initObect();
        this._onEvent();
    }

    private _initObect() {
        this.img_starLight1 = find('task1/img_starLight1', this.node).getComponent(Sprite);
        this.img_starLight2 = find('task2/img_starLight2', this.node).getComponent(Sprite);
        this.img_starLight3 = find('task3/img_starLight3', this.node).getComponent(Sprite);
        this.lab_taskDes1 = find('task1/lab_taskDes1', this.node).getComponent(Label);
        this.lab_taskDes2 = find('task2/lab_taskDes2', this.node).getComponent(Label);
        this.lab_taskDes3 = find('task3/lab_taskDes3', this.node).getComponent(Label);
    }

    private _onEvent() {
        GameCustomEvent.Instance.addCustomEvent(GameEventName.TASK_EVENT,this.freshTaskFun,this);
    }

    start() {

    }

    freshTaskFun(ftEvent: GameEventName)
    {
        switch(ftEvent.getCustomProperty().eventCode)
        {
            case 1:
                //刷新3个任务
                this.taskArr = [];
                this.findTask(ftEvent.getCustomProperty().taskArr);
                this.img_starLight1.node.active = false;
                this.img_starLight2.node.active = false;
                this.img_starLight3.node.active = false;
                this.lab_taskDes1.string = "" + this.taskArr[0].describe;
                this.lab_taskDes2.string = "" + this.taskArr[1].describe;
                this.lab_taskDes3.string = "" + this.taskArr[2].describe;
                break;
            case 2:
                //游戏过程中有任务完成，改变本关卡任务完成情况
            case 3:
                //游戏通关，改变本关卡任务完成情况
                break;
        }
    }

    //根据任务ID找到任务
    findTask(taskIDArr:Array<number>)
    {
        for(var ti:number = 0;ti < taskIDArr.length;ti++)
        {
            for(var ta:number = 0;ta < GlobalData.Instance.taskArr.length;ta++)
            {
                if(taskIDArr[ti] == GlobalData.Instance.taskArr[ta].taskID)
                {
                    var newTask:taskTableStructure = {taskID:GlobalData.Instance.taskArr[ta].taskID,
                        taskType:GlobalData.Instance.taskArr[ta].taskType,describe:GlobalData.Instance.taskArr[ta].describe};
                    this.taskArr.push(newTask);
                    break;
                }
            }
        }
    }

    //任务完成亮星
    lightStar()
    {
        //判断任务类型
        if(this.taskArr[0].taskType == 1)
        {
            //
            this.img_starLight1.node.active = true;
        }
    }

    update(deltaTime: number) {
        
    }
}


