import { _decorator, Component, Node, BoxCollider2D, Contact2DType, Collider2D, Collider, Sprite, find } from 'cc';
import { GameCustomEvent } from '../manager/GameCustomEvent';
import { GameEventName } from '../manager/GameEventName';
const { ccclass, property } = _decorator;

/**
 * 足球碰撞
*/
@ccclass('SoccerCollision')
export class SoccerCollision extends Component {
    @property(BoxCollider2D)
    private collider: BoxCollider2D = null;
    
    private soccer_1:Sprite;
    private soccer_2:Sprite;
    private soccer_3:Sprite;
    private soccer_4:Sprite;
    private soccer_5:Sprite;
    private soccer_6:Sprite;
    private soccerImgChange:number;
    onLoad()
    {
        this._initObect();

        // 注册碰撞事件
        this.initCollision();
    }

    private _initObect() {
        this.soccer_1 = find('soccer_1', this.node).getComponent(Sprite);
        this.soccer_2 = find('soccer_2', this.node).getComponent(Sprite);
        this.soccer_3 = find('soccer_3', this.node).getComponent(Sprite);
        this.soccer_4 = find('soccer_4', this.node).getComponent(Sprite);
        this.soccer_5 = find('soccer_5', this.node).getComponent(Sprite);
        this.soccer_6 = find('soccer_6', this.node).getComponent(Sprite);
    }

    start() {

    }

    // 初始化碰撞检测
    private initCollision() {
        if (this.collider) {
            this.collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
            this.collider.on(Contact2DType.END_CONTACT, this.onEndContact, this);
            // console.log('初始化足球碰撞！',this.collider);
        }
    }

    // 碰撞开始
    private onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D) {
        //console.log('足球发生碰撞！',selfCollider.group,otherCollider.group,otherCollider.tag);//2 足球 4 敌人 8 英雄 0 标签
        if(otherCollider.group == 4)
        {
            //发送触碰事件，敌人的ID
            //console.log('碰撞敌人ID！',otherCollider.node["enemyID"]);
            let threadEvent = new GameEventName({ eventCode: 1,soccerID:selfCollider.node["soccerID"],enemyID: otherCollider.node["enemyID"] });
            GameCustomEvent.Instance.node.emit(GameEventName.FRIGHT_SUBTRACT_BOOLD_EVENT,threadEvent);
        }else if(otherCollider.group == 8)
        {
            //发送触碰事件，英雄的ID
            //console.log('碰撞英雄ID！',otherCollider.node["heroID"]);
            let threadEvent = new GameEventName({ eventCode: 2,soccerID:selfCollider.node["soccerID"],heroID: otherCollider.node["heroID"] });
            GameCustomEvent.Instance.node.emit(GameEventName.FRIGHT_SUBTRACT_BOOLD_EVENT,threadEvent);
        }
    }

    // 碰撞结束
    private onEndContact(selfCollider: Collider2D, otherCollider: Collider2D) {
        //console.log('足球碰撞结束！',selfCollider.group,otherCollider.group);
        // let threadEvent = new GameEventName({ eventCode: 999 });
        // GameCustomEvent.Instance.node.emit(GameEventName.EXPLORE_THREAD_CONTROLLER_EVENT,threadEvent);
    }

    update(deltaTime: number) {
        if(this.soccer_1.node.active)
        {
            this.soccer_1.node.active = false;
            this.soccer_2.node.active = true;
        }else if(this.soccer_2.node.active)
        {
            this.soccer_2.node.active = false;
            this.soccer_3.node.active = true;
        }else if(this.soccer_3.node.active)
        {
            this.soccer_3.node.active = false;
            this.soccer_4.node.active = true;
        }else if(this.soccer_4.node.active)
        {
            this.soccer_4.node.active = false;
            this.soccer_5.node.active = true;
        }else if(this.soccer_5.node.active)
        {
            this.soccer_5.node.active = false;
            this.soccer_6.node.active = true;
        }else if(this.soccer_6.node.active)
        {
            this.soccer_6.node.active = false;
            this.soccer_1.node.active = true;
        }
    }
}


