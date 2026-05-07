import { GameSettings } from "../../FrameConfig/FrameData";
import BuildSetting from "../BuildSetting";
import { SDK } from "../SDK";
import { SDKType } from "../data/SDKType";

export class SDKStorage {

    /** 长震动  */
    public VibrateLong() {
        if (!GameSettings.vibrationEnabled) return
        if (SDK.Getenv)
            SDK.Getenv.vibrateLong && SDK.Getenv.vibrateLong({})
        else
            navigator && navigator.vibrate && navigator.vibrate(400)
    }
    
    /** 短震动  */
    public VibrateShort() {
        if (BuildSetting.kPlatformSDK == SDKType.ToutiaoSDK) return
        if (!GameSettings.vibrationEnabled) return;
        if (SDK.Getenv)
            SDK.Getenv.vibrateShort && SDK.Getenv.vibrateShort({})
        else
            navigator && navigator.vibrate && navigator.vibrate(100)
    }

    public GetStorage(key: string): string {
        if (SDK.Getenv) {
            if (BuildSetting.kPlatformSDK == SDKType.OPPOSDK
                || BuildSetting.kPlatformSDK == SDKType.HuaWeiSDK
                || BuildSetting.kPlatformSDK == SDKType.XiaomiSDK
                || BuildSetting.kPlatformSDK == SDKType.MeizuSDK
                || BuildSetting.kPlatformSDK == SDKType.ZuiyouSDK)
                return localStorage.getItem(key);
            else if (BuildSetting.kPlatformSDK == SDKType.ZfbSDK) {
                const res = SDK.Getenv.getStorageSync({ key: key })
                return res.success ? res.data : ""
            }
            else if (BuildSetting.kPlatformSDK == SDKType.TbSDK) {
                const res = SDK.Getenv.getStorageSync({ key: key })
                if (res.data && typeof res.data != "object")
                    return res.data
                return ""
            }
            else if (SDK.Getenv.getStorageSync)
                try { return SDK.Getenv.getStorageSync(key) } catch (err) {
                    console.log(`GetStorage ${key} 失败`)
                    return ""
                }
            else if (BuildSetting.kPlatformSDK == SDKType.VivoSDK)
                return qg.getStorageSync({ key: key })
            else
                return localStorage.getItem(key)
        } else
            return localStorage.getItem(key)
    }

    public SetStorage(key: string, value: string) {
        if (SDK.Getenv) {
            if (BuildSetting.kPlatformSDK == SDKType.OPPOSDK
                || BuildSetting.kPlatformSDK == SDKType.HuaWeiSDK
                || BuildSetting.kPlatformSDK == SDKType.XiaomiSDK
                || BuildSetting.kPlatformSDK == SDKType.MeizuSDK
                || BuildSetting.kPlatformSDK == SDKType.ZuiyouSDK)
                localStorage.setItem(key, value);
            else if (SDK.Getenv.setStorage)
                SDK.Getenv.setStorage({ key: key, data: value })
            else if (BuildSetting.kPlatformSDK == SDKType.VivoSDK)
                SDK.Getenv.setStorage({ key: key, value: value })
            else
                localStorage.setItem(key, value)
        } else
            localStorage.setItem(key, value)
    }
    public DelStorage(key: string) {
        return new Promise<void>((resolve) => {
            if (SDK.Getenv) {
                if (BuildSetting.kPlatformSDK == SDKType.OPPOSDK
                    || BuildSetting.kPlatformSDK == SDKType.HuaWeiSDK
                    || BuildSetting.kPlatformSDK == SDKType.XiaomiSDK
                    || BuildSetting.kPlatformSDK == SDKType.MeizuSDK
                    || BuildSetting.kPlatformSDK == SDKType.ZuiyouSDK) {
                    localStorage.removeItem(key)
                    resolve()
                }
                else if (SDK.Getenv.removeStorage) {
                    SDK.Getenv.removeStorage({
                        key: key,
                        success: res => {
                            console.log(`DelStorage ${key} 成功`)
                            resolve()
                        },
                        fail: err => {
                            console.error(`DelStorage ${key} 失败` + JSON.stringify(err))
                            resolve()
                        }
                    })
                }
                else if (BuildSetting.kPlatformSDK == SDKType.VivoSDK) {
                    SDK.Getenv.deleteStorage({ key: key });
                    resolve()
                }
                else {
                    localStorage.removeItem(key)
                    resolve()
                }
            } else {
                localStorage.removeItem(key)
                resolve()
            }
        })
    }
    /** 清理所有数据 */
    public ClearStorage() {
        if (SDK.Getenv) {
            if (BuildSetting.kPlatformSDK == SDKType.OPPOSDK
                || BuildSetting.kPlatformSDK == SDKType.HuaWeiSDK
                || BuildSetting.kPlatformSDK == SDKType.XiaomiSDK
                || BuildSetting.kPlatformSDK == SDKType.MeizuSDK
                || BuildSetting.kPlatformSDK == SDKType.ZuiyouSDK)
                localStorage.clear()
            else if (SDK.Getenv.clearStorageSync) {
                try {
                    SDK.Getenv.clearStorageSync()
                    console.log("ClearStorage 成功")
                } catch (err) {
                    console.error("ClearStorage 失败" + JSON.stringify(err))
                }
            } else
                localStorage.clear()
        } else
            localStorage.clear()
    }
}