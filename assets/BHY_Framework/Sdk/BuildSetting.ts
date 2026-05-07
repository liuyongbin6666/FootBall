import { SpriteFrame } from "cc";
import { SDKType } from "./data/SDKType";

// 版本构建设置
export default class BuildSetting {
    public static readonly GameName: string = "HuaFu";

    public static kPlatformSDK: SDKType = SDKType.DummySDK;

    /**  app版本平台   */
    public static readonly apkPlatformSDK: SDKType = SDKType.DummySDK;

    /** 游戏版本号 */
    public static readonly Version = 1

    /** 是否为开发环境 */
    public static readonly IsDev: boolean = true;


    // request合法域名
    // 友盟+数据服务域名:https://umini.shujupie.com
    // 数据服务器域名:https://childbirth.wqmss.online
    // blbl登录:https://miniapp.bilibili.com
    // 引力 https://backend.gravity-engine.com
    // 引力 https://api.gravity-engine.com
    // 引力 https://api.datanexus.qq.com
    // 巨量回传 https://analytics.oceanengine.com

    // 23169958789542
    // downloadFile合法域名
    // CDN域名:https://cdn.yymfpf.com
    // CDN域名:https://mahjong.wqmss.online
    // 微信头像域名:https://thirdwx.qlogo.cn
    // EVENT_SEND_DEFAULT_INTERVAL 友盟事件发送默认间隔

    //https://https://cdn.yymfpf.com

    public static CDNUrl = "https://cdn.yymfpf.com"
    public static appid = ""
    public static secret = ""
    /** 引力Token */
    public static geAccessToken = ""

    /** 游戏圈圈子ID(支付宝) */
    public static openlink = ""

    public static Logo: SpriteFrame
    public static Icon: SpriteFrame


    /** wx1 吃席大作战(智游时光) */
    static get wx1() {
        // 吃席大作战
        // appid:wx29a4408a3ab6fe5a
        // appsecret:9bbf23b590446d0c274709e8e2d67174
        // 友盟AppKey:693bad0e8560e34872037914
        // 引力Token:
        // 视频id:adunit-a2f2ab44a38dd020
        return BuildSetting.appid == "wx29a4408a3ab6fe5a"
    }

    // @随风旅行(Jack_Z)-e_acc 这里是参数，权限也已经邀请了麻烦看下
    //  名称：干饭哪家强 
    //  平台：今日头条 
    //  标识：tt_gfnjq3
    //  App ID：ttb979cfc4264f383402 
    //  对外接口密钥：0a04aee3afa773cfef1e11f6d6e2d58a989b65ac 
    //  正式版： 
    //  测试版1：1.0.0
    //  激励视频ID：1jvxi08hm4420kk7rv
    /** tt1 干饭哪家强(指色) */
    static get tt1() {
        // 吃席大作战
        //  标识：tt_gfnjq3
        // appid:ttb979cfc4264f383402 
        // appsecret:0a04aee3afa773cfef1e11f6d6e2d58a989b65ac
        // 友盟AppKey:
        // 引力Token:
        // 视频id:1jvxi08hm4420kk7rv
        return BuildSetting.appid == "ttb979cfc4264f383402"
    }

    /** 是否开启排行榜 */
    public static get OpenRank() {
        return true
        return BuildSetting.kPlatformSDK == SDKType.DummySDK
    }

    /**  分享游    */
    public static ShareGameName: string

    public static get Sharetitle() {
        return BuildSetting.ShareGameName
    }

    public static ShareimageUrl = "share.png"


    /** 检测隐私状态  */
    public static get Privacy() {
        return BuildSetting.kPlatformSDK == SDKType.HuaWeiSDK
            || BuildSetting.kPlatformSDK == SDKType.XiaomiSDK
            || BuildSetting.kPlatformSDK == SDKType.OPPOSDK
            || BuildSetting.kPlatformSDK == SDKType.VivoSDK
            || BuildSetting.kPlatformSDK == SDKType.HonorSDK
            || BuildSetting.kPlatformSDK == SDKType.MeizuSDK
            || BuildSetting.kPlatformSDK == SDKType.DummySDK
    }


    public static get LocalStorage() {
        return BuildSetting.kPlatformSDK == SDKType.HuaWeiSDK
            || BuildSetting.kPlatformSDK == SDKType.XiaomiSDK
            || BuildSetting.kPlatformSDK == SDKType.OPPOSDK
            || BuildSetting.kPlatformSDK == SDKType.MeizuSDK
            || BuildSetting.kPlatformSDK == SDKType.ZuiyouSDK
            || BuildSetting.kPlatformSDK == SDKType.XunleiSDK
            || BuildSetting.kPlatformSDK == SDKType.DummySDK
    }

    
    /** 是否是指色 */
    public static get Zhise() {
        return BuildSetting.tt1
    }
}