import { Label, Node, NodeEventType, _decorator } from 'cc';
import SDKInfo from '../../FrameConfig/FrameData';
import { AudioMgr } from '../../Manager/AudioMgr';
import { UIMgr } from '../../UI/UIMgr';
import { UIPanelBase } from '../../UI/UIPanelBase';
import { SDK } from '../SDK';

const { ccclass, property } = _decorator;
@ccclass('AddIconUI')
export class AddIconUI extends UIPanelBase {
    public static async Show() {
        UIMgr.Ins.openPanel(AddIconUI, null, "SDKUI");
    }

    @property({ type: Node, displayName: "nd_back" })
    nd_back: Node;

    @property({ type: Node, tooltip: "btn_clo" })
    private btn_clo: Node = null;
    @property({ type: Label, tooltip: "lbl_clo" })
    private lbl_clo: Label = null;


    protected onLoad(): void {
        this.updateContent();
        this.schedule(this.updateContent, 0.1)
    }

    public onAfterOpen() {
        this.nd_back.on(NodeEventType.TOUCH_END, this.onBack, this);
        this.btn_clo.on(NodeEventType.TOUCH_END, this.onreceive, this);
    }

    public onBeforeClose() {
        this.nd_back.off(NodeEventType.TOUCH_END, this.onBack, this);
        this.btn_clo.off(NodeEventType.TOUCH_END, this.onreceive, this);
    }

    private onreceive() {
        AudioMgr.Ins.playUISound()
        if (this.lbl_clo.string == "添加桌面")
            SDK.AddIcon().then(end => end && this.OK())
        else if (this.lbl_clo.string == "领取奖励")
            this.OK();
        else
            this.close();
    }

    private OK() {
        SDKInfo.AddIconOK()
        this.close();
    }


    private async updateContent() {
        if (SDKInfo.AddiconDailyreward) {
            this.lbl_clo.string = "明日再来"
        } else {
            if (SDK.From_Addicon)
                this.lbl_clo.string = "领取奖励"
            else {
                let bol = await SDK.hasAddIcon()
                if (bol)
                    this.lbl_clo.string = "从桌面图标进入"
                else
                    this.lbl_clo.string = "添加桌面"
            }
        }
    }
}