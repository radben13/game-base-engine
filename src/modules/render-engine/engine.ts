import { World } from './world'

export class Engine
{
    private running: boolean = false;
    private lastTickTime: number = -1;
    private interval: number = 0;

    constructor(private world: World, private ticksPerSecond: number) {}

    public start(): boolean {
        if (this.running) {
            return false;
        }
        if (this.lastTickTime == -1) {
            this.lastTickTime = (new Date()).getTime();
        }
        this.interval = this.startInterval();
        return true;
    }

    private startInterval(): number {
        return setInterval(this.tick, Math.ceil(1000 / this.ticksPerSecond));
    }

    private tick() {

    }

}
