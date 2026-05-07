import SDKWrapped from "../SDKWrapped";

export default class DummySDK extends SDKWrapped {
    public get SupportShare() { return true }
    /**  是否支持添加快捷方式   */
    public get SupportAddIcon() { return true }
    /**  是否支持侧边    */
    public async Limit() { return true }
    /**  是否支持游戏    */
    public get SupportClub() { return true; }
    /** 是否支持反馈页 */
    public get SupportFeedback() { return true; }

    
    public async Init() {
        await super.Init()
        // this.nickname = "Smile~🐶"
        this.avatarUrl = "avatarUrl"
    }
}