import { Component, NodeEventType, _decorator, game } from 'cc';
import { AudioMgr } from '../../Manager/AudioMgr';
import BuildSetting from '../BuildSetting';
import { SDKType } from '../data/SDKType';
import { SDKEvent } from '../exp/SDKEvent';
import { SDK } from '../SDK';

const { ccclass, property } = _decorator;
@ccclass('Btn_Feedback')
export class Btn_Feedback extends Component {
    protected onLoad(): void {
        this.node.active = SDK.SupportFeedback;
        this.node.on(NodeEventType.TOUCH_END, this.Click, this);

        if (SDK.SupportFeedback)
            this.scheduleOnce(this.ShowFeedback)

        game.on(SDKEvent.ShowGameClubButton, this.ShowFeedback, this);
        game.on(SDKEvent.HideGameClubButton, this.HideFeedback, this);
    }

    /** 显示意见反馈按钮 */
    public HideFeedback() {
        if (BuildSetting.kPlatformSDK == SDKType.WxSDK)
            SDK.HideFeedback()
    }

    /** 隐藏意见反馈按钮 */
    public ShowFeedback() {
        if (BuildSetting.kPlatformSDK == SDKType.WxSDK) {
            console.log("ShowFeedback 1")
            SDK.ShowFeedback(this.node)
        }
    }

    private Click() {
        AudioMgr.Ins.playUISound()
        console.log("ShowFeedback 2")
        SDK.ShowFeedback()
    }

    protected onDestroy(): void {
        this.HideFeedback()
    }
}