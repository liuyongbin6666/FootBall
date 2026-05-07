import { _decorator, Label, Node, NodeEventType, Sprite } from "cc";
import { UIMgr } from "../../UI/UIMgr";
import { UIPanelBase } from "../../UI/UIPanelBase";
import BuildSetting from "../BuildSetting";
import { SDK } from "../SDK";
import { ApkAgeTip } from "./ApkAgeTip";
import { ApkClause } from "./ApkClause";
import { ApkPrivacy } from "./ApkPrivacy";
const { ccclass, property } = _decorator;

@ccclass('ApkPrivacyClause')
export class ApkPrivacyClause extends UIPanelBase {
    protected static Cal: () => void
    public static async Show(Cal: () => void) {
        ApkPrivacyClause.Cal = Cal
        UIMgr.Ins.openPanel(ApkPrivacyClause, null, "SDKUI")
    }

    @property({ type: Label, tooltip: "游戏名" })
    protected GameName: Label;
    @property({ type: Node, tooltip: "用户协议" })
    protected Clause: Node;
    @property({ type: Node, tooltip: "隐私政策" })
    protected Privacy: Node;
    @property({ type: Sprite, tooltip: "Age" })
    public Age: Sprite = null;
    @property({ type: Node, tooltip: "Start" })
    protected Start: Node;
    @property({ type: Node, tooltip: "Clo" })
    protected Clo: Node;

    protected onAfterOpen(): void {
        this.GameName.string = BuildSetting.ShareGameName

        // if (GameLaunch.Ins.Age)
        //     this.Age.spriteFrame = GameLaunch.Ins.Age;

        this.Clause.on(NodeEventType.TOUCH_END, this.onClause, this)
        this.Privacy.on(NodeEventType.TOUCH_END, this.onPrivacy, this)
        this.Age.node.active = false
        this.Age.node.on(NodeEventType.TOUCH_END, this.onAge, this);
        this.Start.on(NodeEventType.TOUCH_END, this.onStart, this)
        this.Clo.on(NodeEventType.TOUCH_END, this.onClo, this)
    }


    protected onClause() { ApkClause.Show() }
    protected onPrivacy() { ApkPrivacy.Show() }
    protected onAge() { ApkAgeTip.Show() }

    protected onStart() {
        ApkPrivacyClause.Cal && ApkPrivacyClause.Cal()
        this.node.removeFromParent()
        this.node.destroy()
    }
    protected onClo() { SDK.Exit() }
}