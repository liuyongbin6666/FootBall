import { BaseEntity } from '../core/BaseEntity';
import { BaseComponent } from '../core/BaseComponent';

/**
 * 简单的Entity示例
 * 直接使用constructor.name作为类型名称
 */
export class SimplePlayerEntity extends BaseEntity {
    private playerName: string = '';
    
    public setPlayerName(name: string): void {
        this.playerName = name;
    }
    
    public getPlayerName(): string {
        return this.playerName;
    }
    
    // 不需要重写getEntityType()，直接使用父类的实现
    // 父类会返回 this.constructor.name，即 'SimplePlayerEntity'
}

/**
 * 简单的Component示例
 * 直接使用constructor.name作为类型名称
 */
export class SimpleMovementComponent extends BaseComponent {
    private speed: number = 5;
    
    public setSpeed(speed: number): void {
        this.speed = speed;
    }
    
    public getSpeed(): number {
        return this.speed;
    }
    
    // 不需要重写getType()，直接使用父类的实现
    // 父类会返回 this.constructor.name，即 'SimpleMovementComponent'
}

/**
 * 使用示例
 */
export class SimpleTypeUsageExample {
    
    public static demonstrateSimpleTypes(): void {
        console.log('=== 简单类型使用示例 ===');
        
        // 创建Entity和Component实例
        const player = new SimplePlayerEntity();
        const movement = new SimpleMovementComponent();
        
        // 设置属性
        player.setPlayerName('简单玩家');
        movement.setSpeed(10);
        
        // 获取类型名称（直接使用类名）
        console.log('玩家类型:', player.getEntityType()); // 输出: 'SimplePlayerEntity'
        console.log('移动组件类型:', movement.getType()); // 输出: 'SimpleMovementComponent'
        
        // 使用组件
        player.addComponent(movement);
        
        console.log('玩家名称:', player.getPlayerName());
        console.log('移动速度:', movement.getSpeed());
    }
    
    public static demonstrateTypeConsistency(): void {
        console.log('\n=== 类型一致性示例 ===');
        
        // 创建多个实例验证类型一致性
        const players: SimplePlayerEntity[] = [];
        const movements: SimpleMovementComponent[] = [];
        
        for (let i = 0; i < 3; i++) {
            const player = new SimplePlayerEntity();
            const movement = new SimpleMovementComponent();
            
            players.push(player);
            movements.push(movement);
        }
        
        // 验证所有实例的类型名称一致
        const playerType = players[0].getEntityType();
        const movementType = movements[0].getType();
        
        console.log('所有玩家类型一致:', players.every(p => p.getEntityType() === playerType));
        console.log('所有移动组件类型一致:', movements.every(m => m.getType() === movementType));
        
        console.log('玩家类型:', playerType);
        console.log('移动组件类型:', movementType);
    }
    
    public static demonstrateInheritance(): void {
        console.log('\n=== 继承示例 ===');
        
        // 继承Entity
        class AdvancedPlayerEntity extends SimplePlayerEntity {
            private level: number = 1;
            
            public setLevel(level: number): void {
                this.level = level;
            }
            
            public getLevel(): number {
                return this.level;
            }
        }
        
        // 继承Component
        class AdvancedMovementComponent extends SimpleMovementComponent {
            private direction: { x: number, y: number } = { x: 0, y: 0 };
            
            public setDirection(x: number, y: number): void {
                this.direction = { x, y };
            }
            
            public getDirection(): { x: number, y: number } {
                return this.direction;
            }
        }
        
        const advancedPlayer = new AdvancedPlayerEntity();
        const advancedMovement = new AdvancedMovementComponent();
        
        advancedPlayer.setPlayerName('高级玩家');
        advancedPlayer.setLevel(10);
        advancedMovement.setSpeed(15);
        advancedMovement.setDirection(1, 0);
        
        console.log('高级玩家类型:', advancedPlayer.getEntityType()); // 输出: 'AdvancedPlayerEntity'
        console.log('高级移动组件类型:', advancedMovement.getType()); // 输出: 'AdvancedMovementComponent'
        
        console.log('玩家名称:', advancedPlayer.getPlayerName());
        console.log('玩家等级:', advancedPlayer.getLevel());
        console.log('移动速度:', advancedMovement.getSpeed());
        console.log('移动方向:', advancedMovement.getDirection());
    }
    
    public static runAllExamples(): void {
        console.log('🚀 开始运行简单类型示例...\n');
        
        this.demonstrateSimpleTypes();
        this.demonstrateTypeConsistency();
        this.demonstrateInheritance();
        
        console.log('\n✅ 所有简单类型示例运行完成！');
    }
}

// 导出示例类
export default SimpleTypeUsageExample; 