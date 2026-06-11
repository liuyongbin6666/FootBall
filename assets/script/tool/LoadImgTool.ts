import { _decorator, Component, Node, resources, Sprite, SpriteFrame, instantiate, Prefab, sp } from 'cc';
import { Layer } from '../manager/Layer';
import { ResMgr } from '../../BHY_Framework/Manager/ResMgr';
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
    async loadSpriteFrame(path: string, changeNode: Node) {
        //微信分包（不再用resource，用 ResMgr.Ins.getOrLoadAsset）
        const asset = await ResMgr.Ins.getOrLoadAsset("img", path + "/spriteFrame", SpriteFrame);
        changeNode.getComponent(Sprite).spriteFrame = asset;
        
        //非微信分包
        // var url = path + "/spriteFrame";
        // var sp: SpriteFrame = null;
        // resources.load<SpriteFrame>(url, (e, asset: SpriteFrame) => {
        //     if (e) {
        //         console.log("加载图失败", e);
        //         return;
        //     }
        //     changeNode.getComponent(Sprite).spriteFrame = asset;
        // })

    }

    //加载Prefab preName 材质名（辨别是否重复加载的唯一标识） path 材质加载路径 fatherNode 父节点 show 显示状态（默认为显示）assignNode 指定生成节点（不传入默认新生成节点）
    async loadPrefab(preName: string, path: string, fatherNode: Node, show: boolean = true, assignNode: Node = null) {
        //微信分包
        // var pre:Prefab = await ResMgr.Ins.getOrLoadAsset("prefab", path, Prefab);
        // var gameNode: Node = instantiate(pre);
        //     if (!show) {
        //         gameNode.active = false;
        //     }
        //     fatherNode.addChild(gameNode);
        //     Layer.Instance.saveGamePre(preName, fatherNode);
        
        //非微信分包
        var _this = this;
        resources.load(path, (e, asset: Prefab) => {
            if (e) {
                console.log("加载prefab失败", e);
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
            var gameNode: Node = instantiate(asset);
            //加载后是否立即显示，预加载可不立即显示
            if (!show) {
                gameNode.active = false;
            }
            fatherNode.addChild(gameNode);
            Layer.Instance.saveGamePre(preName, fatherNode);
            // }
        });
    }

    //加载SkeletonData（更换一个spine动画的皮） path 路径 spineComp spine动画节点 playAniName 播放动画名
    async loadSkeletonData(path: string, spineComp: sp.Skeleton, playAniName: string) {
        //微信分包
        //方法1：await 加载完后赋值
        spineComp.skeletonData = await ResMgr.Ins.getOrLoadAsset("spine", path, sp.SkeletonData);
        spineComp.clearTracks();
        spineComp.setAnimation(0, playAniName, true);

        //方法2：如果未加载完，spine被删掉了会报错
        // ResMgr.Ins.getOrLoadAsset("spine", path, sp.SkeletonData, (err, sk) => {
        //     spineComp.skeletonData = sk;
        //     spineComp.clearTracks();
        //     spineComp.setAnimation(0, playAniName, true);
        // })

        //非微信分包
        // resources.load(path, sp.SkeletonData, (err, data) => {
        //     // if (err || !data) return;
        //     if(err)
        //     {
        //         console.log("加载新的SkeletonData错误",err);
        //         return;
        //     }
        //     // ✅ 正确：直接赋值，不要先设为 null
        //     spineComp.skeletonData = data;
        // spineComp.clearTracks();
        // 必须重新设置动画，否则可能不显示
        // spineComp.setAnimation(0, playAniName, true);
        // });
    }
}


