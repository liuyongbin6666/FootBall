import { _decorator, Node, NodeEventType } from "cc";
import { UIMgr } from "../../UI/UIMgr";
import { UIPanelBase } from "../../UI/UIPanelBase";
const { ccclass, property } = _decorator;

/** 适龄提示 */
@ccclass('ApkAgeTip')
export class ApkAgeTip extends UIPanelBase {
    public static async Show() {
        UIMgr.Ins.openPanel(ApkAgeTip, null, "SDKUI");
    }

    @property({ type: Node, displayName: "nd_back" })
    nd_back: Node;
    protected onAfterOpen(): void {
        this.nd_back.on(NodeEventType.TOUCH_END, this.onBack, this);
    }
}