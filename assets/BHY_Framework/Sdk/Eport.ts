import { SDK } from "./SDK";


/**  新进玩家事件   */
export enum NewEventId {
  /**   进入游    */  NewEvent1 = 1,
  /**   开始加载资    */  NewEvent2,
  /**   开始加载 开始界    */  NewEvent3,
  /**   开始界面 加载完    */  NewEvent4,
  /**   显示开始界    */  NewEvent5,
  /**   确认开启新故事(v1 1:男性 2:女性    */  NewEvent6,
  /**   开始人    */  NewEvent7,
  /**   显示主界    */  NewEvent8,

  /**   结婚(2人口)解锁成就系    */  NewEvent9,
  /**  (5人口)解锁城    */  NewEvent10,

  /**  (开始人生)天赋未选    */  NewEvent11,
  /**  (开始人生)属性未分配    */  NewEvent12,


  /**   第一个结婚事件 (v1 1:结婚 2:未结婚)    */  NewEvent13,
  /**   第一个婚礼事件 (v1 1:朴素婚礼 2:奢靡婚礼 3:浪漫岛婚礼)    */  NewEvent14,
  /**   第一个生娃事件 (v1 1:生 2:不生)    */  NewEvent15,
}


/**  游戏过程数据上报i    */
export enum GameEventId {
  /**   家庭  随后每增加10个人口上传一次打点(v1 人口数    */  Event1 = 1,
  /**   购买房屋(v1 建筑名    */  Event2,
  /**   房屋升级(v1 建筑名    */  Event3,
  /**   购买店铺(v1 建筑名    */  Event4,
  /**   店铺升级(v1 建筑名    */  Event5,
  /**   游戏失败(v1 人口数    */  Event6,
  /**   点击终止家族    */  Event7,
}


/**  广告点击分    */
export enum EportVideo {
  /** 刷新天赋 */  Id1 = 1,
  /** 增加天赋 */  Id2 = 2,
  /** 签到 再签一次 */  Id3 = 3,
  /** 恢复所有挖矿体力 */  Id4 = 4,
  /** 购买所有资源 */  Id5 = 5,
  /** 自动战斗增加时间 */  Id6 = 6,
  /** 开启宝箱 */  Id7 = 7,
  /** 购买商品 */  Id8 = 8,
  /** 锁妖塔扫荡 */  Id9 = 9,
  /** 首领讨伐增加挑战次数 */  Id10 = 10,
  /** 增加离线时间 */  Id11 = 11,
  /** 离线奖励双倍领取 */  Id12 = 12,

}

export class Eport {
  /**  新进玩家事    */
  public static NewEvent(id: NewEventId, v1 = null) {
    SDK.eportAnalytics(`NewEvent${id}`, v1)
  }

  public static GameEvent(id: GameEventId, v1 = null) {
    SDK.eportAnalytics(`Event${id}`, v1)
  }

  /**  新手引    */
  public static Guide(id: number) {
    SDK.eportAnalytics(`Guide${id}`)
  }

  /**  成    */
  public static Chengjiu(id: number) {
    SDK.eportAnalytics(`Chengjiu${id}`)
  }


  /**  错误上    */
  public static onError(v1?: string) {
    console.error(v1)
    SDK.eportAnalytics("onError", v1)
  }
}