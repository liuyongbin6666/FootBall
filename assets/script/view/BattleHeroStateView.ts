import { _decorator, Component, Node, Label, Button, find, Color, Sprite, Layout, Prefab, instantiate } from 'cc';
import { GameCustomEvent } from '../manager/GameCustomEvent';
import { GameEventName } from '../manager/GameEventName';
const { ccclass, property } = _decorator;

/**
 * 战斗英雄状态视图
 * 刘永斌
 */

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

    // 技能等级数组 [技能0等级, 技能1等级, 技能2等级, 技能3等级, 技能4等级, 技能5等级, 技能6等级]
    // 索引对应: 0=伤害, 1=暴击, 2=会心, 3=生命, 4=技能1, 5=技能2, 6=技能3
    skillLevelArray: number[];
    totalLevel: number;
}

//英雄技能数据结构
interface HeroSkillData {
    skillID: number;
    skillName: string;
    skillDesc: string;
    ImgPath: string;
}

@ccclass('BattleHeroStateView')
export class BattleHeroStateView extends Component {
    // 上阵英雄数据列表（模拟数据，实际有2个英雄）
    private heroDataList: HeroBaseData[] = [
        { 
            heroIndex: 0, heroID: 1, heroHeadImgPath: "img/hero/heroHead/icon_heroHead_1", 
            heroImgPath: "img/hero/hero1", heroName: "小黄鸡", heroIntroduce: "小黄鸡的故事，是一只勇敢的小鸡！", 
            quality: 1, maxHP: 100, harm: 10, 
            skillLevelArray: [1, 0, 1, 2, 3, 0, 0], // [伤害,暴击,会心,生命,技能1,技能2,技能3]
            totalLevel: 10
        },
        { 
            heroIndex: 1, heroID: 2, heroHeadImgPath: "img/hero/heroHead/icon_heroHead_1", 
            heroImgPath: "img/hero/hero2", heroName: "小白鸡", heroIntroduce: "小白鸡的故事，是一只聪明的小鸡！", 
            quality: 1, maxHP: 80, harm: 15, 
            skillLevelArray: [0, 1, 1, 2, 1, 1, 0], // [伤害,暴击,会心,生命,技能1,技能2,技能3]
            totalLevel: 12
        },
        { 
            heroIndex: 2, heroID: 3, heroHeadImgPath: "img/hero/heroHead/icon_heroHead_1", 
            heroImgPath: "img/hero/hero3", heroName: "小绿鸡", heroIntroduce: "小绿鸡的故事，是一只绿的小鸡！", 
            quality: 1, maxHP: 90, harm: 12, 
            skillLevelArray: [0, 0, 1, 2, 3, 0, 0], // [伤害,暴击,会心,生命,技能1,技能2,技能3]
            totalLevel: 10
        },
        { 
            heroIndex: 3, heroID: 4, heroHeadImgPath: "img/hero/heroHead/icon_heroHead_1", 
            heroImgPath: "img/hero/hero4", heroName: "小蓝鸡", heroIntroduce: "小蓝鸡的故事，是一只蓝的小鸡！", 
            quality: 1, maxHP: 80, harm: 15, 
            skillLevelArray: [4, 1, 1, 2, 1, 1, 5], // [伤害,暴击,会心,生命,技能1,技能2,技能3]
            totalLevel: 12
        },
    ];

    // 英雄技能数据列表
    private heroSkillDataList: HeroSkillData[] = [
        { skillID: 0, skillName: "伤害", skillDesc: "增加伤害", ImgPath: "img/hero/skill/skill_0" },
        { skillID: 1, skillName: "暴击", skillDesc: "增加暴击率", ImgPath: "img/hero/skill/skill_1" },
        { skillID: 2, skillName: "会心", skillDesc: "增加会心率", ImgPath: "img/hero/skill/skill_2" },
        { skillID: 3, skillName: "生命", skillDesc: "增加生命值", ImgPath: "img/hero/skill/skill_3" },
        { skillID: 4, skillName: "技能1", skillDesc: "增加技能1", ImgPath: "img/hero/skill/skill_4" },
        { skillID: 5, skillName: "技能2", skillDesc: "增加技能2", ImgPath: "img/hero/skill/skill_5" },
        { skillID: 6, skillName: "技能3", skillDesc: "增加技能3", ImgPath: "img/hero/skill/skill_6" },
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
    
    //todo 新增英雄的时候，调用此方法
    private updateHeroList(): void {
        //清空列表
        this.lay_heroList.node.removeAllChildren();

        for (let i = 0; i < this.heroDataList.length; i++) {
            this.createHeroListItem(i);
        }
    }

    private createHeroListItem(index: number): void {
        let item = instantiate(this.heroListItem);
        const heroData = this.heroDataList[index];
        const lab_totalLevel = find('lab_totalLevel', item)?.getComponent(Label);
        //todo 统计全部的升级次数 
        if (lab_totalLevel) {
            lab_totalLevel.string = heroData.totalLevel.toString();
        }

        item.on(Node.EventType.TOUCH_END, () => {
            this.openHeroView(index);
        }, this);//点击英雄项打开窗口,并切换到该英雄的标签
        this.lay_heroList.node.addChild(item);
    }

    //todo 新增英雄的时候，调用此方法
    private updateHeroTab(): void {
        //清空列表
        this.lay_tab.node.removeAllChildren();
        this.tabButtons = []; // 清空按钮数组
        this.currentSelectHeroIndex = 0;

        for (let i = 0; i < this.heroDataList.length; i++) {
            this.createTabItem(i);
        }
    }

    private createTabItem(index: number): void {
        let item = instantiate(this.tabItem);
        const heroData = this.heroDataList[index];
        const labName = find('lab_heroName', item)?.getComponent(Label);
        if (labName) {
            labName.string = heroData.heroName;
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
    }

    // todo 移除英雄
    removeHero(): void {
        //最后一个英雄不能移除,并弹出文本提示
        if ( this.heroDataList.length <= 1) {
            //调用弹出文字的方法
            GameCustomEvent.Instance.node.emit(GameEventName.TIPS_STRIP_EVENT, new GameEventName({ tipsDec: "最后一个英雄不能移除" }));
            return;
        }

        this.heroDataList.splice(this.currentSelectHeroIndex, 1);//移除选中的英雄
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
        if (index < 0 || index >= this.heroDataList.length) return;
        
        this.updateHeroTab();
        this.currentSelectHeroIndex = index;
        this.updateTabSelectState();
        this.refreshHeroInfo(index);
    }

    private updateTabSelectState(): void {
        for (let i = 0; i < this.tabButtons.length; i++) {//遍历所有标签项
            if (i < this.heroDataList.length) {//如果标签项索引在英雄数据列表范围内
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
        if (index < 0 || index >= this.heroDataList.length) return;
        
        const heroData = this.heroDataList[index];
        
        if (this.lab_heroName) this.lab_heroName.string = heroData.heroName;
        if (this.lab_heroIntroduce) this.lab_heroIntroduce.string = heroData.heroIntroduce;
        if (this.lab_maxHP) this.lab_maxHP.string = `${heroData.maxHP}`;
        if (this.lab_harm) this.lab_harm.string = `${heroData.harm}`;

        //todo 更新技能列表
        this.updateSkillList(heroData);
    }
    
    private updateSkillList(heroData: HeroBaseData): void {
        if (!this.lay_skillList) {
            console.log('lay_skillList is null');
            return;
        }
        if (!this.skillListItem) {
            console.log('skillListItem prefab is not assigned');
            return;
        }
        
        this.lay_skillList.node.removeAllChildren();
        
        for (let i = 0; i < this.heroSkillDataList.length; i++) {
            //todo 检查等级是否为0，如果为0则不创建技能项
            if (heroData.skillLevelArray && heroData.skillLevelArray[i] === 0) {
                continue;
            }
            this.createSkillListItem(heroData, i);
        }
    }
    
    private createSkillListItem(heroData: HeroBaseData, index: number): void {
        let item = instantiate(this.skillListItem);
        const skillData = this.heroSkillDataList[index];
        
        const lab_skillName = find('lab_skillName', item)?.getComponent(Label);
        const img_skillIcon = find('img_skillIcon', item)?.getComponent(Sprite);
        const lab_skillLevel = find('lab_skillLevel', item)?.getComponent(Label);
        const lab_skillDesc = find('lab_skillDesc', item)?.getComponent(Label);
        
        if (lab_skillName) {
            lab_skillName.string = skillData.skillName;
        }
        
        if (lab_skillLevel && heroData.skillLevelArray && heroData.skillLevelArray[index] !== undefined) {
            lab_skillLevel.string = `Lv.${heroData.skillLevelArray[index]}`;
        }
        
        if (lab_skillDesc) {
            lab_skillDesc.string = skillData.skillDesc;
        }
        
        this.lay_skillList.node.addChild(item);
    }
}


