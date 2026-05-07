import { Component, Node, _decorator, game } from 'cc';
import BuildSetting from '../BuildSetting';
import { SDKType } from '../data/SDKType';
import { SDKEvent } from '../exp/SDKEvent';
import { SDK } from '../SDK';

const { ccclass, property } = _decorator;
@ccclass('Btn_Club')
export class Btn_Club extends Component {
    @property({ type: Node, displayName: "游戏圈支付宝" })
    Club_zfb: Node;

    protected onLoad(): void {
        this.node.active = SDK.SupportClub
        this.Club_zfb.active = BuildSetting.kPlatformSDK == SDKType.ZfbSDK
        this.scheduleOnce(() => SDK.ShowGameClubButton(this.node))

        game.on(SDKEvent.ShowGameClubButton, this.ShowGameClubButton, this);
        game.on(SDKEvent.HideGameClubButton, this.HideGameClubButton, this);
    }

    public HideGameClubButton() {
        SDK.HideGameClubButton()
    }

    public ShowGameClubButton() {
        SDK.ShowGameClubButton()
    }

    protected onDestroy(): void {
        SDK.HideGameClubButton()
    }
}