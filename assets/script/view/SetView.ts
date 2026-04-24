import { _decorator, Button, Component, find, Node, Sprite } from 'cc';
import { GlobalData } from '../data/GlobalData';
import { AudioMG } from '../sound/AudioMG';
const { ccclass, property } = _decorator;

@ccclass('SetView')
export class SetView extends Component {
    /**
     * 组件
    */
    private btn_close:Button;
    private btn_music:Button;
    private sp_music_on:Sprite;
    private sp_music_off:Sprite;
    private btn_sound:Button;
    private sp_sound_on:Sprite;
    private sp_sound_off:Sprite;
    private btn_ok:Button;
    protected onLoad(): void {
        this._initObect();

        this._onEvent();
    }

    private _initObect() {
        this.btn_close = find('btn_close', this.node).getComponent(Button);
        this.btn_music = find('btn_music', this.node).getComponent(Button);
        this.sp_music_on = find('btn_music/img_on', this.node).getComponent(Sprite);
        this.sp_music_off = find('btn_music/img_off', this.node).getComponent(Sprite);
        this.btn_sound = find('btn_sound', this.node).getComponent(Button);
        this.sp_sound_on = find('btn_sound/img_on', this.node).getComponent(Sprite);
        this.sp_sound_off = find('btn_sound/img_off', this.node).getComponent(Sprite);
        this.btn_ok = find('btn_ok', this.node).getComponent(Button);
    }

    private _onEvent() {
        this.btn_close.node.on(Node.EventType.TOUCH_START, this.closeView, this);
        this.btn_music.node.on(Node.EventType.TOUCH_START, this.changeMusic, this);
        this.btn_sound.node.on(Node.EventType.TOUCH_START, this.changeSound, this);
        this.btn_ok.node.on(Node.EventType.TOUCH_START, this.okClick, this);
    }

    start() {
        this.sp_music_on.node.active = false;
        this.sp_music_off.node.active = true;
        this.sp_sound_on.node.active = false;
        this.sp_sound_off.node.active = true;
    }

    changeMusic()
    {
        if(GlobalData.Instance.musicState == true)
        {
            //关掉背景音乐
            GlobalData.Instance.musicState = false;
            this.sp_music_on.node.active = true;
            this.sp_music_off.node.active = false;
            AudioMG.Instance.setMusicVolume(0);
        }else{
            //打开背景音乐
            GlobalData.Instance.musicState = true;
            this.sp_music_on.node.active = false;
            this.sp_music_off.node.active = true;
            AudioMG.Instance.setMusicVolume(1);
        }
    }

    changeSound()
    {
        if(GlobalData.Instance.soundState == true)
        {
            //关掉音效
            GlobalData.Instance.soundState = false;
            this.sp_sound_on.node.active = true;
            this.sp_sound_off.node.active = false;
            AudioMG.Instance.setSoundVolume(0);
        }else{
            //打开音效
            GlobalData.Instance.soundState = true;
            this.sp_sound_on.node.active = false;
            this.sp_sound_off.node.active = true;
            AudioMG.Instance.setSoundVolume(1);
        }
    }

    okClick()
    {
        this.closeView();
    }
    
    closeView()
    {
        this.node.active = false;
    }

    update(deltaTime: number) {
        
    }
}


