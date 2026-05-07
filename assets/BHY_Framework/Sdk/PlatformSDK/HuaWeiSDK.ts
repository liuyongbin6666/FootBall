import SDKWrapped from "../SDKWrapped";


export default class HuaWeiSDK extends SDKWrapped {


    // com.gzfy.cjwj.mini.huawei 
    // Client Secret: 3e2da0371683fc043d807e3c4db1f9a48c10c7db9c52c3fe27e29c91d8cf0002
    // Developer ID: 30086000583915671

    /**  分包ID   */
    private vest_id = "128665"

    public get Getenv() { return qg }

    /**  是否支持添加快捷方    */
    public get SupportAddIcon() {
        if (qg.hasShortcutInstalled && qg.installShortcut) return true;
        return false;
    }

    // protected login() {
    //#region 
    // qg.gameLogin({
    //     forceLogin: 1, appid: this.appid, success: res => {
    //         // playerId	String	帐号ID，如果游戏不需要华为帐号的登录结果进行鉴权，那么当返回playgerId的时候就可以使用该值进入游戏。
    //         // displayName	String	用户的昵称。
    //         console.log("login success:", JSON.stringify(res));
    //         if (!this.openId || this.openId != res.playerId) {
    //             this.openId = res.playerId
    //         }
    //         if (res.displayName) this.DefName = res.displayName
    //     }, fail: (err, code) => {
    //         console.error("login fail:" + err + ", code:" + code)
    //     }
    // });
    //#endregion

    // qg.gameLoginWithReal({
    //     forceLogin: 1, appid: this.appid, success: res => {
    //         // playerId	String	帐号ID，如果游戏不需要华为帐号的登录结果进行鉴权，那么当返回playgerId的时候就可以使用该值进入游戏。
    //         // displayName	String	用户的昵称。
    //         // hiResImageUri	String	高清头像链接，假如没有设置则为空字符串。
    //         // imageUri	String	头像链接，假如没有设置则为空字符串。
    //         console.log("华为登录成功:", JSON.stringify(res));
    //         if (res.playerId) this.openId = res.playerId
    //         if (res.displayName) this.nickName = res.displayName
    //         //#region 
    //         // qg.getPlayerExtraInfo({
    //         //     transactionId: this.transactionId,
    //         //     success: (res) => {
    //         //         console.log("获取玩家的额外信息成功", JSON.stringify(res));
    //         //         // isAdult	Bolean	用户是否成年
    //         //         // playerId	String	玩家帐户ID，不同华为帐号登录游戏成功后返回的玩家游戏帐户ID
    //         //         // playerDuration	Integer	玩家当天游戏时长
    //         //         // isRealName	Boolean	用户是否实名认证
    //         //         if (res.isAdult)
    //         //     },
    //         //     fail: (data, code) => {
    //         //         console.log("get player ExtraInfo fail:" + data + ", code:" + code);
    //         //     }
    //         // });
    //         //#endregion 



    //         qg.setUnderAgeOfPromise && qg.setUnderAgeOfPromise(false)
    //         qg.requestConsentUpdate && qg.requestConsentUpdate({
    //             success: res => {
    //                 console.log('请求用户意见更新状态 success ' + JSON.stringify(res))
    //                 // consentStatus	number 用户意见状态。
    //                 // 0: 用户已同意接收个性化广告与非个性化广告。
    //                 // 1: 用户已同意仅接收非个性化广告。
    //                 // 2: 用户既未同意接收也未拒绝接收个性化广告或非个性化广告。

    //                 // isNeedConsent	boolean	 是否需要用户确认意见。
    //                 // 取值为false，表明可以向HUAWEI Ads SDK请求个性化广告。
    //                 // 取值为true，表明用户在欧洲经济区内或其他敏感地区，需进一步确认用户意见。

    //                 // AdProviderList	Array	广告技术提供商信息列表。AdProvider对象结构详
    //             },
    //             fail: err => {
    //                 console.log('请求用户意见更新状态 fail ' + JSON.stringify(err))
    //             }
    //         })

    //         qg.setConsentStatus && qg.setConsentStatus(0)

    //     }, fail: (err, code) => {
    //         console.error("华为登录失败:" + err + ", code:" + code)
    //         this.showerrModal("登录失败", "是否重新登录", () => this.login()).Lab.visible = false
    //     }
    // });
    // qg.setTagForChildProtection && qg.setTagForChildProtection(-1)
    // qg.setAdContentClassification && qg.setAdContentClassification('W')
    // qg.setNonPersonalizedAd && qg.setNonPersonalizedAd(0) 
    // } 
}