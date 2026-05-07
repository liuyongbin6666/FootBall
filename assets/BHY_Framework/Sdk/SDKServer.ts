
import BuildSetting from "./BuildSetting";
import { GameStorage } from "./GameSave";
import { CODE } from "./PlatformSDK/code";
import { basesql, Rankdata } from "./PlatformSDK/Rankdata";
import { SDK } from "./SDK";

/** 排行榜类型 */
export enum RankType {
    /** 存GameSave数据 */
    Type1 = "1",
    Type2 = "2",
    Type3 = "3",
    Type4 = "4",
    Type5 = "5",
}

export default class SDKServer {
    // public static URL = "https://rank.yymfpf.com:5510/rank/"
    public static URL = "https://childbirth.wqmss.online:5510/rank/"

    /** 平台[web/wx/tt/ks] */
    public static platform = "web"
    /** 游戏id */
    public static readonly gameid = "HuaFu"

    public static Init() {
        // SDKServer.UpdateData(RankType.Type2, GameInfo.level)
        // SDKServer.RankBoss1()
        // game.on(SDKEvent.次日刷新, SDKServer.RankBoss1, SDKServer)
    }

    /** 排行榜数据 */
    private static Data: {
        [type: string]: {
            num: number
            other?: string
        }
    } = {}

    /** 更新排行榜数据 */
    public static UpdateData(type: RankType, num: number, other?: string) {
        if (other)
            SDKServer.Data[type] = { num }
        else
            SDKServer.Data[type] = { num, other }
        // SDKServer.Save(type)
    }

    /** 获取服务器数据 */
    public static async Get() {
        return new Promise<string>((resolve, reject) => {
            if (!BuildSetting.OpenRank)
                resolve("")
            else if (!SDK.openId)
                resolve("")
         
            else {
                const send = {} as basesql
                send.id = SDK.openId;
                send.type = "1";

                SDK.post(SDKServer.URL + "get", send).then((data: {
                    code: CODE;
                    msg: basesql;
                }) => {
                    if (data.code == CODE.SUCCESS && data.msg)
                        resolve(data.msg.data)
                    else
                        resolve("")
                })
            }
        })
    }

    /** 保存数据 */
    public static Save(type?: RankType) {

        let save = GameStorage.Ins.Save();

       
            if (type)
                SDKServer.Savetype(type, save)
            else
                for (const type in SDKServer.Data)
                    SDKServer.Savetype(type, save)
       
    }

    private static Savetype(type: string, save: any) {
        if (!BuildSetting.OpenRank) return;
        if (!SDK.openId) return;
        if (!SDK.avatarUrl) return;

        const data = {} as basesql

        data.id = SDK.openId;
        data.url = SDK.avatarUrl;
        data.name = SDK.nickname;

        data.gameid = SDKServer.gameid;
        data.platform = SDKServer.platform;

        data.type = type
        data.num = SDKServer.Data[type].num;

        if (SDKServer.Data[type].other)
            data.rankData = SDKServer.Data[type].other

        if (type == RankType.Type1)
            data.data = save

        SDK.post(SDKServer.URL + "save", JSON.parse(JSON.stringify(data)))
    }

    private static ranks: { [path: number]: Rankdata } = {};

    /** 
     * 排行榜
     * @param type
     * @param value 
     * @returns 
     */
    public static async Rank(type: RankType) {
        return new Promise<Rankdata>(async (resolve, reject) => {
            if (!BuildSetting.OpenRank)
                resolve(SDKServer._Rank(type, []))
            else {
                let find = SDKServer.ranks[type]
                if (!find) {
                  
                        let res: {
                            code: CODE;
                            msg: any;
                        } = await SDK.post(SDKServer.URL + "rank", {
                            type: type,
                            platform: SDKServer.platform,
                            gameid: SDKServer.gameid
                        })

                        if (res) {
                            if (res.code == CODE.SUCCESS && typeof res.msg != "string") {
                                find = SDKServer._Rank(type, res.msg)
                                SDKServer.ranks[type] = find;
                                resolve(find)
                            } else
                                resolve(SDKServer._Rank(type, []))
                        } else
                            resolve(SDKServer._Rank(type, []))
                } else
                    resolve(SDKServer._Rank(type, find.data))
            }
        })
    }

    private static _Rank(type: RankType, data: basesql[]): Rankdata {
        let self = {} as basesql;
        if (BuildSetting.Zhise)
            self.id = SDK.userId;
        else
            self.id = SDK.openId;

        self.url = SDK.avatarUrl;
        self.name = SDK.nickname;
        self.type = type;

        self.num = SDKServer.Data[type].num;
        if (SDKServer.Data[type].other)
            self.rankData = SDKServer.Data[type].other

        const List = data.slice(0, 50);

        /** 排行榜中是否有自己数据 */
        const find = List.find(ele => {
            if (BuildSetting.Zhise)
                return ele.id == SDK.userId
            else
                return ele.id == SDK.openId
        })

        if (find) {
            find.id = self.id
            find.url = self.url
            find.name = self.name
            find.num = self.num
            find.rankData = self.rankData
        }
        else if (List.length < 50) {
            List.push(self)
        }
        else {
            List.sort((a, b) => { return Number(b.num) - Number(a.num) })

            if (Number(self.num) > Number(List[List.length - 1].num)) {
                List.pop()
                List.push(self)
            }
        }

        List.sort((a, b) => { return Number(b.num) - Number(a.num) })

        List.forEach((ele, index) => {
            ele.count = index + 1;
            if (ele.id == self.id)
                self.count = ele.count
        })

        return { self, data: List }
    }
}