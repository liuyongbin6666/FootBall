import { sys } from "cc";
import SDKWrapped from "../SDKWrapped";
export default class KsSDK extends SDKWrapped {
    get Getenv() { return ks }
    get SupportShare() { return true }

    /**  是否支持添加快捷方式   */
    public get SupportAddIcon() {
        if (this.Getenv.addShortcut)
            return true;
        return false;
    }

    public async Limit() {
        return new Promise<boolean>((resolve) => {
            ks.checkSliderBarIsAvailable({
                success: (res) => {
                    console.log("侧边栏调用成功:" + JSON.stringify(res));
                    resolve(!!res?.available)
                },
                fail: (err) => {
                    console.log("侧边栏调用失败:" + JSON.stringify(err));
                    resolve(false)
                },
            })
        })
        // return this.Getenv.addCommonUse ? true : false
    }

    public async Init() {
        await super.Init() 
    }

    protected IntersTime: number
    public ShowInterstitialAd() {
        if (sys.os == sys.OS.IOS) return;

        if (!this.Insertid || !this.Getenv.createInterstitialAd) return
        return
        let now = Date.now()
        if (now < this.IntersTime) return;
        this.IntersTime = now + 60000;

        if (this.AD.InterstitialAd) {
            this.AD.InterstitialAd.destroy()
            delete this.AD.InterstitialAd
        }

        this.AD.InterstitialAd = this.Getenv.createInterstitialAd({ adUnitId: this.Insertid })
        if (this.AD.InterstitialAd) {
            this.AD.InterstitialAd.onError(this.AD.InteronError)
            this.AD.InterstitialAd.onClose(this.AD.InteronClose)
            this.AD.InterstitialAd.show().then(res => {
                console.log(`插屏广告展示成功 ${JSON.stringify(res)}`)
            })
        }
    }

    protected onErrorInter(err) {
        console.error("插屏 错误" + JSON.stringify(err))
        this.AD.InterstitialAd.destroy()
        delete this.AD.InterstitialAd
    }

    protected onInterClose() {
        console.log("插屏 关闭")
        this.AD.InterstitialAd.destroy()
        delete this.AD.InterstitialAd
    }
}