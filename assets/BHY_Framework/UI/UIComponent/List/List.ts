import { _decorator, CCFloat, CCInteger, Component, Enum, instantiate, Node, Prefab, ScrollView, UITransform, v2, v3, Vec3 } from "cc";
const { ccclass, property } = _decorator;

/** 列表项类型  */
enum NodeType {
    /** Prefab  */
    Prefab = 1,
    /** Node  */
    Node = 2,
}

enum StartAxisType {
    /** 垂直排列  */
    Vertical = 1,
    /** 水平排列  */
    Horizontal = 2,
}

/** 垂直滚动方向  */
enum VscrollDirType {
    /** 从上往下  */
    Top = 1,
    /** 从下往上  */
    Bottom = 2,
}

/** 水平滚动方向  */
enum HscrollDirType {
    /** 从左往右  */
    Left = 1,
    /** 从右往左  */
    Right = 2,
}

@ccclass("List")
export class List extends Component {
    /** 垂直滚动方向 Prefab Node */
    @property({ type: Enum(NodeType), tooltip: "垂直滚动方向\nPrefab:Prefab\nNode:Node" })
    private Type: NodeType = NodeType.Node;
    /** 列表选项 */
    @property({ type: Prefab, tooltip: "列表项", visible() { return this.Type == NodeType.Prefab } })
    private Prefab: Prefab = null;
    @property({ type: Node, tooltip: "列表项", visible() { return this.Type == NodeType.Node } })
    private Node: Node = null;

    /** 布局方向 1:垂直排列  2:水平排列 */
    @property({ type: Enum(StartAxisType), tooltip: "布局方向\nVertical:垂直排列\nHorizontal:水平排列" })
    private startAxis: StartAxisType = StartAxisType.Vertical;

    /** 垂直滚动方向 1:从上往下  2:从下往上 */
    @property({ type: Enum(VscrollDirType), tooltip: "垂直滚动方向\nTop:从上往下\nBottom:从下往上", visible() { return this.startAxis == StartAxisType.Vertical } })
    private VscrollDir: VscrollDirType = VscrollDirType.Top;

    /** 水平滚动方向 1:从左往右  2:从右往左  */
    @property({ type: Enum(HscrollDirType), tooltip: "水平滚动方向\nLeft:从左往右\nRight:从右往左", visible() { return this.startAxis == StartAxisType.Horizontal } })
    private HscrollDir: HscrollDirType = HscrollDirType.Left;

    /** 网格行数  */
    @property({ type: CCInteger, tooltip: "网格行数" })
    private gridRow: number = 1;
    /** 网格列数  */
    @property({ type: CCInteger, tooltip: "网格列数" })
    private gridCol: number = 1;
    /** 列表项之间X间隔  */
    @property({ type: CCFloat, tooltip: "列表项X间隔" })
    private spaceX: number = 10;
    /** 列表项之间Y间隔  */
    @property({ type: CCFloat, tooltip: "列表项Y间隔" })
    private spaceY: number = 10;


    /**list显示需要增加的宽度(单侧) */
    @property({ type: CCFloat, displayName: "list显示需要增加的宽度(单侧)", tooltip: "list显示需要增加的宽度(单侧)" })
    private addwidth: number = 0;
    /**list显示需要增加的高度(单侧) */
    @property({ type: CCFloat, displayName: "list显示需要增加的高度(单侧)", tooltip: "list显示需要增加的高度(单侧)" })
    private addheight: number = 0;

    @property({ displayName: "是否自适应,根据布局方向(小于对应布局，则自适应)", tooltip: "是否自适应,根据布局方向(小于对应布局，则自适应)" })
    private isAuto: boolean = false;


    /** 单元格渲染处理器 */
    public renderHandler: (cell: Node, data: any, Index: number) => void = null;
    /** 滚动处理器 */
    public scrollHandler: () => void = null;


    //====================== 滚动容器 ===============================
    /** 列表滚动容器  */
    private scrollView: ScrollView = null;
    private ScrollTransform: UITransform;
    private content: UITransform = null;


    /** content y坐标  */
    protected content_y: number
    /** content x坐标  */
    protected content_x: number

    /** Prefab 宽度  */
    protected Prefabwidth: number
    /** Prefab 高度  */
    protected Prefabheight: number

    /** Prefab 一半宽度  */
    protected Prefabwidth2: number
    /** Prefab 一半高度  */
    protected Prefabheight2: number

    /** Scroll 宽度  */
    protected Scrollwidth: number
    /** Scroll 高度  */
    protected Scrollheight: number

    /** Scroll 一半宽度  */
    protected Scrollwidth2: number
    /** Scroll 一半高度  */
    protected Scrollheight2: number

    protected Init() {
        this.gridCol = Math.max(1, this.gridCol);
        this.gridRow = Math.max(1, this.gridRow);

        let Transform: UITransform

        if (this.Type == NodeType.Node) {
            Transform = this.Node.getComponent(UITransform);
            this.Node.active = false;
        }
        else if (this.Type == NodeType.Prefab) {
            if (this.Prefab.data) {
                Transform = this.Prefab.data.getComponent(UITransform);
            }

            if (!Transform) {
                const tmp = instantiate(this.Prefab);
                Transform = tmp.getComponent(UITransform);
                tmp.destroy();
            }
        }

        this.Prefabwidth = Transform.width;
        this.Prefabheight = Transform.height;

        this.Prefabwidth2 = Math.floor(this.Prefabwidth * 0.5)
        this.Prefabheight2 = Math.floor(this.Prefabheight * 0.5)

        this.scrollView = this.node.getComponent(ScrollView);

        this.scrollView.inertia = true;
        this.scrollView.elastic = true;

        this.scrollView.vertical = false;
        this.scrollView.horizontal = false;
        this.scrollHandler && this.scrollView.node.on(ScrollView.EventType.SCROLLING, this.scrollHandler, this);

        this.ScrollTransform = this.node.getComponent(UITransform);
        this.Scrollwidth = this.ScrollTransform.width
        this.Scrollheight = this.ScrollTransform.height

        this.content = this.scrollView.content.getComponent(UITransform)

        if (this.startAxis == StartAxisType.Vertical) {
            //1:垂直排列
            this.Scrollwidth = this.Prefabwidth * this.gridCol + this.spaceX * (this.gridCol - 1);

            // visible half sizes for checks
            this.Scrollwidth2 = Math.floor(this.Scrollwidth * 0.5);
            this.Scrollheight2 = Math.floor(this.Scrollheight * 0.5);

            this.content.width = this.ScrollTransform.width = this.Scrollwidth;
            this.content.height = this.Scrollheight;

            if (this.VscrollDir == VscrollDirType.Top) {
                //从上往下
                this.content.setAnchorPoint(0.5, 1);
                this.content.node.setPosition(0, this.Scrollheight2);
            } else if (this.VscrollDir == VscrollDirType.Bottom) {
                //从下往上
                this.content.setAnchorPoint(0.5, 0);
                this.content.node.setPosition(0, -this.Scrollheight2);
            }
        }
        else if (this.startAxis == StartAxisType.Horizontal) {
            //2:水平排列
            this.Scrollheight = this.Prefabheight * this.gridRow + this.spaceY * (this.gridRow - 1)

            // visible half sizes for checks
            this.Scrollwidth2 = Math.floor(this.Scrollwidth * 0.5);
            this.Scrollheight2 = Math.floor(this.Scrollheight * 0.5);

            this.content.height = this.ScrollTransform.height = this.Scrollheight;
            this.content.width = this.Scrollwidth;

            if (this.HscrollDir == HscrollDirType.Left) {
                //从左往右
                this.content.setAnchorPoint(0, 0.5);
                this.content.node.setPosition(-this.Scrollwidth2, 0);
            } else if (this.HscrollDir == HscrollDirType.Right) {
                //从右往左
                this.content.setAnchorPoint(1, 0.5);
                this.content.node.setPosition(this.Scrollwidth2, 0);
            }
        }


        if (this.addwidth)
            this.ScrollTransform.width = this.ScrollTransform.width + this.addwidth * 2
        if (this.addheight)
            this.ScrollTransform.height = this.ScrollTransform.height + this.addheight * 2

        // console.log("Scroll 宽高", this.Scrollwidth, this.Scrollheight)
    }



    private posList: Vec3[] = []

    private data: any[] = []

    public SetData(data: any[]) {
        this.Init()
        if (!data) return;

        this.data = data;

        this.posList.length = 0

        /** 初始y坐标  */
        let y = -this.Prefabheight2;

        /** 初始x坐标  */
        let x = -this.Prefabwidth2;

        if (this.startAxis == StartAxisType.Vertical) {
            //1.垂直排列
            let num = Math.ceil(this.data.length / this.gridCol);

            let height = Math.floor(num * this.Prefabheight + (num - 1) * this.spaceY);

            if (this.isAuto) {
                this.ScrollTransform.height = Math.min(height, this.Scrollheight);
            }
            this.scrollView.vertical = height > this.Scrollheight;

            if (this.VscrollDir == VscrollDirType.Top) {
                //从上往下
                y = -this.Prefabheight2;
                this.content.height = height
            } else if (this.VscrollDir == VscrollDirType.Bottom) {
                //从下往上
                y = this.Prefabheight2;
                this.content.height = height < this.Scrollheight ? this.Scrollheight : height
            }
        } else if (this.startAxis == StartAxisType.Horizontal) {
            //2:水平排列
            let num = Math.ceil(this.data.length / this.gridRow)
            let width = Math.floor(num * this.Prefabwidth + (num - 1) * this.spaceX);

            if (this.isAuto) {
                this.ScrollTransform.width = Math.min(width, this.Scrollwidth);
            }

            this.scrollView.horizontal = width > this.Scrollwidth;

            if (this.HscrollDir == HscrollDirType.Left) {
                //从左往右
                x = this.Prefabwidth2;
                this.content.width = width
            } else if (this.HscrollDir == HscrollDirType.Right) {
                //从右往左
                x = -this.Prefabwidth2;
                this.content.width = width < this.Scrollwidth ? this.Scrollwidth : width
            }
        }

        for (let i = 0; i < this.data.length; i++) {
            if (this.startAxis == StartAxisType.Vertical) {
                //1.垂直排列

                /** 第几列(0开始)  */
                let Col = Math.ceil(i % this.gridCol);

                this.posList.push(v3(-this.Scrollwidth2 + this.Prefabwidth2 + (this.Prefabwidth + this.spaceX) * Col, y));

                if (Col + 1 == this.gridCol) {
                    if (this.VscrollDir == VscrollDirType.Top) {
                        //从上往下
                        y -= this.Prefabheight + this.spaceY;
                    } else if (this.VscrollDir == VscrollDirType.Bottom) {
                        //从下往上
                        y += this.Prefabheight + this.spaceY;
                    }
                }
            } else if (this.startAxis == StartAxisType.Horizontal) {
                //2.水平排列

                /** 第几行(0开始)  */
                let Row = Math.ceil(i % this.gridRow);

                this.posList.push(v3(x, this.Scrollheight2 - this.Prefabheight2 - (this.Prefabheight + this.spaceY) * Row));

                if (Row + 1 == this.gridRow) {
                    if (this.HscrollDir == HscrollDirType.Left) {
                        //从左往右
                        x += this.Prefabwidth + this.spaceX;
                    } else if (this.HscrollDir == HscrollDirType.Right) {
                        //从右往左
                        x -= this.Prefabwidth + this.spaceX;
                    }
                }
            }
        }

        this.content.node.children.forEach(item => item.active = false)
    }


    protected update(dt: number): void {
        if (this.posList.length <= 0) return;

        this.content_x = this.content.node.position.x;
        this.content_y = this.content.node.position.y;

        for (let i = 0; i < this.posList.length; i++) {
            const pos = this.posList[i];

            // 使用绝对值简化判断逻辑
            const isVerticalVisible = Math.abs(this.content_y + pos.y) < (this.Scrollheight2 + this.Prefabheight2);
            const isHorizontalVisible = Math.abs(this.content_x + pos.x) < (this.Scrollwidth2 + this.Prefabwidth2);

            const Name = `id${i}`;
            let cell = this.content.node.getChildByName(Name)

            if ((this.startAxis == StartAxisType.Vertical && isVerticalVisible) ||
                (this.startAxis == StartAxisType.Horizontal && isHorizontalVisible)) {
                if (!cell || !cell.active) {
                    if (!cell) {
                        cell = this.content.node.getChildByName("hide");
                        if (!cell) {
                            if (this.Prefab)
                                cell = instantiate(this.Prefab);
                            else if (this.Node)
                                cell = instantiate(this.Node);
                            this.content.node.addChild(cell);
                        }
                    }

                    cell.active = true;
                    cell.name = Name;

                    this.renderHandler && this.renderHandler(cell, this.data[i], i);

                    cell.setPosition(pos)
                }
            }
            else if (cell) {
                cell.name = "hide";
                cell.active = false;
            }
            cell && cell.setSiblingIndex(i)
        }
    }

    public refresh() {
        for (let i = 0; i < this.posList.length; i++) {
            const Name = `id${i}`;
            let cell = this.content.node.getChildByName(Name)
            if (cell && cell.active)
                this.renderHandler && this.renderHandler(cell, this.data[i], i);
        }
    }


    /**  
    * 滚动到列表, 有问题，滑动时间要>0.5
    * @param index 位置，0表示第1项
    * @param dt 滑动时间
    * @param attenuated 是否衰减
     */
    public moveTo(index: number, dt: number, attenuated = true) {
        const { offsetX, offsetY } = this.calculateOffset(index);
        // console.log(offsetX, offsetY)
        const timeInSecond = Math.max(0.5, dt);
        this.scrollView.scrollToOffset(v2(offsetX, offsetY), timeInSecond, attenuated);
    }

    /** 
     * 将指定索引的项移动到列表中间
     * @param index 要移动的项的索引
     * @param dt 滑动时间，默认0.5秒
     * @param attenuated 是否衰减，默认truea
      */
    public moveToMiddle(index: number, dt: number = 0.5, attenuated: boolean = true) {
        // await DateUtils.delay(100);
        if (index < 0 || index >= this.posList.length) return;

        let offsetX = 0;
        let offsetY = 0;

        if (this.startAxis == StartAxisType.Vertical) {
            // 垂直排列
            const row = Math.floor(index / this.gridCol);
            const totalRows = Math.ceil(this.posList.length / this.gridCol);
            const totalHeight = totalRows * this.Prefabheight + (totalRows - 1) * this.spaceY;
            const viewHeight = this.Scrollheight;

            // 计算目标项的位置
            let targetPos = 0;
            if (this.VscrollDir == VscrollDirType.Top) {
                // 从上往下
                targetPos = (this.Prefabheight + this.spaceY) * row + this.Prefabheight / 2;
                // 中心位置偏移
                offsetY = targetPos - viewHeight / 2;
            } else {
                // 从下往上
                targetPos = totalHeight - ((this.Prefabheight + this.spaceY) * row + this.Prefabheight / 2);
                offsetY = totalHeight - targetPos - viewHeight / 2;
            }

            // 边界处理
            offsetY = Math.max(0, offsetY);
            offsetY = Math.min(totalHeight - viewHeight, offsetY);
            if (totalHeight <= viewHeight) offsetY = 0;

        } else {
            // 水平排列
            const col = Math.floor(index / this.gridRow);
            // 计算实际总宽度
            const totalCols = Math.ceil(this.posList.length / this.gridRow);
            const totalWidth = totalCols * this.Prefabwidth + (totalCols - 1) * this.spaceX;
            const viewWidth = this.Scrollwidth;

            // 计算目标项的位置
            let targetPos = 0;
            if (this.HscrollDir == HscrollDirType.Left) {
                // 从左往右
                targetPos = (this.Prefabwidth + this.spaceX) * col + this.Prefabwidth / 2;
                // 中心位置偏移
                offsetX = targetPos - viewWidth / 2;
            } else {
                // 从右往左
                targetPos = totalWidth - ((this.Prefabwidth + this.spaceX) * col + this.Prefabwidth / 2);
                offsetX = totalWidth - targetPos - viewWidth / 2;
            }

            // 边界处理
            offsetX = Math.max(0, offsetX);
            offsetX = Math.min(totalWidth - viewWidth, offsetX);
            if (totalWidth <= viewWidth) offsetX = 0;
        }

        const timeInSecond = Math.max(0.5, dt);
        this.scrollView.scrollToOffset(v2(offsetX, offsetY), timeInSecond, attenuated);
    }
    /** 
     * 滚动到列表
     * @param index 位置，0表示第1项
      */
    public scrollToOffset(index: number) {
        const { offsetX, offsetY } = this.calculateOffset(index);
        this.scrollView.scrollToOffset(v2(offsetX, offsetY));
    }


    private calculateOffset(index: number): { offsetX: number, offsetY: number } {
        let offsetX = 0;
        let offsetY = 0;

        if (this.startAxis == StartAxisType.Vertical) {
            //1:垂直排列
            index = Math.floor(index / this.gridCol)
            if (this.VscrollDir == VscrollDirType.Top) {
                //从上往下
                offsetY = (this.Prefabheight + this.spaceY) * index;
            } else if (this.VscrollDir == VscrollDirType.Bottom) {
                //从下往上
                offsetY = this.content.height - this.Scrollheight2 - (this.Prefabheight + this.spaceY) * index;
            }
        } else if (this.startAxis == StartAxisType.Horizontal) {
            //2:水平排列
            index = Math.floor(index / this.gridRow)
            if (this.HscrollDir == HscrollDirType.Left) {
                //从左往右
                offsetX = (this.Prefabwidth + this.spaceX) * index;
            } else if (this.HscrollDir == HscrollDirType.Right) {
                //从右往左
                offsetX = this.content.width - this.Scrollwidth2 - (this.Prefabwidth + this.spaceX) * index;
            }
        }
        return { offsetX, offsetY };
    }
}