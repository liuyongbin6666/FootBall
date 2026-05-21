import { _decorator, Component, Node, Label, Button, find, Color, Sprite, Layout, Prefab, instantiate } from 'cc';
import { GameCustomEvent } from '../manager/GameCustomEvent';
import { GameEventName } from '../manager/GameEventName';
import { GlobalData } from '../data/GlobalData';
import { heroStructure } from '../data/GlobalStructure';
import { heroPropertyTableStructure } from '../data/GlobalStructure';
import { heroSkillStructure } from '../data/GlobalStructure';
const { ccclass, property } = _decorator;

/**
 * 战斗英雄状态视图
 * 刘永斌
 */

@ccclass('BattleHeroStateView')
export class BattleHeroStateView extends Component {
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

    // 技能列表布局组件
    private lay_skillList: Layout | null = null;
    @property(Prefab)
    private skillListItem: Prefab = null;

    private btn_remove: Button | null = null;//移除按钮

    protected onLoad(): void {
        this._initObject();
        this._onEvent();
    }

    start() {
        this.node_window.active = false;
        this.lay_tab.node.active = false;
        this.refreshHeroInfo(0);
    }

    update(deltaTime: number) {
        
    }

    private _initObject(): void {
        
        this.lay_heroList = find('lay_heroList', this.node).getComponent(Layout);
        this.updateHeroList();
        this.lay_tab = find('lay_tab', this.node).getComponent(Layout);
        
        this.node_window = find('node_window', this.node);
        this.btn_exit = find('node_window/btn_exit', this.node)?.getComponent(Button) || null;

        this.img_avatarBg = find('node_window/window/heroInfo/img_avatarBg', this.node)?.getComponent(Sprite) || null;
        this.img_avatar = find('node_window/window/heroInfo/img_avatarBg/img_avatar', this.node)?.getComponent(Sprite) || null;
        this.lab_heroName = find('node_window/window/heroInfo/img_avatarBg/lab_heroName', this.node)?.getComponent(Label) || null;
        
        this.lab_harm = find('node_window/window/heroInfo/base/harm/lab_harm', this.node)?.getComponent(Label) || null;
        this.lab_maxHP = find('node_window/window/heroInfo/base/maxHP/lab_maxHP', this.node)?.getComponent(Label) || null;
        this.lab_heroIntroduce = find('node_window/window/heroInfo/heroIntroduce/lab_heroIntroduce', this.node)?.getComponent(Label) || null;
        
        this.lay_skillList = find('node_window/window/skill/ScrollView/view/lay_skillList', this.node)?.getComponent(Layout);

        this.btn_remove = find('node_window/window/operate/btn_remove', this.node)?.getComponent(Button) || null;
    }
    
    //todo 新增英雄和升级英雄的时候，调用此方法
    private updateHeroList(): void {
        const joinHeroArr = GlobalData.Instance.joinHeroArr;
        //清空列表
        this.lay_heroList.node.removeAllChildren();

        for (let i = 0; i <  joinHeroArr.length; i++) {
            this.createHeroListItem(i, joinHeroArr[i]);
        }
    }

    private createHeroListItem(index: number, hero: heroStructure): void {
        let item = instantiate(this.heroListItem);
        const lab_totalLevel = find('lab_totalLevel', item)?.getComponent(Label);
        //todo 统计全部的升级次数 
        if (lab_totalLevel) {
            const totalLevel = hero.harmLevel + hero.criticalLevel + hero.breakOutLevel + hero.HPLevel;
            lab_totalLevel.string = totalLevel.toString();
        }

        item.on(Node.EventType.TOUCH_END, () => {
            this.openHeroView(index);
        }, this);//点击英雄项打开窗口,并切换到该英雄的标签
        this.lay_heroList.node.addChild(item);
    }

    private updateHeroTab(): void {
        const joinHeroArr = GlobalData.Instance.joinHeroArr;
        //清空列表
        this.lay_tab.node.removeAllChildren();
        this.tabButtons = []; // 清空按钮数组
        this.currentSelectHeroIndex = 0;

        for (let i = 0; i < joinHeroArr.length; i++) {
            this.createTabItem(i, joinHeroArr[i]);
        }
    }

    private createTabItem(index: number, hero: heroStructure): void {
        let item = instantiate(this.tabItem);
        const labName = find('lab_heroName', item)?.getComponent(Label);
        if (labName) {
            labName.string = hero.heroName;
        }
        item.active = true;
        
        // 绑定点击事件
        item.on(Node.EventType.TOUCH_END, () => {
            this.onTabClick(index);
        }, this);
        
        this.tabButtons.push(item);//将标签项添加到数组中，方便后续操作
        this.lay_tab.node.addChild(item);
    }

    private _onEvent(): void {
        // 退出按钮点击事件
        this.btn_exit.node.on(Node.EventType.TOUCH_END, this.closeView, this);
        // 移除按钮点击事件
        this.btn_remove.node.on(Node.EventType.TOUCH_END, this.removeHero, this);
        
        // 监听新增英雄事件
        GameCustomEvent.Instance.node.on(GameEventName.HERO_ADD_EVENT, this.onHeroAdd, this);
        // 监听升级英雄事件
        GameCustomEvent.Instance.node.on(GameEventName.HERO_UPGRADE_EVENT, this.onHeroUpgrade, this);
    }
    
    private onHeroAdd(): void {
        this.updateHeroList();
        //this.updateHeroTab();
        //this.updateTabSelectState();
        //this.refreshHeroInfo(this.currentSelectHeroIndex);
    }
    
    private onHeroUpgrade(): void {
        this.updateHeroList();
        //this.updateHeroTab();
        //this.updateTabSelectState();
        //this.refreshHeroInfo(this.currentSelectHeroIndex);
    }

    // todo 移除英雄
    removeHero(): void {
        //最后一个英雄不能移除,并弹出文本提示
        if ( GlobalData.Instance.joinHeroArr.length <= 1) {
            //调用弹出文字的方法
            GameCustomEvent.Instance.node.emit(GameEventName.TIPS_STRIP_EVENT, new GameEventName({ tipsDec: "最后一个英雄不能移除" }));
            return;
        }

        GlobalData.Instance.joinHeroArr.splice(this.currentSelectHeroIndex, 1);//移除选中的英雄
        this.updateHeroList();
        this.updateHeroTab();
        this.updateTabSelectState();
        this.refreshHeroInfo(this.currentSelectHeroIndex);
    }

    //打开窗口
    openHeroView(index: number)
    {
        if(this.node_window.active)
        {
            this.node_window.active = false;
            this.lay_tab.node.active = false;
        }else
            {
            this.node_window.active = true;
            this.lay_tab.node.active = true;
            this.onTabClick(index);
        }
    }

    private closeView(): void {
        this.lay_tab.node.active = false;
        this.node_window.active = false;
    }

    private onTabClick(index: number): void {
        if (index < 0 || index >= GlobalData.Instance.joinHeroArr.length) return;
        
        this.updateHeroTab();
        this.currentSelectHeroIndex = index;
        this.updateTabSelectState();
        this.refreshHeroInfo(index);
    }

    private updateTabSelectState(): void {
        for (let i = 0; i < this.tabButtons.length; i++) {//遍历所有标签项
            if (i < GlobalData.Instance.joinHeroArr.length) {//如果标签项索引在英雄数据列表范围内
                const tabNode = this.tabButtons[i];//获取当前标签项节点
                const btnComponent = tabNode.getComponent(Button);//获取按钮组件
                
                if (i === this.currentSelectHeroIndex) {//如果当前标签项索引与选中的英雄索引相同
                        tabNode.getComponent(Sprite)!.color = new Color(255, 200, 100, 255);//设置选中项的颜色为黄色
                } else {
                    tabNode.getComponent(Sprite)!.color = new Color(255, 255, 255, 255);//设置未选中项的颜色为白色
                }
            }
        }
    }

    private refreshHeroInfo(index: number): void {
        if (index < 0 || index >= GlobalData.Instance.joinHeroArr.length) return;
        
        const hero = GlobalData.Instance.joinHeroArr[index];
        
        if (this.lab_heroName) this.lab_heroName.string = hero.heroName;
        if (this.lab_heroIntroduce) this.lab_heroIntroduce.string = hero.heroIntroduce;
        if (this.lab_maxHP) this.lab_maxHP.string = `${hero.maxHP}`;
        if (this.lab_harm) this.lab_harm.string = `${hero.harm}`;

        //todo 更新技能列表
        this.updateSkillList(hero);
    }
    
    private updateSkillList(hero: heroStructure): void {
        if (!this.lay_skillList) {
            console.log('lay_skillList is null');
            return;
        }
        if (!this.skillListItem) {
            console.log('skillListItem prefab is not assigned');
            return;
        }
        
        this.lay_skillList.node.removeAllChildren();
        
        const heroProTableArr = GlobalData.Instance.heroProGrowUpTableArr;
        if (!heroProTableArr || heroProTableArr.length === 0) {
            console.log('heroProGrowUpTableArr is empty');
            return;
        }
        
        const propertyLevels = [
            { type: 1, level: hero.harmLevel },
            { type: 2, level: hero.criticalLevel },
            { type: 3, level: hero.breakOutLevel },
            { type: 4, level: hero.HPLevel }
        ];
        
        for (const prop of propertyLevels) {
            if (prop.level === 0) continue;
            
            const propData = heroProTableArr.find(p => p.propertyType === prop.type);
            if (propData) {
                this.createSkillListItem(propData.propertyName, propData.propertyIconPath, prop.level, propData.describe);
            }
        }
    }
    
    private createSkillListItem(skillName: string, skillIconPath: string, skillLevel: number, skillDesc: string): void {
        let item = instantiate(this.skillListItem);
        
        const lab_skillName = find('lab_skillName', item)?.getComponent(Label);
        const img_skillIcon = find('img_skillIcon', item)?.getComponent(Sprite);
        const lab_skillLevel = find('lab_skillLevel', item)?.getComponent(Label);
        const lab_skillDesc = find('lab_skillDesc', item)?.getComponent(Label);
        
        if (lab_skillName && skillName) {
            lab_skillName.string = skillName;
        }
        
        if (lab_skillLevel && skillLevel) {
            lab_skillLevel.string = `Lv.${skillLevel}`;
        }
        
        if (lab_skillDesc && skillDesc) {
            lab_skillDesc.string = skillDesc;
        }
        
        this.lay_skillList.node.addChild(item);
    }
}


