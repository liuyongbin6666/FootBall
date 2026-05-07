import BuildSetting from "../Sdk/BuildSetting";
import { SDKType } from "../Sdk/data/SDKType";

export default class JSZIP {
    /**  JS压缩数据  */
    public static JSZip_Str(data) {
        // return data
        if (!data || BuildSetting.kPlatformSDK == SDKType.DummySDK) return data
        try {
            if (typeof data != 'string')
                data = JSON.stringify(data)
            // console.log(data)
            const zip: JSZip = new JSZip();
            zip.file("data.txt", data);
            const date = zip.generate({ 'compression': 'DEFLATE' });
            // console.log("JS压缩数据成功: ", date.length)
            return date
        } catch (error) {
            // console.error("JS压缩数据 错误")
            return data;
        }
    }

    /**  JS解析    */
    public static Str_JSZip(data) {
        // return JSON.parse(data);
        if (!data || BuildSetting.kPlatformSDK == SDKType.DummySDK) return data
        try {
            const zip: JSZip = new JSZip(data, { base64: true });
            const content: string = zip.file("data.txt").asText();
            if (!content) return content
            // console.log("JS解析数据成功: ", content)
            return JSON.parse(content);
        } catch (error) {
            // console.error("JS解析数据 错误")
            return data;
        }
    }
}