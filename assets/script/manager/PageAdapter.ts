import { _decorator, Node, Canvas, Camera, Component, log, director, Enum, tween, view, Widget, Size, screen, UITransform } from "cc";
const { ccclass, property, menu } = _decorator;
const AUTO_ROTATE = true;      //是否开启自动旋转
const ROTATE_TIME = 1;         //屏幕旋转时长
enum AdapterMode { 无, 拉伸全屏, 等比缩放 }
/**
 * 适配
 * 方向适配、尺寸适配、坐标适配、动态适配
*/
@ccclass
@menu('Gi/PageAdapter')
class PageAdapter extends Component {
    @property({ type: Enum(AdapterMode), displayName: '适配模式' })
    adapterMode: AdapterMode = AdapterMode.等比缩放;
    private rootNode: Node = null;
    private cameraNode: Node = null;
    protected onLoad(): void {
        let wgt = this.node.getComponent(Widget);
        wgt && (wgt.enabled = false);
        this.rootNode = director.getScene().getComponentInChildren(Canvas).node;
        this.cameraNode = this.rootNode.getComponentInChildren(Camera).node;
        if (!this.rootNode || !this.cameraNode) {
            log('PageAdapter添加失败！(未找到Canvas或Camera组件)');
            this.destroy();
        }
    }
    protected onEnable(): void {
        this.updateAdapter();
        view.on('canvas-resize', this.updateAdapter, this);
    }
    protected onDisable(): void {
        view.off('canvas-resize', this.updateAdapter, this);
    }
    private updateAdapter(): void {
        let winSize = new Size(screen.windowSize.width / view['_scaleX'], screen.windowSize.height / view['_scaleY']);
        let ut = this.node.getComponent(UITransform);
        if (AUTO_ROTATE) {
            let designSize = view.getDesignResolutionSize();
            if (ut.width < ut.height === designSize.width < designSize.height) {
                this.cameraNode.angle !== 0 && tween(this.cameraNode).to(ROTATE_TIME, { angle: 0 }, { easing: 'expoOut' }).start();
            } else {
                [winSize.width, winSize.height] = [winSize.height, winSize.width];
                this.cameraNode.angle !== -90 && tween(this.cameraNode).to(ROTATE_TIME, { angle: -90 }, { easing: 'expoOut' }).start();
            }
        }
        switch (this.adapterMode) {
            case AdapterMode.拉伸全屏:
                this.rootNode.setScale(winSize.width / ut.width, winSize.height / ut.height);
                this.node.setPosition(winSize.width * (ut.anchorX - 0.5), winSize.height * (ut.anchorY - 0.5));
                break;
            case AdapterMode.等比缩放:
                let scale = winSize.width / winSize.height > ut.width / ut.height ? winSize.height / ut.height : winSize.width / ut.width;
                this.rootNode.setScale(scale, scale);
                this.node.setPosition(ut.width * (ut.anchorX - 0.5), ut.height * (ut.anchorY - 0.5));
                break;
        }
    }
}
declare global {
    module gi {
        class PageAdapter extends Component {
            static AdapterMode: typeof AdapterMode;
            adapterMode: AdapterMode;
        }
    }
}
((globalThis as any).gi ||= {}).PageAdapter ||= Object.assign(PageAdapter, { AdapterMode: AdapterMode });