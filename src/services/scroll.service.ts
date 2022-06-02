
export class ScrollService {

    protected startTime: number = performance.now();

    protected scrollTime: number = 500;

    protected startScrollTop: number = 0;

    protected endScrollTop: number = 1;

    protected measurer: HTMLDivElement | null = null;

    protected rafTimer: number = 0;

    public scrollToId (elementId: string): void {
        const element: Element | null = document.querySelector(`#${elementId}`);
        if (element instanceof HTMLElement) {
            this.scrollToElement(element);
        }
    }

    // eslint-disable-next-line max-statements
    public scrollToElement (element: Element): void {
        // Measure scroll position
        const elemRect: DOMRect = element.getBoundingClientRect();
        this.startTime = performance.now();
        this.scrollTime = Math.abs(elemRect.top) / 2;
        let {scrollTop} = document.documentElement;
        scrollTop = scrollTop === 0 ? document.body.scrollTop : scrollTop;
        this.startScrollTop = scrollTop;

        if (this.rafTimer) {
            cancelAnimationFrame(this.rafTimer);
            this.rafTimer = 0;
        } else {
            this.injectMeasurer();
        }
        this.animateScroll(element);
    }

    // eslint-disable-next-line max-statements
    protected animateScroll (element: Element): void {
        // Check if element moved
        const elemRect: DOMRect = element.getBoundingClientRect();
        let {scrollTop} = document.documentElement;
        scrollTop = scrollTop === 0 ? document.body.scrollTop : scrollTop;
        const navBarHeight = this.getNavBarHeight();
        this.endScrollTop = scrollTop - navBarHeight + elemRect.top;

        // Bezier animation
        let time: number = (performance.now() - this.startTime) / this.scrollTime;
        time = time > 1 ? 1 : time;
        const p0: number = this.startScrollTop;
        const p1: number = this.startScrollTop;
        const p2: number = this.endScrollTop;
        const p3: number = this.endScrollTop;

        const result = (((1 - time) ** 3) * p0) +
            (3 * time * ((1 - time) ** 2) * p1) +
            (3 * (time ** 2) * (1 - time) * p2) +
            ((time ** 3) * p3);

        window.scrollTo(0, result); // Universal scroll

        if (time < 1) {
            this.rafTimer = requestAnimationFrame(() => this.animateScroll(element));
        } else {
            this.rafTimer = 0;
            this.removeMeasurer();
        }
    }

    protected injectMeasurer (): void {
        const measurer: HTMLDivElement = document.createElement("div");
        measurer.style.position = "fixed";
        measurer.style.top = "0";
        measurer.style.height = "100vh";

        document.body.appendChild(measurer);
        this.measurer = measurer;
    }

    protected getNavBarHeight (): number {
        const height = this.measurer?.getBoundingClientRect().height ?? 0;
        return height - window.innerHeight;
    }

    protected removeMeasurer (): void {
        if (this.measurer) {
            document.body.removeChild(this.measurer);
            this.measurer = null;
        } else {
            throw new Error("ScrollService measurer is not injected");
        }
    }

}
