import { Component, Game, game, Node, screen, sys, UITransform, View } from "cc";
import { MD5 } from "../Crypto/md5";
import BuildSetting from "./BuildSetting";
import { SDKType } from "./data/SDKType";
import { EportVideo } from "./Eport";
import { SDKAD } from "./exp/SDKAD";
import { SDKEvent } from "./exp/SDKEvent";
import { SDKRecord } from "./exp/SDKRecord";
import { SDKShare } from "./exp/SDKShare";
import { SDKStorage } from "./exp/SDKStorage";
import { SDKUserInfo } from "./exp/SDKUserInfo";
import { CODE } from "./PlatformSDK/code";
import SDKServer from "./SDKServer";
import { ApkPrivacyClause } from "./SDKUI/ApkPrivacyClause";
import { ErrModal } from "./SDKUI/ErrModal";

export default abstract class SDKWrapped extends Component {

    /** 游戏进入时间戳(秒) */
    public Entertime = 0;

    /** 系统信息对象，包含设备、平台等信息 */
    public SystemInfo: SystemInfo
    /** 是否为长屏幕设备(高宽比>=2) */
    public isLongScreen: boolean
    /** 屏幕缩放比例 */
    public scale: number

    /** 调整后的画面宽度 */
    public width: number
    /** 调整后的画面高度 */
    public height: number

    /** 随机字符串 */
    public RandomString(length: number) {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    /** 用户唯一标识ID */
    public userId: string

    /** 用户唯一标识(um_od) */
    protected um_od = ""
    /** 用户OpenID */
    protected _openId = ""
    set openId(v) {
        this._openId = v
        console.log("openId: " + this._openId)
        this.SetStorage("openId", v)
    }

    get openId() {
        if (!this._openId) {
            let Id = this.GetStorage("openId")
            this.um_od = this.GetStorage("um_od")
            if (Id)
                this.openId = Id
            else if (this.um_od)
                this.openId = this.um_od;
            if (!this._openId && BuildSetting.kPlatformSDK == SDKType.DummySDK)
                this.openId = this.RandomString(12)//ESAnNTbOxEg7
        }
        return this._openId;
    }

    /** 用户昵称默认值 */
    protected _nickname = ""//"Smile~🐶" 小咪不吃鱼丶
    /** 设置用户昵称 */
    public set nickname(v) { this._nickname = v }
    /** 获取用户昵称，如果未设置则返回默认游客昵称 */
    public get nickname() {
        if (!this._nickname && this.openId)//&& BuildSetting.kPlatformSDK == SDKType.DummySDK
            this._nickname = `游客${this.openId.substring(0, 5)}...`
        return this._nickname;
    }

    /** 用户头像URL地址 */
    public avatarUrl = ""

    /** 服务器ID */
    public Sid = ""

    /** 激励视频广告ID */
    public Videoid = ""

    /** Banner广告ID */
    public Bannerid = ''

    /** 插屏广告ID */
    public Insertid = ''

    /** 原生广告-图片类型ID */
    public NativeImgid = ""
    

    /** 原生广告-Icon类型ID */
    public NativeIconid = ""

    /** 原生广告-插屏类型ID */
    public NativeInsertid = ""

    /** 游戏Banner广告ID */
    public GameBannerid = ""

    /** 游戏九宫格广告ID */
    public GamePortalid = ""

    /** 抖音推荐流直出内容ID列表 */
    public content_id = ["CONTENT488304642"];

    /** 淘宝SDK实例 */
    public tbsdk: any

    /** 淘宝渠道标签信息 */
    public tbtagInfo: any


    /** 获取环境对象 */
    public get Getenv() { return null }

    /** 是否支持分享功能 */
    public get SupportShare() { return false }

    /** 是否支持添加桌面快捷方式 */
    public get SupportAddIcon() { return false }

    /** 是否支持侧边栏功能 */
    public async Limit() { return false }

    /** 是否是抖音平台 */
    public get Douyin() { return false }
    /** 是否支持游戏圈功能 */
    public get SupportClub() { return false; }
    /** 是否支持反馈页 */
    public get SupportFeedback() { return false; }


    /** 是否需要创建用户信息授权按钮 */
    public get IscreateUserInfo() {
        return BuildSetting.kPlatformSDK == SDKType.WxSDK
            || BuildSetting.kPlatformSDK == SDKType.QQSDK
            || BuildSetting.kPlatformSDK == SDKType.BlBlSDK
    }

    /** 是否从侧边栏进入游戏 */
    public get From_Limit() {
        let scene = `${this.scene}`;
        if (BuildSetting.kPlatformSDK == SDKType.ToutiaoSDK)
            return scene == '021001' || scene == '021036' || scene == '101001' || scene == '101036'
        else if (BuildSetting.kPlatformSDK == SDKType.BlBlSDK)
            return scene == '021036'
        else if (BuildSetting.kPlatformSDK == SDKType.WxSDK)
            return scene == '1089' || scene == '1001'
        else if (BuildSetting.kPlatformSDK == SDKType.KsSDK)
            return this.from == 'sidebar_new'
        else if (BuildSetting.kPlatformSDK == SDKType.DummySDK)
            return true
        else if (BuildSetting.kPlatformSDK == SDKType.TbSDK)
            // 淘宝二楼回访场景
            return this.tbtagInfo?.tag == 'ceiling' && this.tbtagInfo?.extra?.raw == "mini_ceiling"
    }

    /** 是否从桌面快捷方式进入游戏 */
    public get From_Addicon() {
        let scene = `${this.scene}`
        if (BuildSetting.kPlatformSDK == SDKType.BlBlSDK)
            return scene == '10002'
        else if (BuildSetting.kPlatformSDK == SDKType.ToutiaoSDK)
            return scene == '021020' || scene == '101020' || scene == "181020" || scene == "141020" || scene == "991020"
        else if (BuildSetting.kPlatformSDK == SDKType.KsSDK)
            return ks.isLaunchFromShortcut()
        else if (BuildSetting.kPlatformSDK == SDKType.VivoSDK
            || BuildSetting.kPlatformSDK == SDKType.OPPOSDK
            || BuildSetting.kPlatformSDK == SDKType.XiaomiSDK
            || BuildSetting.kPlatformSDK == SDKType.HonorSDK)
            return this.from == 'shortcut'
        // return this.from == "retention_apk" || this.from == "retention_desk_ios"
    }


    public get Privacy() { return this.GetStorage("Privacy") }
    /**  检查隐私政策    */
    public CheckPrivacy() {
        return new Promise<void>((resolve) => {
            // if (BuildSetting.Privacy && !this.Privacy) {
            //     ApkPrivacyClause.Show(() => {
            //         this.SetStorage("Privacy", "true")
            //         resolve()
            //     })
            // }
            // else
                resolve()
        })
    }

    /**  小米同意隐私    */
    public UserAgreed() { }
    /**  加快触发 JavaScript VM 进行（垃圾回收），GC 时机是由 JavaScript VM 来控制的，并不能保证调用后马上触发 G    */
    public triggerGC() { this.Getenv && this.Getenv.triggerGC && this.Getenv.triggerGC() }

    /**  开发版 */
    public develop = false
    /**  体验版 */
    public trial = false
    /**  正式版 */
    public release = false


    /** 插屏广告展示间隔时间（秒） */
    public interstitialTime: number = 120;
  
    /** 游戏ID */
    protected game_id = "1091"
    /** 分包密钥 */
    protected sdk_key = "13c4475e146a4d899f58d8e85a5db114"
    /** 域名 */
    protected domain_name = "https://plat.ujplay.net"

    /**
     * 初始化SDK系统
     * 设置基础配置、监听系统事件、初始化广告系统等
     */
    public async Init() {
        // 记录游戏进入时间戳
        this.Entertime = Math.floor(Date.now() * .001)

        if (this.Getenv) {
            // 处理平台更新机制
            if (this.Getenv.getUpdateManager) {
                let update = this.Getenv.getUpdateManager()
                if (update.onUpdateReady)
                    update.onUpdateReady(() => update.applyUpdate())
            }

            // 内存警告时触发GC
            if (this.Getenv.triggerGC && this.Getenv.onMemoryWarning) {
                this.Getenv.onMemoryWarning(() => this.triggerGC())
                this.schedule(this.triggerGC.bind(this), 5)
            }

            // 保持屏幕常亮
            if (this.Getenv.setKeepScreenOn)
                this.Getenv.setKeepScreenOn({ keepScreenOn: true })

            // 获取系统信息
            if (this.Getenv.getWindowInfo)
                this.SystemInfo = this.Getenv.getWindowInfo();
            else if (this.Getenv.getSystemInfoSync)
                this.SystemInfo = this.Getenv.getSystemInfoSync();

            console.log("SystemInfo:", JSON.stringify(this.SystemInfo));

            // 配置分享功能
            if (BuildSetting.kPlatformSDK == SDKType.WxSDK
                || BuildSetting.kPlatformSDK == SDKType.QQSDK) {
                // 微信和QQ平台分享配置
                this.Getenv.updateShareMenu({ withShareTicket: true });
                this.Getenv.onShareAppMessage(() => {
                    return {
                        imageUrl: BuildSetting.ShareimageUrl
                    }
                })
            }
            else if (this.Getenv.onShareAppMessage) {
                if (BuildSetting.kPlatformSDK == SDKType.BlBlSDK)
                    // B站平台分享配置
                    this.Getenv.onShareAppMessage(res => {
                        return {
                            imageUrl: BuildSetting.ShareimageUrl,
                            biliContent: `${BuildSetting.ShareGameName}，和我一起来玩吧 #小游戏# #${BuildSetting.ShareGameName}#`,
                        }
                    });
                else
                    // 其他平台分享配置
                    this.Getenv.onShareAppMessage(res => {
                        return {
                            title: BuildSetting.Sharetitle,
                            desc: BuildSetting.ShareGameName,
                            imageUrl: BuildSetting.ShareimageUrl,
                        }
                    });
            }


            if (BuildSetting.kPlatformSDK == SDKType.WxSDK)
                this.Getenv.showShareMenu({ menus: ['shareAppMessage', 'shareTimeline'] })
            else if (BuildSetting.kPlatformSDK == SDKType.QQSDK) {
                this.Getenv.showShareMenu({ showShareItems: ['qq', 'qzone', 'wechatFriends', 'wechatMoment'] })
                this.Getenv.onAddToFavorites && this.Getenv.onAddToFavorites((res) => {
                    return {
                        title: '添加收藏标题',
                        imageUrl: '',
                        query: 'a=1&b=2'
                    }
                })
            }

            if (this.Getenv.getLaunchOptionsSync) {
                this.Option = this.Getenv.getLaunchOptionsSync()
                console.log("登录入口信息: ", JSON.stringify(this.Option));

                if (this.Option.scene)
                    this.scene = this.Option.scene;

                if (this.Option.query && this.Option.query.clickid)
                    this.clickid = this.Option.query.clickid

                if (this.Option.from)
                    this.from = this.Option.from;
                else if (this.Option.referrerInfo && this.Option.referrerInfo.type)
                    this.from = this.Option.referrerInfo.type

                console.log("scene: ", this.scene);
                console.log("clickid: ", this.clickid);
                console.log("from: ", this.from);
            }

            if (BuildSetting.kPlatformSDK == SDKType.TbSDK) {
                this.tbsdk = this.Getenv.tb.getInteractiveSDK()
                this.tbtagInfo = this.tbsdk.getChannelTag()
                if (this.tbtagInfo)
                    console.log("tbtagInfo", JSON.stringify(this.tbtagInfo))
            }
        }

        console.log("运行系统:", sys.os)
        console.log("运行平台:", sys.platform)

        this.isLongScreen = (screen.windowSize.height / screen.windowSize.width) >= 2;

        console.log("是否是长屏:", JSON.stringify(screen.windowSize), this.isLongScreen, screen.devicePixelRatio);

        let size = View.instance.getDesignResolutionSize()

        if ((screen.windowSize.width / screen.windowSize.height) < (size.width / size.height)) {
            console.log("宽度不变，高度根据屏幕比缩放")

            this.height = screen.windowSize.height / screen.windowSize.width * size.width;
            this.width = size.width;
            this.scale = size.width / (screen.windowSize.width / screen.devicePixelRatio)
        } else {
            console.log("高度不变，宽度根据屏幕比缩放")

            this.width = screen.windowSize.width / screen.windowSize.height * size.height
            this.height = size.height;
            this.scale = size.height / (screen.windowSize.height / screen.devicePixelRatio);
        }

        console.log("调整后宽高:", this.width, this.height);
        // this.scale = screen.devicePixelRatio
        console.log("缩放系数:", this.scale);

        this.Storage = new SDKStorage()
        this.UserInfo = new SDKUserInfo()
        await this.UserInfo.init()
        this.Record = new SDKRecord()
        this.Share = new SDKShare()
        this.AD = new SDKAD()
        this.IniADCal()


        // this.onNetworkStatusChange()

        if (this.Getenv) {
            if (BuildSetting.kPlatformSDK == SDKType.HuaWeiSDK)
                this.submitPlayerEvent(`${Date.now()}`, 'GAMEBEGIN')
            // this.Getenv.offShow()
            this.Getenv.onShow(res => {
                const now = Date.now();
                this.submitPlayerEvent(`${now}`, 'GAMEBEGIN')
                this.onShow(res)
                this.Share.Show()
                // BuildSetting.kPlatformSDK == SDKType.WxSDK && game.emit(SDKEvent., true)
            })
            // this.Getenv.offHide()
            this.Getenv.onHide(res => {
                this.submitPlayerEvent(this.transactionId, 'GAMEEND')
                this.onHide(res);
            })

            //监听音频中断结束事件。在收到 onAudioInterruptionBegin 事件之后，小程序内所有音频会暂停，收到此事件之后才可再次播放成功
            this.Getenv.offAudioInterruptionEnd && this.Getenv.offAudioInterruptionEnd()
            this.Getenv.onAudioInterruptionEnd && this.Getenv.onAudioInterruptionEnd(() => {
                this.onShow("音频中断结束")
            })
            //监听音频因为受到系统占用而被中断开始事件。以下场景会触发此事件：闹钟、电话、FaceTime 通话、微信语音聊天、微信视频聊天。此事件触发后，小程序内所有音频会暂停。
            this.Getenv.offAudioInterruptionBegin && this.Getenv.offAudioInterruptionBegin()
            this.Getenv.onAudioInterruptionBegin && this.Getenv.onAudioInterruptionBegin(() => {
                // this.onlinetime;
                this.onHide("音频中断开始")
            })
        }
        else {
            game.on(Game.EVENT_SHOW, this.onShow, this);
            game.on(Game.EVENT_HIDE, this.onHide, this);
        }


        game.on(SDKEvent.ShowInterstitialAd, this.ShowInterstitialAd, this);


        // if (BuildSetting.kPlatformSDK == SDKType.TbSDK) {
        //     try {
        //         // @ts-ignore
        //         let cloudObj = new cloud.Cloud();
        //         console.log("cloud", cloudObj)
        //         cloudObj.init({ env: 'online' });//test online
        //         this.userCloudStore = cloudObj.userCloudStore;
        //         // 备份路径，可不填，如果不填，采用默认路径"default"
        //         this.userCloudStore.definePath = GameStorage. 
        //     }
        //     catch (error) {
        //         console.error("cloud初始化错误:", error)
        //     }
        // }
    }

    private IniADCal() {
        //视频 加载成功
        this.AD.VideoonLoad = this.onLoadVideo.bind(this);
        //视频 错误
        this.AD.VideoonError = this.onErrorVideo.bind(this);
        //视频 关闭回调
        this.AD.VideoonClose = this.onVideoClose.bind(this);

        //Banner 尺寸回调
        this.AD.BanneronResize = this.onBannerResize.bind(this);
        //Banner 加载成功
        this.AD.BanneronLoad = this.onBannerLoad.bind(this);
        //Banner 错误
        this.AD.BanneronError = this.onBannerError.bind(this);

        //插屏 加载成功
        this.AD.InteronLoad = this.onLoadInter.bind(this);
        //插屏 错误
        this.AD.InteronError = this.onErrorInter.bind(this);
        //插屏 关闭
        this.AD.InteronClose = this.onInterClose.bind(this);
    }


    public geinit = false
    public ge: GravityAnalyticsAPI;
    /** 引力引擎 初始化 */
    private async initge() {
        if (BuildSetting.kPlatformSDK == SDKType.DummySDK) return
        // if (!BuildSetting.geAccessToken) return

        let config: any = {
            accessToken: BuildSetting.geAccessToken, // 项目通行证，在：网站后台-->设置-->应用列表中找到Access Token列 复制（首次使用可能需要先新增应用）
            // clientId: this.openId, // 用户唯一标识，如产品为小游戏，则必须填用户openid（注意，不是小游戏的APPID！！！）
            autoTrack: {
                appLaunch: true, // 自动采集 $MPLaunch
                appShow: true, // 自动采集 $MPShow
                appHide: true, // 自动采集 $MPHide
                pageShow: true, // 自动采集 $MPViewScreen
                pageShare: true, // 自动采集 $MPShare
            },
            name: "ge", // 全局变量名称
            // debugMode: "debug", // debug 是否开启测试模式，开启测试模式后，可以在 网站后台--设置--元数据--事件流中查看实时数据上报结果。（测试时使用，上线之后一定要关掉，改成 none 或者删除）
        }

        if (this.openId)
            config.clientId = this.openId

        this.ge = new GravityAnalyticsAPI(config)

        if (!this.openId) {
            await new Promise<void>((resolve, reject) => {
                this.Getenv.login({
                    success: (res) => {
                        console.log("login", JSON.stringify(res));

                        if (BuildSetting.kPlatformSDK == SDKType.ToutiaoSDK)
                            this.ge.getDouyinOpenId(res.code)
                                .then((res) => {
                                    console.log("getDouyinOpenId:", JSON.stringify(res));
                                    if (res.openid)
                                        this.openId = res.openid
                                    resolve()
                                }).catch(err => {
                                    console.error("getDouyinOpenId:", JSON.stringify(err));
                                    resolve();
                                })
                        else if (BuildSetting.kPlatformSDK == SDKType.WxSDK)
                            this.ge.getWechatOpenId(res.code)
                                .then((res) => {
                                    // 这里返回的res和官方文档返回的resp保持一致，具体请查看下方列出的官方文档中的返回值 
                                    console.log("getWechatOpenId:", JSON.stringify(res));
                                    if (res.openid)
                                        this.openId = res.openid;
                                    resolve();
                                }).catch(err => {
                                    console.error("getWechatOpenId:", JSON.stringify(err));
                                    resolve();
                                });
                        else if (BuildSetting.kPlatformSDK == SDKType.BlBlSDK)
                            this.ge.getBilibiliOpenId(res.code)
                                .then((res) => {
                                    // 这里返回的res和官方文档返回的resp保持一致，具体请查看下方列出的官方文档中的返回值 
                                    console.log("getBilibiliOpenId:", JSON.stringify(res));
                                    if (res.openid)
                                        this.openId = res.openid;
                                    resolve();
                                }).catch(err => {
                                    console.error("getBilibiliOpenId:", JSON.stringify(err));
                                    resolve();
                                });
                        else if (BuildSetting.kPlatformSDK == SDKType.KsSDK)
                            this.ge.getKuaishouOpenId(res.code)
                                .then((res) => {
                                    // 这里返回的res和官方文档返回的resp保持一致，具体请查看下方列出的官方文档中的返回值 
                                    console.log("getKuaishouOpenId:", JSON.stringify(res));
                                    if (res.openid)
                                        this.openId = res.openid;
                                    if (res["open_id"])
                                        this.openId = res["open_id"];

                                    resolve();
                                }).catch(err => {
                                    console.error("getKuaishouOpenId:", JSON.stringify(err));
                                    resolve();
                                });
                    }
                })
            });
        }

        if (!this.openId) return;

        this.ge.setupAndStart({ clientId: this.openId })

        await new Promise<void>((resolve, reject) => {
            /**   
             * @param {string} name 用户名，可以理解成用户在业务中的昵称，如果没有，可以填用户唯一ID（必填）
             * @param {number} version 用户初始化的程序发布更新的版本号（必填）
             * @param {string} openid open id (小程序/小游戏必填)
             * @param {string} enable_sync_attribution 是否开启同步获取归因信息，具体请参考同步归因：https://doc.gravity-engine.com/turbo-integrated/sync_attribution.html
                */
            this.ge.initialize({
                name: BuildSetting.ShareGameName,
                version: 1,
                openid: this.openId,
                enable_sync_attribution: false
            }).then((res) => {
                console.log("引力初始化成功", JSON.stringify(res));

                this.ge.loginEvent()

                //设置公共事件属性
                // this.ge.setSuperProperties({ game_name: BuildSetting.ShareGameName, play_id: this.openId });
                this.geinit = true;
                resolve()
            }).catch((err) => {
                console.error("引力初始化失败", JSON.stringify(err));
                resolve()
            });
        })
    }

    public transactionId = ""
    /**  华为    */
    public submitPlayerEvent(eventId: string, eventType: string) {
        if (BuildSetting.kPlatformSDK == SDKType.HuaWeiSDK)
            this.Getenv.submitPlayerEvent && this.Getenv.submitPlayerEvent({//上报进入
                //randomNumStr 是不超过64位的随机数字符串
                eventId: eventId,
                eventType: eventType,
                success: (res) => {
                    //仅当eventType为GAMEBEGIN时，返回对应的transactionId，用于GAMEEND场景。其他场景包括接口返回失败时为空字符串。
                    if (eventType == "GAMEBEGIN")
                        this.transactionId = res.transactionId
                },
                fail: (data, code) => { }
            });
    }

    public onShow(res: any = "") {
        if (res) {
            if (res.scene)
                this.scene = res.scene;
            else if (res.query && res.query.scene)
                this.scene = res.query.scene;

            if (res.from)
                this.from = res.from;
            else if (res.referrerInfo && res.referrerInfo.type)
                this.from = res.referrerInfo.type
        }

        if (this.AD.IsShowVideoIn) return
        console.log("onShow:" + JSON.stringify(res))
        if (this.IsHide) {
            this.IsHide = false;
            game.resume()
            this.scheduleOnce(() => {
                game.emit(SDKEvent.Show, res)
            })
        }
    }
    private IsHide = false;

    public onHide(res = "") {
        console.log("onHide:" + JSON.stringify(res))
        if (!this.IsHide) {
            this.IsHide = true
            SDKServer.Save();
            game.emit(SDKEvent.Hide, res)
            game.pause();
        }
    }

    /**  
     * 快手游戏启动场景
     * game_center	游戏中心
     * lbs	同城
     * im	快手私信
     * search	搜索
     * detail_link	视频 link
     * detail_tag	视频标签
     * campaign	活动页
     * sidebar_miniprogram	侧边栏小小游戏入口
     * profile	个人主页
     * retention_apk	Android 桌面快捷方式
     * retention_desk_ios	iOS 桌面快捷方式
     * other	其他
       */
    private from = ""
    /**  当前场景    */
    private scene = ""

    /** 启动参数里获取的 clickid */
    private clickid = ""
    /**  登录入口    */
    public Option: LaunchOptionsSync;


    public userCloudStore
    // public cloudObj: Cloud

    protected logintime = 0;
    /**      */
    public Login() {
        return new Promise<void>(async (resolve) => {
            if (BuildSetting.geAccessToken) {
                await this.initge()
                resolve()
            }
       
            else if (BuildSetting.kPlatformSDK == SDKType.BlBlSDK) {
                bl.login({
                    success: (res) => {
                        console.log("登陆成功,获取到 登录信息", res);
                        let Url = `https://miniapp.bilibili.com/api/sns/jscode2session?appid=${BuildSetting.appid}&secret=${BuildSetting.secret}&js_code=${res.code}&grant_type=authorization_code`
                        this.get(Url).then(res => {
                            if (res && res.openid)
                                this.openId = res.openid
                            resolve()
                        })
                    }, fail: err => {
                        console.log("登陆失败", err);
                        resolve()
                    }
                })
            }
            else if (BuildSetting.kPlatformSDK == SDKType.KsSDK) {
                ks.login({
                    success: (res) => {
                        console.log("登陆成功,获取到 登录信息", res);
                        if (res.gameUserId) {
                            this.openId = res.gameUserId
                        }
                        resolve()
                    }, fail: err => {
                        console.log("登陆失败", err);
                        resolve()
                    }
                })
            }
            else if (BuildSetting.kPlatformSDK == SDKType.MangGuoSDK) {
                mgtv.login({
                    success: res => {
                        console.log("login success", JSON.stringify(res));
                        mgtv.getUserProfile({
                            success: res => {
                                console.log("获取用户信息 success", JSON.stringify(res));
                                if (res && res.data && res.data.uuid) {
                                    this.openId = res.data.uuid
                                    this.nickname = res.data.nickName
                                    this.avatarUrl = res.data.avatarUrl

                                    console.log("头像地址:", this.avatarUrl)
                                    console.log("玩家昵称:", this.nickname)
                                }
                                resolve()
                            },
                            fail: res => {
                                console.log("获取用户信息 fail", JSON.stringify(res));
                                resolve()
                            }
                        });
                    },
                    fail: res => {
                        console.error("login fail", JSON.stringify(res));
                    }
                });
            }
            else if (BuildSetting.kPlatformSDK == SDKType.VivoSDK) {
                qg.login({
                    success: res => {
                        console.log("login success", JSON.stringify(res));

                        if (res && res.openId) {
                            this.openId = res.openId
                            this.nickname = res.nickName
                            this.avatarUrl = res.avatar

                            console.log("头像地址:", this.avatarUrl)
                            console.log("玩家昵称:", this.nickname)
                        }
                        resolve()
                    },
                    fail: res => {
                        console.error("login fail", JSON.stringify(res));
                        resolve()
                    }
                });
            }
            else if (BuildSetting.kPlatformSDK == SDKType.XiaomiSDK) {
                qg.login({
                    success: res => {
                        console.log("login success", JSON.stringify(res));
                        if (res && res.data && res.data.appAccountId)
                            this.openId = res.data.appAccountId;
                        resolve()
                    },
                    fail: res => {
                        console.error("login fail", JSON.stringify(res));
                        resolve()
                    }
                });
            }

            else if (this.openId) {
                resolve()
            }
            else if (BuildSetting.kPlatformSDK == SDKType.ZfbSDK) {
                this.Getenv.getAuthCode({
                    scopes: 'auth_base',//建议使用默认授权方式
                    success: async res => {
                        const authCode = res.authCode;
                        console.log("getAuthCode 成功", authCode)
                        let data = await this.post("https://childbirth.wqmss.online:5510/Zhifubao/login2", { code: authCode, appId: BuildSetting.appid })
                        // 获取需要的用户信息
                        if (data && data.msg && data.msg.openId)
                            this.openId = data.msg.openId
                        resolve()
                    },
                    fail: err => {
                        console.log('getAuthCode 调用失败', err)
                        resolve()
                    }
                });
            }
            else {
                this.schedule(dt => {
                    this.logintime += dt;
                    if (this.openId || this.logintime >= 0.2) {
                        this.unscheduleAllCallbacks()
                        console.log("login LoginCal")
                        resolve()
                    }
                })
            }
        })
    }

    /** blbl 检查登录态是否过期 */
    public checkSession() {
        return new Promise<void>((resolve, reject) => {
            if (BuildSetting.kPlatformSDK == SDKType.BlBlSDK)
                bl.checkSession({
                    success: () => {
                        // session_key 未过期，并且在本生命周期一直有效
                        resolve()
                    },
                    fail: () => {
                        // session_key 已经失效，需要重新执行登录流程
                        // 重新登录
                        bl.login({
                            success: (res) => {
                                console.log("登陆成功,获取到 登录信息", res);
                                resolve()
                            }, fail: err => {
                                console.log("登陆失败", err);
                                resolve()
                            }
                        })
                    }
                })
            else {
                resolve()
            }
        })
    }

    /** 签名 */
    public sign(str: any) { return MD5.md5.hex_md5(`${str}1170601406`) }

    public UserInfo: SDKUserInfo
    /**
     * 创建用户信息授权按钮
     * @param x 按钮x坐标（相对于屏幕）
     * @param y 按钮y坐标（相对于屏幕）
     * @param w 按钮宽度
     * @param h 按钮高度
     * @description 在指定位置创建用户信息授权按钮。主要用于微信和QQ平台获取用户基本信息。
     * 如果用户已授权，则直接获取用户信息；否则创建授权按钮。坐标会根据屏幕缩放比例自动调整。
     */
    public createUserInfo(node: Node) {
        if (!this.IscreateUserInfo) return;

        if (this.UserInfo.authSetting && this.UserInfo.authSetting["scope.userInfo"])
            this.UserInfo.getUserInfo();
        else {
            let Position = node.getWorldPosition();
            let Transform = node.getComponent(UITransform);

            let x = Position.x - Transform.width * 0.5;
            let y = (this.height - 1334) * 0.5 + (1334 - Position.y - Transform.height * 0.5);
            let w = Transform.width;
            let h = Transform.height;

            x = Math.round(x / this.scale)
            y = Math.round(y / this.scale)
            w = Math.round(w / this.scale)
            h = Math.round(h / this.scale)
            this.UserInfo.createUserInfoButton(x, y, w, h)
        }
    }

    /**
     * 获取用户信息
     * @returns {Promise<void>}
     * @description 异步获取用户基本信息。根据不同平台（快手、淘宝、支付宝等）执行相应的授权流程。
     * 对于快手和淘宝平台，需要先获取userInfo权限；支付宝平台需要获取userInfo权限；
     * 其他平台直接获取用户信息。
     */
    public async getUserInfo() {
        console.log("[SDK] getUserInfo")
        if (BuildSetting.kPlatformSDK == SDKType.KsSDK
            || BuildSetting.kPlatformSDK == SDKType.TbSDK) {
            if (await this.authorize("scope.userInfo"))
                await this.UserInfo.getUserInfo()
        } else if (BuildSetting.kPlatformSDK == SDKType.ZfbSDK) {
            if (await this.authorize("userInfo"))
                await this.UserInfo.getUserInfo()
        }
        else
            await this.UserInfo.getUserInfo()
    }

    /**
     * 销毁用户信息授权按钮
     * @description 移除之前创建的用户信息授权按钮
     */
    public DelUserInfoButton() { this.UserInfo.DelUserInfoButton() }

    /**
     * 获取用户授权
     * @param scope 授权类型，如"scope.userInfo"表示用户信息授权
     * @returns {Promise<boolean>} 返回授权结果
     * @description 向用户请求特定权限的授权。不同平台的授权scope可能不同，
     * 如微信/QQ使用"scope.userInfo"，支付宝使用"userInfo"等
     */
    public authorize(scope: string) { return this.UserInfo.authorize(scope) }



    public AD: SDKAD
    /**
     * 显示激励视频广告
     * @param Id 广告来源ID，用于统计广告点击分布
     * @param Cbk 广告关闭后的回调函数，参数end表示是否完整观看广告
     * @param v1 额外参数，可用于数据统计
     * @description 展示激励视频广告，并在广告关闭后执行回调
     */
    public ShowVideoAd(Id: EportVideo, Cbk: (end: boolean) => void = null, v1: string = null) {
        this.AD.ShowVideoAd(Id, Cbk, v1)
    }

    /**
     * 视频广告加载成功回调
     * @description 内部方法，处理视频广告加载成功事件
     */
    protected onLoadVideo() { this.AD.onLoadVideo() }

    /**
     * 视频广告加载失败回调
     * @param err 错误信息
     * @description 内部方法，处理视频广告加载失败事件
     */
    protected onErrorVideo(err) { this.AD.onErrorVideo(err) }

    /**
     * 视频广告关闭回调
     * @param res 包含isEnded属性，表示用户是否完整观看广告
     * @description 内部方法，处理视频广告关闭事件
     */
    protected onVideoClose(res: { isEnded: boolean }) { this.AD.onVideoClose(res) }


    protected BannerWidth
    /**
     * 显示Banner广告
     * @description 显示Banner广告，优先使用原生Banner。在OPPO、vivo和华为平台上使用特定实现
     */
    public ShowBannerAd() {
        this.AD.ShowBannerAd()
    }

    /**
     * 显示普通Banner广告
     * @description 显示标准Banner广告，主要用于OPPO和华为平台
     */
    public ShowBanner() { };

    /**
     * Banner广告加载成功回调
     * @description 内部方法，处理Banner广告加载成功事件
     */
    protected onBannerLoad() { }

    /**
     * Banner广告加载失败回调
     * @param err 错误信息
     * @description 内部方法，处理Banner广告加载失败事件
     */
    protected onBannerError(err) { }

    /**
     * Banner广告尺寸变化回调
     * @param res 尺寸信息
     * @description 内部方法，处理Banner广告尺寸调整事件
     */
    protected onBannerResize(res) { }

    /**
     * 隐藏Banner广告
     * @description 隐藏当前显示的Banner广告
     */
    public HideBannerAd() {
        this.AD.HideBannerAd()
    }

    /**
     * 插屏广告展示间隔时间
     * @description 控制插屏广告展示的最小时间间隔
     */
    protected InsertintervalTime = 0;

    /**
     * 显示插屏广告
     * @param InsTime 是否启用展示间隔限制，默认为true
     * @description 展示插屏广告，可以通过InsTime参数控制是否遵循展示间隔限制
     */
    public ShowInterstitialAd(InsTime = true) {
        this.AD.IsShowInterstitial = true
    }

    protected onLoadInter(res) {
        //console.log("插屏加载成功", JSON.stringify(res))
        this.AD.IsShowInterstitial = false;
    }
    protected onErrorInter(err) {
        //console.error("插屏 错误" + JSON.stringify(err))
        this.AD.IsShowInterstitial = false;
        this.AD.IsLoadInterstitial = false;
    }
    protected onInterClose() {
        //console.log("插屏 关闭")
        this.AD.IsShowInterstitial = false;
        this.AD.IsLoadInterstitial = false;
    }


    /**  显示 单    */
    public ShowCustomAd(left: number = null, top: number = null) { }
    /**  隐藏 单    */
    public HideCustomAd() { }

    /**  显示 单格    */
    public ShowCustom1Ad(left: number = null, top: number = null) { }
    /**  隐藏 单格    */
    public HideCustom1Ad() { }

    /**  显示 单格    */
    public ShowCustom2Ad(left: number = null, top: number = null) { }
    /**  隐藏 单格    */
    public HideCustom2Ad() { }

    /**  显示 横屏多    */
    public ShowCustomsWAd() { }
    /**  隐藏 横屏多    */
    public HideCustomsWAd() { }

    /**  显示 左侧垂直多    */
    public ShowCustomsLAd() { }
    /**  隐藏 左侧垂直多    */
    public HideCustomsLAd() { }

    /**  显示 右侧垂直多    */
    public ShowCustomsRAd() { }
    /**  隐藏 右侧垂直多    */
    public HideCustomsRAd() { }

    /**  显示 触发型矩阵    */
    public ShowCustom_TrgAd() { }
    /**  隐藏 触发型矩阵    */
    public HideCustom_TrgAd() { }

    /**  显示 展示型矩阵    */
    public ShowCustom_DemstAd() { }
    /**  隐藏 展示型矩阵    */
    public HideCustom_DemstAd() { }

    /**  显示 ov小游戏互推盒子横幅    */
    public ShowGameBannerAd() { }
    /**  隐藏 ov小游戏互推盒子横幅    */
    public HideGameBannerAd() { }

    protected PortalAdCD = 0
    /**  显示互推盒子九宫格    */
    public ShowGamePortalAd() { }
    /**  隐藏互推盒子九宫格    */
    public HideGamePortalAd() { }

    /**  显示 微信游戏对局回放分享 */
    public ShowGameRecorderShareButton(y) { }
    /**  隐藏 微信游戏对局回放分享 */
    public HideGameRecorderShareButton() { }

    public ClubButton
    protected Club_show = false
    /** 显示游戏圈 */
    public ShowGameClubButton(node?: Node) {
        // this.ClubButton = 1
    }
    /** 隐藏游戏圈 */
    public HideGameClubButton() { }


    private Storage: SDKStorage

    /** 长震动 */
    public VibrateLong() { this.Storage.VibrateLong() }
    /** 短震动 */
    public VibrateShort() { this.Storage.VibrateShort() }

    public CleStorage = false;
    public GetStorage(key: string): string { return this.Storage.GetStorage(key) }
    public SetStorage(key: string, value: string) {
        if (this.CleStorage) return;
        this.Storage.SetStorage(key, value)
    }
    public DelStorage(key: string) { return this.Storage.DelStorage(key) }
    /** 清理所有数据 */
    public ClearStorage() {
        this.CleStorage = true
        this.Storage.ClearStorage()
    }


    private Share: SDKShare
    public ShareGame(Cbk: (end: boolean) => void = null, query = "") {
        this.Share.ShareGame(Cbk, query)
    }


    public Record: SDKRecord
    /** 是否支持录屏 */
    public get IsSupportRecord() { return this.Record.IsSupportRecord }
    /** 是否录屏中 */
    public get IsRecord() { return this.Record.IsRecord }
    /** 录屏长度 */
    public get RecordLength(): number { return this.Record.RecordLength }
    /**  
     * 开始录屏
     * @param ShowErrTip 是否显示错误提示
     * @param StopFun 
       */
    public StartRecord(ShowErrTip = false, StopFun = null) { this.Record.StartRecord(ShowErrTip, StopFun) }
    /** 停止录屏 */
    public StopRecord(StopFun: Function = null) { this.Record.StopRecord(StopFun) }
    /** 分享录屏 */
    public ShareRecord(Cal: (end: boolean) => void = null) { this.Record.ShareRecord(Cal) }


    /** 加载错误重启对话框 */
    public showerrModal(title: string, content: string = "请退出重启！", Cal: () => void = null) {
        ErrModal.Show(title, content, Cal)
        // this.Getenv.showModal({
        //     title: title,
        //     content: content,
        //     showCancel: false,
        //     // cancelText: "退出",//取消按钮的文字，最多 4 个字符
        //     confirmText: "确定",//确认按钮的文字，最多 4 个字符
        //     // success: res => {
        //     //     if (res.confirm) {//点击确定
        //     //         if (Cal && content == "是否重新登录") Cal()
        //     //         else this.Restart()
        //     //     }
        //     // }, fail: err => {
        //     //     if (err.errMsg == "fail cancel")
        //     //         this.Exit()
        //     // }
        // })
    }

    /**  
     * 显示公告
     * @param msg 提示
     * @param time 持续时间
       */
    public ShowTips(msg) {
        // this.Tips.push(msg) 
        // TipsMgr.Ins.show(msg)
    }

    /**   已上报加载事    */
    // private Loadeport: { [id: string]: boolean } = {}
    /** 数据上报 */
    public eportAnalytics(Str: string, v1 = null) {
        if (!Str) return;
        // if (BuildSetting.) return

        if (v1)
            console.log("数据上报:" + Str, v1)
        else
            console.log("数据上报:" + Str)

        if (this.Getenv && this.Getenv.uma) {
            if (v1)
                this.Getenv.uma.trackEvent(Str, { v1: `${v1}` });
            else
                this.Getenv.uma.trackEvent(Str);
        }

        // if (BuildSetting.tt5)
        //     tt.mmdEvent(Str, { v1: `${v1}` }, res => console.log("mmdEvent callBack:", res))

        // if (this.geinit)
        //     this.ge.track(Str, { v1: v1 });
    }

    public eportAnalytics1(Str: string, v1 = null) {
        // if (!BuildSetting. || !BuildSetting.Zhise) return

        // Str = `${BuildSetting.ABundle ? "A_" : "B_"}${Str}`
        // if (v1)
        //     console.log("数据上报:" + Str, v1)
        // else
        //     console.log("数据上报:" + Str)

        // if (v1)
        //     seeg.onEvent(Str, { v1: `${v1}` })
        // else
        //     seeg.onEvent(Str, {})
    }

    protected VersionMap = new Map<string, boolean>()

    /**
     * 比较SDK版本号
     * @param {string} v2 要比较的目标版本号
     * @returns {boolean} 如果当前SDK版本号大于等于目标版本号返回true，否则返回false
     * @description 比较当前系统SDK版本与目标版本的大小。版本号格式为"x.y.z"，
     * 从左到右依次比较每个数字。使用缓存机制避免重复计算相同版本号的比较结果。
     * 如果系统不支持或未提供SDK版本号，则返回true。
     */
    public compareVersion(v2) {
        if (!this.SystemInfo || !this.SystemInfo.SDKVersion) return true;

        if (this.VersionMap.has(v2))
            return this.VersionMap.get(v2)

        const v1 = this.SystemInfo.SDKVersion.split(".")
        v2 = v2.split(".")
        const len = Math.max(v1.length, v2.length)
        while (v1.length < len)
            v1.push("0")
        while (v2.length < len)
            v2.push("0")
        for (let i = 0; i < len; i++) {
            const n1 = parseInt(v1[i])
            const n2 = parseInt(v2[i])
            if (n1 > n2) {
                this.VersionMap.set(v2, true)
                return true
            }
            else if (n1 < n2) {
                this.VersionMap.set(v2, false)
                return false
            }
        }
        this.VersionMap.set(v2, false)
        return false
    }

    public get(Url: string) {
        return new Promise<{ code: CODE, msg: any } | any>((resolve) => {
            let http = new XMLHttpRequest()
            http.open("get", Url, true)
            http.timeout = 5000;
            http.responseType = "text";
            http.setRequestHeader("Content-Type", "application/json");

            http.onload = () => {
                if (http.response) {
                    let msg: { code: CODE, msg: string } = http.response;
                    try {
                        if (typeof msg == "string")
                            msg = JSON.parse(msg)
                        console.log(`${Url} 返回`, msg)
                        resolve(msg)
                    } catch (error) {
                        console.error(`${Url} get 错误 返回:`, msg)
                        resolve(null)
                    }
                }
                else {
                    // this.ShowTips("请求错误 请稍后再试")
                    console.error("get 错误2", http.statusText)
                    resolve(null)
                }
            }
            http.onerror = err => {
                console.error("GET ERROR", err)
                resolve(null)
            };
            http.send()
        })
    }
    public post(Url: string, data = null) {
        return new Promise<{ code: CODE, msg: any } | any>((resolve) => {
            if (BuildSetting.kPlatformSDK == SDKType.ZfbSDK
                || BuildSetting.kPlatformSDK == SDKType.TbSDK) {
                this.Getenv.request({
                    // 你的服务器地址
                    url: Url,
                    method: "POST",
                    dataType: "json",
                    data: data,
                    success: res => {
                        console.log(`${Url} 返回`, res?.data)
                        resolve(res?.data)
                    },
                    fail: err => {
                        console.log('request 请求失败', err)
                        resolve(null)
                    }
                })
            } else {
                let http = new XMLHttpRequest()
                http.open("post", Url, true)
                http.timeout = 5000;
                http.responseType = "text";
                http.setRequestHeader("Content-Type", "application/json");

                http.onload = () => {
                    if (http.response) {
                        let msg: { code: CODE, msg: string } = http.response;
                        try {
                            if (typeof msg == "string")
                                msg = JSON.parse(msg)
                            console.log(`${Url} 返回`, msg)
                            resolve(msg)
                        } catch (error) {
                            console.error(`${Url} post 错误 返回:`, msg)
                            console.error("请求数据:", data)
                            resolve(null)
                        }
                    }
                    else {
                        // this.ShowTips("请求错误 请稍后再试")
                        console.error("post 错误2", http.statusText)
                        resolve(null)
                    }
                }
                http.onerror = err => {
                    console.error("POST ERROR", err)
                    resolve(null)
                };
                if (data)
                    http.send(JSON.stringify(data))
                else
                    http.send("{}")
            }
        })
    }

    /**  清理玩家    */
    public ClearData() {
        this.Record.Clear()
        game.emit(SDKEvent.KCleData);
    }

    /**  直接退出    */
    public Exit() {
        if (this.Getenv) {
            if (BuildSetting.kPlatformSDK == SDKType.VivoSDK)
                qg.exitApplication()
            else if (BuildSetting.kPlatformSDK == SDKType.OPPOSDK
                || BuildSetting.kPlatformSDK == SDKType.HuaWeiSDK
                || BuildSetting.kPlatformSDK == SDKType.XiaomiSDK)
                this.Getenv.exitApplication({})
            else if (BuildSetting.kPlatformSDK == SDKType.MeizuSDK)
                mz.exitGame && mz.exitGame()
            else if (BuildSetting.kPlatformSDK == SDKType.BaiduSDK)
                this.Getenv.exit()
            else
                this.Getenv.exitMiniProgram({})
        } else
            window.close()
    }

    /** 重启 */
    public Restart() {
        if (this.Getenv) {
            if (this.Getenv.restartMiniProgramSync)
                this.Getenv.restartMiniProgramSync()
            else if (this.Getenv.restartMiniProgram)
                this.Getenv.restartMiniProgram()
            else
                this.Exit()
        } else {
            window.location.reload();
        }
    }

    /**  更多游戏 */
    public OpenMore() {
        if (BuildSetting.kPlatformSDK == SDKType.QQSDK
            || BuildSetting.kPlatformSDK == SDKType.WxSDK)
            this.ShowCustom_TrgAd()
        else if (BuildSetting.kPlatformSDK == SDKType.OPPOSDK)
            this.ShowGamePortalAd()
        else if (BuildSetting.kPlatformSDK == SDKType.ToutiaoSDK)
            this.navigateToMiniGame()
        else if (BuildSetting.kPlatformSDK == SDKType.ApkSDKOPPO)
            this.OpenMoreGame()
    }

    /** 安卓退出 */
    public Back() { }
    /** OPPOAPP  更多 */
    public OpenMoreGame() { }

    protected IsClickStart = false
    /** OPPO 点击游戏开始 */
    public ClickStart() {
        if (BuildSetting.kPlatformSDK != SDKType.OPPOSDK) return
        if (this.IsClickStart) return
        this.IsClickStart = true
        this.Getenv.reportMonitor('beign_click_btn', 0)
    }

    /** 是否支持跳转 */
    public get IsSupportToMiniGame() {
        if (BuildSetting.kPlatformSDK == SDKType.ToutiaoSDK) {
            if (sys.os != sys.OS.ANDROID)
                return false
            if (!this.Getenv.showMoreGamesModal)
                return false
            return true
        }
        return false
    }

    /**  游戏互推 跳转到其他    */
    public navigateToMiniGame() {
        if (BuildSetting.kPlatformSDK == SDKType.ToutiaoSDK)
            this.Getenv.showMoreGamesModal({ appLaunchOptions: [] });
        // else if (BuildSetting.kPlatformSDK == SDKType.WxSDK)
        //     this.Getenv.navigateToMiniProgram({
        //         appId: data.appid,
        //         path: data.page,
        //         success: res => {
        //             console.log(`跳转成功 appid:${data.appid}`)
        //         }, fail: err => {
        //             console.error(`跳转失败 appid:${data.appid}`)
        //         }
        //     })
    }

    /** 是否已经创建桌面图标  */
    public hasAddIcon() {
        return new Promise<boolean>((resolve) => {
            if (!this.SupportAddIcon)
                return resolve(false)

            if (BuildSetting.kPlatformSDK == SDKType.OPPOSDK
                || BuildSetting.kPlatformSDK == SDKType.VivoSDK
                || BuildSetting.kPlatformSDK == SDKType.HuaWeiSDK
                || BuildSetting.kPlatformSDK == SDKType.XiaomiSDK) {
                qg.hasShortcutInstalled({
                    success: (res) => {
                        // 判断图标未存在时，创建图标
                        console.log("是否已经创建桌面图标 success:" + JSON.stringify(res))
                        resolve(res)
                    },
                    fail: (err) => {
                        console.log("是否已经创建桌面图标 fail:" + JSON.stringify(err))
                        resolve(false)
                    }
                })
            }
            else if ((BuildSetting.kPlatformSDK == SDKType.ToutiaoSDK && sys.os == sys.OS.ANDROID)
                || BuildSetting.kPlatformSDK == SDKType.KsSDK && sys.os == sys.OS.ANDROID
                || BuildSetting.kPlatformSDK == SDKType.BlBlSDK) {
                //抖音/快手 仅在Android上支持
                if (this.Getenv.checkShortcut) {
                    this.Getenv.checkShortcut({
                        success: res => {
                            // console.log("检查快捷方式 success:" + JSON.stringify(res));
                            if (BuildSetting.kPlatformSDK == SDKType.KsSDK)
                                resolve(!!res.installed)
                            else if (BuildSetting.kPlatformSDK == SDKType.ToutiaoSDK) {
                                if (!res.status.exist || res.status.needUpdate)
                                    resolve(false)
                                else
                                    resolve(true)
                            } else if (BuildSetting.kPlatformSDK == SDKType.BlBlSDK)
                                resolve(!!res.status.exist)
                        },
                        fail: err => {
                            // console.log("检查快捷方式 fail:" + JSON.stringify(err));
                            resolve(false)
                        },
                    });
                }
                else
                    resolve(false)
            } else
                resolve(false)
        })
    }
    protected AddIcontime = 0;
    /** 请求添加Icon */
    public AddIcon() {
        return new Promise<boolean>(async (resolve, reject) => {
            if (!this.SupportAddIcon) {
                this.ShowTips("当前环境不支持添加快捷方式")
                resolve(false)
            }
            // const now = Date.now()
            // if (now - this.AddIcontime < 0) {
            //     this.ShowTips("请求太频繁")
            //     return resolve(false)
            // }
            // this.AddIcontime = now + 5000

            else if (await this.hasAddIcon())
                resolve(true)
            else if (BuildSetting.kPlatformSDK == SDKType.OPPOSDK
                || BuildSetting.kPlatformSDK == SDKType.VivoSDK
                || BuildSetting.kPlatformSDK == SDKType.HuaWeiSDK
                || BuildSetting.kPlatformSDK == SDKType.XiaomiSDK) {
                qg.installShortcut({
                    success: res => {
                        // 执行用户创建图标奖励
                        console.log("创建桌面图标 success " + JSON.stringify(res))
                        resolve(true)
                    },
                    fail: err => {
                        console.log("创建桌面图标 fail " + JSON.stringify(err))
                        resolve(false)
                    }
                })
            }
            else if ((BuildSetting.kPlatformSDK == SDKType.ToutiaoSDK && this.Douyin)
                || BuildSetting.kPlatformSDK == SDKType.KsSDK
                || BuildSetting.kPlatformSDK == SDKType.BlBlSDK) {
                this.Getenv.addShortcut({
                    success: res => {
                        console.log("添加桌面成功:" + JSON.stringify(res));
                        resolve(true)
                    },
                    fail: err => {
                        console.log("添加桌面失败:" + JSON.stringify(err));
                        resolve(false)
                    }
                });
            }
            else
                resolve(true)
        })
    }

    /**  设置剪    */
    public setClipboardData(str: string) {
        if (this.Getenv && this.Getenv.setClipboardData)
            this.Getenv.setClipboardData({ data: str })
    }

    /**  跳转平台运营    */
    public openActivity() { }
    /**  上报排行榜    */
    public UpdateRank(score) {
        if (!this.Getenv) return
        if (!this.Getenv.setUserCloudStorage) return;
        const now = Date.now()
        if (BuildSetting.kPlatformSDK == SDKType.QQSDK)
            this.Getenv.setUserCloudStorage({
                KVDataList: [{
                    key: "buildpro",
                    value: JSON.stringify({
                        qqgame: {
                            score: score,
                            update_time: now
                        }
                    })
                }],
                success: () => console.log('排行榜 上传成功'),
                fail: () => console.error('排行榜 上传失败')
            })
        else if (BuildSetting.kPlatformSDK == SDKType.WxSDK && this.compareVersion("1.9.92"))
            this.Getenv.setUserCloudStorage({
                KVDataList: [{
                    key: "buildpro",
                    value: JSON.stringify({
                        wxgame: {
                            score: score,
                            update_time: now
                        }
                    })
                }],
                success: () => console.log('排行榜 上传成功'),
                fail: () => console.error('排行榜 上传失败')
            })
        else if (BuildSetting.kPlatformSDK == SDKType.ToutiaoSDK && this.compareVersion("1.11.0"))
            this.Getenv.setUserCloudStorage({
                KVDataList: [{
                    key: "buildpro",
                    value: JSON.stringify({
                        ttgame: {
                            score: score,
                            update_time: now
                        }
                    })
                }],
                success: () => console.log('排行榜 上传成功'),
                fail: () => console.error('排行榜 上传失败')
            })
    }


    /**  显示排行榜    */
    public Rank(shareTicket = null) {
        if (BuildSetting.kPlatformSDK == SDKType.QQSDK
            || BuildSetting.kPlatformSDK == SDKType.WxSDK) {
            //RankUI.Ins.visible = true
            this.Getenv.postMessage({
                type: 0,
                //shareTicket: shareTicket,
                nickName: this.nickname,
                avatarUrl: this.avatarUrl,
                openId: this.openId,
            })
        }
    }

    /**  添加    */
    public addColorSign() {
        if (BuildSetting.kPlatformSDK != SDKType.QQSDK) return
        if (this.Getenv.isColorSignExistSync()) return
        this.Getenv.addColorSign && this.Getenv.addColorSign()
    }
    /**  添加到最近浏览    */
    public addRecentColorSign() {
        if (BuildSetting.kPlatformSDK != SDKType.QQSDK) return
        if (!this.Getenv.addRecentColorSign) return
        const Fun = () => {
            if (this.UserInfo.authSetting['scope.recentColorSign'])
                this.Getenv.addRecentColorSign()
            else
                this.Getenv.authorize({
                    scope: 'scope.recentColorSign',
                    success: res =>
                        //判断是否已在彩签内   只支持 this.Getenv.addColorSign 添加的彩签
                        this.Getenv.addRecentColorSign()
                })
        }
        if (this.UserInfo.authSetting)
            Fun()
        else
            //可以通过 this.Getenv.getSetting 先查询一下用户是否授权了 "scope.record" 这个 scope
            this.Getenv.getSetting({
                success: res => {
                    this.UserInfo.authSetting = res.authSetting
                    Fun()
                }
            })
    }

    /**  消息    */
    public subscribeAppMsg(tmplId) { }
    /**  手Q 添加收藏，基础库1.19.0版本开始支持（其中 ios 小游戏从 QQ 客户端 8.4.8 版本开始支持；安卓小游戏需要到 QQ 客户端 8.4.10 开始支持 */
    public addToFavorites() {
        if (BuildSetting.kPlatformSDK != SDKType.QQSDK) return
        this.Getenv.addToFavorites({
            // title: '添加收藏标题',
            // imageUrl: '',
            // query: 'a=1&b=2',
            // success: function (res) {
            //     console.log('addToFavorites success', res)
            // },
            // fail: function (err) {
            //     console.log('addToFavorites fail', err)
            // },
            // complete: function (res) {
            //     console.log('addToFavorites info', res)
            // }
        })
    }

    /**  加载完成的分包    */
    private SubLoadEnd = new Set<string>();
    /**  加载中的分包    */
    private SubLoadIn = new Map<string, (() => void)[]>();

    private SubLoadInCal(url: string) {
        let Cal = this.SubLoadIn.get(url)
        for (const cal of Cal) cal()
        this.SubLoadIn.delete(url);
    }
    /** 加载分包 */
    public loadSubpkg(name: string, Cal: () => void = null, Pro: (pro: number) => void = null) {
        if (!this.Getenv)
            return Cal && Cal()
        if (this.SubLoadEnd.has(name))
            return Cal && Cal()

        if (this.SubLoadIn.has(name)) {
            if (Cal)
                this.SubLoadIn.get(name).push(Cal)
            return
        }
        if (Cal)
            this.SubLoadIn.set(name, [Cal]);
        else
            this.SubLoadIn.set(name, []);


        const loadTask = this.Getenv.loadSubpackage({
            name: name,
            success: res => {
                console.log(`分包加载成功：${name}`)
                this.SubLoadInCal(name)
                this.SubLoadEnd.add(name);
            }
        })

        if (loadTask.onProgressUpdate)
            loadTask.onProgressUpdate(res => {
                Pro && Pro(res.progress);
            });
    }

    private SubpkgPros: { [name: string]: number } = {};
    private SubpkgLen = 0;
    private SubpkgEnd = 0;
    /** 加载多个分包 */
    public loadSubpkgs(names: string[], Cal: () => void = null, Pro: (pro: number) => void = null) {
        if (!this.Getenv)
            return Cal && Cal()
        for (let i = names.length - 1; i >= 0; i--) {
            const name = names[i];
            if (this.SubLoadEnd.has(name))
                names.splice(i, 1)
            else {
                const loadTask = this.Getenv.loadSubpackage({
                    name: name,
                    success: res => {
                        console.log(`分包加载成功：${name}`)
                        if (++this.SubpkgEnd >= this.SubpkgLen)
                            Cal && Cal()
                    }
                })

                if (loadTask.onProgressUpdate)
                    loadTask.onProgressUpdate(res => {
                        this.SubpkgPros[name] = res.progress;
                        let pro = 0;
                        for (const key in this.SubpkgPros)
                            pro += this.SubpkgPros[key]
                        Pro && Pro(pro * .01 / this.SubpkgLen)
                    });
            }
        }
        this.SubpkgLen = names.length;
        if (this.SubpkgLen <= 0)
            Cal && Cal()
    }


    /**  
     * 显示 loading 提示框
     * @param title 提示的内容
     * @param time 默认隐藏时间
       */
    public showLoading(title: string = "加载中", time = 500) {
        if (this.Getenv && this.Getenv.showLoading)
            this.Getenv.showLoading({ title: title, mask: true });
    }

    /** 隐藏 loading 提示 */
    public hideLoading() {
        if (this.Getenv && this.Getenv.hideLoading)
            this.Getenv.hideLoading({});
    }

    /** 微信 拍摄或从手机相册中选择图片或视频    */
    public chooseMedia() {
        return new Promise<string>((resolve) => {
            if (BuildSetting.kPlatformSDK == SDKType.WxSDK && this.Getenv.chooseMedia)
                this.Getenv.chooseMedia({
                    count: 1,
                    mediaType: ['image'],
                    sourceType: ['album', 'camera'],
                    success: res => {
                        const tempFilePath = res.tempFiles.tempFilePath;
                        console.log(res.tempFiles.tempFilePath)
                        resolve(tempFilePath)
                    }, fail: err => {
                        console.error(err)
                        resolve('')
                    }
                })
            else
                resolve('')
        })
    }

    private salex;
    private saley;
    /**  微信 将当前 Canvas 保存为一个临时文件    */
    public toTempFilePath(x, y, width, height) {
        if (BuildSetting.kPlatformSDK != SDKType.WxSDK) {
            console.error("当前平台不支持或者SDK暂未接入")
            return
        }
        // if (!this.salex)
        //     this.salex =  size.width / Laya.stage.width;
        // if (!this.saley)
        //     this.saley = Laya.Browser.height / Laya.stage.height;
        // var canvas = Laya.stage.drawToCanvas(Laya.Browser.width, Laya.Browser.height, 0, 0);
        // canvas['_source'].toTempFilePath({
        //     x: x * this.salex,
        //     y: y * this.saley,
        //     width: width * this.salex,
        //     height: height * this.saley,
        //     destWidth: width,
        //     destHeight: height,
        //     success: (res) => {
        //         res.tempFilePath
        //         // this.Getenv.shareAppMessage({
        //         //     imageUrl: res.tempFilePath
        //         // })
        //     }
        // })
    }

    /** 保存图片到系统相册 */
    public saveImageToPhotosAlbum(filePath: string) { this.UserInfo.saveImageToPhotosAlbum(filePath); }

    /**  微信进入客服会    */
    openCustomerServiceConversation(Cal: () => void = null) {
        if (BuildSetting.kPlatformSDK == SDKType.WxSDK)
            wx.openCustomerServiceConversation({
                sessionFrom: BuildSetting.ShareGameName,
                showMessageCard: true,
                sendMessageTitle: BuildSetting.ShareGameName,
                // sendMessageImg: BuildSetting.ShareimageUrl,
                success: res => {
                    console.log("进入客服会话成功", res);
                    Cal && Cal();
                }
            })
    }

    /**  跳转到 侧边栏(抖音) / 将小游戏设为常用(快手) */
    public navigateToScene() {
        return new Promise<boolean>(async (resolve) => {
            if (await this.Limit()) {
                if (BuildSetting.kPlatformSDK == SDKType.ToutiaoSDK || BuildSetting.kPlatformSDK == SDKType.BlBlSDK) {
                    this.Getenv.navigateToScene({
                        scene: "sidebar",
                        success: (res) => {
                            console.log("进入侧边栏成功", JSON.stringify(res));
                            resolve(true);
                        },
                        fail: err => {
                            console.error("进入侧边栏失败", JSON.stringify(err))
                            resolve(false);
                        }
                    })
                }
                // else if (BuildSetting.kPlatformSDK == SDKType.KsSDK) {
                //     //将小游戏设为常用
                //     this.Getenv.addCommonUse({
                //         success: (res) => {
                //             console.log("将小游戏设为常用", JSON.stringify(res))
                //             this.ShowTips("已添加至侧边栏-小程序");
                //             resolve(true);
                //         },
                //         fail: err => {
                //             console.log("将小游戏设为常用", JSON.stringify(err))
                //             this.ShowTips("添加失败");
                //             resolve(false);
                //         }
                //     });
                // }
                else if (BuildSetting.kPlatformSDK == SDKType.DummySDK)
                    resolve(true);
                else
                    resolve(false);
            }
            else
                resolve(false);
        })
    }

    /**  是否已经将小游戏设为常    */
    // public async checkCommonUse() {
    //     return new Promise<boolean>((resolve) => {
    //         if (BuildSetting.kPlatformSDK == SDKType.KsSDK)
    //             this.Getenv.checkCommonUse({
    //                 success: res => {
    //                     console.log("是否已经将小游戏设为常用", JSON.stringify(res))
    //                     if (res.isCommonUse)
    //                         resolve(true);
    //                     else
    //                         resolve(false);
    //                 },
    //                 fail: err => {
    //                     console.log("是否已经将小游戏设为常用", JSON.stringify(err))
    //                     resolve(false);
    //                 }
    //             });
    //         else if (BuildSetting.kPlatformSDK == SDKType.DummySDK)
    //             resolve(true);
    //         else
    //             resolve(false);
    //     })
    // }




    /** 抖音直玩订阅 */
    public FeedSubscribe() {
        if (!this.Douyin) return
        if (!this.Getenv.checkFeedSubscribeStatus) return
        if (!this.Getenv.requestFeedSubscribe) return

        this.unschedule(this.savetime)
        /**  查询用户直玩订阅的授权情    */
        this.Getenv.checkFeedSubscribeStatus({
            type: "play",
            scene: 1,
            success: res => {
                console.log(`[查询Feed] 成功:` + JSON.stringify(res));
                if (res.status) {
                    this.savetime()
                    this.schedule(this.savetime, 60)
                } else {
                    /**  向用户请求授权，允许游戏在满足一定的条件后出现在 Feed 流    */
                    this.Getenv.requestFeedSubscribe({
                        scene: 1,
                        contentIDs: this.content_id,
                        type: "play",
                        success: res => {
                            console.log(`[Feed] 授权成功:` + JSON.stringify(res))
                            this.savetime()
                            this.schedule(this.savetime, 60)
                        },
                        fail: err => {
                            console.log(`[Feed] 授权失败:` + JSON.stringify(err))
                        }
                    })
                }
            },
            fail: err => {
                console.log(`[查询Feed] 失败:` + JSON.stringify(err))
            },
        })
    }

    /** 保存上次在线时 */
    protected savetime() {
        this.post("https://childbirth.wqmss.online:5510/FeedSubscribe/savetime/", { openId: this.openId })
    }


    /** game_addiction关键行为 */
    Game_addiction() {
        if (!this.clickid) return
        if (this.geinit) return

        this.post("https://analytics.oceanengine.com/api/v2/conversion", {
            event_type: "game_addiction", //事件类型：active激活  game_addiction关键行为  active_register//注册
            context: {
                ad: {
                    callback: this.clickid,//callback 这里需要填写的就是从启动参数里获取的 clickid
                }
            },
            properties: {
                age: 12   //这里就是附加属性
            },
            timestamp: Date.now()
        })
    }

    /** active_register注册 */
    async Game_register() {
        if (!this.clickid) return
        if (this.geinit) return

        const now = Date.now()
        if (!this.GetStorage("register")) {
            this.SetStorage("register", "true")
            // 注册
            await this.post("https://analytics.oceanengine.com/api/v2/conversion", {
                event_type: "active_register", //事件类型：active激活  game_addiction关键行为  active_register//注册
                context: {
                    ad: {
                        callback: this.clickid,//callback 这里需要填写的就是从启动参数里获取的 clickid
                    }
                },
                properties: {
                    age: 12   //这里就是附加属性
                },
                timestamp: now
            })
        }

        // 激活
        this.post("https://analytics.oceanengine.com/api/v2/conversion", {
            event_type: "active", //事件类型：active激活  game_addiction关键行为  active_register//注册
            context: {
                ad: {
                    callback: this.clickid,//callback 这里需要填写的就是从启动参数里获取的 clickid
                }
            },
            properties: {
                age: 12   //这里就是附加属性
            },
            timestamp: now
        })
    }


    /** 意见反馈页面按钮 */
    public FeedbackButton
    /** 打开意见反馈页 */
    public ShowFeedback(node?: Node) { }
    /** 关闭意见反馈页 */
    public HideFeedback() { }
}