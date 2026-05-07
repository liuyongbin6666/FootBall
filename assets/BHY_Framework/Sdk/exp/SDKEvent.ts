
export class SDKEvent {
    /**  头像变化 Event回调  */
    public static readonly KChangeAvatar = "SDKChangeAvatar";
    /**  广告完毕 Event    */
    public static readonly KVideoShowEnd = "SDKVideoShowEnd";
    /**  开局故事视频 Event    */
    public static readonly KStoryVideo = "SDKStoryVideo";
    /**  清理玩家数据 Event    */
    public static readonly KCleData = "SDKCleData";

    /**  加载原生插屏广告 Event    */
    public static readonly KLoadInsertNad = "SDKLoadInsertNad"
    /**  加载原生Ico广告 Event    */
    public static readonly KLoadIconNad = "SDKLoadIconNad"
    /**  加载原生Img广告 Event    */
    public static readonly KLoadImgNad = "SDKLoadImgNad"

    /**  隐藏其他原生    */
    public static readonly KHideNad = "SDKHideNad"

    /**  显示排行榜 Event    */
    public static readonly KShowRank = "SDKShowRank"

    /**  录屏分享 Event    */
    public static readonly KShareRec = "SDKShareRec"

    /**  显示视频 Event    */
    public static readonly KShowVideo = "SDKShowVideo"

    /**  游戏分享 Event    */
    public static readonly KShareGame = "SDKShareGame"

    /**  游戏登录 Event    */
    //public static readonly KLogin = "SDKLogin"

    public static readonly Show = "SDKShow"
    public static readonly Hide = "SDKHide"

    /**  数据    */
    public static readonly StorageErr = "SDKStorageErr"

    /**  配置    */
    public static readonly ConfigErr = "SDKConfigErr"


    /**  显示视频    */
    public static readonly VideoShow = "SDKVideoShow"
    /**  隐藏视频    */
    public static readonly VideoHide = "SDKVideoHide"


    /**  隐藏视频    */
    public static readonly Save = "SDKSave"

    /**  视频下载完    */
    public static readonly SDKDownVideoEnd = "SDKDownVideoEnd"


    /**  授权完    */
    public static readonly SDKauthorize = "SDKauthorize"


    public static readonly SDKSaveData = "SDKSaveData"

    /**  创建授权按    */
    public static readonly SDKcreateUserInfoButton = "SDKcreateUserInfoButton"
 


    public static readonly stopguide = "stopguide"
    public static readonly scaleguide = "scaleguide"


    /** 显示插屏 */
    public static readonly ShowInterstitialAd = "ShowInterstitialAd"

    /** 显示游戏圈 */
    public static readonly ShowGameClubButton = "ShowGameClubButton"
    /** 隐藏游戏圈 */
    public static readonly HideGameClubButton = "HideGameClubButton"


    public static readonly 次日刷新 = "次日刷新"
}