import { game } from "cc"
import SDKInfo from "../../FrameConfig/FrameData"
import BuildSetting from "../BuildSetting"
import { SDKType } from "../data/SDKType"
import { EportVideo } from "../Eport"
import { SDK } from "../SDK"
import SDKServer from "../SDKServer"
import { SDKEvent } from "./SDKEvent"

export class SDKAD {
    /**  视频广告实例  */
    public RewardedVideoAd
    /**  视频加载回    */
    public VideoonLoad
    /**  视频错误回    */
    public VideoonError
    /**  视频关闭回    */
    public VideoonClose
    /**  视频 是否成功    */
    private IsLoadVideo = false;
    /**  视频 能否    */
    public IsShowVideo = false;
    /**  视频 是否显    */
    public IsShowVideoIn = false;


    /**  插屏     */
    public InterstitialAd: QGInsertAd
    /**  插屏加载回    */
    public InteronLoad
    /**  插屏错误回    */
    public InteronError
    /**  插屏 关闭回    */
    public InteronClose
    /**  插屏是否成功    */
    public IsLoadInterstitial = false
    /**  是否能展示    */
    public IsShowInterstitial = false
    /**  是否显示插    */
    private IsShowInterstitialIn = false


    /**  banner广告实    */
    public BannerAd: QGBannerAd
    /**  banner尺寸回    */
    private BannerSize
    /**  banner尺寸回    */
    public BanneronResize
    /**  banner加载回    */
    public BanneronLoad
    /**  banner错误回    */
    public BanneronError
    /**  是否能显示bann    */
    public IsShowBanner = false
    /**  是否显示banne    */
    public IsShowBannerIn = false
    /**  banner Timeo    */
    public bannerTimeout

    /**  banner刷新    */
    public banner_time = 30000;
    /**  原生格子刷新    */
    public native_time = 30000;
    /**  插屏显示间隔时间 6    */
    public chaping_time = 6 * 60000;


    // public NInsertAdUI: NInsertAdUI;
    // public NBannerAdUI: NBannerAdUI;

    /**  预加载原生插屏    */
    public NativeInsert: QGNativeAdLoadItem
    /**  原生插屏    */
    private NativeInsertAd: QGNativeAd;
    /**  原生插屏广告 加载回    */
    public NativeInsertonLoad
    /**  原生插屏广告 错误回    */
    public NativeInsertonError

    /**  预加载原生Img    */
    public NativeImg: QGNativeAdLoadItem
    /**  原生Img    */
    private NativeImgAd: QGNativeAd;
    /**  原生Img广告 加载回    */
    public NativeImgonLoad
    /**  原生Img广告 错误回    */
    public NativeImgonError

    /**  预加载原生Icon    */
    public NativeIcon: QGNativeAdLoadItem
    /**  原生Icon    */
    private NativeIconAd: QGNativeAd;
    /**  原生Icon广告 加载回    */
    public NativeIcononLoad
    /**  原生Icon广告 错误回    */
    public NativeIcononError

    public Init() {
        // this.NInsertAdUI = new NInsertAdUI()
        // this.NBannerAdUI = new NBannerAdUI()
    }

    /**  是否是展示    */
    public VideoSharepoint = false

    public VideoId: EportVideo
    /**  视频C    */
    // private VideoCD: { [VideoId: string]: number } = {};

    public ShowVideoAd(Id: EportVideo, Cbk: (end: boolean) => void = null, v1: string = null) {
        // if (this.IsShowVideo)
        //     return SDK.ShowTips('视频加载中!');//视频还未准备好
        this.VideoId = Id;

        this.IsShowVideo = true;

        game.once(SDKEvent.KShowVideo, () => {
            game.off(SDKEvent.KShowVideo)
            this.IsShowVideo = false;
            if (this.err)
                this.msg && SDK.ShowTips(this.msg);
            else if (this.end)
                game.emit(SDKEvent.KVideoShowEnd);
            else
                SDK.ShowTips('视频未看完');
            game.emit(SDKEvent.VideoHide)
            if (Cbk) {
                Cbk(this.end)
            }
        }, this)
        this.VideoSharepoint = false;
        this.ShowRewardedVideoAd()

        //bilibili 激励视频数据上报 [用户点击观看视频广告时上报]
        if (BuildSetting.kPlatformSDK == SDKType.BlBlSDK)
            SDK.Getenv.reportScene({ sceneId: 1007 });
     

        SDK.eportAnalytics(`ClickVideo${this.VideoId}`, v1)
        SDK.eportAnalytics1(`ClickVideo${this.VideoId}`, v1)

        // if (BuildSetting.tt5) {
        //     //0 拉取 1 曝光 2 完播
        //     tt.mmdAd(1, SDK.Videoid, `Video${this.VideoId}`, 0, res => {
        //         console.log("mmdAd 拉取 callBack:", res)
        //     })
        // } else if (BuildSetting.ks7) {
        //     ZlksSdk.reportActive(ZlKsEventKey.APP_VIDEO_CLICK, ZlKsEventName.APP_VIDEO_CLICK);
        // }
    }

    private async ShowRewardedVideoAd() {
        if (SDK.Getenv) {
            if (BuildSetting.kPlatformSDK == SDKType.ZfbSDK || BuildSetting.kPlatformSDK == SDKType.TbSDK) {
                if (!SDK.Getenv.createRewardedAd || !SDK.Videoid)
                    return this.video_over(true)
            } else {
                if (!SDK.Getenv.createRewardedVideoAd || !SDK.Videoid)
                    return this.video_over(true)
            }

            await this.VideoshowLoading()
            if (BuildSetting.kPlatformSDK == SDKType.WxSDK
                || BuildSetting.kPlatformSDK == SDKType.ZfbSDK
                || BuildSetting.kPlatformSDK == SDKType.TbSDK) {
                if (!this.RewardedVideoAd)
                    this.CreateVideo();
                else if (this.IsLoadVideo)
                    this.VideShowSuc();
                else
                    this.RewardedVideoAd.load();
            }
            else if (BuildSetting.kPlatformSDK == SDKType.KsSDK) {
                if (!this.RewardedVideoAd)
                    this.CreateVideo();
                this.VideShowSuc();
            }
            else {
                if (!this.RewardedVideoAd)
                    this.CreateVideo();

                if (this.IsLoadVideo)
                    this.VideShowSuc();
                else
                    this.RewardedVideoAd.load();
            }
        }
        else {
            await this.VideoshowLoading()
            this.VideShowSuc();
            setTimeout(() => this.video_over(Math.random() > 0.25), 500);
        }
    }

    public CreateVideo() {
        if (!SDK.Videoid) return
        if (this.RewardedVideoAd) return;
        if (SDK.Sid)
            this.RewardedVideoAd = SDK.Getenv.createRewardedVideoAd({ adUnitId: SDK.Videoid, appSid: SDK.Sid });

        else if (BuildSetting.kPlatformSDK == SDKType.ZfbSDK || BuildSetting.kPlatformSDK == SDKType.TbSDK)
            this.RewardedVideoAd = SDK.Getenv.createRewardedAd({ adUnitId: SDK.Videoid });
        // else if (BuildSetting.kPlatformSDK == SDKType.VivoSDK)
        //     this.RewardedVideoAd = SDK.Getenv.createRewardedVideoAd({ posId: SDK.Videoid });
        else
            this.RewardedVideoAd = SDK.Getenv.createRewardedVideoAd({ adUnitId: SDK.Videoid });

        this.RewardedVideoAd.onLoad && this.RewardedVideoAd.onLoad(this.VideoonLoad);
        this.RewardedVideoAd.onError && this.RewardedVideoAd.onError(this.VideoonError);
        this.RewardedVideoAd.onClose && this.RewardedVideoAd.onClose(this.VideoonClose);
        this.IsLoadVideo = BuildSetting.kPlatformSDK == SDKType.ToutiaoSDK;
    }
    /**  视频加载成功    */
    public onLoadVideo() {
        console.log("拉取视频广告成功")
        this.IsLoadVideo = true
        this.VideShowSuc()
    }
    /**  视频错误    */
    public onErrorVideo(err) {
        console.log("视频广告错误:" + JSON.stringify(err))
        this.video_over(false, true)
    }

    /**  视频广告关闭    */
    public async onVideoClose(res: { isEnded: boolean, isCompleted?: boolean }) {
        console.log("视频广告关闭:" + JSON.stringify(res))
        if (BuildSetting.kPlatformSDK == SDKType.HuaWeiSDK) this.RewardedVideoAd.load()
        let ok = false;
        if (res && (res.isEnded || res.isCompleted))
            ok = true;

        await this.video_over(ok);

        ok && SDKServer.Save();
        ok && SDK.Game_addiction();
        ok && SDKInfo.FirstVideoReporting()

       

        // if (SDK.geinit && ok) {
        //     // 引力 激励视频广告观看次数 +1
        //     SDK.ge.userAdd({ $reward_ad_count: 1 });
        // }


        // if (BuildSetting.tt5 && ok) {
        //     //0 拉取 1 曝光 2 完播
        //     tt.mmdAd(1, SDK.Videoid, `Video${this.VideoId}`, 2, res => {
        //         console.log("mmdAd 完播 callBack:", res)
        //     })
        // } else if (BuildSetting.ks7) {
        //     if (ok)
        //         ZlksSdk.reportActive(ZlKsEventKey.APP_VIDEO_SUCCESS, ZlKsEventName.APP_VIDEO_SUCCESS);
        //     else
        //         ZlksSdk.reportActive(ZlKsEventKey.APP_VIDEO_FAILED, ZlKsEventName.APP_VIDEO_FAILED);
        // }
    }

    /**  显示    */
    public VideShowSuc() {
        if (!this.IsShowVideo) return
        console.log("播放视频广告")
        this.ShowSuc();
        if (this.RewardedVideoAd) {
            this.RewardedVideoAd.show();

            // if (BuildSetting.kPlatformSDK == SDKType.ToutiaoSDK) {
            //     if (BuildSetting.tt5) {
            //         //0 拉取 1 曝光 2 完播
            //         tt.mmdAd(1, SDK.Videoid, `Video${this.VideoId}`, 1, res => {
            //             console.log("mmdAd 曝光 callBack:", res);
            //         })
            //     }

            //     this.RewardedVideoAd.show()
            //         .then(() => {
            //             console.log("视频广告 展示成功");
            //             this.ShowSuc();
            //         })
            //         .catch(err => {
            //             console.error("视频广告 展示失败", err)
            //             this.RewardedVideoAd.load()
            //                 .then(() => {
            //                     console.log("视频广告 再次加载成功");
            //                     this.RewardedVideoAd.show()
            //                         .then(() => {
            //                             console.log("视频广告 再次展示成功");
            //                             this.ShowSuc();
            //                         })
            //                         .catch(err => {
            //                             console.error("视频广告 再次展示失败", err)
            //                             this.video_over(false, true)
            //                         })
            //                 })
            //                 .catch(err => {
            //                     console.error("视频广告 再次加载失败", err)
            //                     this.video_over(false, true)
            //                 })
            //         })
            // }
            // else {
            // }
        }
    }

    protected ShowSuc() {
        this.IsShowVideo = false;
        this.IsLoadVideo = false;
        this.IsShowVideoIn = true;
        game.emit(SDKEvent.VideoShow)
        SDK.onHide()
    }

    /**  是否看    */
    private end: boolean
    /**  是否错    */
    private err: boolean
    /**     */
    private msg: string
    /**  
     * 视频完成回调
     * @param end 是否看完
     * @param err 是否错误
     * @param msg 提示
       */
    public video_over(end: boolean, err = false, msg = "视频拉取繁忙，请稍后再试或尝试重启!") {
        return new Promise<void>((resolve) => {
            this.IsShowVideoIn = false;
            this.IsShowVideo = false;
            this.end = end;
            this.err = err;
            this.msg = msg;
            SDK.onShow();
            SDK.scheduleOnce(() => {
                game.emit(SDKEvent.KShowVideo);
                resolve()
            })

        })
    }

    /**  视频加载    */
    public VideoshowLoading() {
        
        return new Promise<void>((resolve) => SDK.scheduleOnce(() => { resolve() }))
    }

    /**  
     * 显示banner  OV华为走这儿  优先原生banner
       */
    public ShowBannerAd() {
        this.HideBannerAd()
        this.IsShowBanner = true
        SDK.ShowBanner()
    }

    /**  销毁bann    */
    public DesBanner() {
        this.IsShowBannerIn = false;
        this.bannerTimeout && clearTimeout(this.bannerTimeout)
        if (this.BannerAd) {
            this.BannerAd.offResize && this.BannerAd.offResize(this.BanneronResize);
            this.BannerAd.offError(this.BanneronError);
            this.BannerAd.offLoad(this.BanneronLoad);
            this.BannerAd.hide()
            this.BannerAd.destroy()
            delete this.BannerAd
        }
    }

    /**  隐藏bann    */
    public HideBannerAd() {
        this.IsShowBanner = false
        this.DesBanner()
    }

    /**  销毁插    */
    public DesInter() {
        this.IsLoadInterstitial = false;
        this.IsShowInterstitial = false;
        if (this.InterstitialAd) {
            this.InterstitialAd.offLoad(this.InteronLoad)
            this.InterstitialAd.offError(this.InteronError)
            this.InterstitialAd.offClose(this.InteronClose)
            this.InterstitialAd.destroy()
            delete this.InterstitialAd
        }
    }
}