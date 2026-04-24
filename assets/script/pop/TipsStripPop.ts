import { _decorator, Component, find, Label, Node, tween, Vec3 } from 'cc';
import { GameCustomEvent } from '../manager/GameCustomEvent';
import { GameEventName } from '../manager/GameEventName';
const { ccclass, property } = _decorator;
/**
 * 提示跑动条
 */
@ccclass('TipsStripPop')
export class TipsStripPop extends Component {
    private lab_dec:Label;
    //上一次是否运行完
    private runState:boolean = true;

    protected onLoad(): void {
        this._initObect();

        this._onEvent();
    }

    private _initObect() {
        this.lab_dec = find('lab_dec', this.node).getComponent(Label);
    }

    private _onEvent() {
        GameCustomEvent.Instance.addCustomEvent(GameEventName.TIPS_STRIP_EVENT,this.onTipsStripEvent,this);
    }

    start() {
    }

    // 提示事件
    onTipsStripEvent(tipsStripEvent: GameEventName) {
        console.log('监听到提示事件:', tipsStripEvent);
        //更改文字提示
        this.lab_dec.string = tipsStripEvent.getCustomProperty().tipsDec;
        this.run();
    }

    //提示条跑动
    run(){
        if(this.runState)
        {
            this.runState = false;
            this.node.setPosition(0,-200,0);
            this.node.active = true;
            var _this = this;
            tween(this.node).to(0.3,{position:new Vec3(0,200,0)}).delay(2).call(()=>{
                this.closeTipsStrip();
            }).start();
        }
    }

    private closeTipsStrip()
    {
        this.node.active = false;
        this.runState = true;
    }

    update(deltaTime: number) {
        
    }
}


