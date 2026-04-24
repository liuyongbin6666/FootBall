import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

/**
 * 运算工具
 */
@ccclass('OperationTool')
export class OperationTool extends Component {
    private static _instance: OperationTool = null;

    public static get Instance() {
        if (this._instance == null) {
            this._instance = new OperationTool();
        }

        return this._instance;
    }

    //保留小数点后x位数
    public retainDecimal(dot:number,gold:number):number
    {
       var newGold = parseFloat(gold.toFixed(dot));
       return newGold;
    }
    
    //计算两个点的角度 x1,y1 起点 x2,y2 终点
    public calculateAngle(x1:number, y1:number, x2:number, y2:number):number
    {
        // 计算x和y的差值
        const deltaY:number = y2 - y1;
        const deltaX:number = x2 - x1;
        
        // 使用Math.atan2计算角度（弧度）
        const radians:number = Math.atan2(deltaY, deltaX);
        
        // 将弧度转换为度
        const degrees:number = radians * (180 / Math.PI);
        
        return degrees;//-90
    }
    
    //两点之间的距离，计算长度
    public calculateDistance(x1:number, y1:number, x2:number, y2:number):number
    {
        const distance:number = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
        return distance;
    }

    //两个静止点之间，每次平均移动的像素距离（模拟tween） seconds 单次来或回消耗总秒数 executeSeconds 每多少秒执行一次 distance 两点距离
    public moveStaticDotDistance(seconds:number,executeSeconds:number,distance:number):number
    {
        //总移动次数 = 单次来或回消耗总秒数 ÷ 计时器毫秒
        var soccerMoveMax:number = seconds / executeSeconds;
        //每executeSeconds秒该条轴移动速度 = 两点距离 ÷ 总移动次数
        var lastMove:number = Math.abs(distance) / soccerMoveMax;
        //暂定保留两位小数点
        lastMove = OperationTool.Instance.retainDecimal(2,lastMove);
        return lastMove;
    }

    //两个动态点之间，每次平均移动的像素距离 seconds 总移动次数 moveTotal 已移动次数 distance 两点距离
    public moveDynamicDotDistance(seconds:number,moveTotal:number,distance:number):number
    {
        //剩余移动次数 = 总移动次数 - 已移动次数
        var lastSoccerMove:number = seconds - moveTotal;
        //每秒y轴移动速度 = 足球和敌人之间的y距离 ÷ 剩余移动次数
        var lastSpeedY:number = Math.abs(distance) / lastSoccerMove;
        lastSpeedY = OperationTool.Instance.retainDecimal(2,lastSpeedY);
        return lastSpeedY;
        //moveTotal++;
    }
}


