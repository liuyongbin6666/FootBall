import { _decorator, AudioClip, AudioSource, Component, Node, resources } from 'cc';
import { clipNameStructure, soundStructure } from '../data/GlobalStructure';
const { ccclass, property } = _decorator;

/**
 * 音乐音效管理类
 */
@ccclass('AudioMG')
export class AudioMG extends Component {
    private static _instance: AudioMG = null;

    public static get Instance() {
        if (this._instance == null) {
            this._instance = new AudioMG();
        }
        return this._instance;
    }
    //背景音乐
    main_audio: AudioSource;
    //单个音效
    sound_once: AudioSource;
    //多个音效
    sound_more:Array<AudioSource>
    // effectList: AudioClip[] = [];
    //音效存储
    clipArr:Array<clipNameStructure> = [];

    start() {
    }

    // 单个背景音乐播放（根据音频资源路径加载音频资源）
    public playMusicAudio(audioPath:string)
    {
        if(this.main_audio == null)
        {
            this.main_audio = new AudioSource();
        }
        // var audioPath = "audio/main_music";
        var _this = this;
        resources.load(audioPath, AudioClip, (err, clip: AudioClip) =>
        {
            _this.main_audio.clip = clip;
            _this.main_audio.loop = true;
            _this.main_audio.play();
            console.log("音乐加载完毕！",_this.main_audio);
        });
    }
    
    // 单个音效播放
    public playSoundAudio(audioPath:string,name:string)
    {
        if(this.sound_once == null)
        {
            this.sound_once = new AudioSource();
        }
        this.loadOneSoundAudio(audioPath,name,this.sound_once);
    }

    // 多个音效同时播放
    public playMoreSoundAudio(soundMoreArr:Array<soundStructure>)
    {
        //清空数组
        this.sound_more = [];
        //根据同时播放的音效个数加载
        for(var sm:number = 0;sm < soundMoreArr.length;sm++)
        {
            var meanwhileSound: AudioSource = new AudioSource();
            this.sound_more.push(meanwhileSound);
            this.loadOneSoundAudio(soundMoreArr[sm].audioPath,soundMoreArr[sm].name,this.sound_more[sm]);
        }
    }

    //单个音效加载
    private loadOneSoundAudio(audioPath:string,name:string,soundOne: AudioSource)
    {
        //如果已加载过，无需重复加载
        for(var cn:number = 0;cn < this.clipArr.length;cn++)
        {
            if(name == this.clipArr[cn].name)
            {
                this.sound_once.clip = this.clipArr[cn].clip;
                this.sound_once.play();
                console.log("音效已加载过！",this.sound_once);
                return;
            }
        }
        // var audioPath = "audio/main_music";
        var _this = this;
        var _soundOne = soundOne;
        resources.load(audioPath, AudioClip, (err, clip: AudioClip) =>
        {
            // _this.sound_once.clip = clip;
            _soundOne.clip = clip;
            // _this.sound_once.loop = false;
            _soundOne.loop = false;
            // _this.sound_once.play();
            _soundOne.play();
            var newClip:clipNameStructure = {name:name,clip:clip};
            _this.clipArr.push(newClip);
            console.log("音效加载完毕！",_soundOne);
        });
    }

    // 设置音乐音量 0~1
    setMusicVolume(value:number)
    {
        if(this.main_audio)
        {
            this.main_audio.volume = value;
        }
    }

    // 设置音效音量 0~1
    setSoundVolume(value:number)
    {
        if(this.sound_once)
        {
            this.sound_once.volume = value;
        }
        if(this.sound_more && this.sound_more.length > 0)
        {
            for(var sm:number = 0;sm < this.sound_more.length;sm++)
            {
                this.sound_more[sm].volume = value;
            }
        }
    }

    // 播放音乐
    play () {
        this.main_audio.play();
    }

    // 暂停音效播放
    pauseSound_once() {
        if(this.sound_once)
        {
            this.sound_once.pause();
        }
    }

    update(deltaTime: number) {
        
    }
}


