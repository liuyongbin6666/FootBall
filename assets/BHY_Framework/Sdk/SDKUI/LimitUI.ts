import { Label, Node, NodeEventType, Sprite, _decorator } from 'cc';
import SDKInfo from '../../FrameConfig/FrameData';
import { AudioMgr } from '../../Manager/AudioMgr';
import { UIMgr } from '../../UI/UIMgr';
import { UIPanelBase } from '../../UI/UIPanelBase';
import BuildSetting from '../BuildSetting';
import { SDKType } from '../data/SDKType';
import { SDK } from '../SDK';

const { ccclass, property } = _decorator;
@ccclass('LimitUI')
export class LimitUI extends UIPanelBase {
    public static async Show() {
        UIMgr.Ins.openPanel(LimitUI, null, "SDKUI");
    }

    @property({ type: Node, displayName: "nd_back" })
    nd_back: Node;

    @property(Label)
    private Label1: Label = null;

    @property(Node)
    private Limit1_wx: Node = null;
    @property(Node)
    private Limit1_tt: Node = null;
    @property(Node)
    private Limit1_ks: Node = null;
    @property(Node)
    private Limit1_tb: Node = null;
    @property(Node)
    private Limit1_blbl: Node = null;

    @property(Node)
    private Limit2_wx: Node = null;
    @property(Node)
    private Limit2_tt: Node = null;
    @property(Node)
    private Limit2_ks: Node = null;
    @property(Node)
    private Limit2_tb: Node = null;
    @property(Node)
    private Limit2_blbl: Node = null;


    @property(Label)
    private lbl_num: Label = null;
    @property(Node)
    private btn_clo: Node = null;
    @property(Label)
    private lbl_clo: Label = null;


    protected onLoad(): void {
        this.Update();
        this.schedule(this.Update, 0.1)
    }

    protected onAfterOpen(): void {
        this.nd_back.on(NodeEventType.TOUCH_END, this.onBack, this);
        this.btn_clo.on(NodeEventType.TOUCH_END, this.onreceive, this);
    }

    public onBeforeClose() {
        this.nd_back.off(NodeEventType.TOUCH_END, this.onBack, this);
        this.btn_clo.off(NodeEventType.TOUCH_END, this.onreceive, this);
    }

    public onBeforeOpen() {
        {
            this.Limit1_wx.active = false
            this.Limit1_tt.active = false
            this.Limit1_ks.active = false
            this.Limit1_tb.active = false
            this.Limit1_blbl.active = false
        }

        {
            this.Limit2_wx.active = false
            this.Limit2_tt.active = false
            this.Limit2_ks.active = false
            this.Limit2_tb.active = false
            this.Limit2_blbl.active = false
        }


        let icon: Sprite
        switch (BuildSetting.kPlatformSDK) {
            case SDKType.WxSDK:
                this.Label1.string = "1.下拉微信聊天框";
                this.Limit1_wx.active = true
                this.Limit2_wx.active = true
                icon = this.Limit2_wx.getChildByName("Mask").getChildByName("icon").getComponent(Sprite);
                break;
            case SDKType.ToutiaoSDK:
                this.Label1.string = "1.点击侧边图标";
                this.Limit1_tt.active = true
                this.Limit2_tt.active = true
                icon = this.Limit2_tt.getChildByName("icon").getComponent(Sprite);
                break;
            case SDKType.KsSDK:
                this.Label1.string = "1.点击侧边图标";
                this.Limit1_ks.active = true
                this.Limit2_ks.active = true
                icon = this.Limit2_ks.getChildByName("icon").getComponent(Sprite);
                break;
            case SDKType.TbSDK:
                this.Label1.string = "1.首页左滑找到全部频道";
                this.Limit1_tb.active = true
                this.Limit2_tb.active = true
                icon = this.Limit2_tb.getChildByName("Mask").getChildByName("icon").getComponent(Sprite);
                break;
            case SDKType.BlBlSDK:
                this.Label1.string = "1.点击首页左上方头像打开侧边栏";
                this.Limit1_blbl.active = true
                this.Limit2_blbl.active = true
                icon = this.Limit2_blbl.getChildByName("Mask").getChildByName("icon").getComponent(Sprite);
                break;
            default:
                this.Label1.string = "1.点击侧边图标";
                this.Limit1_tt.active = true
                this.Limit2_tt.active = true
                icon = this.Limit2_tt.getChildByName("icon").getComponent(Sprite);
                break;
        }

        icon.spriteFrame = BuildSetting.Icon


        this.lbl_num.string = `*${SDKInfo.Limitnum}`;
        this.lbl_num.node.parent.active = SDKInfo.Limitnum > 0
    }


    private onreceive() {
        AudioMgr.Ins.playUISound()
        if (this.lbl_clo.string == "进入侧边栏")
            SDK.navigateToScene()
        else if (this.lbl_clo.string == "领取奖励")
            this.OK();
        else
            this.close();
    }

    private OK() {
        SDKInfo.LimitOK()
        this.close();
    }

    private Update() {
        if (SDKInfo.Dailyreward) {
            this.lbl_clo.string = "明日再来"
        } else {
            if (SDK.From_Limit)
                this.lbl_clo.string = "领取奖励"
            else if (BuildSetting.kPlatformSDK == SDKType.KsSDK)
                this.lbl_clo.string = "从侧边栏进入领奖"
            else if (BuildSetting.kPlatformSDK == SDKType.ToutiaoSDK || BuildSetting.kPlatformSDK == SDKType.BlBlSDK)
                this.lbl_clo.string = "进入侧边栏"
            else
                this.lbl_clo.string = "我知道了"
        }
    }
}