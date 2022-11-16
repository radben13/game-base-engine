
import {WorldActor, WorldEntity} from '../../render-engine'

export class Bouncer extends WorldActor
{

    constructor(entity: WorldEntity) {
        super(entity)
    }

    

    public animate(time: number): void {
        const entity = this.entity as SimpleEntity
        if (!this.lastTime || this.condition != ActorCondition.moving) {
            this.lastTime = time
            return
        }
        const changeTime = time - this.lastTime;
        this.lastTime = time
        entity.setPosition(this.speed.map((val, direction) => {
            let change = val * changeTime / 1000
            let pos = entity.getPosition()[direction]
            pos += change
            if (pos > this.originalPos[direction]) {
                this.speed[direction]
            }
        }) as [number, number])
        if (speed) {
            x += Math.cos(this.angle) * speed
            y += Math.sin(this.angle) * speed
        }
        this.speed += this.acceleration * changeTime / 1000
        if (y > this.originalPos[1]) {
            y = this.originalPos[1] - (y - this.originalPos[1]) * 0.5
            this.speed = Math.round(-this.speed * 0.5)
        }
        entity.setPosition([x, y])
    }

    // new class extends WorldActor {
        
    //     public animationFrame(time: number): void {
    //         this.parent.animate(time)
    //     }
    // }
}
