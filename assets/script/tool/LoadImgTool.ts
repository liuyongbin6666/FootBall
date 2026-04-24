import { _decorator, Component, Node, resources, Sprite, SpriteFrame, instantiate, Prefab } from 'cc';
import { Layer } from '../manager/Layer';
const { ccclass, property } = _decorator;

/**
 * 加载图工具
 */
@ccclass('LoadImgTool')
export class LoadImgTool extends Component {
    private static _instance: LoadImgTool = null;

    public static get Instance() {
        if (this._instance == null) {
            this._instance = new LoadImgTool();
        }

        return this._instance;
    }
    
    //加载图 path 图路径 changeNode 需要更换图的控件
    loadSpriteFrame(path:string,changeNode:Node) {
        var url = path +"/spriteFrame";
        var sp:SpriteFrame = null;
        resources.load<SpriteFrame>(url,(e,asset:SpriteFrame)=>{
            if(e){
                console.log("加载图失败",e);
                return;
            }
            changeNode.getComponent(Sprite).spriteFrame = asset;
        })

    }
    
    //加载Prefab preName 材质名（辨别是否重复加载的唯一标识） path 材质加载路径 fatherNode 父节点 show 显示状态（默认为显示）assignNode 指定生成节点（不传入默认新生成节点）
    loadPrefab(preName:string,path:string,fatherNode:Node,show:boolean = true,assignNode:Node = null)
    {
        var _this = this;
        resources.load(path,(e,asset:Prefab)=>{
            if(e){
                console.log("加载prefab失败",e);
                return;
            }
            // if(assignNode)
            // {
            //     assignNode = instantiate(asset);
            //     //加载后是否立即显示，预加载可不立即显示
            //     if(!show)
            //     {
            //         assignNode.active = false;
            //     }
            //     fatherNode.addChild(assignNode);
            // }else{
                var gameNode:Node = instantiate(asset);
                //加载后是否立即显示，预加载可不立即显示
                if(!show)
                {
                    gameNode.active = false;
                }
                fatherNode.addChild(gameNode);
                Layer.Instance.saveGamePre(preName,fatherNode);
            // }
        });
    }
}


