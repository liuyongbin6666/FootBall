import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

/**
 * 字符处理工具
 */
@ccclass('CharacterTool')
export class CharacterTool extends Component {
    private static _instance: CharacterTool = null;

    public static get Instance() {
        if (this._instance == null) {
            this._instance = new CharacterTool();
        }

        return this._instance;
    }

    //去掉指定字符
    removeFixedString(originalString: string, fixedSubstring: string): string {
        return originalString.replace(fixedSubstring, '');
    }

    //金额超过4位数 按照格式 100,00.00
    moneyType(money:number): string {
        //计算有几位小数
        const result = (money.toString()).indexOf('.');
        var moneyStr:string = money.toString();
        if(result !== -1)
        {
            if(money.toString().split('.')[1].length == 1)
            {
                //当只有1位小数时，补个字符0
                moneyStr = money.toString() + "0";
            }
        }else{
            //当没有小数时，补2个字符0
            moneyStr = money.toString() + ".00";
        }
        var newMoneyStr:string = "";
        for(var s:number = 0;s < moneyStr.length;s++)
        {
            if(s > 0 && s % 3 == 0 && s < moneyStr.length - 3)
            {
                newMoneyStr = newMoneyStr + "," + moneyStr[s];
            }else{
                newMoneyStr += moneyStr[s];
            }
        }
        return newMoneyStr;
    }

    //比较字符相似度
    levenshteinDistance(a: string, b: string): number {
        let m = a.length;
        let n = b.length;
        let dp = new Array(m + 1).fill(0).map(() => new Array(n + 1).fill(0));
     
        for (let i = 0; i <= m; i++) {
            dp[i][0] = i;
        }
     
        for (let j = 0; j <= n; j++) {
            dp[0][j] = j;
        }
     
        for (let i = 1; i <= m; i++) {
            for (let j = 1; j <= n; j++) {
                if (a[i - 1] === b[j - 1]) {
                    dp[i][j] = dp[i - 1][j - 1];
                } else {
                    dp[i][j] = Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]) + 1;
                }
            }
        }
     
        return dp[m][n];
    }

    //字竖直排列
    verticalText(char:string):string
    {
        var newChar:string = "";
        for(var i:number = 0;i < char.length;i++)
        {
            if(i == char.length - 1)
            {
                //最后一个字符不换行
                newChar += char[char.length - 1];
            }else{
                newChar += char[i] + "\n";
            }
        }
        return newChar;
    }

    //文件路径字符全局替换 默认用符号/替换符号- -可以改成其他符号
    pathCharacter(originalStr:string):string
    {
        var newPath:string = originalStr.replace(/-/g,"/");
        return newPath;
    }

    //文本换行 默认用符号\n替换符号-n -n可以改成其他符号
    lineFeed(originalStr:string):string
    {
        var newStr:string = originalStr.replace(/-n/g,"\n");
        return newStr;
    }
}


