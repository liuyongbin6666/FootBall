import { Node, UITransform } from "cc";
import BuildSetting from "../BuildSetting";
import SDKWrapped from "../SDKWrapped";

export default class ZfbSDK extends SDKWrapped {

    public get Getenv() { return my }

    public get SupportShare() { return true }
    /** 是否支持游戏圈 */
    public get SupportClub() {
        if (this.Getenv.createGameClubButton) return true
        return false;
    }

    /**  显示游戏圈    */
    public ShowGameClubButton(node: Node) {
        if (!this.SupportClub) return
        if (!this.ClubButton) {
            let Position = node.getWorldPosition();
            let Transform = node.getComponent(UITransform);

            let x = Position.x - Transform.width * 0.5;
            let y = (this.height - 1334) * 0.5 + (1334 - Position.y - Transform.height * 0.5);
            let w = Transform.width;
            let h = Transform.height;

            x = Math.round(x / this.scale)
            y = Math.round(y / this.scale)
            w = Math.round(w / this.scale)
            h = Math.round(h / this.scale)

            console.log("createGameClubButton", x, y, w, h)

            this.ClubButton = this.Getenv.createGameClubButton({
                // type: "text", 
                // text: "text",
                type: "image",
                icon: "blue",
                openlink: BuildSetting.openlink,//游戏圈传参数，进入到指定圈子下。该参数传游戏圈的圈子ID
                style: {
                    left: x,
                    top: y,
                    width: w,
                    height: h,
                }
            })
            // this.ClubButton.onTap(res => {
            // console.log("游戏圈按钮的点击事件", res)
            // })
        }
        // green	绿色的图标
        // white	白色的图标
        // dark	有黑色圆角背景的白色图标
        // light	有白色圆角背景的绿色图标
        // if (this.Club_show) return
        // this.Club_show = true
        this.ClubButton?.show()
    }
    /**  隐藏游戏圈    */
    public HideGameClubButton() {
        // if (!this.Club_show) return
        // this.Club_show = false
        this.ClubButton?.hide()
    }
}