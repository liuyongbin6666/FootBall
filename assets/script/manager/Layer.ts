import { _decorator, Component, DynamicAtlasManager, dynamicAtlasManager, find, Node, Prefab } from 'cc';
import { LoadImgTool } from '../tool/LoadImgTool';
import { preItemStructure, preStructure } from '../data/GlobalStructure';
import { SDK, SDKInterface } from '../../BHY_Framework/Sdk/SDK';
import SDKInfo from '../../BHY_Framework/FrameConfig/FrameData';
import { GameStorage } from '../../BHY_Framework/Sdk/GameSave';
import BuildSetting from '../../BHY_Framework/Sdk/BuildSetting';
import { ResMgr } from '../../BHY_Framework/Manager/ResMgr';
const { ccclass, property } = _decorator;
/**
 * 层级管理
*/
@ccclass('Layer')
export class Layer extends Component {
    /**
     * 组件
    */
    static Instance: Layer;
    //UI层
    // layerUI:Node;
    //界面层
    layerView:Node;
    //动画层
    // layerAnimation:Node;
    //引导层
    layerGuidance:Node;
    //弹窗层
    layerPop:Node;
    //提示层
    layerTips:Node;
    //过渡层
    layerTransition:Node;
    //打印BUG日志层
    // layerLog:Node;

    /**
     * 数据
    */
    //已加载过的材质(单个使用，例如页面) node
    preNodeArr:Array<preStructure> = [];
    //已加载过的材质item（多个使用，例如人物、物品） prefab
    preItemArr:Array<preItemStructure> = [];
    protected async onLoad() {
        // 在游戏加载时将当前组件实例设置为全局访问点
        Layer.Instance = this;

        Layer.Instance.layerView = find('layerView', this.node);
        // Layer.Instance.layerAnimation = find('layerAnimation', this.node);
        Layer.Instance.layerGuidance = find('layerGuidance', this.node);
        Layer.Instance.layerPop = find('layerPop', this.node);
        Layer.Instance.layerTips = find('layerTips', this.node);
        Layer.Instance.layerTransition = find('layerTransition', this.node);
        // Layer.Instance.layerLog = find('layerLog', this.node);

        //传入名字加载bundle，后续页面需要加载，单独设一个bundle，加载完图片后再加载材质
        // ResMgr.Ins.loadBundle();

        BuildSetting.ShareGameName = "足球鸡仔";
        BuildSetting.appid = "tt9868eed5060ea37302";
        BuildSetting.secret = "";
        BuildSetting.geAccessToken = "";

//         BuildSetting.Logo = this.Logo
//         BuildSetting.Icon = this.Icon


      await this.addComponent(SDKInterface).init()
        this.addComponent(GameStorage)
    //    SDK.Videoid = this.Videoid
    //         SDK.Bannerid = this.Bannerid
    //         SDK.Insertid = this.Insertid

      await SDK.CheckPrivacy()

        let now = Date.now()
        await SDK.Login();
        await SDK.checkSession();
        console.log(`【加载计时】SDK.Login 完成耗时: ${Date.now() - now}`)
        SDK.Game_register();
        await GameStorage.Ins.Load();
        SDKInfo.Init(() => {
            // 侧边栏奖励回调 获得奖励方法

        }, () => {
            // 桌面入口奖励回调 获得奖励方法

        });

        // DynamicAtlasManager.instance.enabled=false;

        await ResMgr.Ins.loadBundle("audio");
        await ResMgr.Ins.loadBundle("front");
        await ResMgr.Ins.loadBundle("img");
        await ResMgr.Ins.loadBundle("spine");
    }

    start() {
        //加载首页
        var pathLoading = this.getGamePrePath("loading");
        LoadImgTool.Instance.loadPrefab("loading",pathLoading,Layer.Instance.layerView);
        
        //预加载弹窗
        var pathTips = this.getGamePrePath("tips");
        LoadImgTool.Instance.loadPrefab("tips",pathTips,Layer.Instance.layerPop,false);
        //预加载提示
        var pathTipsStrip = this.getGamePrePath("tipsStrip");
        LoadImgTool.Instance.loadPrefab("tipsStrip",pathTipsStrip,Layer.Instance.layerTips,false);
        //预加载过渡层
        // var pathGCTransition = this.getGamePrePath("gradualChangeTransition");
        // LoadImgTool.Instance.loadPrefab("gradualChangeTransition",pathGCTransition,Layer.Instance.layerTransition,true);
    }

    //显示
    public show(preName:string,showLayer:Node)
    {
        //如果已加载过，无需重复加载，直接显示
        for(var cn:number = 0;cn < this.preNodeArr.length;cn++)
        {
            if(preName == this.preNodeArr[cn].preName)
            {
                showLayer.getChildByName(preName).active = true;
                console.log(this.preNodeArr[cn].preName + "材质已加载过，直接显示！");
                return;
            }
        }
        //如果没加载过，需要加载再显示
        var path = this.getGamePrePath(preName);
        LoadImgTool.Instance.loadPrefab(preName,path,showLayer);
        //存储到已加载过的材质数组中
        var newPreNode:preStructure = {preName:preName,layer:showLayer};
        this.preNodeArr.push(newPreNode);
    }

    //关闭显示
    public close(preName:string,closeLayer:Node)
    {
        if(closeLayer.getChildByName(preName))
        {
            closeLayer.getChildByName(preName).active = false;
        }else{
            console.log("材质名或层级错误，或未加载过材质，无法关闭显示！");
        }
    }

    //清除（内存释放，例如一天只能过一次的副本关卡页面，打完就清除）
    public delete(preName:string,deleteLayer:Node)
    {
        if(!deleteLayer.getChildByName(preName))
        {
            console.log("材质名或层级错误，或未加载过材质，无法删除！");
        }
        //先移除显示
        deleteLayer.getChildByName(preName).active = false;
        //再移除Node模块
        deleteLayer.removeChild(deleteLayer.getChildByName(preName));
        // 在存储数组中找到材质移除
        for(var cn:number = 0;cn < this.preNodeArr.length;cn++)
        {
            if(preName == this.preNodeArr[cn].preName)
            {
                this.preNodeArr.splice(cn,1);
                console.log("材质已移除！");
                return;
            }
        }
    }

    //获取
    public get(preName:string,showLayer:Node):Node
    {
        for(var cn:number = 0;cn < this.preNodeArr.length;cn++)
        {
            if(preName == this.preNodeArr[cn].preName)
            {
                return showLayer.getChildByName(preName);
            }
        }
        console.log("未找到节点！");
        return null;
    }

    //页面材质（单个唯一存在）加载成功后，存储到已加载过的材质数组中
    saveGamePre(pName:string,layerNode:Node)
    {
        var newPreNode:preStructure = {preName:pName,layer:layerNode};
        this.preNodeArr.push(newPreNode);
    }

    //组件材质（多个同时存在）加载成功后，存储到已加载过的材质数组中
    saveGamePreItem(iName:string,itemPre:Prefab)
    {
        var newPreItem:preItemStructure = {preItemName:iName,preItem:itemPre};
        this.preItemArr.push(newPreItem);
    }

    //根据名字，返回对应的Prefab加载路径
    getGamePrePath(preName:string):string
    {
        switch(preName)
        {
            /**
             * 加载过渡
            */
            //进度条加载（较多文件）
            case "loading":
                return "prefab/view/loading";
            //菊花转加载（较少文件）
            case "chrysanthemumSpinLoading":
                return "prefab/view/chrysanthemumSpinLoading";
            //过渡层
            case "gradualChangeTransition":
                return "prefab/transition/gradualChangeTransition";
            /**
             * 提示
            */
            //弹窗
            case "tips":
                return "prefab/pop/tips";
            //提示
            case "tipsStrip":
                return "prefab/pop/tipsStrip";
            //漂浮动态数字提示
            case "dynamicFigure":
                return "prefab/pop/dynamicFigure";
            /**
             * 登录
            */
            //登录
            case "login":
                return "prefab/view/login";
            //注册
            case "register":
                return "prefab/view/register";
            //修改密码
            case "changePassword":
                return "prefab/view/changePassword";
            //修改用户资料
            case "changeUserInformation":
                return "prefab/view/changeUserInformation";
            /**
             * 页面
            */
            //漫画
            case "cartoon":
                return "prefab/view/cartoon";
            //大厅
            case "hall":
                return "prefab/view/hall";
            //菜单
            case "menu":
                return "prefab/view/menu";
            //设置
            case "set":
                return "prefab/view/set";
            //战斗-英雄静止版
            case "fight":
                return "prefab/view/fight/fight";
            //战斗-英雄移动版
            case "fightMoveHero":
                return "prefab/view/fight/fightMoveHero";
            //战斗英雄状态
            case "battleHeroState":
                return "prefab/view/battleHeroState/battleHeroState";
            //酒馆抽卡
            case "amplificationCard":
                return "prefab/view/amplificationCard";
            //关卡通关
            case "levelPass":
                return "prefab/view/levelPass";
            //战斗失败
            case "lose":
                return "prefab/view/lose";
            //游戏记录
            case "gameRecord":
                return "prefab/view/gameRecord/gameRecord";
            //奖励
            case "award":
                return "prefab/view/award/award";
            //排行榜
            case "rank":
                return "prefab/view/rank/Rank";
            //角色属性
            case "roleProperty":
                return "prefab/view/roleProperty/roleProperty";
            //任务
            case "task":
                return "prefab/view/task/task";
            //地图
            case "map":
                return "prefab/view/map/map";
            //装备
            case "equip":
                return "prefab/view/equip";
            //规则
            case "rule":
                return "prefab/view/rule";
            //商城
            case "shop":
                return "prefab/view/shop/shop";
            //签到
            case "sign":
                return "prefab/view/sign";
            //好友
            case "friends":
                return "prefab/view/friends/friends";
            //好友详情
            case "friendDetails":
                return "prefab/view/friends/friendDetails";
            //引导
            case "guidance":
                return "prefab/view/guidance/guidance";
            //按键操作引导
            case "keyOperation":
                return "prefab/view/guidance/keyOperation";
            /**
             * 组件（有单独脚本）
            */
            //小框对话
            case "littleSpeak":
                return "prefab/module/littleSpeak";
            //绕圆
            case "gossip":
                return "prefab/module/gossip";
            /**
             * 子对象（无单独脚本）
            */
            case "gossipItem":
                return "prefab/commonItem/gossipItem";
            case "roomItem":
                return "prefab/view/map/mapComponent/item/roomItem";
            case "mapRoomItem":
                return "prefab/view/map/mapComponent/item/mapRoomItem";
            case "npcItem":
                return "prefab/view/map/item/npcItem";
            case "npcPassItem":
                return "prefab/view/map/item/npcPassItem";
            /**
             * 内嵌小游戏
            */
            //战斗准备，战前设置
            case "battlePrepare":
                return "prefab/view/miniGames/battle/battlePrepare";
            //战斗结算
            case "battleOver":
                return "prefab/view/miniGames/battle/battleOver";
        }
        console.log("材质名未找到！");
        return "";
    }

    update(deltaTime: number) {
        
    }
}


