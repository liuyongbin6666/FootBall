# 音频管理器 (AudioMgr) 使用指南

## 概述

AudioMgr 是一个高性能的音频管理系统，专门为 Cocos Creator 游戏开发设计。它提供了音乐和音效的播放、暂停、停止等功能，支持音量控制、循环播放等特性。

## 主要特性

- ✅ **音乐管理** - 支持背景音乐的播放和管理
- ✅ **音效管理** - 支持音效的播放和管理
- ✅ **音量控制** - 支持音乐和音效的独立音量控制
- ✅ **循环播放** - 支持音乐的循环播放
- ✅ **音频池** - 支持音效的池化管理，提升性能

## 快速开始

### 1. 播放音乐

```typescript
// 播放背景音乐
AudioMgr.Ins.playMusic('bgm/main_theme', true);

// 播放一次性音乐
AudioMgr.Ins.playMusic('bgm/victory', false);
```

### 2. 播放音效

```typescript
// 播放音效
AudioMgr.Ins.playSound('sfx/click');

// 播放带参数的音效
AudioMgr.Ins.playSound('sfx/explosion', { volume: 0.8, pitch: 1.2 });
```

### 3. 控制播放

```typescript
// 暂停音乐
AudioMgr.Ins.pauseMusic();

// 恢复音乐
AudioMgr.Ins.resumeMusic();

// 停止音乐
AudioMgr.Ins.stopMusic();
```

## API 参考

### 音乐控制

```typescript
// 播放音乐
playMusic(clip: AudioClip | string, loop?: boolean): AudioSource

// 暂停音乐
pauseMusic(): void

// 恢复音乐
resumeMusic(): void

// 停止音乐
stopMusic(): void

// 设置音乐音量
setMusicVolume(volume: number): void

// 获取音乐音量
getMusicVolume(): number
```

### 音效控制

```typescript
// 播放音效
playSound(clip: AudioClip | string, options?: AudioOptions): AudioSource

// 停止音效
stopSound(clip: AudioClip | string): void

// 停止所有音效
stopAllSounds(): void

// 设置音效音量
setSoundVolume(volume: number): void

// 获取音效音量
getSoundVolume(): number
```

### 全局控制

```typescript
// 设置主音量
setMasterVolume(volume: number): void

// 获取主音量
getMasterVolume(): number

// 静音/取消静音
setMute(mute: boolean): void

// 是否静音
isMuted(): boolean
```

## 使用场景

### 1. 背景音乐管理

```typescript
// 游戏开始时的背景音乐
AudioMgr.Ins.playMusic('bgm/main_theme', true);

// 战斗时的背景音乐
AudioMgr.Ins.stopMusic();
AudioMgr.Ins.playMusic('bgm/battle', true);

// 胜利时的音乐
AudioMgr.Ins.stopMusic();
AudioMgr.Ins.playMusic('bgm/victory', false);
```

### 2. UI 音效

```typescript
// 按钮点击音效
onButtonClick() {
    AudioMgr.Ins.playSound('sfx/button_click');
}

// 界面切换音效
onUISwitch() {
    AudioMgr.Ins.playSound('sfx/ui_switch');
}
```

### 3. 游戏音效

```typescript
// 玩家攻击音效
onPlayerAttack() {
    AudioMgr.Ins.playSound('sfx/attack', { volume: 0.8 });
}

// 敌人死亡音效
onEnemyDeath() {
    AudioMgr.Ins.playSound('sfx/enemy_death', { volume: 0.6 });
}

// 爆炸音效
onExplosion() {
    AudioMgr.Ins.playSound('sfx/explosion', { 
        volume: 0.9, 
        pitch: 1.2 
    });
}
```

## 最佳实践

### 1. 音频资源管理

```typescript
// 预加载重要音频
async preloadAudio() {
    const audioClips = [
        'bgm/main_theme',
        'sfx/button_click',
        'sfx/attack',
        'sfx/explosion'
    ];
    
    for (const clip of audioClips) {
        await AudioMgr.Ins.preloadAudio(clip);
    }
}
```

### 2. 音量设置

```typescript
// 根据游戏设置调整音量
updateAudioSettings() {
    const musicVolume = GameSettings.musicVolume;
    const soundVolume = GameSettings.soundVolume;
    
    AudioMgr.Ins.setMusicVolume(musicVolume);
    AudioMgr.Ins.setSoundVolume(soundVolume);
}
```

### 3. 场景切换

```typescript
// 场景切换时的音频处理
onSceneChange() {
    // 停止当前音乐
    AudioMgr.Ins.stopMusic();
    
    // 播放新场景的音乐
    AudioMgr.Ins.playMusic('bgm/new_scene', true);
}
```

### 4. 性能优化

```typescript
// 使用音频池管理音效
class AudioPool {
    private pool: Map<string, AudioSource[]> = new Map();
    
    playSound(clip: string, options?: AudioOptions) {
        let sources = this.pool.get(clip);
        if (!sources || sources.length === 0) {
            // 创建新的音频源
            const source = AudioMgr.Ins.playSound(clip, options);
            return source;
        } else {
            // 复用池中的音频源
            const source = sources.pop();
            source.clip = clip;
            source.play();
            return source;
        }
    }
}
```

## 注意事项

1. **音频格式**: 使用合适的音频格式，平衡文件大小和音质
2. **内存管理**: 及时释放不需要的音频资源
3. **音量控制**: 提供用户可调节的音量控制
4. **平台兼容**: 注意不同平台的音频支持差异
5. **性能考虑**: 避免同时播放过多音频，影响性能

## 故障排除

### 常见问题

1. **音频无法播放**
   - 检查音频文件是否存在
   - 检查音频格式是否支持
   - 检查设备音量设置

2. **音频延迟**
   - 预加载重要音频文件
   - 使用音频池减少创建开销
   - 优化音频文件大小

3. **内存泄漏**
   - 及时停止不需要的音频
   - 释放音频资源
   - 使用音频池管理

### 调试技巧

```typescript
// 检查音频状态
const musicSource = AudioMgr.Ins.getCurrentMusic();
if (musicSource) {
    console.log('当前音乐:', musicSource.clip.name);
    console.log('音乐音量:', musicSource.volume);
    console.log('是否播放:', musicSource.playing);
}

// 检查音效池状态
const soundCount = AudioMgr.Ins.getActiveSoundCount();
console.log(`活跃音效数量: ${soundCount}`);
```

## 更新日志

### v1.0.0
- 初始版本
- 支持音乐和音效播放
- 支持音量控制
- 支持音频池管理
- 支持循环播放

## 许可证

MIT License 