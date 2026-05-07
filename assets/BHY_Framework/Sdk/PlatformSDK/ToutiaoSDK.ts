import { Node } from "cc";
import BuildSetting from "../BuildSetting";
import SDKWrapped from "../SDKWrapped";

export default class ToutiaoSDK extends SDKWrapped {

    /**  视频广告id  */
    Videoid = ""
    /**  插屏i    */
    Insertid = ""
    /**  Banner告    */
    Bannerid = ""


    public get Getenv() { return tt as any }
    public get SupportShare() {
        switch (this.SystemInfo.appName) {
            //今日头条
            case "Toutiao": return true;
            //抖音（国内版)
            case "Douyin": return true;
            //抖音（极速版）
            case "douyin_lite": return true;
            //今日头条（极速版) 
            case "news_article_lite": return true;
            //抖音火山版
            case "aweme_hotsoon": return true;
            //西瓜
            case "XiGua": return true;
            //皮皮虾
            case "PPX": return true;

            default: return false
        }
    }

    public get SupportAddIcon() {
        if (this.Douyin)
            if (this.Getenv.addShortcut)
                return true;
        return false;
    }
    public async Limit() {
        if (this.Douyin && this.Getenv.navigateToScene)
            return true
        else
            return false
    }

    public get Douyin() { return this.SystemInfo.appName == "Douyin" || this.SystemInfo.appName == "douyin_lite" }

    public get SupportFeedback() {
        if (this.Getenv.openFeedback)
            return true
        return false
    }


    public async Init() {
        await super.Init()

        console.log("宿主 APP 名称", this.SystemInfo.appName)

        if (this.Getenv.showFavoriteGuide)
            this.scheduleOnce(() => this.Getenv.showFavoriteGuide({}), 60)

        if (this.Douyin && this.Getenv.onFeedStatusChange)
            this.Getenv.onFeedStatusChange(({ type }) => {
                if (type === 'feedEnter') {
                    console.log('从Feed流进入小游戏')
                }
                if (type === 'feedExit') {
                    console.log('从小游戏退回到Feed流')
                }
            })
        // try {
        //     let envType = tt.getEnvInfoSync().microapp.envType;
        //     console.log("小游戏环境:", envType);
        //     this.develop = envType == "preview"
        //     this.trial = envType == "development"
        //     this.release = envType == "production"
        // } catch (error) { }
    }


    // public Login() {
    //     if (BuildSetting.tt6) {
    //         if (!this.openId) {
    //             return new Promise<void>((resolve) => {
    //                 this.Getenv.login({
    //                     force: true,
    //                     success: async (res: {
    //                         anonymousCode: string
    //                         isLogin: boolean
    //                         code: string
    //                         errMsg: string
    //                     }) => {
    //                         let data = await this.get(`https://minigame.zijieapi.com/mgplatform/api/apps/jscode2session?appid=${BuildSetting.appid}&secret=${BuildSetting.secret}&code=${res.code}&anonymous_code=${res.anonymousCode}`)
    //                         this.openId = data.openid
    //                         resolve()
    //                     }, fail: async err => {
    //                         console.log(`login 调用失败 ${JSON.stringify(err)}`);
    //                         resolve()
    //                     }
    //                 })
    //             })
    //         }
    //     } else
    //         return super.Login()
    // }

    // createBanner() {
    //     if (!this.Getenv.createBannerAd || !this.Bannerid) return
    //     this.AD.DesBanner()
    //     this.AD.BannerAd = this.Getenv.createBannerAd({
    //         adUnitId: this.Bannerid,
    //         style: {
    //             top: Laya.Browser.clientHeight - 117,//72 117psdkt
    //             left: Laya.Browser.clientWidth / 2 - 80,//64  104
    //             width: 208//160  128-208
    //         }
    //     });
    //     this.AD.BannerAd.onResize(this.AD.BanneronResize);
    //     this.AD.BannerAd.onLoad(this.AD.BanneronLoad);
    //     this.AD.BannerAd.onError(this.AD.BanneronError);
    //     Laya.timer.clear(this, this.createBanner)
    //     Laya.timer.once(30000, this, this.createBanner)
    // }
    // /**  显示bann    */
    // public ShowBannerAd() {
    //     this.AD.IsShowBanner = true
    //     if (this.AD.BannerAd)
    //         this.onBannerLoad()
    //     else
    //         this.createBanner()
    // }
    // protected onBannerLoad() {
    //     if (!this.AD.IsShowBanner) return
    //     if (!this.AD.BannerAd) return
    //     this.AD.BannerAd.show()
    // }
    // protected onBannerError(err) {
    //     console.error("Banner广告错误", JSON.stringify(err))
    //     this.AD.DesBanner()
    // }
    // public onBannerResize(res) {
    //     console.log("Banner Resize:" + JSON.stringify(res))
    //     if (!this.AD.BannerAd.style) return
    //     //console.log("Banner style " + JSON.stringify(this.AD.BannerAd.style))
    //     this.AD.BannerAd.style.top = Laya.Browser.clientHeight - res.height
    //     this.AD.BannerAd.style.left = (Laya.Browser.clientWidth - res.width) * 0.5// 水平居中 
    // }

    // HideBannerAd() {
    //     this.AD.IsShowBanner = false
    //     if (!this.AD.BannerAd) return
    //     this.AD.BannerAd.hide()
    // }

    /**  creat    */
    private createInterstitial() {
        if (!this.Getenv.createInterstitialAd || !this.Insertid) return
        this.AD.InterstitialAd = this.Getenv.createInterstitialAd({ adUnitId: this.Insertid })
        this.AD.InterstitialAd.onLoad(this.AD.InteronLoad)
        this.AD.InterstitialAd.onError(this.AD.InteronError)
        this.AD.InterstitialAd.onClose(this.AD.InteronClose)
    }
    /**  显示    */
    public ShowInterstitialAd() {
        if (!this.Getenv.createInterstitialAd || !this.Insertid) return

        this.AD.IsShowInterstitial = true
        if (!this.AD.InterstitialAd)
            this.createInterstitial()
        else if (this.AD.IsLoadInterstitial)
            this.ShowInsert()
        else
            this.AD.InterstitialAd.load()
    }

    protected ShowInsert() {
        if (!this.AD.InterstitialAd) return
        if (!this.AD.IsShowInterstitial) return
        this.AD.IsShowInterstitial = false;
        this.AD.InterstitialAd.show().then(() => {
            console.log("插屏显示成功")
            this.AD.IsLoadInterstitial = false;
        }).catch(err => {
            console.error("插屏显示失败 " + JSON.stringify(err))
        })
    }
    protected onLoadInter() {
        console.log("插屏加载成功")
        this.AD.IsLoadInterstitial = true
        this.ShowInsert()
    }
    protected onErrorInter(err) {
        console.error("插屏 错误" + JSON.stringify(err))
    }
    protected onInterClose() {
        console.log("插屏 关闭")
    }


    public ShowFeedback(node: Node) {
        if (!this.SupportFeedback) return
        this.Getenv.openFeedback({})
    }
}