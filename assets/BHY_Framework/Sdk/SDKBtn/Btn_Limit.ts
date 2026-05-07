import { Component, NodeEventType, _decorator } from 'cc';
import { AudioMgr } from '../../Manager/AudioMgr';
import { SDK } from '../SDK';
import { LimitUI } from '../SDKUI/LimitUI';

const { ccclass, property } = _decorator;
@ccclass('Btn_Limit')
export class Btn_Limit extends Component {
    protected async onLoad() {
        this.node.active = false
        this.node.active = await SDK.Limit()
        this.node.on(NodeEventType.TOUCH_END, this.Click, this);
    }

    private Click() {
        AudioMgr.Ins.playUISound()
        LimitUI.Show()
    }
}