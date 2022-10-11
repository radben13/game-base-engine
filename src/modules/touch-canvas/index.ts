import { BehaviorSubject, Observable, Subject } from 'rxjs'
import { filter, map, combineLatestWith, tap } from 'rxjs/operators'

export class TouchCanvas
{

    private height: BehaviorSubject<string> = new BehaviorSubject('100%');
    private width: BehaviorSubject<string> = new BehaviorSubject('100%');
    private dimensionRefresh: BehaviorSubject<undefined> = new BehaviorSubject(void(0));
    private canvasMouse: Subject<MouseEvent> = new Subject();
    private canvas: BehaviorSubject<HTMLCanvasElement | null> = new BehaviorSubject<HTMLCanvasElement | null>(null);

    constructor(private targetSelector: string = '#touch-wrapper') {
    }

    /**
     * Initialize a TouchCanvas instance within an element.
     */
    public init() {
        const targetElement = this.getTargetElement();
        if (!targetElement) {
            console.error(new Error('Attempt to init TouchCanvas without target element specified'))
            return
        }
        targetElement.innerHTML = `<div class="touch-canvas-wrapper"><canvas class="touch-canvas" /></div>`

        this.getDimension$()
            .pipe(combineLatestWith(this.getCanvas$()))
            .subscribe(([{height, width}, canvas]) => {
                canvas.style.height = height
                canvas.style.width = width
                const dimensions = canvas.getBoundingClientRect()
                canvas.setAttribute('width', dimensions.width.toString())
                canvas.setAttribute('height', dimensions.height.toString())
            })
        this.getCanvas$().subscribe((canvas) => {
                canvas.addEventListener('click', (event) => this.canvasMouse.next(event))
                canvas.addEventListener('mouseover', (event) => this.canvasMouse.next(event))
                canvas.addEventListener('mousedown', (event) => this.canvasMouse.next(event))
                canvas.addEventListener('mousemove', (event) => this.canvasMouse.next(event))
            })
        const canvas = targetElement.querySelector('.touch-canvas')
        if (canvas && canvas instanceof HTMLCanvasElement) {
            this.canvas.next(canvas)
        }

        window.addEventListener('resize', () => this.dimensionRefresh.next(void(0)))
    }

    /**
     * getTargetElement
     */
    public getTargetElement(): HTMLElement | null {
        return window.document.querySelector(this.targetSelector);
    }

    /**
     * getDimension$
     */
    public getDimension$() {
        return this.height.asObservable()
            .pipe(
                combineLatestWith(this.width.asObservable(), this.dimensionRefresh.asObservable()),
                map(([height, width]) => {
                    return {height, width}
                })
            );
    }
    
    /**
     * setHeight
     */
    public setHeight(height: string) {
        this.height.next(height);
    }

    /**
     * setWidth
     */
    public setWidth(width: string) {
        this.width.next(width);
    }

    
    /**
     * setDimensions
     */
    public setDimensions(height: string, width: string) {
        this.height.next(height);
        this.width.next(width);
    }

    /**
     * getCanvas$
     */
    public getCanvas$(): Observable<HTMLCanvasElement> {
        return this.canvas.asObservable()
            .pipe(
                filter(canvas => Boolean(canvas) && canvas instanceof HTMLCanvasElement),
                map(canvas => canvas as HTMLCanvasElement)
            )
    }

    /**
     * getCanvasClick$
     */
    public getCanvasClick$() {
        return this.canvasMouse.asObservable()
            .pipe(
                filter(event => event.type == 'click'),
                combineLatestWith(this.getCanvas$()),
                map(([event, canvas]) => {
                    const {x,y} = canvas.getBoundingClientRect();
                    return {
                        x: event.clientX - x,
                        y: event.clientY - y
                    }
                })
            );
    }

    

    /**
     * getCanvasMouseMove$
     */
     public getCanvasMouseMove$() {
        return this.canvasMouse.asObservable()
            .pipe(
                filter(event => event.type == 'mousemove'),
                combineLatestWith(this.getCanvas$()),
                map(([event, canvas]) => {
                    const {x,y} = canvas.getBoundingClientRect();
                    return {
                        x: event.clientX - x,
                        y: event.clientY - y
                    }
                })
            );
    }

    
    /**
     * getCanvasMouseDown$
     */
     public getCanvasMouseDown$() {
        return this.canvasMouse.asObservable()
            .pipe(
                filter(event => event.type == 'mousedown'),
                combineLatestWith(this.getCanvas$()),
                map(([event, canvas]) => {
                    const {x,y} = canvas.getBoundingClientRect();
                    return {
                        x: event.clientX - x,
                        y: event.clientY - y
                    }
                })
            );
    }

    
    /**
     * getCanvasClick$
     */
     public getCanvasContext$(): Observable<CanvasRenderingContext2D> {
        return this.getCanvas$()
            .pipe(
                map((canvas) => {
                    return canvas.getContext("2d")
                }),
                filter((context) => Boolean(context)),
                map(context => context as CanvasRenderingContext2D),
                tap(context => context?.resetTransform())
            );
    }

}
