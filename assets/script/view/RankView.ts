import { _decorator, Button, Component, find, Label, Node, Sprite } from 'cc';
import { GlobalData } from '../data/GlobalData';
import { AudioMG } from '../sound/AudioMG';
import { List } from '../../BHY_Framework/UI/UIComponent/List/List';
const { ccclass, property } = _decorator;

/**
 * 排行榜界面
 */
@ccclass('RankView')
export class RankView extends Component {
    /**
     * 组件
    */
    private lbl_title1:Label;
    private lbl_title2:Label;
    private nd_back:Node;
    private nd_self:Node;
    private list_rank:List;
    protected onLoad(): void {
        this._initObect();

        this._onEvent();
    }

    private _initObect() {
        this.lbl_title1 = find('lbl_title1', this.node).getComponent(Label);
        this.lbl_title2 = find('lbl_title2', this.node).getComponent(Label);
        this.nd_back = find('nd_back', this.node);
        this.nd_self = find('nd_self', this.node);
        this.list_rank = find('list_rank', this.node).getComponent(List);
    }

    private _onEvent() {
        this.nd_back.on(Node.EventType.TOUCH_END, this.closeView, this);
    }
    
    closeView()
    {
        this.node.active = false;
    }
}


