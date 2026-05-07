import { Component, _decorator } from 'cc';
import { SDK } from '../SDK';

const { ccclass, property } = _decorator;
@ccclass('Btn_UserInfo')
export class Btn_UserInfo extends Component {
    protected onLoad() {
        if (SDK.openId && !SDK.avatarUrl)
            this.scheduleOnce(() => {
                if (SDK.UserInfo.authSetting && SDK.UserInfo.authSetting["scope.userInfo"])
                    SDK.getUserInfo();
                else if (SDK.IscreateUserInfo)
                    SDK.createUserInfo(this.node)
            }, 0.1)
        else
            SDK.DelUserInfoButton()
    }

    protected onDestroy(): void {
        SDK.DelUserInfoButton()
    }
}