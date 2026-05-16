import { _decorator, Component, Node, Label, Button, find, Color, Sprite, Layout, Prefab, instantiate } from 'cc';
import { Layer } from '../manager/Layer';
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

    // 英雄列表布局组件
    private lay_heroList: Layout | null = null;
    @property(Prefab)
    private heroListItem: Prefab = null;

    // 标签按钮布局组件
    private lay_tab: Layout | null = null;
    @property(Prefab)
    private tabItem: Prefab = null;
    // 标签按钮数组
    private tabButtons: Node[] = [];
    // 当前选中的英雄索引
    private currentSelectHeroIndex: number = 0;
    
    // 窗口节点
    private node_window: Node | null = null;
    // 窗口面板组件
    private btn_exit: Button | null = null;//退出按钮

    private img_avatarBg: Sprite | null = null;//头像框
    private img_avatar: Sprite | null = null;//头像
    private lab_heroName: Label | null = null;//英雄名
    private lab_harm: Label | null = null;
    private lab_maxHP: Label | null = null;
    private lab_heroIntroduce: Label | null = null;

    private btn_remove: Button | null = null;//移除按钮

    protected onLoad(): void {
        this._initObject();
        this._onEvent();
    }

    start() {
        this.node_window.active = false;
        this.refreshHeroInfo(0);
    }

    update(deltaTime: number) {
        
    }

    private _initObject(): void {
        this.lay_heroList = find('lay_heroList', this.node).getComponent(Layout);
        this.lay_tab = find('lay_tab', this.node).getComponent(Layout);
        this.updateHeros();
        
        this.node_window = find('node_window', this.node);
        this.btn_exit = find('node_window/btn_exit', this.node)?.getComponent(Button) || null;

        this.img_avatarBg = find('node_window/window/heroInfo/img_avatarBg', this.node)?.getComponent(Sprite) || null;
        this.img_avatar = find('node_window/window/heroInfo/img_avatarBg/img_avatar', this.node)?.getComponent(Sprite) || null;
        this.lab_heroName = find('node_window/window/heroInfo/img_avatarBg/lab_heroName', this.node)?.getComponent(Label) || null;
        
        this.lab_harm = find('node_window/window/heroInfo/base/harm/lab_harm', this.node)?.getComponent(Label) || null;
        this.lab_maxHP = find('node_window/window/heroInfo/base/maxHP/lab_maxHP', this.node)?.getComponent(Label) || null;
        this.lab_heroIntroduce = find('node_window/window/heroInfo/heroIntroduce/lab_heroIntroduce', this.node)?.getComponent(Label) || null;
        //todo 技能
        this.btn_remove = find('node_window/window/operate/btn_remove', this.node)?.getComponent(Button) || null;
    }
    
    private updateHeros(): void {
        //清空列表
        this.lay_heroList.node.removeAllChildren();
        this.lay_tab.node.removeAllChildren();

        for (let i = 0; i < this.heroDataList.length; i++) {
            this.createHeroListItem(i);
            this.createTabItem(i);
        }
    }

    private createHeroListItem(index: number): void {
        let item = instantiate(this.heroListItem);
        item.on(Node.EventType.TOUCH_END, this.openHeroView, this);
        this.lay_heroList.node.addChild(item);
    }

    private createTabItem(index: number): void {
        let item = instantiate(this.tabItem);
        const heroData = this.heroDataList[index];
        const labName = find('lab_heroName', item)?.getComponent(Label);
        if (labName) {
            labName.string = heroData.heroName;
        }
        item.active = true;
        this.tabButtons.push(item);
        this.lay_tab.node.addChild(item);
    }

    private _onEvent(): void {
        
        //this.btn_heroView2.node.on(Node.EventType.TOUCH_END, this.openHeroView, this);
        // 退出按钮点击事件
        this.btn_exit.node.on(Node.EventType.TOUCH_END, this.closeView, this);
        // 移除按钮点击事件
        //this.btn_remove.node.on(Node.EventType.TOUCH_END, this.removeHero, this);

        for (let i = 0; i < this.tabButtons.length; i++) {
            if (i < this.heroDataList.length) {
                this.tabButtons[i].on(Node.EventType.TOUCH_END, () => {
                    this.onTabClick(i);
                }, this);
            }
        }
    }

    openHeroView()
    {
        if(this.node_window.active)
        {
            this.node_window.active = false;
            this.lay_tab.node.active = false;
        }else{
            this.node_window.active = true;
            this.lay_tab.node.active = true;
        }
    }

    private closeView(): void {
        Layer.Instance.close("battleHeroState", Layer.Instance.layerView);
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


