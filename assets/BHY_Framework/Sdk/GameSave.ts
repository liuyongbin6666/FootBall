
import { Component, game } from "cc";
import JSZIP from "../JSZIP/JSZIP";
import BuildSetting from "./BuildSetting";
import { SDKEvent } from "./exp/SDKEvent";
import { SDK } from "./SDK";
import SDKServer from "./SDKServer";


type FInitDefaultValue = () => any;
type FFieldDecoratorsProtocol = (target: any, propertyName: string) => void;
///
/// GameStorageSetting
///
class GameStorageSetting {
    public ClassType: any;
    public FeildName: string;
    public DefaultValue?: any | FInitDefaultValue;
    public DailyRefresh?: boolean;
    public LowUpdate?: boolean
}


export class GameStorage extends Component {
    public static Ins: GameStorage
    protected onLoad(): void {
        GameStorage.Ins = this
    }

    public static StroageSetting: GameStorageSetting[] = [];
    public static DailyRefreshDate: number;
    private static readonly kStorageName = "GameSave_" + BuildSetting.GameName;
    // /** 延迟到本帧结束保存  */
    /** 保存  */
    public Save() {
        GameStorage.CheckDailyRefresh();
        var data = {
            Version: BuildSetting.Version,
            DailyRefreshDate: GameStorage.DailyRefreshDate
        };
        var nCount = GameStorage.StroageSetting.length;
        for (var nIndex = 0; nIndex < nCount; nIndex++) {
            var rSetting = GameStorage.StroageSetting[nIndex];
            data[rSetting.FeildName] = rSetting.ClassType[rSetting.FeildName];
        }
        let value = JSZIP.JSZip_Str(JSON.stringify(data))
        SDK.SetStorage(GameStorage.kStorageName, value);
        return value
    }

    public async Load() {
        game.on(SDKEvent.Hide, this.Save, this)
        this.schedule(this.Save, 1.5)

        let data = SDK.GetStorage(GameStorage.kStorageName)

        // data = "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"
        // data = JSZIP.Str_JSZip(data)
        if (data) {
            console.log("GetStorage获取成功", GameStorage.kStorageName, data)
            this.Start(JSZIP.Str_JSZip(data))
        }
        else {
            console.log("GetStorage获取失败", GameStorage.kStorageName, data)
            this.Start(await SDKServer.Get())
        }
        SDKServer.Init()
    }

    private Start(data = null) {
        try {
            if (typeof data == "string")
                data = JSON.parse(data);
            if (!data) {
                GameStorage.ApplyDefaultValue(false);
                this.Save();
                // GameStorage.LoadEnd = false;
                return;
            }
        } catch (error) {
            console.log(`GameSave "${GameStorage.kStorageName}" JSON.parse error`);
            GameStorage.ApplyDefaultValue(false);
            this.Save();
            return;
        }

        if (data["Version"] != BuildSetting.Version) {
            console.log(`删除非该版本存档文件`)
            SDK.ClearStorage();
            GameStorage.ApplyDefaultValue(false);
            this.Save();
            return;
        }
        var nCount = GameStorage.StroageSetting.length;
        for (var nIndex = 0; nIndex < nCount; nIndex++) {
            var rSetting = GameStorage.StroageSetting[nIndex];
            if (data[rSetting.FeildName] == null) {
                if (null != rSetting.DefaultValue) {
                    if (typeof rSetting.DefaultValue === "function") {
                        rSetting.ClassType[rSetting.FeildName] = rSetting.DefaultValue();
                    } else {
                        rSetting.ClassType[rSetting.FeildName] = rSetting.DefaultValue;
                    }
                }
                continue;
            }

            rSetting.ClassType[rSetting.FeildName] = data[rSetting.FeildName];
        }

        GameStorage.DailyRefreshDate = data["DailyRefreshDate"];
        GameStorage.CheckDailyRefresh()
    }

    public static ApplyDefaultValue(bOnlyDailyRefresh: boolean) {
        var nCount = GameStorage.StroageSetting.length;
        for (var nIndex = 0; nIndex < nCount; nIndex++) {
            var rSetting = GameStorage.StroageSetting[nIndex];
            if (bOnlyDailyRefresh && !rSetting.DailyRefresh) {
                continue;
            }

            if (null != rSetting.DefaultValue) {
                if (typeof rSetting.DefaultValue === "function") {
                    rSetting.ClassType[rSetting.FeildName] = rSetting.DefaultValue();
                } else {
                    rSetting.ClassType[rSetting.FeildName] = rSetting.DefaultValue;
                }
            }
        }

        GameStorage.DailyRefreshDate = Date.now();
    }

    private static NowDate = new Date()
    private static DailyDate = new Date()
    private static CheckDailyRefresh() {
        let now = Date.now()
        if (!GameStorage.DailyRefreshDate)
            GameStorage.DailyRefreshDate = now;
        else {
            GameStorage.NowDate.setTime(now)
            GameStorage.DailyDate.setTime(GameStorage.DailyRefreshDate)
            if (GameStorage.Num_Time(GameStorage.NowDate) > GameStorage.Num_Time(GameStorage.DailyDate))
                GameStorage.ApplyDefaultValue(true);
        }
    }

    /** dateNow转年月日
    * @param Str 20201225
     */
    private static Num_Time(date: Date) {
        const Year = date.getFullYear()
        const Month: any = date.getMonth() + 1
        const Day = date.getDate();
        return `${Year}${Month <= 9 ? `0${Month}` : Month}${Day <= 9 ? `0${Day}` : Day}`;
    }
}



function GeneratorFieldDecorators<T>(defaultValue: T | Function, lowUpdate: boolean, dailyRefresh: boolean): FFieldDecoratorsProtocol {
    return (target: any, propertyName: string) => {
        var rStorageSetting: GameStorageSetting = {
            ClassType: target,
            FeildName: propertyName,
            DefaultValue: defaultValue,
            LowUpdate: lowUpdate,
            DailyRefresh: dailyRefresh,
        };
        GameStorage.StroageSetting.push(rStorageSetting);
    }
}

/// 添加修饰器得静态变量，会被GameStorage保存到LocalStorage中。
/** 
 * 
 * @param defaultValue 默认值
 * @param dailyRefresh 每日刷新
 * @param lowUpdate 低频率保存(默认实时保存 false)
 * @returns 
  */
export default function GSave<T>(defaultValue?: T | Function, dailyRefresh?: boolean, lowUpdate?: boolean): FFieldDecoratorsProtocol {
    return GeneratorFieldDecorators(defaultValue, lowUpdate, dailyRefresh);
}