/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * Reimplementation because don't have polifill for old Safari
 */
export class EventTargetJs implements EventTarget {

    private readonly events: Map<string, EventListenerOrEventListenerObject[]> = new Map();

    public addEventListener (
        type: string,
        callback: EventListenerOrEventListenerObject | null,
        _options?: AddEventListenerOptions | boolean | undefined
    ): void {
        if (!this.events.has(type)) {
            this.events.set(type, []);
        }
        const events = this.events.get(type);
        if (callback !== null && events?.includes(callback) === false) {
            events.push(callback);
        }
    }

    public dispatchEvent (event: Event): boolean {
        const events = this.events.get(event.type);
        events?.forEach((callback) => {
            if (callback instanceof Function) {
                callback(event);
            }
        });
        return true;
    }

    public removeEventListener (
        type: string,
        callback: EventListenerOrEventListenerObject | null,
        _options?: EventListenerOptions | boolean | undefined
    ): void {
        const events = this.events.get(type);
        if (callback !== null && events?.includes(callback) === true) {
            const index = events.indexOf(callback);
            events.splice(index, 1);
        }
    }

}
