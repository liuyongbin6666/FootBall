//----------------------------------------------------------------------------------------------广告----------------------------------------------------------------------------------------------

interface QGInitAdServiceInput extends QGStandardInput<any> {
    appId: string;
    isDebug: boolean;
}

interface QGCreateAdInput extends QGStandardInput<any> {
    adUnitId?: string;
    posId?: string;
    style?: any,
}

interface QGBannerAd {
    style: { top: number, left: number }

    show(): Promise<any>
    hide()
    destroy()

    onShow(Cal: any);
    offShow(Cal?: any)
    onHide(Cal?: any)
    OffHide(Cal?: any)
    onError(Cal?: any)
    offError(Cal?: any)

    onLoad(Cal?: any)
    offLoad(Cal?: any)

    onResize(Cal?: any)
    offResize(Cal?: any)

    /**  vivo  */
    onClose(Cal?: any)
    onSize(Cal?: any)
    offClose(Cal?: any)
    offSize(Cal?: any)
}

interface Video {
    x?: number	//0	否	视频的左上角横坐标	
    y?: number	//0	否	视频的左上角纵坐标	
    width?: number	//300	否	视频的宽度	
    height?: number	//150	否	视频的高度	
    src: string		//是	视频的资源地址	
    poster?: string		//否	视频的封面	
    initialTime?: number	//0	否	视频的初始播放位置，单位为 s 秒	
    playbackRate?: number	//1.0	否	视频的播放速率，有效值有 0.5、0.8、1.0、1.25、1.5	
    live?: boolean	//false	否	视频是否为直播	
    objectFit?: string	//'contain'	否	视频的缩放模式	
    controls?: boolean	//true	否	视频是否显示控件	
    showProgress?: boolean	//true	否	是否显示视频底部进度条	2.12.0
    showProgressInControlMode?: boolean	//true	否	是否显示控制栏的进度条	2.12.0
    backgroundColor?: boolean	//'#000000'	否	视频背景颜色	2.12.0
    autoplay?: boolean	//false	否	视频是否自动播放	
    loop?: boolean	//false	否	视频是否是否循环播放	
    muted?: boolean	//false	否	视频是否禁音播放	
    obeyMuteSwitch?: boolean	//false	否	视频是否遵循系统静音开关设置（仅iOS）	2.4.0
    enableProgressGesture?: boolean	//true	否	是否启用手势控制播放进度	
    enablePlayGesture?: boolean	//false	否	是否开启双击播放的手势	
    showCenterPlayBtn?: boolean	//true	否	是否显示视频中央的播放按钮	
    underGameView?: boolean	//false	否	视频是否显示在游戏画布之下（配合 Canvas.getContext('webgl', {alpha: true}) 使主屏canvas实现透明效果）
}
interface QGInsertAd {
    load(): Promise<any>;
    show(): Promise<any>;

    onLoad(Cal?: any)
    offLoad(Cal?: any)
    onShow(Cal?: any)
    offShow()
    onError(Cal?: any)
    offError(Cal?: any)
    onClose(Cal?: any)
    offClose(Cal?: any)
    destroy()
}

interface QGVideoAd {
    load(): Promise<any>;
    show(): Promise<any>;

    onLoad(Cal?: any)
    offLoad(Cal?: any)
    onVideoStart(Cal?: any)
    offVideoStart()
    onRewarded(Cal?: any)
    offRewarded()
    onClose(Cal?: any)
    offClose(Cal?: any)
    onError(Cal?: any)
    offError(Cal?: any)
    destroy()
}
interface QGStats {
    mode: number,
    size: number,
    lastAccessedTime: number,
    lastModifiedTime: number,

    isDirectory(): boolean;
    isFile(): boolean;
}
interface QGNativeAdLoadItem {
    /**  广告标识，用来上报曝光与点    */
    adId: string;
    /**  广告标    */
    title: string;
    /**  广告描    */
    desc: string;
    /**  推广应用的Icon图    */
    iconUrlList: string[];
    /**  广告图    */
    imgUrlList: string[];
    /**  “广告”标签图    */
    logoUrl: string;
    /**  点击按钮文本描    */
    clickBtnTxt: string;
    /**  获取广告类型，取值说明：0：无 1：纯文字 2：图片 3：图文混合 4：视    */
    creativeType: number;
    /**  获取广告点击之后的交互类型，取值说明： 0：无 1：浏览类 2：下载类 3：浏览器（下载中间页广告） 4：打开应用首页 5：打开应用详    */
    interactionType: number;
    /**   推广应用的Icon图标(viv    */
    icon: string;
}

interface QGNativeAd {
    load()

    reportAdShow(input: { adId: string })
    reportAdClick(input: { adId: string })
    onLoad(Cal?: any)
    offLoad(Cal?: any)
    onError(Cal?: any)
    offError(Cal?: any)
    destroy()
}



interface QGDownloadFileInputResult {
    tempFilePath: string;
    statusCode: number;
    errCode: string;
    errMsg: number;
}
interface QGDownloadFileInput extends QGStandardInput<QGDownloadFileInputResult> {
    url: string;
    header
    filePath: string;
}



interface QGDownloadProgressCallbackParam {
    taskID: string;
    progress: number;
    totalBytesWritten: number;
    totalBytesExpectedToWrite: number;
}

interface DownloadTask {
    /**  中断下载    */
    abort()
    onProgressUpdate(Cal?: any)
}


interface QGInnerAudioContext {
    src: string;
    autoplay: boolean;
    loop: boolean;
    readonly currentTime: number; //? 文档上是string类型
    volume: number;
    readonly duration: number;
    readonly paused: boolean;
    readonly buffered: number;
    time: number

    /**  播放速度。范围 0.5-2.0，默认为 1。（Android 需要 6 及以上版    */
    playbackRate: number

    play()
    pause()
    stop()
    seek(position: number)
    destroy()

    onCanplay(Cal?: any)
    offCanplay(Cal?: any)
    onPlay(Cal?: any)
    offPlay(Cal?: any)
    onPause(Cal?: any)
    offPause(Cal?: any)
    onStop(Cal?: any)
    offStop(Cal?: any)
    onEnded(Cal?: any)
    offEnded(Cal?: any)
    onTimeUpdate(Cal?: any)
    offTimeUpdate(Cal?: any)
    onError(Cal?: any)
    offError(Cal?: any)
    onWaiting(Cal?: any)
    offWaiting(Cal?: any)
    onSeeking(Cal?: any)
    offSeeking(Cal?: any)
    onSeeked(Cal?: any)
    offSeeked(Cal?: any)
}


interface QGStandardInput<Res> {
    success?(res: Res)
    fail?(err: any)
    complete?(obj: any)
}
interface QGproduct {
    /**  商品名    */
    Name: string,
    /**  商品描    */
    Desc: string,
    /**  商品数    */
    count: number,
    /**  商品价格，以分为单    */
    price: number
}
/**  系统信    */
interface SystemInfo {
    /**  屏    */
    screenWidth: number,//
    /**  屏    */
    screenHeight: number,//	  
    // /**  可使用窗口    */
    // windowHeight: number,//
    // /**  可使用窗口    */
    // windowWidth: number,//  
    /**  操作系统    */
    // system: string,// 

    /**  手Q客户端基础库    */
    SDKVersion: string	//

    //**  **********************************************抖音************************************************************************************
    /**  宿主 APP     */
    appName: string

    /**  当前小游戏运行的宿主环    */
    host: {
        /**  宿主 app 对应的 appI    */
        appId
    }
}
interface Stats {
    /**  文件的类型和存取的权限，对应 POSIX stat.st_mo    */
    mode: string;
    /**  文件大小，单位：B，对应 POSIX stat.st_si    */
    size: number
    /**  文件最近一次被存取或被执行的时间，UNIX 时间戳，对应 POSIX stat.st_atim    */
    lastAccessedTime: number
    /**  文件最后一次被修改的时间，UNIX 时间戳，对应 POSIX stat.st_mtim    */
    lastModifiedTime: number
    /**  文判断当前文件是否一个    */
    isDirectory(): boolean;
    /**  文判断当前文件是否一个普通    */
    isFile(): boolean;
}
interface FS {
    /**  判断文件/目录是否    */
    access(res: {
        path: string;
        success?(res: any)
        fail?(err: any)
        complete?(obj: any)
    })
    /**  创建    */
    mkdir(res: {
        uri?
        dirPath?
        recursive?: boolean;
        success?(res: any)
        fail?(err: any)
        complete?(obj: any)
    })
    /**  
     * 创建目录同步版本
     * @param dirPath 创建的目录路径 (本地路径)
     * @param recursive 是否在递归创建该目录的上级目录后再创建该目录。如果对应的上级目录已经存在，则不创建该上级目录。如 dirPath 为 a/b/c/d 且 recursive 为 true，
     * 将创建 a 目录，再在 a 目录下创建 b 目录，以此类推直至创建 a/b/c 目录下的 d 目录。
       */
    mkdirSync(dirPath: string, recursive: boolean)

    /**  删除    */
    rmdir(res: {
        dirPath?: any
        uri?: any
        recursive?: boolean;
        success?(res: any)
        fail?(err: any)
        complete?(obj: any)
    })
    /**  删除本地存储的    */
    deleteFile(res: {
        uri: string;
        success?(res: any)
        fail?(err: any)
        complete?(obj: any)
    })
    unzip(res: {
        zipFilePath: string;
        targetPath: string;
        success?(res: any)
        fail?(err: any)
        complete?(obj: any)
    })
    /**  删除    */
    unlink(res: {
        filePath: string;
        success?(res: any)
        fail?(err: any)
        complete?(obj: any)
    })
    /**  读取目录内文件    */
    readdir(res: {
        dirPath: string;
        success?(res: any)
        fail?(err: any)
        complete?(obj: any)
    })
    /**  获取文件 Stats     */
    statSync(url: string, recursive?: boolean): any;
    /**  删除    */
    rmdirSync(url: string, recursive?: boolean)
    /**  删除    */
    unlinkSync(url: string)
    /**  读取目录内文件    */
    readdirSync(url: string): any;//string[]
    /**  判断文件/目录是否    */
    accessSync(url: string)

    /**  获取该小程序下已保存的本地缓存文件    */
    getSavedFileList(res: {
        success?(res: {
            fileList: {
                /**  本地    */
                filePath: string
                /**  本地文件大小，以字节为    */
                size: number	//
                /**  文件保存时的时间戳，从1970/01/01 08:00:00 到当前时间的    */
                createTime: number	//
            }[]
        })
        fail?(err: any)
        complete?(obj: any)
    })
    /**  删除该小程序下已保存的本地缓存    */
    removeSavedFile(res: {
        filePath: string;
        success?(res: any)
        fail?(err: any)
        complete?(obj: any)
    })

    /**  复制文    */
    copyFileSync(srcPath: string, destPath: string)


    /**  读取本地文件内    */
    readFile(res: {
        filePath: string;
        encoding: string;
        success?(res: any)
        fail?(err: any)
        complete?(obj: any)
    })

    saveFile(res: {
        tempFilePath: string;
        filePath: string;
        success?(res: any)
        fail?(err: any)
        complete?(obj: any)
    })


}

interface RecorderManager {
    onStart(Cal?: any)
    onResume(Cal?: any)
    onPause(Cal?: any)
    onStop(Cal?: any)
    onError(Cal?: any)

    clipVideo(res: {
        path: string;
        timeRange?: any[];
        clipRange?: any[];
        success?(res: any)
        fail?(err: any)
    })
    start(res: { duration: number })
    stop()
    pause()
    resume()
}


declare namespace qg {
    export function VibrateLong(input: QGStandardInput<any>);
    export function vibrateShort(input: QGStandardInput<any>);
    export namespace env {
        export const USER_DATA_PATH: string;
    }

    export function setKeepScreenOn(args: any);

    export function downloadFile(input: QGDownloadFileInput): DownloadTask;

    export function createInnerAudioContext(): QGInnerAudioContext;

    export function initAdService(input: QGInitAdServiceInput)

    export function createBannerAd(input: QGCreateAdInput): QGBannerAd;
    export function createBannerAd(input: any): QGBannerAd;

    export function createInsertAd(input: QGCreateAdInput): QGInsertAd;
    export function createRewardedVideoAd(input: QGCreateAdInput): QGVideoAd;
    export function createNativeAd(input: QGCreateAdInput): QGNativeAd;
    export function createInterstitialAd(input: QGCreateAdInput): QGInsertAd;

    export function createBoxPortalAd(input: any): any;

    /**  (vivo) 本地获取用户openid、头像等信息的新接口，为了省去qg.login的服务器对接，可以直接获取到用户的openid等信    */
    export function getAccountInfo(input: any)

    export function login(input: QGStandardInput<any>)
    export function share(input: QGStandardInput<any>)
    export function getFileSystemManager(): FS;

    export function onUpdateReady(res: Function);
    export function applyUpdate(): {}

    export function getUpdateManager()

    /**  viv    */
    export function getStorageSync(key: { key: string }): string
    export function setStorageSync(key: { key: string, value: string }): any
    export function deleteStorageSync(key: { key: string }): any


    export function setStorage(key: { key: string, value: string }): any
    export function deleteStorage(key: { key: string }): any

    export function accessFile(res: { uri: string }): boolean | string
    export function download(obj: {
        url: string;
        success?(res: any)
        fail?(err: any)
        complete?(obj: any)
    }): { onProgressUpdate(res: any) };
    export function moveFile(obj: {
        srcUri: string;
        dstUri: string;
        success?(res: any)
        fail?(err: any)
        complete?(obj: any)
    }): { onProgressUpdate(res: any) };

    export function unzipFile(obj: {
        srcUri: string;
        dstUri: string;
        success?(res: any)
        fail?(obj: any)
    })
    // export function onShow(Cal(res) : any) 
    // export function onHide(Cal(res) : any) 
    // export function offShow(Cal(res) : any) 
    // export function offHide(Cal(res) : any)  

    export function getProfile(obj: {
        token: string;
        success?(res: any)
        fail?(data: any, code: any)
    })



    export function getSystemInfoSync(): SystemInfo;
    export function setKeepScreenOn(res: { keepScreenOn: boolean })

    export function pay(res: {
        // 登录接口返回的token
        appId?: number,
        // 登录接口返回的token
        token?: string,
        // 时间戳
        timestamp?: number,
        paySign?: string,
        // 订单号
        orderNo?: string,
        // 成功回调函数，结果以 OPPO 小游戏平台通知CP的回调地址为准
        success?(res)
        fail?(err, code)
        complete?(err, code)
        orderInfo?//vivo
    })
    export function rmdir(res: {
        uri: string;
        success?(res: any)
        fail?(err: any)
    })
    /**  OPPO小游戏跳    */
    export function navigateToMiniGame(res: {
        pkgName: string,
        path?: string,
        extraData?: { from: string },
        success?(res: any)
        fail?(err: any)
    })

    export function hasShortcutInstalled(res: {
        success?(res: boolean)
        fail?(err)
        complete?()
    })

    export function installShortcut(res: {
        success?(res: boolean)
        fail?(err)
        complete?()
    })

    export function loadSubpackage(res: {
        name: string;
        success?(res: boolean)
        fail?(err)
    })

    export function getLocation(res: {
        success?(res: {
            latitude: string;
            longitude: string;
        })
    })

    export function reportMonitor(str, num)


    export function listDir(res: {
        uri: string;
        success?(data: { fileList: { uri: string, length: number, lastModifiedTime: number }[] })
        fail?(data, code)
    })

    export function mkdir(res: {
        uri: string;
        success?(res)
        fail?(err)
    })
    export function isFile(res: { uri: string })
    export function isDirectory(res: { uri: string })
    export function deleteFile(res: {
        uri: string;
        success?(res)
        fail?(err)
    })
    export function showDialog(res: {
        title: string;
        message: string;
        buttons: {
            text: string;
            color: string
        }[];
        success?(data)
        cancel?(err)
        fail?(err)
    })
    export function exitApplication(res?: any);

    export function showModal(res: {
        title: string;
        content: string;
        showCancel: boolean;
        success?(res: { confirm: boolean, cancel: boolean })
    })
    export function getUserInfo(obj: {
        success?(res?: any)
        fail?(data: any, code: any)
    })
    export function triggerGC();
    export function hideLoading(res?: {
        success?(r)
        fail?(e)
        complete?(e)
    });
    export function showLoading(res: {
        message?: string;
        title?: string;
        success?(r)
        fail?(e)
    })
    export function createVideo(Video: Video)


    export function setClipboardData(res: {
        text?: string;
        data?: string;
        success?(r)
        fail?(e)
    })

    export function createGameBannerAd(res: {
        adUnitId: string
    })
    export function createGamePortalAd(res: {
        adUnitId: string
    })
}

declare namespace tt {

}

declare let mz;
declare let uc;
declare let gamebox;
declare let ks;
declare let hbs;
declare let bl;
declare let my
declare let mgtv


declare let JSEncrypt;
declare let RSAKey;
declare let KJUR;
declare let GameGlobal;
declare let VConsole;
declare let dyb;
declare let h5api;

declare let CryptoJS: any
declare let Game: any