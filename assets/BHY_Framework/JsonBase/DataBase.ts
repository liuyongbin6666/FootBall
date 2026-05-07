import { JsonAsset } from "cc";
import { ResMgr } from "../Manager/ResMgr";


/** 数据 */
export class DataBase<T> {
    public data: T[]

    public async data_sync(path: string) {
        if (!this.data) {
            let json = await ResMgr.Ins.getOrLoadAsset(`JsonData`, path, JsonAsset);

            this.data = json.json as any
        }
    }

    /** 查找配置 */
    // findOne(option: T) {
    //     let found = true

    //     for (let item of this.data) {
    //         found = true
    //         for (let key in option) {
    //             if (item[key] != option[key]) {
    //                 found = false
    //                 break
    //             }
    //         }

    //         if (found) {
    //             return item
    //         }
    //     }
    // }

    public filter(func: (item: T) => boolean, thisArg?) {
        return this.data.filter(func, thisArg);
    }

    public filterOne(func: (item: T) => boolean, thisArg?) {
        // return this.data.filter(func)[0];
        return this.data.find(func, thisArg)
    }
}