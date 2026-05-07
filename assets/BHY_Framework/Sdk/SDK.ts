import { Component, game, sys } from "cc";
import BuildSetting from "./BuildSetting";
import { SDKType } from "./data/SDKType";
import { Eport } from "./Eport";
import BlBlSDK from "./PlatformSDK/BlBlSDK";
import DummySDK from "./PlatformSDK/DummySDK";
import HuaWeiSDK from "./PlatformSDK/HuaWeiSDK";
import KsSDK from "./PlatformSDK/KsSDK";
import MangGuoSDK from "./PlatformSDK/MangGuoSDK";
import OPPOSDK from "./PlatformSDK/OPPOSDK";
import TbSDK from "./PlatformSDK/TbSDK";
import ToutiaoSDK from "./PlatformSDK/ToutiaoSDK";
import VivoSDK from "./PlatformSDK/VivoSDK";
import WxSDK from "./PlatformSDK/WxSDK";
import XiaomiSDK from "./PlatformSDK/XiaomiSDK";
import ZfbSDK from "./PlatformSDK/ZfbSDK";
import SDKServer from "./SDKServer";
import SDKWrapped from "./SDKWrapped";

export var SDK: SDKWrapped;

export class SDKInterface extends Component {
    public async init() {
        if (sys.platform == sys.Platform.WECHAT_GAME) {
            if (window.hasOwnProperty("ks")) {
                SDKServer.platform = "ks"
                SDK = this.node.addComponent(KsSDK)
                BuildSetting.kPlatformSDK = SDKType.KsSDK;
                console.log("KsSDK...");
            } else if (window.hasOwnProperty("bl")) {
                SDKServer.platform = "bl"
                SDK = this.node.addComponent(BlBlSDK)
                BuildSetting.kPlatformSDK = SDKType.BlBlSDK;
                console.log("BlBlSDK...");
            } else {
                //WECHAT 
                SDKServer.platform = "wx"
                SDK = this.node.addComponent(WxSDK)
                BuildSetting.kPlatformSDK = SDKType.WxSDK;
                console.log("WxSDK...");
            }
        }
        else if (sys.platform == sys.Platform.BYTEDANCE_MINI_GAME) {
            SDKServer.platform = "tt"
            SDK = this.node.addComponent(ToutiaoSDK)
            BuildSetting.kPlatformSDK = SDKType.ToutiaoSDK;
            console.log("ToutiaoSDK...");
        }

        else if (sys.platform == sys.Platform.ALIPAY_MINI_GAME) {
            SDKServer.platform = "zfb"
            SDK = this.node.addComponent(ZfbSDK)
            BuildSetting.kPlatformSDK = SDKType.ZfbSDK;
            console.log("ZfbSDK...");
        }
        else if (sys.platform == sys.Platform.TAOBAO_MINI_GAME) {
            SDKServer.platform = "tb"
            SDK = this.node.addComponent(TbSDK)
            BuildSetting.kPlatformSDK = SDKType.TbSDK;
            console.log("TbSDK...");
        }


        else if (sys.platform == sys.Platform.OPPO_MINI_GAME) {
            SDKServer.platform = "oppo"
            SDK = this.node.addComponent(OPPOSDK)
            BuildSetting.kPlatformSDK = SDKType.OPPOSDK;
            console.log("OPPOSDK...");
        }
        else if (sys.platform == sys.Platform.VIVO_MINI_GAME) {
            SDKServer.platform = "vivo"
            SDK = this.node.addComponent(VivoSDK)
            BuildSetting.kPlatformSDK = SDKType.VivoSDK;
            console.log("VivoSDK...");
        }
        else if (sys.platform == sys.Platform.HUAWEI_QUICK_GAME) {
            SDKServer.platform = "huawei"
            SDK = this.node.addComponent(HuaWeiSDK)
            BuildSetting.kPlatformSDK = SDKType.HuaWeiSDK;
            console.log("HuaWeiSDK...");
        }
        else if (sys.platform == sys.Platform.XIAOMI_QUICK_GAME) {
            SDKServer.platform = "xiaomi"
            SDK = this.node.addComponent(XiaomiSDK)
            BuildSetting.kPlatformSDK = SDKType.XiaomiSDK;
            console.log("XiaomiSDK...");
        }
        else if (window.hasOwnProperty("mgtv")) {
            SDKServer.platform = "mgtv"
            SDK = this.node.addComponent(MangGuoSDK)
            BuildSetting.kPlatformSDK = SDKType.MangGuoSDK;
            console.log("MangGuoSDK...");
        }
        else {
            SDKServer.platform = "web"
            SDK = this.node.addComponent(DummySDK)
            BuildSetting.kPlatformSDK = SDKType.DummySDK;
            console.log("DummySDK...");
        }

        SDK.hideLoading();

        await SDK.Init();

        if (SDK.Getenv && SDK.Getenv.onError) {
            SDK.Getenv.onError(error => {
                console.error("监听到全局错误事件", JSON.stringify(error))
                Eport.onError(JSON.stringify(error))
            })
        }
        game.on("onError", Eport.onError, Eport)
    }
}