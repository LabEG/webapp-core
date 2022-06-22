
export class EventsService<TEnum> {

    protected events: EventTarget = new EventTarget();

    public addEventListener (
        type: TEnum,
        listener: EventListenerOrEventListenerObject | null,
        options?: AddEventListenerOptions | boolean
    ): void {
        this.events.addEventListener(String(type), listener, options);
    }

    public dispatchEvent (type: TEnum, data: unknown): boolean {
        return this.events.dispatchEvent(new CustomEvent(String(type), {detail: data}));
    }

    public removeEventListener (
        type: TEnum,
        callback: EventListenerOrEventListenerObject | null,
        options?: EventListenerOptions | boolean
    ): void {
        this.events.removeEventListener(String(type), callback, options);
    }

}
