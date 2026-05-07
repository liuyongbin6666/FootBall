
interface Rule {
    version1: {
        switches: {
            checkSwitch: boolean,
            cancelPageShowManual: boolean,
            cancelPageShowAuto: boolean,
            trigger: boolean
        }
    }
    version2: {
        switches: {
            checkSwitch: boolean,
            cancelPageShowManual: boolean,
            cancelPageShowAuto: boolean,
            trigger: boolean
        }
    }
    special: {
        path: string,
        appId: string,
        name: string,
        icon: string,
    }
    all: {
        path: string,
        appId: string,
        name: string,
        icon: string[],
        id: string,
        favorite: string,
    }[]
}

interface LaunchOptionsSync {
    /**  快手游戏启动场景   */
    from: string

    /**  启动小游戏的场    */
    scene: string
    /**  启动小游戏的 query     */
    query: any
    /**  shareTicket，详见获取更多转发    */
    shareTicket: string
    /**  来源信息。从另一个小程序、公众号或 App 进入小程序时返回。否则返回 {}。(参见后文注    */
    referrerInfo: {
        /**  来源小程序、公众号或 App 的 app    */
        appId: string
        /**  来源小程序传过来的数据，scene=1037或1038时    */
        extraData: any

        /**(vivo)参数的来源类型:
            shortcut:桌面图标。
            ad:内部买量渠道。
            ade:外部买量渠道。
            other:其它。 */
        type:string
    }
}

/**  当前帐号    */
interface AccountInfoSync {
    /**  小程序帐号    */
    miniProgram: {
        /**  小程序 app    */
        appId: string
        /**  小程序版本  微信
         * 合法值  
         * develop	开发版	
         * trial	体验版	
         * release	正式版
          */
        envVersion: string
        /**  线上小程序版本号      */
        version: string
    }
    /**  插件帐号信息（仅在插件中调用时包含这一    */
    plugin: {
        appId: string
        version: string
    }
}
/**  微信游戏对局回放分享    */
interface GameRecorderShareButton {
    style: {
        /**  左上角横坐标，单位 逻辑    */
        left?: number
        /**  左上角纵坐标，单位 逻辑    */
        top?: number
        /**  按钮的高度，最小 40 逻辑    */
        height?: number
        /**  文本的颜    */
        color?: string
    }
    /**  图标的 url。支持 http/https 开头的网络资源和 wxfile:// 开头的本地资源。如果不设置则使用默认图    */
    icon?: string
    /**  按钮的背景图片的 url。支持 http/https 开头的网络资源和 wxfile:// 开头的本地资源。如果不设置则使用默认图    */
    image?: string
    /**  按钮的文    */
    text?: string
    /**  对局回放的分享    */
    share?: {
        /**  对局回放背景音乐的地址。必须是一个代码包文件路径或者 wxfile:// 文件路径，不支持 http/https 开头的 url    */
        bgm: string		        //是
        /**  对局回放的剪辑区间，是一个二维数组，单位 ms（毫秒）。[[1000, 3000], [4000, 5000]] 表示剪辑已录制对局回放的 1-3 秒和 4-5 秒最终合成为一个 3 秒的对局回放。对局回放剪辑后的总时长最多 60 秒，即 1 分    */
        timeRange: number[]		//是
        /**  分享的对局回放打开后跳转小游戏的 query    */
        query?: string	    	//否  
        /**  分享的对局回放打开后跳转小游戏的 path （独立分包路径）。详见 小游戏独立分包    */
        path?: string	       	//否  
        /**  对局回放的标题。对局回放标题不能随意设置，只能选择预设的文案模版和对应的参数    */
        title?: Object	       	//否  
        /**  对局回放的按钮。只能选择预设的文案模版    */
        button?: Object	    	//否  	
        /**  对局回放的音量大小，最小 0，最大 1。	2.9    */
        volume?: number         //否  
        /**  对局回放的播放速率，只能设置以下几个值:0.3，0.5，1，1.5，2，2.5，3。其中1表示原速播放，小于1表示减速播放，大于1表示加速播放。	2.9    */
        atempo?: number     	//否  
        /**  如果原始视频文件中有音频，是否与新传入的bgm混音，默认为false，表示不混音，只保留一个音轨，值为true时表示原始音频与传入的bgm混音。	2.10    */
        audioMix?: boolean      //否  
    }
}
interface TempFile {
    x?: number	//0	否	截取 canvas 的左上角横坐标
    y?: number	//0	否	截取 canvas 的左上角纵坐标
    width?: number	//canvas 的宽度	否	截取 canvas 的宽度
    height?: number	//canvas 的高度	否	截取 canvas 的高度
    destWidth?: number	//canvas 的宽度	否	目标文件的宽度，会将截取的部分拉伸或压缩至该数值
    destHeight?: number	//canvas 的高度	否	目标文件的高度，会将截取的部分拉伸或压缩至该数值
    fileType?: string	//png	否	目标文件的类型
    quality?: number	//1.0	否	jpg图片的质量，仅当 fileType 为 jpg 时有效。取值范围为 0.0（最低）- 1.0（最高），不含 0。不在范围内时当作 1.0
    success?(res: { tempFilePath: string })		//否	接口调用成功的回调函数
    fail?(err)		//否	接口调用失败的回调函数
    complete?(res)		//否	接口调用结束的回调函数（调用成功、失败都会执行）
}
interface Canvas {
    /**  画布的    */
    width: number
    /**  画布的    */
    height: number
    /**  将当前 Canvas 保存为一个临时文件。如果使用了开放数据域，则生成后的文件仅能被用于以下接口:wx.saveImageToPhotosAlbum、wx.shareAppMessage、wx.onShareAppMessa    */
    toTempFilePath(object: TempFile)
    toTempFilePathSync(object: Object): string;
    /**  获取画布对象的绘图上    */
    getContext(contextType: string, contextAttributes: Object): RenderingContext

    /**  把画布上的绘制内容以一个 data URI 的格式    */
    toDataURL(): string
}

declare namespace wx {
    export function login(object: any): any;

    export function createBannerAd(object: any): QGBannerAd;
    export function createInterstitialAd(object: any): QGInsertAd;
    /**  获取当前帐号信息。线上小程序版本号仅支持在正式版小程序中获取，开发版和体验版中无法    */
    export function getAccountInfoSync(): AccountInfoSync;

    /**  原生格子    */
    export function createCustomAd(res: {
        /**  广告单元     */
        adUnitId: string
        /**  *广告自动刷新的间隔时间，单位为秒，参数值必须大于等于30（仅对支持自动刷新的模板生    */
        adIntervals?: number
        style: {
            /**  左上角横    */
            left: number
            /**  左上角纵    */
            top: number
            /**  用于设置组件宽度，只有部分模板才支持，如矩阵格子    */
            width?: number
            /**  (只对小程序适用) 原生模板广告组件是否固定屏幕位置（不跟随屏幕滚    */
            fixed?: boolean
        }
    }): void;

    /**  微信游戏对局回放分享    */
    export function createGameRecorderShareButton(res: GameRecorderShareButton): void;

    /**  微信创建游戏圈    */
    export function createGameClubButton(res: {
        type?: string
        text?: string
        icon?: string
        style?: {
            left: number
            top: number
            width: number
            height: number
        }
    }): void;

    export function createCanvas(): Canvas;
    export function shareAppMessage(res): any;


    export function setUserCloudStorage(res): void;


    export function onGyroscopeChange(res): void;
    export function startGyroscope(res): void;
    export function stopGyroscope(res?): void;

    export function chooseMedia(res?): void;
    export function postMessage(res?): void;

    export function saveImageToPhotosAlbum(res?): void;


    export function showLoading(res?): void;
    export function hideLoading(res?): void;

    /**  进入客服会    */
    export function openCustomerServiceConversation(res?): void;


    export function loadFont(res): void;
    /**  创建视    */
    export function createVideo(res): any;

    export function getFileSystemManager(): FS;

    export const env: { USER_DATA_PATH: string }
}