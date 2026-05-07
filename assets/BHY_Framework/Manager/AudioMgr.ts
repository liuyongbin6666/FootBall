/**
 * @file AudioMgr.ts
 * @description 音频管理器，支持音乐/音效/震动，与GameSettings联动
 */
import { _decorator, AudioClip, AudioSource, game } from "cc";
import { GameSettings } from "../FrameConfig/FrameData";
import { CmpSingletion } from "../Singleton/CmpSingletion";
import { LogMgr } from "./LogMgr";
import { ResMgr } from "./ResMgr";
import { SDKEvent } from "../Sdk/exp/SDKEvent";
const { ccclass, property, menu } = _decorator;
export enum AudioModeE {
    BGM = 1,
    Audio
}

/**
 * 音频管理器
 * 支持背景音乐、音效、震动功能
 * 与GameSettings联动，自动读取音量设置
 */
@ccclass("AudioMgr")
@menu("框架组件/音频管理器")
export class AudioMgr extends CmpSingletion<AudioMgr> {
    private _audioSource: AudioSource;
    private _bgmSource: AudioSource;
    private _clipCache: Map<string, AudioClip> = new Map();

    /** 禁用所有音频(用于临时静音) */
    private _muteAll: boolean = false;
    public Name = "AudioMgr";

    public static get Ins(): AudioMgr {
        return this.getInstance<AudioMgr>();
    }
    /**
     * 
     * @param node 绑定音频组件到目标节点
     * @returns 
     */
    public async init() {
        if (this._initialized) {
            LogMgr.Ins.warn(`[${this.Name}] 重复初始化`);
            return;
        }
        this._initialized = true;
        LogMgr.Ins.info(`[${this.Name}] 初始化音频管理器`);

        this._audioSource = this.node.addComponent(AudioSource);
        this._bgmSource = this.node.addComponent(AudioSource);
        this._bgmSource.loop = true;
        this.setVolume(AudioModeE.BGM, GameSettings.musicVolume);
        this.setVolume(AudioModeE.Audio, GameSettings.soundVolume);


        game.on(SDKEvent.Hide, this.pause, this)
        game.on(SDKEvent.Show, this.resume, this)
        LogMgr.Ins.info(`[AudioMgr] 音频组件绑定完成`);
    }

    /**
     * 播放背景音乐
     * @param clip 音频片段或路径
     * @param volume 音量（可选，默认使用GameSettings.musicVolume）
     * @param bundleName 资源包名
     * @param cb 回调函数
     */
    public playMusic(clip: AudioClip | string, bundleName: string = "Sounds", volume?: number, cb?: (clip: AudioClip) => void) {
        if (!GameSettings.musicVolume || GameSettings.musicVolume <= 0) {
            LogMgr.Ins.debug(`[AudioMgr] 音乐已禁用，跳过播放`);
            return;
        }
        if (typeof volume !== "number") volume = GameSettings.musicVolume;

        if (!this._bgmSource) {
            LogMgr.Ins.error(`[AudioMgr] 播放音乐失败：BGM AudioSource未初始化`);
            return;
        }

        if (this._bgmSource.clip) {
            if (clip instanceof AudioClip) {
                if (this._bgmSource.clip.name == clip.name)
                    return
            } else
                if (this._bgmSource.clip.name == clip)
                    return
        }

        this._bgmSource.stop();
        this._bgmSource.loop = true;
        if (clip instanceof AudioClip) {
            this._bgmSource.clip = clip;
            this._bgmSource.play();
            this._bgmSource.volume = volume;
            LogMgr.Ins.debug(`[AudioMgr] 播放音乐: ${clip.name}`);
            cb && cb(clip);
        } else {

            if (this._clipCache.has(clip)) {
                this._bgmSource.clip = this._clipCache.get(clip);
                this._bgmSource.play();
                this._bgmSource.volume = volume


                LogMgr.Ins.debug(`[AudioMgr] 播放音乐(缓存): ${clip}`);
                cb && cb(this._clipCache.get(clip));
            } else {
                ResMgr.Ins.getOrLoadAsset<AudioClip>(bundleName, clip, AudioClip, (err, res) => {
                    if (err || !res) {
                        LogMgr.Ins.error(`[AudioMgr] 加载BGM失败: ${clip} ${err?.message}`);
                        return;
                    }
                    this._clipCache.set(clip, res);
                    this._bgmSource.clip = res;
                    this._bgmSource.play();
                    this._bgmSource.volume = volume;
                    LogMgr.Ins.debug(`[AudioMgr] 播放音乐(加载): ${clip}`);
                    cb && cb(res);
                });
            }
        }
    }

    /**
     * 播放音效
     * @param clip 音频片段或路径
     * @param volume 音量（可选，默认使用GameSettings.soundVolume）
     * @param bundleName 资源包名
     * @param cb 回调函数
     */
    public playOneShot(clip: AudioClip | string, bundleName: string = "Sounds", volume?: number, cb?: (clip: AudioClip) => void) {
        if (!GameSettings.soundVolume || GameSettings.soundVolume <= 0) {
            LogMgr.Ins.debug(`[AudioMgr] 音效已禁用，跳过播放`);
            return;
        }
        if (typeof volume !== "number") volume = GameSettings.soundVolume;

        if (!this._audioSource) {
            LogMgr.Ins.error(`[AudioMgr] 播放音效失败：AudioSource未初始化`);
            return;
        }

        if (clip instanceof AudioClip) {
            this._audioSource.playOneShot(clip, volume);
            LogMgr.Ins.debug(`[AudioMgr] 播放音效: ${clip.name}`);
            cb && cb(clip);
        } else {
            if (this._clipCache.has(clip)) {
                this._audioSource.playOneShot(this._clipCache.get(clip), volume);
                LogMgr.Ins.debug(`[AudioMgr] 播放音效(缓存): ${clip}`);
                cb && cb(this._clipCache.get(clip));
            } else {
                ResMgr.Ins.getOrLoadAsset<AudioClip>(bundleName, clip, AudioClip, (err, res) => {
                    if (err || !res) {
                        LogMgr.Ins.error(`[AudioMgr] 加载音效失败: ${clip} ${err?.message}`);
                        return;
                    }
                    this._clipCache.set(clip, res);
                    this._audioSource.playOneShot(res, volume);
                    LogMgr.Ins.debug(`[AudioMgr] 播放音效(加载): ${clip}`);
                    cb && cb(res);
                });
            }
        }
    }

    /**
        * 播放UI音效(常用按钮、弹窗等UI交互音效)
        * @param type 音效类型("button", "popup", "close", "switch", "slide", "error", "success")
        * @param volume 音量倍数(相对于全局音效音量)
        * @returns 音效ID
        */
    public playUISound(type: string = "click", volume: number = 1.0) {
        // UI音效通常放在resources或公共bundle中
        const bundleName = "Sounds"; // 可根据项目结构调整
        let path = "";

        // 根据类型选择不同的UI音效
        // switch (type) {
        //     case "click":
        //         path = "click";
        //         break;
        //     case "popup":
        //         path = "popup";
        //         break;
        //     case "close":
        //         path = "close";
        //         break;
        //     case "error":
        //         path = "error";
        //         break;
        //     case "win":
        //         path = "win";
        //         break;
        //     case "fail":
        //         path = "fail";
        //         break;
        //     case "hit":
        //         path = "hit";
        //         break; 

        //     default:
        //         path = "click";
        //         break;
        // }
        this.playOneShot(type, bundleName, volume);
    }
    /**
     * 停止音乐/音效
     * @param type 音频类型
     */
    public stop(type?: AudioModeE): void {
        if (!type || type === AudioModeE.BGM) {
            if (this._bgmSource) {
                this._bgmSource.stop();
                LogMgr.Ins.debug(`[AudioMgr] 停止BGM`);
            }
        }
        if (!type || type === AudioModeE.Audio) {
            if (this._audioSource) {
                this._audioSource.stop();
                LogMgr.Ins.debug(`[AudioMgr] 停止音效`);
            }
        }
    }

    /**
     * 暂停音乐/音效
     * @param type 音频类型
     */
    public pause(type?: AudioModeE): void {
        if (!type || type === AudioModeE.BGM) {
            if (this._bgmSource) {
                this._bgmSource.pause();
                LogMgr.Ins.debug(`[AudioMgr] 暂停BGM`);
            }
        }
        if (!type || type === AudioModeE.Audio) {
            if (this._audioSource) {
                this._audioSource.pause();
                LogMgr.Ins.debug(`[AudioMgr] 暂停音效`);
            }
        }
    }

    /**
     * 恢复音乐/音效
     * @param type 音频类型
     */
    public resume(type?: AudioModeE): void {
        if (!type || type === AudioModeE.BGM) {
            if (this._bgmSource && GameSettings.musicVolume > 0) {
                this._bgmSource.play();
                LogMgr.Ins.debug(`[AudioMgr] 恢复BGM`);
            }
        }
        if (!type || type === AudioModeE.Audio) {
            if (this._audioSource && GameSettings.soundVolume > 0) {
                this._audioSource.play();
                LogMgr.Ins.debug(`[AudioMgr] 恢复音效`);
            }
        }
    }

    /**
     * 设置音量
     * @param type 音频类型
     * @param volume 音量值
     */
    public setVolume(type: AudioModeE, volume: number): void {
        if (type === AudioModeE.BGM) {
            if (this._bgmSource) {
                this._bgmSource.volume = volume;
                GameSettings.musicVolume = volume;
                LogMgr.Ins.debug(`[AudioMgr] 设置BGM音量: ${volume}`);
            }
        } else {
            if (this._audioSource) {
                this._audioSource.volume = volume;
                GameSettings.soundVolume = volume;
                LogMgr.Ins.debug(`[AudioMgr] 设置音效音量: ${volume}`);
            }
        }
    }
    /**
    * 设置所有音频静音
    * @param mute 是否静音
    */
    public muteAll(mute: boolean): void {
        this._muteAll = mute;

        // 更新音乐音量
        if (this._bgmSource) {
            this._bgmSource.volume = this._muteAll ? 0 : GameSettings.musicVolume;
        }

        // 更新所有活动的音效播放器音量
        if (this._audioSource) {
            this._audioSource.volume = this._muteAll ? 0 : GameSettings.soundVolume;
        }

    }
    /**
     * 震动
     * @param duration 震动时长（毫秒）
     */
    // public vibrate(duration: number = 200): void {
    //     if (!GameSettings.vibrationEnabled) {
    //         LogMgr.Ins.debug(`[AudioMgr] 震动已禁用`);
    //         return;
    //     }

    //     try {
    //         if (sys.isNative && sys.os === sys.OS.ANDROID) {
    //             // @ts-ignore
    //             jsb.reflection.callStaticMethod("org/cocos2dx/lib/CocosHelper", "vibrate", "()V");
    //             LogMgr.Ins.debug(`[AudioMgr] 原生震动`);
    //         } else if (window.navigator && window.navigator.vibrate) {
    //             window.navigator.vibrate(duration);
    //             LogMgr.Ins.debug(`[AudioMgr] 浏览器震动`);
    //         } else {
    //             LogMgr.Ins.warn(`[AudioMgr] 当前环境不支持震动`);
    //         }
    //     } catch (error) {
    //         LogMgr.Ins.error(`[AudioMgr] 震动失败: ${error}`);
    //     }
    // }

    /**
     * 清除音频缓存
     */
    public clearCache(): void {
        this._clipCache.clear();
        LogMgr.Ins.info(`[AudioMgr] 音频缓存已清除`);
    }

    /**
     * 释放资源
     */
    public release(): void {
        this.stop(AudioModeE.BGM);
        this.stop(AudioModeE.Audio);
        this.clearCache();
        LogMgr.Ins.info(`[AudioMgr] 音频管理器资源已释放`);
    }

    public get audioSource(): AudioSource {
        return this._audioSource;
    }

    public get bgmSource(): AudioSource {
        return this._bgmSource;
    }
} 