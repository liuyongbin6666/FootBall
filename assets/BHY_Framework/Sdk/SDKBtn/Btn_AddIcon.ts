import { Component, NodeEventType, _decorator } from 'cc';
import { AudioMgr } from '../../Manager/AudioMgr';
import { SDK } from '../SDK';
import { AddIconUI } from '../SDKUI/AddIconUI';

const { ccclass, property } = _decorator;
@ccclass('Btn_AddIcon')
export class Btn_AddIcon extends Component {
    protected onLoad(): void {
        this.node.active = SDK.SupportAddIcon
        this.node.on(NodeEventType.TOUCH_END, this.Click)
    }

    private Click() {
        AudioMgr.Ins.playUISound()
        AddIconUI.Show()
    }
}