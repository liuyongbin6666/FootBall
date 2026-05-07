
import GSave from "../Sdk/GameSave";
/**
 * 游戏设置类
 * 使用GDataClass装饰器标记为需要单独存储的数据类
 * 使用GSave装饰器标记需要保存的属性
 */
export class GameSettings {
    /**
     * 音乐音量 (0-1)
     */
    @GSave(0.2)
    public static musicVolume: number;

    /**
     * 音效音量 (0-1)
     */
    @GSave(1)
    public static soundVolume: number;

    /**
     * 是否开启振动
     */
    @GSave(true)
    public static vibrationEnabled: boolean;

    /**
     * 语言设置
     */
    @GSave("ZH")
    public static language: string;
}

export default class SDKInfo {

    public static Limitnum = 0

    /** 设置奖励回调 */
    public static Init(LimitCal: () => void, AddIconCal: () => void) {
        if (!this.LimitCal)
            this.LimitCal = LimitCal
        if (!this.AddIconCal)
            this.AddIconCal = AddIconCal
    }

    /**  抖音每日奖    */
    @GSave(false, true)
    public static Dailyreward: boolean;
    /** 侧边栏奖励回调 */
    private static LimitCal: () => void;
    public static LimitOK() {
        if (!SDKInfo.Dailyreward) {
          
            SDKInfo.Dailyreward = true;
            this.LimitCal && this.LimitCal()
        }
    }

    /**  桌面入口每日奖 */
    @GSave(false, true)
    public static AddiconDailyreward: boolean;
    /** 桌面入口奖励回调 */
    private static AddIconCal: () => void;
    public static AddIconOK() {
        if (!SDKInfo.AddiconDailyreward) {
          
            SDKInfo.AddiconDailyreward = true;
            this.AddIconCal && this.AddIconCal()
        }
    }

    /** 视频看完次数 */
    @GSave(0)
    public static VideoEndNum: number;

    /** 每日视频次数 */
    @GSave(0, true)
    public static dailyAdNum: number;

    /**  视频播放完    */
    public static FirstVideoReporting() {
        SDKInfo.dailyAdNum++;
        SDKInfo.VideoEndNum++;
        // 发送广告奖励刷新事件，通知界面更新红点状态
        // game.emit(EventConst.RefreshAdReward);
    }
}