import { _decorator, Label, Node, NodeEventType } from "cc";
import { UIMgr } from "../../UI/UIMgr";
import { UIPanelBase } from "../../UI/UIPanelBase";
import { SDK } from "../SDK";
const { ccclass, property } = _decorator;

/** 错误对话框 */
@ccclass('ErrModal')
export class ErrModal extends UIPanelBase {
    protected static Cal: () => void

    /** 显示错误对话框 */
    public static async Show(title: string, content: string = "请退出重启！", Cal: () => void = null) {
        ErrModal.Cal = Cal
        UIMgr.Ins.openPanel(ErrModal, { title, content }, "SDKUI")
    }

    @property({ type: Label, tooltip: "title" })
    protected title: Label;
    @property({ type: Label, tooltip: "content" })
    protected content: Label;
    @property({ type: Node, tooltip: "Ent" })
    protected Ent: Node;
    @property({ type: Node, tooltip: "Clo" })
    protected Clo: Node;

    protected _panelData: {
        title: string
        content: string
    };


    public onAfterOpen() {
        this.Ent.on(NodeEventType.TOUCH_END, this.onEnt, this)
        this.Clo.on(NodeEventType.TOUCH_END, this.onClo, this)
        this.title.string = this._panelData.title
        this.content.string = this._panelData.content
    }

    protected onEnt() {
        this.node.removeFromParent()
        this.node.destroy()
        ErrModal.Cal && ErrModal.Cal()
    }

    protected onClo() {
        SDK.Exit()
    }
}