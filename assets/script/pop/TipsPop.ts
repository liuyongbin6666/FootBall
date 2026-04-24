import { _decorator, Button, Component, find, Label, Node } from 'cc';
import { GameCustomEvent } from '../manager/GameCustomEvent';
import { GameEventName } from '../manager/GameEventName';
const { ccclass, property } = _decorator;

/**
 * 提示弹窗
 */
@ccclass('TipsPop')
export class TipsPop extends Component {
    /**
     * 组件
    */
    private lab_title:Label;
    private lab_dec:Label;
    private btn_ok:Button;
    
    /**
     * 数据
    */
    //点击确定后需要执行的方法
    private tipsFun:Function;
    protected onLoad(): void {
        this._initObect();

        this._onEvent();
    }

    private _initObect() {
        this.lab_title = find('lab_title', this.node).getComponent(Label);
        this.lab_dec = find('lay_tips/lab_dec', this.node).getComponent(Label);
        this.btn_ok = find('lay_tips/sp_btn/btn_ok', this.node).getComponent(Button);
    }

    private _onEvent() {
        this.btn_ok.node.on(Node.EventType.TOUCH_START, this.closeTipsPop, this);
        GameCustomEvent.Instance.addCustomEvent(GameEventName.TIPS_EVENT,this.onTipsEvent,this);
    }

    start() {
    }
    
    // 弹窗事件
    onTipsEvent(tipsEvent: GameEventName) {
        // console.log('监听到弹窗事件:', tipsEvent,tipsEvent.getCustomProperty().tipsFun);
        //更改文字标题
        this.lab_title.string = tipsEvent.getCustomProperty().tipsTitle;
        //更改文字提示
        this.lab_dec.string = tipsEvent.getCustomProperty().tipsDec;
        //接收方法
        // this.tipsFun = tipsEvent.getCustomProperty().tipsFun;
    }

    //执行方法并关闭提示弹窗
    private okClick()
    {
        this.tipsFun();
        this.closeTipsPop();
    }

    private closeTipsPop()
    {
        this.node.active = false;
    }

    update(deltaTime: number) {
        
    }
}


