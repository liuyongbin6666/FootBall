import { _decorator, Component, Node, Label, Button, find, Color, Sprite } from 'cc';
const { ccclass, property } = _decorator;

// 英雄基础数据结构
interface HeroBaseData {
    heroIndex: number;

    heroID: number;
    heroHeadImgPath: string;
    heroImgPath: string;
    heroName: string;
    heroIntroduce: string;
    quality: number;
    maxHP: number;
    harm: number;

    harmLevel: number;
    criticalLevel: number;
    breakOutLevel: number;
    HPLevel: number;
    skill1Level: number;
    skill2Level: number;
    skill3Level: number;
}

@ccclass('BattleHeroStateView')
export class BattleHeroStateView extends Component {
    
    @property(Node)//标签按钮容器
    private lay_tab: Node = null!;//标签按钮容器
    // 标签按钮数组
    private tabButtons: Node[] = [];
    
    // 当前选中的英雄索引
    private currentSelectHeroIndex: number = 0;
    
    // 上阵英雄数据列表（模拟数据，实际有2个英雄）
    private heroDataList: HeroBaseData[] = [
        { 
            heroIndex: 0, heroID: 1, heroHeadImgPath: "img/hero/heroHead/icon_heroHead_1", 
            heroImgPath: "img/hero/hero1", heroName: "小黄鸡", heroIntroduce: "小黄鸡的故事，是一只勇敢的小鸡！", 
            quality: 1, maxHP: 100, harm: 10, harmLevel: 1, criticalLevel: 0, breakOutLevel: 1, 
            HPLevel: 2, skill1Level: 3, skill2Level: 0, skill3Level: 0
        },
        { 
            heroIndex: 1, heroID: 2, heroHeadImgPath: "img/hero/heroHead/icon_heroHead_1", 
            heroImgPath: "img/hero/hero2", heroName: "小白鸡", heroIntroduce: "小白鸡的故事，是一只聪明的小鸡！", 
            quality: 1, maxHP: 80, harm: 15, harmLevel: 0, criticalLevel: 1, breakOutLevel: 1, 
            HPLevel: 2, skill1Level: 1, skill2Level: 1, skill3Level: 0
        }
    ];

    // 信息面板组件
    private btn_exit: Button | null = null;//退出按钮

    private img_avatarBg: Sprite | null = null;//头像框
    private img_avatar: Sprite | null = null;//头像
    private lab_heroName: Label | null = null;//英雄名
    private lab_harm: Label | null = null;
    private lab_maxHP: Label | null = null;
    private lab_heroIntroduce: Label | null = null;

    private btn_remove: Button | null = null;//移除按钮

    //标签按钮
    private btn_1: Button | null = null;//btn_1 序列1的英雄的按钮
    private lab_1: Label | null = null;//lab_1 序列1的英雄名

    private btn_2: Button | null = null;//btn_2 序列2的英雄的按钮
    private lab_2: Label | null = null;//lab_2 序列2的英雄名

    private btn_3: Button | null = null;//btn_3 序列3的英雄的按钮
    private lab_3: Label | null = null;//lab_3 序列3的英雄名

    private btn_4: Button | null = null;//btn_4 序列4的英雄的按钮
    private lab_4: Label | null = null;//lab_4 序列4的英雄名

    private btn_5: Button | null = null;//btn_5 序列5的英雄的按钮
    private lab_5: Label | null = null;//lab_5 序列5的英雄名

    private btn_6: Button | null = null;//btn_6 序列6的英雄的按钮
    private lab_6: Label | null = null;//lab_6 序列6的英雄名

    private btn_7: Button | null = null;//btn_7 序列7的英雄的按钮
    private lab_7: Label | null = null;//lab_7 序列7的英雄名

    protected onLoad(): void {
        this._initObject();
        this._initTabs();
        this._onEvent();
    }

    start() {
        this.refreshHeroInfo(0);
    }

    update(deltaTime: number) {
        
    }

    private _initObject(): void {
        this.btn_exit = find('btn_exit', this.node)?.getComponent(Button) || null;

        this.img_avatarBg = find('lay_window/lay_main/lay_heroInfo/img_avatarBg', this.node)?.getComponent(Sprite) || null;
        this.img_avatar = find('lay_window/lay_main/lay_heroInfo/img_avatarBg/img_avatar', this.node)?.getComponent(Sprite) || null;
        this.lab_heroName = find('lay_window/lay_main/lay_heroInfo/img_avatarBg/lab_heroName', this.node)?.getComponent(Label) || null;
        
        this.lab_harm = find('lay_window/lay_main/lay_heroInfo/base/harm/lab_harm', this.node)?.getComponent(Label) || null;
        this.lab_maxHP = find('lay_window/lay_main/lay_heroInfo/base/maxHP/lab_maxHP', this.node)?.getComponent(Label) || null;
        this.lab_heroIntroduce = find('lay_window/lay_main/lay_heroInfo/img_heroIntroduce/lab_heroIntroduce', this.node)?.getComponent(Label) || null;
        
        this.btn_remove = find('lay_window/lay_main/lay_operate/btn_remove', this.node)?.getComponent(Button) || null;

        this.btn_1 = find('lay_window/lay_tab/btn_1', this.node)?.getComponent(Button) || null;
        this.lab_1 = find('lay_window/lay_tab/btn_1/lab_1', this.node)?.getComponent(Label) || null;
        this.btn_2 = find('lay_window/lay_tab/btn_2', this.node)?.getComponent(Button) || null;
        this.lab_2 = find('lay_window/lay_tab/btn_2/lab_2', this.node)?.getComponent(Label) || null;
        this.btn_3 = find('lay_window/lay_tab/btn_3', this.node)?.getComponent(Button) || null;
        this.lab_3 = find('lay_window/lay_tab/btn_3/lab_3', this.node)?.getComponent(Label) || null;
        this.btn_4 = find('lay_window/lay_tab/btn_4', this.node)?.getComponent(Button) || null;
        this.lab_4 = find('lay_window/lay_tab/btn_4/lab_4', this.node)?.getComponent(Label) || null;
        this.btn_5 = find('lay_window/lay_tab/btn_5', this.node)?.getComponent(Button) || null;
        this.lab_5 = find('lay_window/lay_tab/btn_5/lab_5', this.node)?.getComponent(Label) || null;
        this.btn_6 = find('lay_window/lay_tab/btn_6', this.node)?.getComponent(Button) || null;
        this.lab_6 = find('lay_window/lay_tab/btn_6/lab_6', this.node)?.getComponent(Label) || null;
        this.btn_7 = find('lay_window/lay_tab/btn_7', this.node)?.getComponent(Button) || null;
        this.lab_7 = find('lay_window/lay_tab/btn_7/lab_7', this.node)?.getComponent(Label) || null;
    }

private _initTabs(): void {
    if (!this.lay_tab) return;       // 防护性检查
    this.tabButtons = [];             // 清空旧的按钮数组
    
    for (let i = 0; i < 7; i++) {    // 遍历最多7个标签位
        const tabNode = find(`lay_window/lay_tab/btn_${i + 1}`, this.lay_tab);  // 查找节点
        if (tabNode) {
            this.tabButtons.push(tabNode);  // 加入数组
            
            if (i < this.heroDataList.length) {  // 有英雄数据
                tabNode.active = true;           // 显示按钮
                const heroData = this.heroDataList[i];
                const labName = find(`lab_${i + 1}`, tabNode)?.getComponent(Label);//查找英雄名标签
                if (labName) {
                    labName.string = heroData.heroName;  // 设置英雄名
                }
            } else {
                tabNode.active = false;  // 无数据则隐藏按钮
            }
        }
    }
    
    this.updateTabSelectState();  // 更新选中状态
}

    private _onEvent(): void {
        for (let i = 0; i < this.tabButtons.length; i++) {
            if (i < this.heroDataList.length) {
                this.tabButtons[i].on(Node.EventType.TOUCH_END, () => {
                    this.onTabClick(i);
                }, this);
            }
        }
    }

    private onTabClick(index: number): void {
        if (index < 0 || index >= this.heroDataList.length) return;
        
        this.currentSelectHeroIndex = index;
        this.updateTabSelectState();
        this.refreshHeroInfo(index);
    }

    private updateTabSelectState(): void {
        for (let i = 0; i < this.tabButtons.length; i++) {
            if (i < this.heroDataList.length) {
                const tabNode = this.tabButtons[i];
                const btnComponent = tabNode.getComponent(Button);
                
                if (i === this.currentSelectHeroIndex) {
                        tabNode.getComponent(Sprite)!.color = new Color(255, 200, 100, 255);
                } else {
                    tabNode.getComponent(Sprite)!.color = new Color(255, 255, 255, 255);
                }
            }
        }
    }

    private refreshHeroInfo(index: number): void {
        if (index < 0 || index >= this.heroDataList.length) return;
        
        const heroData = this.heroDataList[index];
        
        if (this.lab_heroName) this.lab_heroName.string = heroData.heroName;
        if (this.lab_heroIntroduce) this.lab_heroIntroduce.string = heroData.heroIntroduce;
        if (this.lab_maxHP) this.lab_maxHP.string = `血量: ${heroData.maxHP}`;
        if (this.lab_harm) this.lab_harm.string = `伤害: ${heroData.harm}`;
    }
}


