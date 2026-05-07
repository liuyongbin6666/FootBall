/**
 * @file PoolMgrTest.ts
 * @description PoolMgr测试脚本
 */

import { _decorator, Component, Node } from 'cc';
import { PoolMgr } from '../PoolMgr';
import { LogMgr } from '../LogMgr';
import { DefaultPoolItem, PoolItemType, IPoolItem } from '../PoolItem';

const { ccclass, property } = _decorator;

/**
 * PoolMgr测试组件
 */
@ccclass('PoolMgrTest')
export class PoolMgrTest extends Component {

    onLoad() {
        this.runTest();
    }

    private runTest() {
        LogMgr.Ins.info(`[PoolMgrTest] 开始测试对象池管理器`);

        try {
            // 测试1：初始化
            PoolMgr.Ins.init();
            LogMgr.Ins.info(`[PoolMgrTest] 初始化测试通过`);

            // 测试2：创建对象池
            const createResult = PoolMgr.Ins.createPool('TestPool', {
                maxSize: 10,
                initSize: 2,
                factory: (): IPoolItem => {
                    const node = new Node('TestNode');
                    // 添加DefaultPoolItem组件
                    const poolItem = node.addComponent(DefaultPoolItem) as DefaultPoolItem;
                    poolItem.poolId = 'TestPool';
                    poolItem.poolType = PoolItemType.NODE;
                    return poolItem;
                }
            });
            LogMgr.Ins.info(`[PoolMgrTest] 创建对象池测试: ${createResult ? '通过' : '失败'}`);

            // 测试3：获取对象
            const item = PoolMgr.Ins.get('TestPool');
            LogMgr.Ins.info(`[PoolMgrTest] 获取对象测试: ${item ? '通过' : '失败'}`);

            // 测试4：回收对象
            if (item) {
                const putResult = PoolMgr.Ins.put(item);
                LogMgr.Ins.info(`[PoolMgrTest] 回收对象测试: ${putResult ? '通过' : '失败'}`);
            }

            // 测试5：清理对象池
            PoolMgr.Ins.clearPool('TestPool', true);
            LogMgr.Ins.info(`[PoolMgrTest] 清理对象池测试通过`);

            LogMgr.Ins.info(`[PoolMgrTest] 所有测试完成`);

        } catch (error) {
            LogMgr.Ins.error(`[PoolMgrTest] 测试失败: ${error}`);
        }
    }
} 