import { _decorator, Component, Node, sp } from 'cc';
import { GameCustomEvent } from '../manager/GameCustomEvent';
import { GameEventName } from '../manager/GameEventName';
const { ccclass, property } = _decorator;

@ccclass('EnemySke')
export class EnemySke extends Component {
    @property(sp.Skeleton)
    private ske_enemy: sp.Skeleton = null;
    start() {
        GameCustomEvent.Instance.addMoreCustomEvent(GameEventName.ENEMY_SKE_EVENT,this.playAni,this);
    }

    playAni(hsEvent: GameEventName)
    {
        switch(hsEvent.getCustomProperty().eventCode)
        {
            case 0:
                //销毁
                this.removeEnemy(hsEvent.getCustomProperty().enemySerialNum);
                break;
            case 1:
                //统一事件，一起播放
                this.ske_enemy.clearTracks();
                this.ske_enemy.setAnimation(1, hsEvent.getCustomProperty().aniName, hsEvent.getCustomProperty().aniLoop);
                break;
            case 2:
                //单个事件，单个播放
                if(hsEvent.getCustomProperty().enemySerialNum == this.node.parent["enemySerialNum"])
                {
                    this.ske_enemy.clearTracks();
                    this.ske_enemy.setAnimation(1, hsEvent.getCustomProperty().aniName, hsEvent.getCustomProperty().aniLoop);
                }
                break;
        }
    }

    removeEnemy(esn:number)
    {
        GameCustomEvent.Instance.removeMoreCustomEvent(GameEventName.ENEMY_SKE_EVENT,"" + esn,"enemySerialNum");
    }

    update(deltaTime: number) {
        
    }
}


