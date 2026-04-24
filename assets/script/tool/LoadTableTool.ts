import { _decorator, Component, Node, resources, TextAsset } from 'cc';
const { ccclass, property } = _decorator;
/**
 * 加载表，文字类工具
 */
@ccclass('LoadTableTool')
export class LoadTableTool extends Component {
    private static _instance: LoadTableTool = null;

    public static get Instance() {
        if (this._instance == null) {
            this._instance = new LoadTableTool();
        }

        return this._instance;
    }

    //加载表 fileUrl 表路径
    loadTextFile(fileUrl : string,action :(result : string)=>void) {
        return new Promise((reject) => {
            resources.load(fileUrl, TextAsset, (err, textAsset) => {
                if (err) {
                    console.error('加载表失败:', err);
                    reject(err);
                    return;
                }
                action(textAsset.text);
            });
        });
    }
}


