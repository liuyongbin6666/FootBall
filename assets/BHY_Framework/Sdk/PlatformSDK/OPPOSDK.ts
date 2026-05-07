import SDKWrapped from "../SDKWrapped";


export default class OPPOSDK extends SDKWrapped {


    // com.gzfy.cjwj.nearme.gamecenter
    // appid: 32064853
    // appkey: eaa7l8dajc0GkoCksOC0gwOwG
    // appsecret: e5c0D1Cc85dB834ca58b6C352b552F4a

    /**  分包ID   */
    private vest_id = "128667"

    public get Getenv() { return qg }

    /**  是否支持添加快捷方    */
    public get SupportAddIcon() {
        if (qg.hasShortcutInstalled && qg.installShortcut) return true;
        return false;
    }

    // protected login() {
    //     qg.login({
    //         success: (res) => {
    //             console.log('OPPO登录成功...' + JSON.stringify(res));
    //             //                 {"actualAvatar":"https://ocs-cn-north1.heytapcs.com/titans-usercenter-avatar-bucket-cn/527/867/034/430768725.jpg?20210510183619?v=1620642979000","actualNickName":"Smile1053","age":"22","avatar":"https://ocs-cn-north1.heytapcs.com/titans-usercenter-avatar-
    //             // bucket-cn/527/867/034/430768725.jpg?20210510183619?v=1620642979000","birthday":"946656000000","confirmTransform":"true","constellation":"魔羯座","isTourist":"false","location":"成都市","nickName":"Smile1053","oid":"112252757","phoneNum":"184****7953","sex":"M","token":"TN_UFB2SDE1WVg0WFNPZFlSK2JPdmJCZFcrVlkxQTg5SnE3e
    //             // Ct0UytZTnZ0VWlaTGdweVVWTW85UGlFYTNkbERvdQ","uid":"1071823363","time":1651818867378,"code":0}

    //             //                 {"actualAvatar":"https://ocs-cn-north1.heytapcs.com/titans-usercenter-avatar-bucket-cn/527/867/034/430768725.jpg?20210510183619?v=1620642979000","actualNickName":"Smile1053","age":"22","avatar":"https://ocs-cn-north1.heytapcs.com/titans-usercenter-avatar-
    //             // bucket-cn/527/867/034/430768725.jpg?20210510183619?v=1620642979000","birthday":"946656000000","confirmTransform":"true","constellation":"魔羯座","isTourist":"false","location":"成都市","nickName":"Smile1053","oid":"112252757","phoneNum":"184****7953","sex":"M","token":"TN_UFB2SDE1WVg0WFNPZFlSK2JPdmJCZFcrVlkxQTg5SnE3e
    //             // Ct0UytZTnZ0VWlaTGdweVVWTW85UGlFYTNkbERvdQ","uid":"1071823363","time":1651819824615,"code":0, 

    //             if (res.uid)
    //                 this.openId = res.uid

    //             if (res.actualAvatar)
    //                 this.avatarUrl = res.actualAvatar
    //             else if (res.avatar)
    //                 this.avatarUrl = res.avatar


    //             if (res.actualNickName)
    //                 this.nickname = res.actualNickName
    //             else if (res.nickName)
    //                 this.nickname = res.nickName
    //             // if (res.nickname)
    //             //     this.nickName = res.nickname
    //             // GEvent.Ins.event(SDKEvent.KChangeAvatar) 
    //         }, fail: err => {
    //             console.log('OPPO登录失败...' + JSON.stringify(err));
    //         }
    //     });
    // }

    // public ShowBanner() {
    //     if (!qg.createBannerAd || !this.Bannerid || (this.AD.NBannerAdUI && this.AD.NBannerAdUI.visible)) return
    //     this.AD.BannerAd = qg.createBannerAd({ adUnitId: this.Bannerid, style: {} });
    //     // this.AD.BannerAd.onLoad(this.AD.BanneronLoad);
    //     // this.AD.BannerAd.onError(this.AD.BanneronError);
    //     this.AD.BannerAd.show()
    // }
    // // protected onBannerLoad() { console.log("Banner加载成功") }
    // // protected onBannerError(err) { console.error("Banner广告错误", JSON.stringify(err)) }
    // /**  隐藏bann    */
    // HideBannerAd() {
    //     this.AD.IsShowBanner = false
    //     if (this.AD.NBannerAdUI)
    //         this.AD.NBannerAdUI.Hide()
    //     this.AD.DesBanner()
    // }
    // /**  销毁bann    */
    // protected DesBanner() {
    //     if (this.AD.BannerAd) {
    //         // this.AD.BannerAd.offError(this.AD.BanneronError);
    //         // this.AD.BannerAd.offLoad(this.AD.BanneronLoad);
    //         this.AD.BannerAd.hide()
    //         this.AD.BannerAd.destroy()
    //         delete this.AD.BannerAd
    //         this.AD.BannerAd = null
    //     }
    // }

    // /**  互推盒子横幅    */
    // GameBannerAd = null
    // /**  显示oppo小游戏互推盒子横幅    */
    // ShowGameBannerAd() {
    //     if (!qg.createGameBannerAd || !this.GameBannerid) return
    //     if (this.SystemInfo.platformVersionCode >= 1076) {
    //         this.HideBannerAd()
    //         if (this.GameBannerAd) {
    //             this.GameBannerAd.destroy()
    //             delete this.GameBannerAd
    //             this.GameBannerAd = null
    //         }
    //         this.GameBannerAd = qg.createGameBannerAd({ adUnitId: this.GameBannerid })
    //         this.GameBannerAd.show().catch(err => this.ShowBannerAd())
    //     } else
    //         this.ShowBannerAd()
    // }
    // /**  隐藏oppo小游戏互推盒子横幅    */
    // HideGameBannerAd() { this.GameBannerAd && this.GameBannerAd.hide() }



    // /**  互推九宫格 加载回    */
    // protected GamePortalonLoad
    // /**  互推九宫格 错误回    */
    // protected GamePortalonError
    // /**  互推九宫格 关闭回    */
    // protected GamePortalonClose
    // /**  互推盒子九宫格    */
    // protected GamePortalAd = null
    // /**  互推盒子九宫格    */
    // ShowGamePortalAd() {
    //     if (!qg.createGamePortalAd || !this.GamePortalid) return
    //     if (this.SystemInfo.platformVersionCode < 1076) return
    //     const now = Date.now()
    //     if (now - this.PortalAdCD < 0) return
    //     this.PortalAdCD = now + 1000
    //     //this.HideBannerAd()
    //     if (!this.GamePortalonLoad) {
    //         this.GamePortalonLoad = this.onGamePortalLoad.bind(this);
    //         this.GamePortalonError = this.onGamePortalError.bind(this);
    //         this.GamePortalonClose = this.oGamePortalnClose.bind(this);
    //     }
    //     if (!this.GamePortalAd) {
    //         this.GamePortalAd = qg.createGamePortalAd({ adUnitId: this.GamePortalid })
    //         this.GamePortalAd.onLoad(this.GamePortalonLoad)
    //         this.GamePortalAd.onError(this.GamePortalonError)
    //         this.GamePortalAd.onClose(this.GamePortalonClose)
    //     }
    //     this.GamePortalAd.load()//.then(res =>this.GamePortalAd.show() )
    // }

    // protected onGamePortalLoad() {
    //     console.log("互推九宫格 加载成功")
    //     this.GamePortalAd.show()
    // }
    // protected onGamePortalError(err) {
    //     console.log("互推九宫格 错误 " + JSON.stringify(err))
    //     this.desGamePortal()
    // }
    // protected oGamePortalnClose() {
    //     console.log("互推九宫格 关闭")
    //     this.desGamePortal()
    // }

    // HideGamePortalAd() { this.GamePortalAd && this.GamePortalAd.hide() }
    // protected desGamePortal() {
    //     if (this.GamePortalAd) {
    //         this.GamePortalAd.offLoad(this.GamePortalonLoad)
    //         this.GamePortalAd.offError(this.GamePortalonError)
    //         this.GamePortalAd.offClose(this.GamePortalonClose)
    //         this.GamePortalAd.hide()
    //         this.GamePortalAd.destroy()
    //         delete this.GamePortalAd
    //         this.GamePortalAd = null
    //     }
    // }

    // PlayVideo() {
    //     GEvent.Ins.event(SDKEvent.KStoryVideo, [false])
    //     return
    //     try {
    //         qg.showLoading({ title: 'CG加载中!' })
    //         console.log('createVideo')
    //         this.Video = qg.createVideo({
    //             width: Laya.Browser.clientWidth,
    //             height: Laya.Browser.clientHeight,
    //             src: BuildSetting.Videosrc,
    //             poster: 'Icon.png',
    //             controls: false,
    //             autoplay: true,
    //             enableProgressGesture: false,
    //             showCenterPlayBtn: false
    //         })
    //         this.Video.requestFullScreen()
    //         // this.Video.onWaiting(res => {
    //         //     console.log('CG 加载中', JSON.stringify(res))
    //         // })
    //         this.Video.onPlay(res => {
    //             console.log('CG 开始播放', JSON.stringify(res))
    //             qg.hideLoading({})
    //         })

    //         this.Video.onEnded(res => {
    //             console.log('CG 播放到末尾', JSON.stringify(res))
    //             this.VideoEd()
    //         })
    //         this.Video.onPause(res => {
    //             console.log('CG 暂停', JSON.stringify(res))
    //             this.VideoEd()
    //         })
    //         let Update = null
    //         this.Video.onTimeUpdate(res => {
    //             console.log('CG 播放进度更新' + JSON.stringify(res))
    //             Update = Date.now()
    //         })
    //         let Interval = setInterval(() => {
    //             if (Update && Date.now() - Update > 1000) {
    //                 clearInterval(Interval)
    //                 this.VideoEd()
    //             }
    //         }, 1000)
    //         this.Video.onError(res => {
    //             console.log('CG 错误', JSON.stringify(res))
    //             this.VideoEd()
    //         })
    //         this.Video.play()
    //     } catch (error) {
    //         GEvent.Ins.event(SDKEvent.KStoryVideo, [false])
    //     }
    // }

    // /**  是否已经创建桌面图    */
    // hasAddIcon(Cal: (b: boolean) => void = null) {
    //     qg.hasShortcutInstalled({
    //         success: (res) => {
    //             // 判断图标未存在时，创建图标
    //             console.log("是否已经创建桌面图标 success " + JSON.stringify(res))
    //             Cal && Cal(res)
    //         },
    //         fail: (err) => {
    //             console.log("是否已经创建桌面图标 fail " + JSON.stringify(err))
    //             Cal && Cal(false)
    //         },
    //         complete: () => {
    //             console.log("是否已经创建桌面图标 complete ")
    //         }
    //     })
    // }
    // AddIcon(Cal: (b: boolean) => void = null) {
    //     const now = Date.now()
    //     if (now - this.AddIcontime < 0) return
    //     this.AddIcontime = now + 5000
    //     qg.hasShortcutInstalled({
    //         success: res => {
    //             if (res == false) {
    //                 qg.installShortcut({
    //                     success: () => {
    //                         // 执行用户创建图标奖励
    //                         console.log("创建桌面图标 success " + JSON.stringify(res))
    //                         Cal && Cal(true)
    //                     },
    //                     fail: (err) => {
    //                         console.log("创建桌面图标 fail " + JSON.stringify(err))
    //                         Cal && Cal(false)
    //                     },
    //                     complete: () => {
    //                         console.log("创建桌面图标 complete ")
    //                     }
    //                 })
    //             }
    //         }
    //     })
    // }

    // /**  上报排    */
    // UpdateRank(score) {
    //     if (!this.openId) return
    //     //"appKey = 11 & appSecret = 22 & pkgName = com.oppo.testgame & rankScore = 333 & rankType = 0 & timeStamp = 15281 & userId = 1111111"
    //     let Obj = {
    //         pkgName: this.pkgName,
    //         appKey: this.appkey,
    //         appSecret: this.appsecret,//签名信息	S
    //         userId: this.openId,
    //         rankScore: score,
    //         rankType: 0,
    //         timeStamp: Date.now(),
    //         sign: '',//签名信息
    //     }

    //     let sign = `appKey=${Obj.appKey}&appSecret=${Obj.appSecret}&pkgName=${Obj.pkgName}&rankScore=${Obj.rankScore}&rankType=${Obj.rankType}&timeStamp=${Obj.timeStamp}&userId=${Obj.userId}`
    //     Obj.sign = MD5.md5.hex_md5(sign).toUpperCase()
    //     let senstr = `appKey=${Obj.appKey}&appSecret=${Obj.appSecret}&pkgName=${Obj.pkgName}&rankScore=${Obj.rankScore}&rankType=${Obj.rankType}&timeStamp=${Obj.timeStamp}&userId=${Obj.userId}&sign=${Obj.sign}`

    //     console.log("上报排行榜senstr", senstr)
    //     this.request("https://play.open.oppomobile.com/instant-game-open/rank/update", (err, msg) => {
    //         if (err) {
    //             console.log("上报排行榜 错误事件")
    //         } else {
    //             console.log("上报排行榜", msg)
    //             if (typeof msg == "string") msg = JSON.parse(msg)
    //         }
    //     }, senstr, "post", "text", ["Content-Type", "application/x-www-form-urlencoded"])
    // }
}