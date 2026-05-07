import SDKWrapped from "../SDKWrapped";
export default class TbSDK extends SDKWrapped {

    public get Getenv() { return my }

    public get SupportShare() { return true }
    /**  是否支持侧边    */
    public async Limit() { return true }

    public async Init() {
        await super.Init()
    }
}