import { _decorator, Button, Component, find, instantiate, Label, Layout, Node, Prefab, ScrollView, Sprite } from 'cc';
import { LoadImgTool } from '../tool/LoadImgTool';
const { ccclass, property } = _decorator;

/**
 * 排行榜界面
 */
@ccclass('ChapterRankView')
export class ChapterRankView extends Component {
    /**
     * 组件
    */
    @property(Prefab)
    private rankItemPre: Prefab = null;

    private btn_close:Button;
    private scr_rank:ScrollView;
    private scr_rank_content:Layout;
    private lab_value_title:Label;
    
    /**
     * 数据
    */
    protected onLoad(): void {
        this._initObect();

        this._onEvent();
    }

    private _initObect() {
        this.btn_close = find('btn_close', this.node).getComponent(Button);
        this.scr_rank = find('scr_rank', this.node).getComponent(ScrollView);
        this.scr_rank_content = find('scr_rank/view/content', this.node).getComponent(Layout);
        this.lab_value_title = find('sp_rank_scr_title/lab_value_title', this.node).getComponent(Label);
    }

    private _onEvent() {
        this.btn_close.node.on(Node.EventType.TOUCH_START, this.closeView, this);
    }

    start() {
        //模拟排行榜数据
        
        //根据第一个类型，加载第一个类型的排行榜数据
        // this.changeRankList(GlobalData.Instance.labelPage.rankTypeArr[0].type);
    }
    
    freshRankList(e)
    {
        console.log("点击的哪个按钮:",e.target,e.target.type);
        this.lab_value_title.string = "" + e.target.typeValueName;
        this.changeRankList(e.target.type);
    }

    changeRankList(type:number)
    {
        //清除所有子item
        this.scr_rank_content.node.removeAllChildren();
        
        //显示排行榜前100个
        for(var rta:number = 0;rta < 100;rta++)
        {
            let item = instantiate(this.rankItemPre);
            if(rta < 3)
            {
                if(rta == 0)
                {
                    item.getChildByName("icon_rank_no1").getComponent(Sprite).node.active = true;
                    item.getChildByName("icon_rank_no2").getComponent(Sprite).node.active = false;
                    item.getChildByName("icon_rank_no3").getComponent(Sprite).node.active = false;
                }else if(rta == 1){
                    item.getChildByName("icon_rank_no1").getComponent(Sprite).node.active = false;
                    item.getChildByName("icon_rank_no2").getComponent(Sprite).node.active = true;
                    item.getChildByName("icon_rank_no3").getComponent(Sprite).node.active = false;
                }else if(rta == 2){
                    item.getChildByName("icon_rank_no1").getComponent(Sprite).node.active = false;
                    item.getChildByName("icon_rank_no2").getComponent(Sprite).node.active = false ;
                    item.getChildByName("icon_rank_no3").getComponent(Sprite).node.active = true;
                }
                item.getChildByName("lab_ranking").getComponent(Label).node.active = false;
                LoadImgTool.Instance.loadSpriteFrame("rank/img_rank_bg_three",item.getChildByName("img_rank_bg"));
            }else{
                item.getChildByName("icon_rank_no1").getComponent(Sprite).node.active = false;
                item.getChildByName("icon_rank_no2").getComponent(Sprite).node.active = false ;
                item.getChildByName("icon_rank_no3").getComponent(Sprite).node.active = false;
                item.getChildByName("lab_ranking").getComponent(Label).node.active = true;
                // item.getChildByName("lab_ranking").getComponent(Label).string = "" + this.valueArr[rta].ranking;
            }
            // item.getChildByName("lab_nickname").getComponent(Label).string = "" + this.valueArr[rta].userName;
            // item.getChildByName("lab_value").getComponent(Label).string = "" + this.valueArr[rta].value;
            this.scr_rank_content.node.addChild(item);
        }
    }

    closeView()
    {
        this.node.active = false;
    }

    update(deltaTime: number) {
        
    }
}


