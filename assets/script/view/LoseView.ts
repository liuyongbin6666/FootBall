import { _decorator, Button, Component, find, Node } from 'cc';
import { Layer } from '../manager/Layer';
import { GameEventName } from '../manager/GameEventName';
import { GameCustomEvent } from '../manager/GameCustomEvent';
const { ccclass, property } = _decorator;

/**
 * 失败界面
 */
@ccclass('LoseView')
export class LoseView extends Component {
    private btn_return:Button;
    private btn_replay:Button;
    protected onLoad(): void {
        this._initObect();
        this._onEvent();
    }

    private _initObect() {
        this.btn_return = find('btn_return', this.node).getComponent(Button);
        this.btn_replay = find('btn_replay', this.node).getComponent(Button);
    }
    private _onEvent() {
        this.btn_return.node.on(Node.EventType.TOUCH_END, this.openHallFun, this);
        this.btn_replay.node.on(Node.EventType.TOUCH_END, this.replayFun, this);
    }

    start() {
    }

    //返回大厅
    openHallFun()
    {
        Layer.Instance.close("fightMoveHero",Layer.Instance.layerView);
        Layer.Instance.show("hall",Layer.Instance.layerView);
        this.closeView();
    }

    //重新开始
    replayFun()
    {
        //发送重新开始消息
        let ampCardEvent = new GameEventName({ eventCode: 5 });
        GameCustomEvent.Instance.node.emit(GameEventName.FIGHT_OTHER_VIEW_EVENT,ampCardEvent);
        this.closeView();
    }

    closeView()
    {
        this.node.active = false;
    }

    update(deltaTime: number) {
        
    }
}


