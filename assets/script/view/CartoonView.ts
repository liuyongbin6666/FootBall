import { _decorator, Component, Node, Sprite, Button, find } from 'cc';
const { ccclass, property } = _decorator;

/**
 * 漫画界面
 */
@ccclass('CartoonView')
export class CartoonView extends Component {
    //漫画页1
    private cartoon_page1:Sprite;
    private cartoon_page2:Sprite;
    private cartoon_page3:Sprite;
    private page3_partBg:Sprite;
    protected onLoad(): void {
        this._initObect();
        this._onEvent();
    }
    private _initObect() {
        this.cartoon_page1 = find('cartoon/cartoon_page1', this.node).getComponent(Sprite);
        this.cartoon_page2 = find('cartoon/cartoon_page2', this.node).getComponent(Sprite);
        this.cartoon_page3 = find('cartoon/cartoon_page3', this.node).getComponent(Sprite);
        this.page3_partBg = find('node_bottom/cartoon_page3/page3_partBg', this.node).getComponent(Sprite);
    }
    private _onEvent() {
        // this.btn_close.node.on(Node.EventType.TOUCH_END, this.closeView, this);
        // this.btn_moveHero.node.on(Node.EventType.TOUCH_START, this.startMoveHero, this);
        // this.btn_set.node.on(Node.EventType.TOUCH_END, this.openSet, this);
        // GameCustomEvent.Instance.addCustomEvent(GameEventName.FIGHT_OTHER_VIEW_EVENT,this.otherViewEveFun,this);
    }

    start() {

    }

    //片头漫画
    originComic()
    {
        //
    }

    update(deltaTime: number) {
        
    }
}


