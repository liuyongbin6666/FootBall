import { game } from "cc";
import BuildSetting from "../BuildSetting";
import { SDK } from "../SDK";
import { SDKType } from "../data/SDKType";
import { SDKEvent } from "./SDKEvent";
export class SDKUserInfo {
    /** 用户授权设置信息 */
    public authSetting = {};

    init() {
        return new Promise<void>((resolve, reject) => {
            if (SDK.Getenv && SDK.Getenv.getSetting)
                SDK.Getenv.getSetting({
                    success: res => {
                        console.log("getSetting 获取成功:" + JSON.stringify(res))
                        this.authSetting = res.authSetting
                        resolve()
                    }, fail: err => {
                        console.log("getSetting 获取失败:" + JSON.stringify(err))
                        resolve()
                    }
                })
            else {
                console.log("没有 getSetting")
                resolve()
            }
        })
    }

    /** 授权按钮 */
    private UserInfoButtons = []
    // private UserInfoButtononTap
    /** 获取用户信息（已用最新版） 下边表述老的原因
    * 此接口有调整，使用该接口将不再出现授权弹窗，请使用 <button open-type="getUserInfo"></button> 引导用户主动进行授权操作
    * 当用户未授权过，调用该接口将直接进入fail回调
    * 当用户授权过，可以使用该接口获取用户信息
     */
    public createUserInfoButton(x?, y?, w?, h?) {
        if (!x) x = 0
        if (!y) y = 0
        if (!w) w = SDK.SystemInfo.screenWidth
        if (!h) h = SDK.SystemInfo.screenHeight

        console.log("[授权按钮]", x, y, w, h)

        let UserInfoButton = SDK.Getenv.createUserInfoButton({
            type: 'text',
            text: '',
            style: {
                left: x,
                top: y,
                width: w,
                height: h,
                // backgroundColor: "#824E46"
            }
        })
        UserInfoButton.onTap(this.onUserInfoButtonTap.bind(this))
        this.UserInfoButtons.push(UserInfoButton)
    }

    private onUserInfoButtonTap(res) {
        console.log("onTap:" + JSON.stringify(res))
        if (res.errMsg == "getUserInfo:ok") {
            SDK.avatarUrl = res.userInfo.avatarUrl;
            SDK.nickname = res.userInfo.nickName;

            this.ChangeAvatarEnd()
            this.DelUserInfoButton();
        }
    }

    //销毁授权按钮 清除微信授权按钮
    public DelUserInfoButton(): void {
        if (!this.UserInfoButtons || this.UserInfoButtons.length === 0)
            return;
        this.UserInfoButtons.forEach((button) => button && button.destroy && button.destroy());
        this.UserInfoButtons.length = 0; // 清空数组
    }


    public async getUserInfo(): Promise<void> {
        if (BuildSetting.kPlatformSDK === SDKType.HuaWeiSDK) {
            return;
        }

        console.log("[SDKUserInfo] getUserInfo");

        const getUserInfoHandler = () => {
            if (SDK.Getenv) {
                if (SDK.Getenv.getUserInfo) {
                    return new Promise<void>((resolve) => {
                        SDK.Getenv.getUserInfo({
                            success: (res) => {
                                this.handleUserInfoResponse(res);
                                resolve();
                            },
                            fail: (err) => {
                                console.error("获取用户数据失败:", err);
                                SDK.ShowTips("获取用户数据失败,请从右上角设置允许使用用户信息")
                                resolve();
                            }
                        });
                    });
                }
                else if (SDK.Getenv.getAuthUserInfo) {
                    return new Promise<void>((resolve) => {
                        SDK.Getenv.getAuthUserInfo({
                            success: (res) => {
                                this.handleAuthUserInfoResponse(res);
                                resolve();
                            },
                            fail: (err) => {
                                console.error("获取用户数据失败:", err);
                                resolve();
                            }
                        });
                    });
                }
                else if (SDK.Getenv.getUserProfile) {
                    return new Promise<void>((resolve) => {
                        SDK.Getenv.getUserProfile({
                            success: (res) => {
                                this.handleAuthUserInfoResponse(res);
                                resolve();
                            },
                            fail: (err) => {
                                console.error("获取用户数据失败:", err);
                                resolve();
                            }
                        });
                    });
                }
            } else {
                console.warn("未找到有效的用户信息获取方法");
                return Promise.resolve(); // 无操作
            }
        };

        await getUserInfoHandler();
    }

    private handleUserInfoResponse(res: any): void {
        console.log("userInfo:" + JSON.stringify(res));
        if (BuildSetting.kPlatformSDK === SDKType.VivoSDK) {
            SDK.nickname = res.data.nickName;
            SDK.avatarUrl = res.data.smallAvatar;
        } else if (res.userInfo) {
            SDK.avatarUrl = res.userInfo.avatarUrl;
            SDK.nickname = res.userInfo.nickName;
        } else if (res.data) {
            SDK.avatarUrl = res.data.avatarUrl;
            SDK.nickname = res.data.nickName;
        } else if (res.avatarUrl) {
            SDK.avatarUrl = res.avatarUrl;
            SDK.nickname = res.nickName;
        }
        this.ChangeAvatarEnd();
    }

    private handleAuthUserInfoResponse(res: any): void {
        console.log("userInfo:" + JSON.stringify(res));
        SDK.avatarUrl = res.avatar || "";
        SDK.nickname = res.nickName || res.nick || "小咪不吃鱼丶";
        this.ChangeAvatarEnd();
    }


    /** 上传数据  */
    protected ChangeAvatarEnd() {
        if (!SDK.avatarUrl) return

        this.authSetting["scope.userInfo"] = true;
        console.log("头像地址:", SDK.avatarUrl)
        console.log("玩家昵称:", SDK.nickname)
        game.emit(SDKEvent.KChangeAvatar)

       
    }

    /** 保存图片到系统相册  */
    public async saveImageToPhotosAlbum(filePath: string) {
        if (BuildSetting.kPlatformSDK != SDKType.WxSDK) {
            console.error("当前平台不支持或者SDK暂未接入")
            return
        }
        let res = await this.authorize("scope.writePhotosAlbum")
        if (res)
            SDK.Getenv.saveImageToPhotosAlbum({
                filePath: filePath,
                success: res => {
                    console.log(`${filePath} 保存成功:` + JSON.stringify(res))
                },
                fail: err => {
                    console.log(`${filePath} 保存失败:` + JSON.stringify(err))
                }
            })
    }

    /**微信授权 */
    public authorize(scope: string) {
        return new Promise<boolean>((resolve, reject) => {
            if ((BuildSetting.kPlatformSDK == SDKType.WxSDK || BuildSetting.kPlatformSDK == SDKType.QQSDK) && scope == "scope.userInfo") {
                SDK.ShowTips("朋友信息不能走授权")
                resolve(false)
            }
            else if (this.authSetting && this.authSetting[scope])
                resolve(true)
            else if (BuildSetting.kPlatformSDK == SDKType.ZfbSDK) {
                SDK.Getenv.getAuthCode({
                    scopes: "auth_user",
                    success: res => {
                        console.log(`${scope} 授权成功:` + JSON.stringify(res))
                        this.authSetting[scope] = true;
                        resolve(true)
                    }, fail: err => {
                        console.log(`${scope} 授权失败:` + JSON.stringify(err))
                        SDK.ShowTips("授权失败")
                        resolve(false)
                    }
                })
            }
            else {
                SDK.Getenv.authorize({
                    scopes: scope,
                    scope: scope,
                    success: res => {
                        console.log(`${scope} 授权成功:` + JSON.stringify(res))
                        this.authSetting[scope] = true;
                        resolve(true)
                    }, fail: err => {
                        console.log(`${scope} 授权失败:` + JSON.stringify(err))
                        SDK.ShowTips("授权失败,请从右上角设置允许使用用户信息")
                        resolve(false)
                    }
                })
            }
        })
    }
}