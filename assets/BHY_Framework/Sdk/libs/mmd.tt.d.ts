
declare namespace tt {

  /**  ***********************************************************   */
  /**  ***************          摩摩达SDK-抖音     ****************    */
  /**  **********************************************************    */

     /**  
     * 初始化SDK
     *
     * @param gameCode  游戏Code
     * @param version   游戏版本
     * @param _callBack *  参数说明:
     * {}         对象               返回用户信息
     * version     string                版本                   
     * userCode    string               用户code, 用户唯一编号
     * params       Object              游戏发行方配置的参数, 根据情况使用
     * 
     *  */
    export function mmdInitSDK(gameCode: String, version: String, _callBack: Function):void;



    /**  
     * 事件统计
     *
     * @param eventname  事件名
     * @param detail     事件详情 {'xx': 'xx'}
     * @param _callBack  失败或成功回调msg(非必传)
     * 参数       类型                  说明
     * {}         对象               返回成功或失败信息
     *  */
     export function mmdEvent(eventname: String, detail: any, _callBack: Function):void;


    /**  
     * 广告打点
     *
     * @param type  广告类型 0: banner 1: 激励视频 2: 插屏 3: 格子 4: 封面 5: 模板
     * @param adId  广告ID
     * @param place  广告位置
     * @param status  广告状态 0 拉取 1 曝光 2 完播
     * @param _callBack  失败或成功回调msg(非必传)
     * 参数       类型                  说明
     * {}         对象               返回成功或失败信息
     *  */
     export function mmdAd(type: Number, adId: String, place: String, status: Number, _callBack: Function):void;


     /**  
     * 支付打点
     *
     * @param tradeNo   交易单号
     * @param payTime   支付毫秒时间戳
     * @param payAmount   支付金额(单位分)
     * @param area   游戏区服
     * @param _callBack   失败或成功回调msg(非必传)
     * 参数       类型                  说明
     * {}         对象               返回成功或失败信息
     *  */
      export function mmdPay(tradeNo: String, payTime: Number, payAmount: Number, area: String, _callBack: Function):void;
     
     
     
      /**  
     * 聊天打点
     * @param type  聊天类型 0: 世界聊天、 1：工会聊天、2：私聊
     * @param name  用户名
     * @param content  聊天内容
     * @param args  额外参数
     * @param _callBack  失败或成功回调msg(非必传)
     *  */
      export function mmdChat(type: Number, name: String, content: String, args: Object, _callBack: Function):void;



      /**  
       * 用户反馈
       * @param type  反馈类型 0: 充值问题  1：账号问题  2：BUG反馈  3：游戏建议  4：其它问题
       * @param date  问题发生时间
       * @param explain  问题描述
       * @param imagePath  图片路径 无图片传: [] 图片路径通过tt.chooseImage()获取
       * @param args  额外参数
       * @param _callBack  失败或成功回调msg
       *  */
       export function mmdFeedback(type: Number, date: String, explain: String, imagePath:any [], args: Object, _callBack: Function):void;
       


       
       /**  
       * 获取用户反馈列表
       * @param _callBack  返回用户反馈列表
       *  */
       export function mmdFeedbackList(_callBack: Function):void;
  


    /**  
      * 抖音虚拟支付(包含IOS支付)
      * @param orderId // 订单号
      * @param buyQuantity // 购买数量
      * @param amount // 金额(单位: 分)
      * @param zoneId // 区服
      * @param args // 额外参数
      * @param _callBack // 失败或成功回调msg
     *  */
     export function mmdAllPay(orderId: String, buyQuantity: Number, amount: Number, zoneId: String, args: Object, _callBack: Function):void;



    /**  
     * IOS支付(获取微信支付链接)
     * @param orderId // 订单号
     * @param amount // 金额(单位: 分)
     * @param args // 额外参数(希望回传时带上的参数, 非必传)
     * @param _callBack // 失败或成功回调msg 成功返回链接
     *  */
     export function mmdIOSWxPay(orderId: String, amount: Number, args: Object, _callBack: Function):void;



      /**  
     * 提现
     * 
     * @param _callBack // 失败或成功回调的结果集(必传)
     * 
     * 回调字段       类型                  说明
     *                对象               成功或失败返回的信息
     * {
     *  code         Number              0: 成功, 其他: 失败                    
     *  data         Object              包含平台原始交易流水信息 
     *  info         String              失败信息
     *  time         Number              处理时间戳
     * }         
     *  */
       export function mmdExchange(_callBack: Function):void;
     

     
      /**  
     * 获取用户信息
     * @param _callBack   返回用户信息
     * 参数        类型                  说明
     * {}          对象      
     * version     string                版本                   
     * userCode    string               用户code, 用户唯一编号
     *  */
      export function mmdUserInfo(_callBack: Function):void;

      
      /**  
     * 用户主动发起分享
     * @param object   Object
     * 具体参数情况请查看 https://developer.open-douyin.com/docs/resource/zh-CN/mini-game/develop/api/retweet/tt-share-app-message
     * 
     * @param scene   String 场景值
     *  */
      export function mmdShare(object: Object, scene: String):void;


      /**  
     * 监听分享处理
     * @param _callBack   返回渠道用于判断
     *  */
       export function mmdShareChannelHandle(_callBack: Function):void;

}
