import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

/**
 * 自定义事件封装类
*/
@ccclass('GameCustomEvent')
export class GameCustomEvent extends Component {
    /**
     * 自定义事件全局节点（游戏加载即启用），同一个自定义事件需要在同一个节点上发送和监听
    */
    static Instance:GameCustomEvent;
    private eventArr:Array<GameEventStructure> = [];
    private eventMoreArr:Array<GameEventStructure> = [];
 
    protected onLoad() {
        // 在游戏加载时将当前组件实例设置为全局访问点
        GameCustomEvent.Instance = this;
        // this.node.on(GameEventName.REGISTER_EVENT,this.onCustomEvent,this);
    }

    start() {
    }

    //添加单个同一自定义事件监听
    addCustomEvent(eventName:string,callback:Function,target:any)
    {
        //遍历已有自定义数组事件，避免重复添加
        for(var g:number = 0;g < this.eventArr.length;g++)
        {
            if(this.eventArr[g].gameEventName == eventName)
            {
                return;
            }
        }
        var ges:GameEventStructure = {gameEventName:eventName,gameCallback:callback,gameTarget:target};
        this.eventArr.push(ges);
        GameCustomEvent.Instance.node.on(eventName,callback,target);
    }

    //添加多个同一自定义事件监听
    addMoreCustomEvent(eventName:string,callback:Function,target:any)
    {
        var ges:GameEventStructure = {gameEventName:eventName,gameCallback:callback,gameTarget:target};
        this.eventMoreArr.push(ges);
        GameCustomEvent.Instance.node.on(eventName,callback,target);
    }

    //移除单个同一自定义事件监听
    removeCustomEvent(eventName:string)
    {
        //根据自定义事件名移除监听器
        for(var r:number = 0;r < this.eventArr.length;r++)
        {
            if(this.eventArr[r].gameEventName == eventName)
            {
                GameCustomEvent.Instance.node.off(eventName,this.eventArr[r].gameCallback,this.eventArr[r].gameTarget);
                this.eventArr.splice(r,1);
                break;
            }
        }
    }

    //移除多个同一自定义事件监听 eventName 事件名 eventIndexID 事件监听Node唯一标识
    removeMoreCustomEvent(eventName:string,eventIndexID: string)
    {
        //根据自定义事件名移除监听器
        for(var r:number = 0;r < this.eventMoreArr.length;r++)
        {
            if(this.eventMoreArr[r].gameEventName == eventName && this.eventMoreArr[r].gameTarget.node["indexID"] == eventIndexID)
            {
                GameCustomEvent.Instance.node.off(eventName,this.eventMoreArr[r].gameCallback,this.eventMoreArr[r].gameTarget);
                this.eventMoreArr.splice(r,1);
            }
        }
    }

    // 提供一个方法供外部调用
    doSomething(): void {
        // 实现功能
        console.log('Doing something globally!');
    }

    update(deltaTime: number) {
        
    }
}
export interface GameEventStructure {
    //事件名
    gameEventName: string;
    //事件调用方法
    gameCallback:Function;
    //事件父对象
    gameTarget:any;
}


