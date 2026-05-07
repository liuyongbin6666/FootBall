
declare module zs_sdk {
    
    class zs_network {
        /**  
         * 初始化sdk
           */
        static init(): Promise<void>;
        /**  
         * 
         * @param isSwitch 是否为开关类型（开关类型不需要传入表名）
         * @param table 配置表名,不填写获取模块下所有表
           */
        static config(isSwitch?: boolean, table?: string): Promise<any>;
    }

    class zs_dyzt {
        /**  
         * 
         * @param isFinish 视频是否播完
           */
        static checkVideoReport(isFinish: boolean)
    }
}