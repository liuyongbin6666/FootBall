import { _decorator } from 'cc';
import { BaseEntity } from '../core/BaseEntity';

/**
 * 玩家信息接口
 */
export interface testPlayerInfo {
    /** 玩家ID */
    id: string;
    /** 玩家名称 */
    name: string;
    /** 玩家等级 */
    level: number;
    /** 玩家经验 */
    exp: number;
    /** 玩家生命值 */
    hp: number;
    /** 玩家攻击力 */
    attack: number;
    /** 玩家防御力 */
    defense: number;
    /** 玩家金币 */
    gold: number;
    /** 玩家钻石 */
    diamond: number;
}

/**
 * 玩家实体类，继承自BaseEntity
 */
export class testPlayer extends BaseEntity {
    /** 玩家信息 */
    protected _playerInfo: testPlayerInfo = {
        id: '',
        name: '玩家',
        level: 1,
        exp: 0,
        hp: 100,
        attack: 10,
        defense: 5,
        gold: 0,
        diamond: 0
    };

    /**
     * 创建玩家实体
     * @param data 玩家数据
     * @returns 是否创建成功
     */
    public create(data?: any): boolean {
        const result = super.create(data);
        if (data) {
            this._playerInfo = { ...this._playerInfo, ...data };
        }
        return result;
    }

    /**
     * 设置持久化数据上下文
     * @param data 持久化数据
     * @returns 是否设置成功
     */
    public onSetDBContext(data: any): boolean {
        if (data && data.playerInfo) {
            this._playerInfo = { ...this._playerInfo, ...data.playerInfo };
        }
        return super.onSetDBContext(data);
    }

    /**
     * 导出持久化数据上下文
     * @returns 持久化数据
     */
    public exportDBContext(): any {
        return {
            playerInfo: { ...this._playerInfo }
        };
    }

    /**
     * 获取实体类型
     * @returns 实体类型
     */
    public getEntityType(): string {
        // 直接使用类名作为类型
        return this.constructor.name;
    }

    /**
     * 获取玩家信息
     * @returns 玩家信息
     */
    public get playerInfo(): testPlayerInfo {
        return this._playerInfo;
    }

    /**
     * 设置玩家名称
     * @param name 玩家名称
     */
    public setName(name: string): void {
        this._playerInfo.name = name;
    }

    /**
     * 增加经验值
     * @param exp 增加的经验值
     * @returns 是否升级
     */
    public addExp(exp: number): boolean {
        this._playerInfo.exp += exp;
        
        // 简单的升级逻辑
        const nextLevelExp = this._playerInfo.level * 100;
        if (this._playerInfo.exp >= nextLevelExp) {
            this._playerInfo.exp -= nextLevelExp;
            this._playerInfo.level++;
            return true;
        }
        
        return false;
    }
} 