import { game } from "cc";
import BuildSetting from "../BuildSetting";
import { SDKType } from "../data/SDKType";
import { SDK } from "../SDK";
import { SDKEvent } from "./SDKEvent";
export class SDKShare {
    /**  分享时间  */
    private Sharetime: number

    public Show() {
        if (this.Sharetime != null) {
            if (Date.now() - this.Sharetime >= 3500)
                this.Shareend(true)
            else {
                SDK.ShowTips('分享失败,请尝试分享不同的好友或群')
                this.Shareend(false)
            }
        }
        delete this.Sharetime
    }
    public ShareGame(Cbk: (end: boolean) => void = null, query = "") {
        //if ((BuildSetting.kPlatformSDK == SDKType.WxSDK || BuildSetting.kPlatformSDK == SDKType.QQSDK) && Cbk)
        if (Cbk)
            this.Sharetime = Date.now()
        game.once(SDKEvent.KShareGame, () => {
            game.off(SDKEvent.KShareGame)
            Cbk && Cbk(this.end)
        }, this)
        this.Share(query);
    }
    private Share(query = "") {
        if (!SDK.Getenv) {
            SDK.ShowTips("分享成功")
            return this.Shareend(true)
        }
        if (BuildSetting.kPlatformSDK == SDKType.VivoSDK)
            qg.share({
                success: () => this.Shareend(true),
                fail: e => this.Shareend(false)
            });
        else if (BuildSetting.kPlatformSDK == SDKType.M4399SDK)
            gamebox.shareMessageToFriend({
                type: 0, //0： 普通分享 1：邀战分享
                success: res => this.Shareend(true),
                fail: res => this.Shareend(false),
            })
        else if (BuildSetting.kPlatformSDK == SDKType.BlBlSDK)
            SDK.Getenv.shareAppMessage({
                // title: BuildSetting.Sharetitle,
                // subTitle: BuildSetting.ShareGameName,
                imageUrl: BuildSetting.ShareimageUrl,
                biliContent: `${BuildSetting.ShareGameName}，和我一起来玩吧 #小游戏# #${BuildSetting.ShareGameName}#`,
                // biliMessageTitle: BuildSetting.ShareGameName,
                success: () => this.Shareend(true),
                fail: e => this.Shareend(false)
            });
        else if (BuildSetting.kPlatformSDK == SDKType.TbSDK)
            SDK.tbsdk.shareApp({
                title: BuildSetting.Sharetitle,
                desc: BuildSetting.ShareGameName,
                // thumbImgUrl: 'https://gw.alicdn.com/tfs/TB112zbWRr0gK0jSZFnXXbRRXXa-500-500.png'
            }).catch(err => {
                console.log("分享失败", err)
                this.Shareend(false)
            }).then(res => {
                console.log("分享成功", res)
                this.Shareend(true)
            })
        else if (BuildSetting.kPlatformSDK == SDKType.ZfbSDK)
            SDK.Getenv.showSharePanel({
                success: res => console.log("分享成功", res),
                fail: err => console.log("分享失败", err)
            })
        else
            SDK.Getenv.shareAppMessage({
                title: BuildSetting.Sharetitle,
                desc: BuildSetting.ShareGameName,
                imageUrl: BuildSetting.ShareimageUrl,
                success: () => BuildSetting.kPlatformSDK == SDKType.ToutiaoSDK && this.Shareend(true),
                fail: e => BuildSetting.kPlatformSDK == SDKType.ToutiaoSDK && this.Shareend(false)
            });
    }
    private end: boolean;
    private Shareend(end) {
        this.end = end;
        game.emit(SDKEvent.KShareGame)
    }
}