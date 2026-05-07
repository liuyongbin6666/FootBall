import SDKWrapped from "../SDKWrapped";
export default class BlBlSDK extends SDKWrapped {
    public get Getenv() { return bl }

    public get SupportShare() {
        if (this.Getenv.shareAppMessage)
            return true
        return false
    }

    public get SupportAddIcon() {
        if (this.Getenv.addShortcut)
            return true;
        return false;
    }

    public async Limit() {
        if (this.Getenv.navigateToScene)
            return true
        else
            return false
    }
}