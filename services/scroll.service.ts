
export class ScrollService {

    protected startTime = performance.now();
    protected scrollTime = 500;

    protected startScrollTop = 0;
    protected endScrollTop = 1;

    public scrollToId(elementId: string): void {
        const element: Element | null = document.querySelector(`#${elementId}`);
        if (element instanceof HTMLElement) {
            this.scrollToElement(element);
        }
    }

    public scrollToElement(element: Element): void {
        const elemRect: ClientRect = element.getBoundingClientRect();
        this.startTime = performance.now();
        this.scrollTime = Math.abs(elemRect.top) / 2;
        let scrollTop = document.documentElement!.scrollTop;
        scrollTop = scrollTop === 0 ? document.body.scrollTop : scrollTop;
        this.startScrollTop = scrollTop;
        this.endScrollTop = this.startScrollTop + elemRect.top;

        this.animateScroll();
    }

    protected animateScroll() {
        let t: number = (performance.now() - this.startTime) / this.scrollTime;
        t = t > 1 ? 1 : t;
        const p0: number = this.startScrollTop;
        const p1: number = this.startScrollTop;
        const p2: number = this.endScrollTop;
        const p3: number = this.endScrollTop;

        const result = ((1 - t) ** 3) * p0 + 3 * t * ((1 - t) ** 2) * p1 + 3 * (t ** 2) * (1 - t) * p2 + t ** 3 * p3;
        window.scrollTo(0, result); // universal scroll
        if (t < 1) {
            requestAnimationFrame(() => this.animateScroll());
        }

    }

}
