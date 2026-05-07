import { Component, NodeEventType, _decorator } from 'cc';
import { AudioMgr } from '../../Manager/AudioMgr';
import { SDK } from '../SDK';

const { ccclass, property } = _decorator;
@ccclass('Btn_Share')
export class Btn_Share extends Component {
    protected onLoad() {
        this.node.active = SDK.SupportShare;
        this.node.on(NodeEventType.TOUCH_END, this.Click, this);
    }

    private Click() {
        AudioMgr.Ins.playUISound()
        SDK.ShareGame()
    }
}