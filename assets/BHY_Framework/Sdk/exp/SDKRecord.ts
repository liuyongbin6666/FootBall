import BuildSetting from "../BuildSetting";
import { SDKType } from "../data/SDKType";
import { SDK } from "../SDK";

export class SDKRecord {
    /**  获取全局唯一 GameRecorderManager  */
    public GameRecorder
    /**  是否录屏    */
    public IsRecord: boolean = false;
    /**  开始时    */
    private mRecordStartTime: number = 0;
    /**  录屏长    */
    private mRecordLength: number = 0;
    /**  录屏停止回    */
    private StopFun: Function
    /**  视频分享地    */
    public videoPath;
    constructor() {
        if (BuildSetting.kPlatformSDK == SDKType.ToutiaoSDK && SDK.Getenv.getGameRecorderManager) {
            this.GameRecorder = SDK.Getenv.getGameRecorderManager()
            this.GameRecorder.onStart(() => this.RecStart())
            this.GameRecorder.onResume(() => this.RecResume())
            this.GameRecorder.onPause(() => this.RecPause())
            this.GameRecorder.onStop(res => this.RecStop(res))
            this.GameRecorder.onError(err => this.RecError(err))
        }
        // else if (BuildSetting.kPlatformSDK == SDKType.WxSDK && SDK.Getenv.getGameRecorder) {
        //     this.GameRecorder = SDK.Getenv.getGameRecorder()
        //     this.GameRecorder.on('start', () => this.RecStart())
        //     this.GameRecorder.on('resume', () => this.RecResume())
        //     this.GameRecorder.on('pause', () => this.RecPause())
        //     this.GameRecorder.on('stop', res => this.RecStop(res))
        //     this.GameRecorder.on('error', err => this.RecError(err))
        // }
        // else if (BuildSetting.kPlatformSDK == SDKType.KsSDK && SDK.Getenv.getGameRecorder) {
        //     this.GameRecorder = SDK.Getenv.getGameRecorder()
        //     this.GameRecorder.on('start', this.RecStart)
        //     this.GameRecorder.on('resume', this.RecResume)
        //     this.GameRecorder.on('pause', this.RecPause)
        //     this.GameRecorder.on('stop', this.RecStop)
        //     this.GameRecorder.on('error', this.RecError)
        //     this.GameRecorder.on('abort', this.RecAbort)
        // }
        // else if (BuildSetting.kPlatformSDK == SDKType.OPPOSDK && SDK.Getenv.getGameRecorder) {
        //     this.GameRecorder = SDK.Getenv.getGameRecorder()
        //     this.GameRecorder.on('start', () => this.RecStart())
        //     this.GameRecorder.on('resume', () => this.RecResume())
        //     this.GameRecorder.on('pause', () => this.RecPause())
        //     this.GameRecorder.on('stop', res => this.RecStop(res))
        //     this.GameRecorder.on('error', err => this.RecError(err))
        // }
    }
    private RecStart() {
        console.log('录屏开始')
        this.mRecordStartTime = Date.now();
        this.mRecordLength = 0;
        this.IsRecord = true;
        delete this.videoPath
    }
    private RecResume() {
        console.log('继续录屏')
        this.mRecordStartTime = Date.now();
        this.IsRecord = true;
    }
    private RecPause() {
        console.log('录屏暂停')
        this.IsRecord && (this.mRecordLength += Date.now() - this.mRecordStartTime)
        this.IsRecord = false;
    }
    private RecStop(res) {
        console.log('录屏结束:' + JSON.stringify(res))
        this.IsRecord && (this.mRecordLength += Date.now() - this.mRecordStartTime)
        this.IsRecord = false;
        if (res.videoPath)
            this.videoPath = res.videoPath
        this.RecordeEnd()
    }
    private RecError(err) {
        console.error('录屏错误:' + JSON.stringify(err))
        if (this.ShowErrTip)
            SDK.ShowTips("请设置允许游戏画面录制")
        this.IsRecord = false;
        delete this.videoPath
        this.mRecordStartTime = 0
        this.mRecordLength = 0
        this.RecordeEnd()
    }
    private RecAbort() {
        console.error('废弃已录制视频')
        this.IsRecord = false;
        delete this.videoPath
        this.mRecordStartTime = 0
        this.mRecordLength = 0
        this.RecordeEnd()
    }

    /**  是否显示错误提    */
    private ShowErrTip = true;

    /**  是否有录屏功    */
    public get IsSupportRecord(): boolean {
        // if (BuildSetting.kPlatformSDK == SDKType.DummySDK)
        //     return true
        if (!this.GameRecorder) return false
        if (BuildSetting.kPlatformSDK == SDKType.WxSDK || BuildSetting.kPlatformSDK == SDKType.OPPOSDK)
            return this.GameRecorder.isFrameSupported()
        else if (BuildSetting.kPlatformSDK == SDKType.ToutiaoSDK)
            return SDK.SupportShare
        else
            return true
    }
    /**  录屏长    */
    public get RecordLength(): number {
        let nLength = this.mRecordLength;
        if (this.IsRecord) nLength += Date.now() - this.mRecordStartTime;
        return nLength;
    }

    /**  
     * 开始录屏
     * @param ShowErrTip 是否显示错误提示
     * @param StopFun 
     * @returns 
       */
    public StartRecord(ShowErrTip = false, StopFun = null) {
        delete this.videoPath
        this.ShowErrTip = ShowErrTip;
        if (!this.GameRecorder) return StopFun && StopFun()
        this.StopFun = StopFun
        if (BuildSetting.kPlatformSDK == SDKType.WxSDK)
            this.GameRecorder.start({ duration: 7200, bitrate: 3000, hookBgm: true })
        else if (BuildSetting.kPlatformSDK == SDKType.KsSDK)
            this.GameRecorder.start()
        else
            this.GameRecorder.start({ duration: 300 });
    }
    /**  停止录    */
    public StopRecord(StopFun) {
        if (!this.GameRecorder)
            return StopFun && StopFun()

        if (this.videoPath)
            return StopFun && StopFun();

        this.StopFun = StopFun
        this.GameRecorder.stop()
    }

    private RecordeEnd() {
        console.log('RecordeEnd')
        this.StopFun && this.StopFun()
        delete this.StopFun
    }
    // private ShareRecorderCD = 0
    /**  录屏分享    */
    private ShareRecorderIn = false;
    /**  分享录    */
    public ShareRecord(Cal: (end: boolean) => void = null) {
        if (!this.videoPath)
            return SDK.ShowTips("暂无可分享视频")
        // let now = Date.now()
        // if (now - this.ShareRecorderCD <= 500)
        //     return
        // this.ShareRecorderCD = now;
        if (this.ShareRecorderIn)
            return SDK.ShowTips("录屏分享中")
        this.ShareRecorderIn = true;
        if (BuildSetting.kPlatformSDK == SDKType.ToutiaoSDK && SDK.Getenv.shareAppMessage)
            SDK.Getenv.shareAppMessage({
                channel: 'video',
                extra: {
                    videoPath: this.videoPath,
                    videoTopics: [BuildSetting.ShareGameName, "抖音小游戏"], //该字段已经被hashtag_list代替，为保证兼容性，建议两个都填写。
                    hashtag_list: [BuildSetting.ShareGameName, "抖音小游戏"],
                    //video_title: "我和XXX 一起合唱了，好听吗？", //生成的默认内容
                },
                success: () => {
                    this.ShareRecorderIn = false;
                    SDK.ShowTips('分享录屏成功!')
                    delete this.videoPath
                    Cal && Cal(true)
                },
                fail: (e) => {
                    this.ShareRecorderIn = false;
                    console.error(`分享视频失败`, e);
                    if (e.errMsg.indexOf('fail can not be shared without clicking by user') >= 0)
                        this.ShareRecord()
                    else {
                        SDK.ShowTips('取消分享录屏!')
                        delete this.videoPath
                        Cal && Cal(false)
                    }
                }
            });
        else
            Cal && Cal(true)
    }

    public Clear() {
        if (this.GameRecorder) {
            delete this.StopFun

            this.GameRecorder.stop()
            this.IsRecord = false;
            delete this.videoPath
            this.mRecordStartTime = 0
            this.mRecordLength = 0
        }
    }
}