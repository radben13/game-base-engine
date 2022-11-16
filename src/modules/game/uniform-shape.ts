import { SimpleEntity } from '../render-engine/simple-entity'

export class UniformShape extends SimpleEntity
{

    setHeight(height: number): void {
        super.setHeight(height)
        super.setWidth(height)
    }
    
    setWidth(width: number): void {
        super.setWidth(width)
        super.setHeight(width)
    }
}
