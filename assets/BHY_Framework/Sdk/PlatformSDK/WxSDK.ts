import { Node, UITransform } from "cc"
import SDKWrapped from "../SDKWrapped"

export default class WxSDK extends SDKWrapped {

    //友盟+数据服务域名 https://umini.shujupie.com

    // 高性能模式
    // "iOSHighPerformance": true,
    // 高性能+模式
    // "iOSHighPerformance+": true,


    /**  视频广告id  */
    public Videoid = "" //6-60秒
    /**  原生模板 广告    */
    public Bannerid = ""
    /**  插屏i    */
    public Insertid = ""


    public get Getenv() { return wx as any }
    public get SupportShare() {
        if (!this.Getenv.shareAppMessage)
            return false
        return true
    }

    public async Limit() { return true }

    /** 是否支持游戏圈 */
    public get SupportClub() {
        if (this.Getenv.createGameClubButton)
            return true
        return false
    }

    public get SupportFeedback() {
        if (this.Getenv.createFeedbackButton)
            return true
        return false
    }
    // wx.login({
    //     success: res => {
    //         let url = `https://api.weixin.qq.com/sns/jscode2session?appid=wxdc6608eb3cbe3658&secret=e9a281f416eb54cb432b05c8d2e64b35&js_code=${res.code}&grant_type=authorization_code`
    //         wx.request({
    //             url: url,
    //             success: res => {
    //                 console.log(res.data)
    //             }
    //         })
    //     }
    // })

    /**  显示banne    */
    public ShowBannerAd() { this.ShowCustomAd() }
    /**  隐藏banne    */
    public HideBannerAd() { this.HideCustomAd() }

    /**  是否受间隔    */
    private InsTime = true;
    /**  creat    */
    private createInterstitial() {
        if (!this.compareVersion("2.6.0")) return
        if (!this.Insertid || !this.Getenv.createInterstitialAd) return
        this.AD.InterstitialAd = this.Getenv.createInterstitialAd({ adUnitId: this.Insertid })
        this.AD.InterstitialAd.onLoad(this.AD.InteronLoad)
        this.AD.InterstitialAd.onError(this.AD.InteronError)
        this.AD.InterstitialAd.onClose(this.AD.InteronClose)
    }

    /**  
     * 显示插屏
     * @param InsTime 是否受间隔限制
     * @returns
       */
    public ShowInterstitialAd(InsTime = true) {
        this.InsTime = InsTime
        if (!this.compareVersion("2.6.0")) return
        if (!this.Insertid || !this.Getenv.createInterstitialAd) return

        let now = Date.now()

        // 在线5分钟后
        if (Math.floor(now * .001) - this.Entertime < 5 * 60) return

        if (this.InsTime && now < this.InsertintervalTime) return

        this.AD.IsShowInterstitial = true
        if (this.compareVersion("2.8.0")) {
            if (!this.AD.InterstitialAd)
                this.createInterstitial()
            else if (this.AD.IsLoadInterstitial)
                this.ShowInsert()
            else
                this.AD.InterstitialAd.load()
        }
        else {
            this.DesInter()
            this.createInterstitial()
        }
    }
    protected ShowInsert() {
        if (this.AD.IsShowVideoIn) return;
        if (!this.AD.InterstitialAd) return;
        if (!this.AD.IsShowInterstitial) return;
        this.AD.IsShowInterstitial = false;
        this.AD.InterstitialAd.show().then(() => {
            if (this.InsTime)
                this.InsertintervalTime = Date.now() + this.AD.chaping_time;
            this.AD.IsLoadInterstitial = false
        })
    }
    protected onLoadInter() {
        this.AD.IsLoadInterstitial = true
        this.ShowInsert()
    }
    protected onErrorInter(err) { this.DesInter() }
    protected onInterClose() { }

    protected DesInter() {
        this.AD.IsLoadInterstitial = false;
        this.AD.IsShowInterstitial = false;
        if (this.AD.InterstitialAd) {
            this.AD.InterstitialAd.offLoad(this.AD.InteronLoad)
            this.AD.InterstitialAd.offError(this.AD.InteronError)
            this.AD.InterstitialAd.offClose(this.AD.InteronClose)
            if (this.compareVersion("2.8.0"))
                this.AD.InterstitialAd.destroy()
            delete this.AD.InterstitialAd
        }
    }


    //#region 
    // 缩放建议（单格子）
    // 常规样式默认画布为 60×104 像素
    // 卡片样式默认画布为 68×106 像素
    // 可在编辑器自定义修改 80-100% 
    /**  原生    */
    protected CustomAd
    protected CustomonLoad
    protected CustomonError
    protected CustomonClose
    /**  是否能显示 原生    */
    protected IsShowCustomAd = false
    /**  创建 原生    */
    protected createCustom() {
        if (!this.compareVersion("2.11.1")) return
        if (!wx.createCustomAd || !this.Bannerid) return
        this.DesCustom()
        if (!this.CustomonLoad) {
            this.CustomonLoad = this.onCustomLoad.bind(this);
            this.CustomonError = this.onCustomError.bind(this);
            this.CustomonClose = this.onCustomClose.bind(this);
        }

        // 375×120
        // let width = 375
        this.CustomAd = wx.createCustomAd({
            adUnitId: this.Bannerid,
            // adIntervals: 30,
            style: {
                top: this.SystemInfo.screenHeight - (120 * this.SystemInfo.screenWidth / 375),
                left: 0,
                width: this.SystemInfo.screenWidth,
                fixed: true // fixed 只适用于小程序环境
            }
        })

        this.CustomAd.onLoad(this.CustomonLoad)
        this.CustomAd.onError(this.CustomonError)
        this.CustomAd.onClose(this.CustomonClose)

        this.unschedule(this.createCustom)
        this.scheduleOnce(this.createCustom, 30)
    }

    public ShowCustomAd() {
        if (!this.compareVersion("2.11.1")) return
        if (!wx.createCustomAd || !this.Bannerid) return
        this.IsShowCustomAd = true

        if (this.CustomAd)
            this.onCustomLoad()
        else
            this.createCustom()
    }

    protected onCustomLoad() {
        // console.log('原生模板 加载成功')
        if (!this.IsShowCustomAd) return
        if (!this.CustomAd) return
        if (this.CustomAd.isShow()) return
        try {
            this.CustomAd.show()
                .then(() => {
                    // console.log('原生模板 显示成功')
                    if (!this.IsShowCustomAd)
                        this.HideCustomAd()
                })
        } catch (error) { }
    }
    protected onCustomError(err) {
        // console.error('原生模板 错误' + JSON.stringify(err))
        this.DesCustom()
    }
    protected onCustomClose() {
        // console.log('原生模板 关闭')
        this.DesCustom()
    }
    public HideCustomAd() {
        this.IsShowCustomAd = false
        if (!this.CustomAd) return
        if (!this.CustomAd.isShow()) return
        this.CustomAd.hide()
    }

    protected DesCustom() {
        if (this.CustomAd) {
            this.CustomAd.offLoad(this.CustomonLoad)
            this.CustomAd.offError(this.CustomonError)
            this.CustomAd.offClose(this.CustomonClose)
            this.CustomAd.hide()
            this.CustomAd.destroy()
            delete this.CustomAd
            this.CustomAd = null
        }
    }
    //#endregion


    //   /**  游戏对局回放分享    */
    //   private GameRecorderShareButton
    //   public ShowGameRecorderShareButton(y) {
    //       if (!this.GameRecorderShareButton) {
    //           this.GameRecorderShareButton = this.Getenv.createGameRecorderShareButton({
    //               style: {
    //                   left: Laya.Browser.clientWidth * .5 - 86,//x / this.Wscale,	//number	0	否	左上角横坐标，单位 逻辑像素
    //                   top: (y - 12) / this.scale,	//number	0	否	左上角纵坐标，单位 逻辑像素
    //                   height: 40,	// w 172   number	40	否	按钮的高度，最小 40 逻辑像素 
    //                   color: "#3d4546",	//string	#ffffff	否	文本的颜色。 
    //               },
    //           })
    //           //监听游戏对局回放分享按钮的点击事件。只有当分享由于非用户取消的原因失败时，该事件的回调函数才会执行。
    //           // this.GameRecorderShareButton.onTap(res => {
    //           //     console.error("分享按钮的点击事件", res)
    //           // })
    //       }
    //       this.GameRecorderShareButton.show()
    //   }
    //   /**  隐藏 微信游戏对局回放分享    */
    //   public HideGameRecorderShareButton() {
    //       if (this.GameRecorderShareButton)
    //           this.GameRecorderShareButton.hide()
    //   }

    /** 显示游戏圈 */
    public ShowGameClubButton(node: Node) {
        if (!this.SupportClub) return

        if (!this.ClubButton) {
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

            console.log("创建游戏圈按钮:", x, y, w, h)

            this.ClubButton = this.Getenv.createGameClubButton({
                type: "text",
                // icon: "light",//"light",//'green',
                text: "",
                style: {
                    left: x,
                    top: y,
                    width: w,
                    height: h,
                }
            })
            // this.ClubButton.onTap(res => {
            // console.log("游戏圈按钮的点击事件", res)
            // })
        }
        // green	绿色的图标
        // white	白色的图标
        // dark	有黑色圆角背景的白色图标
        // light	有白色圆角背景的绿色图标
        // if (this.Club_show) return
        // this.Club_show = true 
        this.ClubButton?.show()
    }
    /** 隐藏游戏圈 */
    public HideGameClubButton() {
        // if (!this.Club_show) return
        // this.Club_show = false
        this.ClubButton?.hide()
    }


    public ShowFeedback(node: Node) {
        if (!this.SupportFeedback) return

        if (!this.FeedbackButton) {
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

            console.log("创建打开意见反馈页面的按钮:", x, y, w, h)

            this.FeedbackButton = this.Getenv.createFeedbackButton({
                type: 'text',
                text: '',
                style: {
                    left: x,
                    top: y,
                    width: w,
                    height: h,
                }
            })
        }
        this.FeedbackButton.show()
    }

    public HideFeedback() {
        this.FeedbackButton && this.FeedbackButton.hide()
    }
} 