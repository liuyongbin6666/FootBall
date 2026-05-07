import { testPlayer, testPlayerInfo } from './testPlayer';

/**
 * testPlayer使用示例
 * 展示如何使用自动类型系统
 */
export class TestPlayerExample {
    
    /**
     * 基础使用示例
     */
    public static basicUsage(): void {
        console.log('=== testPlayer 基础使用示例 ===');
        
        // 创建玩家实例
        const player = new testPlayer();
        
        // 设置玩家信息
        player.setName('英雄');
        
        // 获取玩家类型（直接使用类名）
        console.log('玩家类型:', player.getEntityType()); // 应该输出 'testPlayer'
        
        // 获取玩家信息
        console.log('玩家名称:', player.playerInfo.name);
        console.log('玩家等级:', player.playerInfo.level);
        console.log('玩家生命值:', player.playerInfo.hp);
        
        // 增加经验值
        const leveledUp = player.addExp(150);
        console.log('是否升级:', leveledUp);
        console.log('新等级:', player.playerInfo.level);
        console.log('剩余经验:', player.playerInfo.exp);
    }
    
    /**
     * 直接创建实例示例
     */
    public static directCreationExample(): void {
        console.log('\n=== 直接创建实例示例 ===');
        
        // 直接创建testPlayer实例
        const player = new testPlayer();
        
        if (player) {
            player.setName('直接创建的玩家');
            console.log('玩家名称:', player.playerInfo.name);
            console.log('玩家类型:', player.getEntityType());
        }
        
        console.log('Entity类型:', player.getEntityType());
    }
    
    /**
     * 数据持久化示例
     */
    public static dataPersistenceExample(): void {
        console.log('\n=== 数据持久化示例 ===');
        
        const player = new testPlayer();
        
        // 设置初始数据
        player.setName('持久化测试玩家');
        player.addExp(250);
        
        // 导出数据
        const exportData = player.exportDBContext();
        console.log('导出的数据:', exportData);
        
        // 创建新实例并导入数据
        const newPlayer = new testPlayer();
        newPlayer.onSetDBContext(exportData);
        
        console.log('导入后的玩家名称:', newPlayer.playerInfo.name);
        console.log('导入后的玩家等级:', newPlayer.playerInfo.level);
        console.log('导入后的玩家经验:', newPlayer.playerInfo.exp);
    }
    
    /**
     * 完整游戏场景示例
     */
    public static gameSceneExample(): void {
        console.log('\n=== 游戏场景示例 ===');
        
        // 创建多个玩家
        const players: testPlayer[] = [];
        
        for (let i = 1; i <= 3; i++) {
            const player = new testPlayer();
            player.setName(`玩家${i}`);
            player.addExp(i * 100);
            players.push(player);
        }
        
        // 显示所有玩家信息
        players.forEach((player, index) => {
            console.log(`\n玩家${index + 1}信息:`);
            console.log(`  名称: ${player.playerInfo.name}`);
            console.log(`  等级: ${player.playerInfo.level}`);
            console.log(`  经验: ${player.playerInfo.exp}`);
            console.log(`  生命值: ${player.playerInfo.hp}`);
            console.log(`  攻击力: ${player.playerInfo.attack}`);
            console.log(`  防御力: ${player.playerInfo.defense}`);
            console.log(`  金币: ${player.playerInfo.gold}`);
            console.log(`  钻石: ${player.playerInfo.diamond}`);
            console.log(`  类型: ${player.getEntityType()}`);
        });
        
        // 模拟战斗升级
        console.log('\n=== 战斗升级模拟 ===');
        const mainPlayer = players[0];
        
        for (let round = 1; round <= 5; round++) {
            const expGained = Math.floor(Math.random() * 50) + 10;
            const leveledUp = mainPlayer.addExp(expGained);
            
            console.log(`第${round}轮战斗获得${expGained}经验`);
            if (leveledUp) {
                console.log(`🎉 玩家升级了！当前等级: ${mainPlayer.playerInfo.level}`);
            }
        }
        
        console.log(`\n最终状态:`);
        console.log(`等级: ${mainPlayer.playerInfo.level}`);
        console.log(`经验: ${mainPlayer.playerInfo.exp}`);
    }
    
    /**
     * 运行所有示例
     */
    public static runAllExamples(): void {
        console.log('🚀 开始运行testPlayer示例...\n');
        
        this.basicUsage();
        this.directCreationExample();
        this.dataPersistenceExample();
        this.gameSceneExample();
        
        console.log('\n✅ 所有示例运行完成！');
    }
}

// 导出示例类，方便在其他地方使用
export default TestPlayerExample; 