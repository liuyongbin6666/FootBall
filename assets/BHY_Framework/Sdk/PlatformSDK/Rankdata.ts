
export class basesql {
    /** 玩家id  */
    id?: number | string

    /** 头像  */
    url: string
    /** 昵称  */
    name: string

    /** 游戏id */
    gameid: string

    /** 平台[wx/tt/ks]  */
    platform: string

    /** 排行榜类型  */
    type: string

    /** 数值  */
    num: number

    /** 排行榜额外数据  */
    rankData: string

    /** 其他压缩数据 */
    data: string

    /** 排名  */
    count: number
}

export class Rankdata {
    /** 排行数据  */
    data: basesql[] = []

    /** 自己数据  */
    self: basesql
}