/**
 * @file ResMgr.ts
 * @description 资源管理器，支持ad包资源加载、释放，兼容Cocos Creator 3.8.x
 */
import { Asset, assetManager, AssetManager, ImageAsset, isValid, Node, NodeEventType, Sprite, SpriteFrame, Texture2D } from 'cc';
import { ClsSingleton } from '../Singleton/ClsSingleton';
import { LogMgr } from './LogMgr';

/** 资源加载状态 */
enum LoadState {
    None,
    Loading,
    Loaded,
}

/**
 * 资源管理器
 */
export class ResMgr extends ClsSingleton<ResMgr> {
    public static get Ins(): ResMgr {
        return this.getInstance<ResMgr>();
    }
    public Name = 'ResMgr';

    /** Bundle加载状态 */
    private _bundleState: Map<string, LoadState> = new Map();
    /** Bundle加载回调队列 */
    private _bundleLoadCbs: Map<string, Array<(bundle: AssetManager.Bundle) => void>> = new Map();
    /** 远程资源加载队列 */
    private _remoteLoadCbs: Map<string, Sprite[]> = new Map();

    public async init() {
        if (this._initialized) {
            LogMgr.Ins.warn(`[${this.Name}] 重复初始化`);
            return;
        }
        this._initialized = true;
        LogMgr.Ins.info(`[${this.Name}] 初始化资源管理器`);
    }

    /** 获取Bundle */
    public getBundle(name: string) {
        return assetManager.getBundle(name);
    }

    /** 加载Bundle */
    public loadBundle(bundleName: string) {
        return new Promise<AssetManager.Bundle>((resolve) => {
            // 已加载 
            const bundle = assetManager.getBundle(bundleName);
            if (bundle) {
                return resolve(bundle);
            }

            // 加载未完成，加入回调队列
            if (this._bundleState.has(bundleName) && this._bundleState.get(bundleName) != LoadState.Loaded) {
                if (!this._bundleLoadCbs.has(bundleName))
                    this._bundleLoadCbs.set(bundleName, []);
                this._bundleLoadCbs.get(bundleName).push(resolve);
                return;
            }

            // 未加载，开始加载
            this._bundleState.set(bundleName, LoadState.Loading);
            this._bundleLoadCbs.set(bundleName, [resolve]);
            assetManager.loadBundle(bundleName, (err, bundle) => {
                if (err) {
                    console.error(`[ResMgr] Bundle加载失败: ${bundleName} ${err.message}`);
                    this._bundleState.set(bundleName, LoadState.None);
                } else {
                    console.log(`[ResMgr] Bundle加载完成: ${bundleName}`);
                    this._bundleState.set(bundleName, LoadState.Loaded);
                }
                const cbs = this._bundleLoadCbs.get(bundleName)
                if (cbs) {
                    for (const cb of cbs) cb(bundle);
                    this._bundleLoadCbs.delete(bundleName);
                }
            });
        });
    }


    /**
     * 获取或加载资源（支持Promise和回调）
     * 如果资源已加载，则直接返回
     * 如果资源未加载，则加载资源，并调用onComplete回调
     * 如果资源加载失败，则返回null，并调用onComplete回调
     * 如果资源加载成功，则返回资源，并调用onComplete回调
     */
    public async getOrLoadAsset<T extends Asset>(bundleName: string, path: string, type?: new () => T, onComplete?: (err: Error | null, asset: T | null) => void): Promise<T | null> {
        let bundle = assetManager.getBundle(bundleName);
        if (!bundle) {
            bundle = await this.loadBundle(bundleName);
            if (!bundle) {
                LogMgr.Ins.warn(`[ResMgr] 加载资源失败，找不到Bundle: ${bundleName}`);
                onComplete && onComplete(new Error('找不到Bundle'), null);
                return null;
            }
        }
        // 先尝试获取缓存
        let asset = type ? bundle.get(path, type) : bundle.get(path);
        if (asset) {
            onComplete && onComplete(null, asset as T);
            return asset as T;
        }
        // 加载资源
        return new Promise<T | null>((resolve) => {
            bundle.load(path, type, (err, res) => {
                if (err) {
                    LogMgr.Ins.warn(`[ResMgr] 加载资源失败: ${bundleName}/${path} ${err.message}`);
                    onComplete && onComplete(err, null);
                    resolve(null);
                } else {
                    onComplete && onComplete(null, res as T);
                    resolve(res as T);
                }
            });
        });
    }

    /**
     * 加载目录下所有资源
     */
    public async loadDir<T extends Asset>(bundleName: string, dir: string, type?: new () => T, onComplete?: (err: Error | null, assets: T[] | null) => void): Promise<T[] | null> {
        let bundle = assetManager.getBundle(bundleName);
        if (!bundle) {
            bundle = await this.loadBundle(bundleName);
            if (!bundle) {
                LogMgr.Ins.warn(`[ResMgr] 加载目录失败，找不到Bundle: ${bundleName}`);
                onComplete && onComplete(new Error('找不到Bundle'), null);
                return null;
            }
        }
        return new Promise<T[] | null>((resolve) => {
            bundle.loadDir(dir, type, null, (err, assets: T[]) => {
                if (err) {
                    LogMgr.Ins.warn(`[ResMgr] 加载目录失败: ${bundleName}/${dir} ${err.message}`);
                    onComplete && onComplete(err, null);
                    resolve(null);
                } else {
                    onComplete && onComplete(null, assets);
                    resolve(assets);
                }
            });
        });
    }

    /**
     * 加载远程资源
     */
    // public loadRemote<T extends Asset>(url: string, options?: any): Promise<T | null> {
    //     return new Promise((resolve) => {
    //         if (!this._remoteLoadCbs.has(url) || this._remoteLoadCbs.get(url).length === 0) {
    //             this._remoteLoadCbs.set(url, [cb]);
    //             // function cb(asset) {
    //             //     const cbs = ResMgr.Ins._remoteLoadCbs.get(url) || [];
    //             //     for (const fn of cbs) fn(asset);
    //             //     ResMgr.Ins._remoteLoadCbs.delete(url);
    //             // }
    //             assetManager.loadRemote(url, options, (err, asset: T) => {
    //                 cb(asset);
    //                 resolve(asset);
    //             });
    //         } else {
    //             this._remoteLoadCbs.get(url).push((asset) => {
    //                 resolve(asset as T);
    //             });
    //         }
    //     });
    // }

    /**
     * 设置Sprite的SpriteFrame（自动加载）
     * @param sprite Sprite组件或Node
     * @param bundleName Bundle名称
     * @param path 资源路径，不包含spriteFrame
     */
    public async setSpriteFrame(sprite: Sprite | Node, bundleName: string, path: string) {
        if (!path) return;
        if (!sprite || !isValid(sprite, true)) return;
        if (sprite instanceof Node) sprite = sprite.getComponent(Sprite);
        if (!sprite || !isValid(sprite, true)) return;
        if (!path.includes('spriteFrame')) path += '/spriteFrame';
        let spriteFrame = await this.getOrLoadAsset<SpriteFrame>(bundleName, path, SpriteFrame);
        if (spriteFrame && isValid(sprite, true)) sprite.spriteFrame = spriteFrame;
    }

    /**
     * 加载多个Bundle
     * @param bundleNames Bundle名称数组
     * @param onProgress 加载进度回调
     */
    public async loadAllBundles(bundleNames: string[], onProgress?: (progress: number) => void) {
        if (bundleNames.length === 0) return;
        let loaded = 0;
        for (const name of bundleNames) {
            await this.loadBundle(name);
            onProgress && onProgress(++loaded / bundleNames.length);
        }
    }

    /**
     * 加载远程图片并设置到Sprite
     */
    public loadRemoteImage(sprite: Sprite, url: string) {
        if (!url || !url.includes('http')) return
        if (!isValid(sprite, true)) return
        url = url.replace('http://', 'https://');
        let ext = url.includes('jpg') || url.includes('jpeg') ? '.jpg' : '.png';

        if (this._remoteLoadCbs.has(url)) {
            this._remoteLoadCbs.get(url).push(sprite)
            return
        }

        this._remoteLoadCbs.set(url, [sprite])

        assetManager.loadRemote<ImageAsset>(url, { ext }, (err, Asset) => {
            if (err) {
                LogMgr.Ins.error(`[ResMgr] 远程图片加载失败: ${url} ${err.message}`);
            } else {
                this._remoteLoadCbs.get(url).forEach(spr => {
                    if (spr && isValid(spr, true)) {
                        const spriteFrame = new SpriteFrame();
                        const texture = new Texture2D();
                        spriteFrame.texture = texture;
                        texture.image = Asset;
                        sprite.spriteFrame = spriteFrame;
                        sprite.node.once(NodeEventType.NODE_DESTROYED, () => {
                            spriteFrame.destroy();
                            texture.destroy();
                        });
                    }
                })
            }

            // this._remoteLoadCbs.get(url).length = 0
            this._remoteLoadCbs.delete(url)
        });
    }

    /**
     * 释放Bundle包
     */
    public releaseBundle(bundleName: string): void {
        let bundle = assetManager.getBundle(bundleName);
        if (!bundle) return;
        LogMgr.Ins.info(`[ResMgr] 释放Bundle包: ${bundleName}`);
        bundle.releaseAll();
        assetManager.removeBundle(bundle);
        this._bundleState.delete(bundleName);
        console.log(`[ResMgr] 释放Bundle包: ${this._bundleState}`);
    }

    /**
     * 释放指定资源
     */
    public releaseAsset(bundleName: string, path: string): void {
        let bundle = assetManager.getBundle(bundleName);
        if (!bundle) return;
        LogMgr.Ins.info(`[ResMgr] 释放资源: ${bundleName}/${path}`);
        bundle.release(path);
    }

    /**
     * 释放目录下所有资源
     */
    public releaseDir(bundleName: string, dir: string): void {
        let bundle = assetManager.getBundle(bundleName);
        if (!bundle) return;
        LogMgr.Ins.info(`[ResMgr] 释放目录: ${bundleName}/${dir}`);
        const infos = bundle.getDirWithPath(dir);
        if (infos) {
            infos.forEach((info) => {
                bundle.release(info.path);
            });
        }
    }

    /**
     * 获取资源（已加载）
     */
    public getAsset<T extends Asset>(bundleName: string, path: string, type?: new () => T): T | null {
        let bundle = assetManager.getBundle(bundleName);
        if (!bundle) {
            LogMgr.Ins.warn(`[ResMgr] getAsset 没有找到Bundle: ${bundleName}`);
            return null;
        }
        return type ? bundle.get(path, type) : bundle.get(path);
    }
} 