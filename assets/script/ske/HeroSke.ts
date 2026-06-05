import { _decorator, Component, Node, sp } from 'cc';
import { GameCustomEvent } from '../manager/GameCustomEvent';
import { GameEventName } from '../manager/GameEventName';
const { ccclass, property } = _decorator;

@ccclass('HeroSke')
export class HeroSke extends Component {
    @property(sp.Skeleton)
    private ske_hero: sp.Skeleton = null;
    start() {
        GameCustomEvent.Instance.addMoreCustomEvent(GameEventName.HERO_SKE_EVENT,this.playAni,this);
    }

    playAni(hsEvent: GameEventName)
    {
        switch(hsEvent.getCustomProperty().eventCode)
        {
            case 1:
                //统一事件，一起播放
                this.ske_hero.clearTracks();
                this.ske_hero.setAnimation(1, hsEvent.getCustomProperty().aniName, hsEvent.getCustomProperty().aniLoop);
                break;
            case 2:
                //单个事件，单个播放
                if(hsEvent.getCustomProperty().heroID == this.node.parent["heroID"])
                {
                    this.ske_hero.clearTracks();
                    // this.ske_hero.setAnimation(1, "animation_attack", false);
                    this.ske_hero.setAnimation(1, hsEvent.getCustomProperty().aniName, hsEvent.getCustomProperty().aniLoop);
                }
                break;
        }
    }

    update(deltaTime: number) {
        
    }
}


