import { Node } from 'cc';
import { UIAnimationType } from '../Enums/UIAnimationType';
import { UILayerType } from '../Enums/UILayerType';

/**
 * UI面板接口
 * 定义UI面板必须实现的方法
 */
export interface IUIPanel {
    /** 获取面板根节点 */
    getRoot(): Node;
    
    /** 获取面板层级类型 */
    getUILayerType(): UILayerType;
    
    /** 获取面板打开动画类型 */
    getOpenAnimationType(): UIAnimationType;
    
    /** 获取面板关闭动画类型 */
    getCloseAnimationType(): UIAnimationType;
    
    /** 面板是否可见 */
    isVisible(): boolean;
    
    /**
     * 打开面板
     * @param data 面板参数
     */
    open(data?: any): Promise<void>;
    
    /**
     * 关闭面板
     */
    close(): Promise<void>;
    
    /**
     * 显示面板
     * @param data 面板参数
     */
    show(data?: any): Promise<void>;
    
    /**
     * 隐藏面板
     */
    hide(): Promise<void>;
    
    /**
     * 更新面板数据
     * @param data 面板数据
     */
    updateData(data: any): void;
    
    /**
     * 刷新面板显示
     */
    refresh(): void;
} 