# 指色SDK使用说明

## 快速集成 

1. 将`seeg_sdk`文件夹拖到Cocos项目中或在构建后的的game.js中引用；
    - 如果无需td，直接使用seeg.js
    - 如果需要td，使用seeg_td.js (sdk大35kb左右)
- 注意
    1. seeg与seeg_td只能接入其中一个
    2. 如果不清楚td是什么，务必与运营沟通，如果选择了接入seeg_td但是没有填写td参数，SDK将无法初始化
2. 添加域名白名单(request白名单):
    - `https://gamesapi2.aslk2018.com`
    - 如果是集成了TD版本 `https://h5.udrig.com`
    - 如果账号由我方运营提供，请提醒我方运营加入白名单
3. 找运营提供参数
    - 由我方提供gid参数，gid参数形式为平台标识_英文游戏名
    - 如果集成TD版本，则需要提供TD参数

**注意**
 - 如果是直接在Cocos工程里面引用，拖入即可，不需要导入为插件
 - 如果是在构建后的项目里引用，仅需在game.js中引用即可，如下
 ```
 // game.js
 // 2.x
 require('./adapter-min.js');

 // 3.x
require('./web-adapter');

// 正确引用方式
require('seeg.js');
// td版本
require('seeg_td.js');
// 错误引用方式
const seeg = requrie('seeg.js');

// 执行语句即可
seeg.init({gid: 'ks_xxx'});
// 集成TD
seeg.init({gid: 'ks_xxx', tdAppKey:'xxx'});
 ```

4. 查看是否有登录成功的日志

## 调用SDK

1. 调用初始化接口`seeg.init`

```
    /**
     * @description 初始化sdk
     * @param option sdk参数
     *      gid: 游戏id 
     *      loggerLevel: 打印等级
     *          0: 全部关闭(默认) 
     *          1: 打印错误信息 
     *          2: 打印警告信息 
     *          3: 打印普通信息 
     *          4: 打印调试信息 
     *          5: 打印全部信息 
     *      tdAppKey: 集成TD版本时，必须提供该参数
     *      old: 是否使用1.0.2(不含)以前的SDK升级而来 没有特殊标注，不要填写该值
     * @returns 
     */
    export function init(option: { gid: string, loggerLevel?: number, old?: boolean, tdAppKey?: string }): void;
```

- 请尽早调用该接口，让sdk初始化。
- gid为我方的游戏标识，以平台标识符开头的字符串，例如wx_xxx、ks_xxx、tt_xxx等, 默认不打印任何信息，如果需要调试，可以设置打印等级，打印等级越高能打印的信息越多，建议线上关闭
- 如果客户端有需要获取用户的登录态信息，可以调用登录监听接口`seeg.onLoginRet`，该接口一次监听只返回一次结果，目前仅提供openid信息

```
    /**
     * @description 
     * @param callback 回调方法
     *      ret: 回调参数
     *          openid: 用户的openid
     *          white: 是否白名单用户
     */
    export function onLoginRet(callback: (ret: { openid: string; white:boolean; }) => void): void;
```

2. 调用广告上报接口`seeg.reportAd`

```
    /**
     * @description 上报广告事件
     * @param option 广告事件参数
     *      complete 广告是否观看完成
     *      
     */
    export function reportAd(option: { complete: boolean }): void;
```

- 广告关闭后，调用该接口（广告加载失败或展示失败，无需调用该接口）

3. 用户数据存储

**使用该接口，务必先与我方运营确认**

```
    /**
     * @description 获取用户远程存储数据
     * @param callback errCode 错误码 errMsg 错误信息 data 用户数据
     */
    export function getUserData(callback: { errCode: number; errMsg?: string; data?: any }): void;

    /**
     * @description 上传用户远程存储数据
     * @param data 用户数据
     */
    export function setUserData(data: { [key: string]: any }): void;
```

- 请注意，存储的频率控制在一分钟6次以下

4. 用户数据打点`seeg.onEvent`

```
    /**
     * @description 事件上报（目前上传到td）
     * @param eventId td的事件名
     * @param params 事件参数
     */
    export function onEvent(eventId: string, params: { [key: string]: number | string }): void;    
```

5. 获取游戏配置`seeg.getGameConfig`

```
    /**
     * @description 获取游戏配置
     * @param object 获取参数
     *        version: 获取配置的版本号 默认1.0.0
     *        success: 获取成功回调
     *        fail: 获取失败回调
     */
    export function getGameConfig(object: { version?:string; success?: (ret: any) => void, fail?: Function }): void;
```

6. 排行榜

分为省份排行榜和个人排行榜，具体请看api

- 省份排行榜
```
    /**
     * @description 获取省份代码
     * @returns 网络不畅，会返回空，请注意判断
     */
    export function getUserProvince(): Promise<{ province: string, province_code: string }>;

    /**
     * @description 获取省份排行
     * @param type 排行榜类型 与 addProvinceData 的type保持一致
     * @returns 
     */
    export function getProvinceList(type: string): Promise<{ list: { province: string; province_code: string; num: number }[] }>;

    /**
     * @description 增加省份排行榜数据
     * @param type 排行榜类型 类型自定义，有几个类型的排行榜，就定义几个type
     * @returns 
     */
    export function addProvinceData(type: string): void;
```

- 个人排行榜
```
/**
     * @description 获取个人排行
     * @param type 排行榜类型
     * @param limit 排行榜条数
     * @returns 网络不畅，会返回空，请注意判断
     */
    export function getRankList(type: string, limit = 100): Promise<{ list?: { uid: string; num: number; nickname: string; avatar: string; rank_data?: string }[] }>;

    /**
     * @description 修改个人日排行榜,隔天重置
     * @param type 排行榜类型
     * @param valueType 数值类型 1：累加 2：覆盖
     * @param num 数值
     * @param rankData 排行榜额外数据
     * @param limit 数量
     */
    export function changeDayRankData(type: string, valueType: 1 | 2, num: number, rankData = '', limit = 100): void;


    /**
     * @description 修改个人周排行榜，每周一重置
     * @param type 排行榜类型
     * @param valueType 数值类型 1：累加 2：覆盖
     * @param num 数值
     * @param rankData 排行榜额外数据
     * @param limit 数量
     */
    export function changeWeekRankData(type: string, valueType: 1 | 2, num: number, rankData = '', limit = 100): void;

    /**
     * @description 修改个人月排行榜 每月一号重置
     * @param type 排行榜类型
     * @param valueType 数值类型 1：累加 2：覆盖
     * @param num 数值
     * @param rankData 排行榜额外数据
     * @param limit 数量
     */
    export function changeMonthRankData(type: string, valueType: 1 | 2, num: number, rankData = '', limit = 100): void;
```

## 注意

1. 在网页模式下，本SDK将会产生一个临时的用户登录，该用户不会生成openid，仅供测试使用，请勿直接用于线上web环境


# 历史版本

|版本|描述|时间|
|-|-|-|
|1.0.6|增加排行榜api|2024-06-24|
|1.0.5|1. 网络请求优化，适配es5|2024-05-21|
|1.0.4|1. 获取后台配置能力|2024-05-06|
|1.0.3|1. 增加TD登录 2. 对外公开时间戳和数据存储|2024-03-11|
|1.0.2|1. 修改快手登录方式|2024-01-11|
|1.0.1|1. 增加打印控制|2024-01-06|
|1.0.0|初始版本|2023-12-25|