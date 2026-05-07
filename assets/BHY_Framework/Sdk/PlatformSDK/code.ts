export enum CODE {
    SUCCESS = 200,
    FAIL
}

// /**   错误类型字符串   */
// export const CodeString = new Map<number, string>([
//     [CODE.SUCCESS, "ok"],
//     [CODE.FAIL, "faild"]
// ])
// /**  
//  * 错误信息返回
//  * @param code
//  * @returns
//    */
// export function Reply(code: CODE, msg?: any): { code: CODE, msg: string } {
//     return { code: code, msg: msg ? msg : CodeString.get(code) }
// }