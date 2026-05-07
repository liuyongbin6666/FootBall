import SDKWrapped from "../SDKWrapped";

export default class HonorSDK extends SDKWrapped {
    get Getenv() { return qg }

    /** 是否支持添加快捷方式  */
    public get SupportAddIcon() {
        if (qg.hasShortcutInstalled && qg.installShortcut) return true;
        return false;
    }
}