import { _decorator, Component, Node, Sprite, Button, find, tween, UIOpacity, Vec3 } from 'cc';
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
    private page3_part_chicken:Sprite;
    private page3_part_pig:Sprite;
    private page3_part_soccer:Sprite;
    protected onLoad(): void {
        this._initObect();
        this._onEvent();
    }
    private _initObect() {
        this.cartoon_page1 = find('cartoon_page1', this.node).getComponent(Sprite);
        this.cartoon_page2 = find('cartoon_page2', this.node).getComponent(Sprite);
        this.cartoon_page3 = find('cartoon_page3', this.node).getComponent(Sprite);
        this.page3_partBg = find('page3_partBg', this.node).getComponent(Sprite);
        this.page3_part_chicken = find('page3_part_chicken', this.node).getComponent(Sprite);
        this.page3_part_pig = find('page3_part_pig', this.node).getComponent(Sprite);
        this.page3_part_soccer = find('page3_part_soccer', this.node).getComponent(Sprite);
    }
    private _onEvent() {
        // this.btn_close.node.on(Node.EventType.TOUCH_END, this.closeView, this);
        // this.btn_moveHero.node.on(Node.EventType.TOUCH_START, this.startMoveHero, this);
        // this.btn_set.node.on(Node.EventType.TOUCH_END, this.openSet, this);
        // GameCustomEvent.Instance.addCustomEvent(GameEventName.FIGHT_OTHER_VIEW_EVENT,this.otherViewEveFun,this);
    }

    start() {
        this.originComic();
    }

    //片头漫画
    originComic()
    {
        //
        tween(this.cartoon_page1.node.getComponent(UIOpacity)).to(1,{opacity:255}).start();
        tween(this.cartoon_page2.node).delay(2).to(0.3,{position:new Vec3(0,0,0)}).start();
        tween(this.cartoon_page3.node).delay(4).to(0.3,{position:new Vec3(0,0,0)}).start();
        tween(this.page3_partBg.node).delay(5).to(0.3,{position:new Vec3(0,-285,0)}).start();
        tween(this.page3_part_pig.node).delay(6).to(0.3,{position:new Vec3(200,-270,0)}).start();
        tween(this.page3_part_chicken.node).delay(6).to(0.3,{position:new Vec3(-158,-195,0)}).start();
        tween(this.page3_part_soccer.node).delay(6).to(0.3,{position:new Vec3(-90,-470,0)}).start();
        setTimeout(() => {
            tween(this.page3_part_pig.node).to(0.5,{position:new Vec3(190,-260,0)}).to(0.5,{position:new Vec3(200,-270,0)}).union().repeatForever().start();
            tween(this.page3_part_chicken.node).to(0.5,{position:new Vec3(-168,-185,0)}).to(0.5,{position:new Vec3(-158,-195,0)}).union().repeatForever().start();
            tween(this.page3_part_soccer.node).to(0.5,{position:new Vec3(-130,-480,0)}).to(0.5,{position:new Vec3(-130,-470,0)}).union().repeatForever().start();;
        }, 6300);
    }

    update(deltaTime: number) {
        
    }
}


