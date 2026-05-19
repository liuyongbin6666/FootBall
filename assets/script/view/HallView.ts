import { _decorator, Button, Component, find, Node } from 'cc';
import { Layer } from '../manager/Layer';
const { ccclass, property } = _decorator;

/**
 * 大厅界面
 */
@ccclass('HallView')
export class HallView extends Component {
    private btn_fight:Button;
    protected onLoad(): void {
        this._initObect();
        this._onEvent();
    }

    private _initObect() {
        this.btn_fight = find('node_middle/btn_fight', this.node).getComponent(Button);

    }

    private _onEvent() {
        this.btn_fight.node.on(Node.EventType.TOUCH_START, this.openFight, this);
    }

    start() {

    }

    openFight()
    {
        // Layer.Instance.show("fight",Layer.Instance.layerView);
        Layer.Instance.show("fightMoveHero",Layer.Instance.layerView);
    }

    update(deltaTime: number) {
        
    }
}


