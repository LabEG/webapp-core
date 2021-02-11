
export class ScrollService {

    protected startTime: number = performance.now();

    protected scrollTime: number = 500;

    protected startScrollTop: number = 0;

    protected endScrollTop: number = 1;

    public scrollToId(elementId: string): void {
        const element: Element | null = document.querySelector(`#${elementId}`);
        if (element instanceof HTMLElement) {
            this.scrollToElement(element);
        }
    }

    public scrollToElement(element: Element): void {
        const navBarHeight = this.getNavBarHeight();

        // measure scroll position
        const elemRect: ClientRect = element.getBoundingClientRect();
        this.startTime = performance.now();
        this.scrollTime = Math.abs(elemRect.top) / 2;
        let { scrollTop } = document.documentElement;
        scrollTop = scrollTop === 0 ? document.body.scrollTop : scrollTop;
        this.startScrollTop = scrollTop;
        this.endScrollTop = this.startScrollTop - navBarHeight + elemRect.top;

        this.animateScroll(element, navBarHeight);
    }

    protected animateScroll(element: Element, navBarHeight: number): void {
        // check if element moved
        const elemRect: ClientRect = element.getBoundingClientRect();
        let { scrollTop } = document.documentElement;
        scrollTop = scrollTop === 0 ? document.body.scrollTop : scrollTop;
        this.endScrollTop = scrollTop - navBarHeight + elemRect.top;

        // bezier animation
        let t: number = (performance.now() - this.startTime) / this.scrollTime;
        t = t > 1 ? 1 : t;
        const p0: number = this.startScrollTop;
        const p1: number = this.startScrollTop;
        const p2: number = this.endScrollTop;
        const p3: number = this.endScrollTop;

        const result = (((1 - t) ** 3) * p0) + (3 * t * ((1 - t) ** 2) * p1) + (3 * (t ** 2) * (1 - t) * p2) + ((t ** 3) * p3);
        window.scrollTo(0, result); // universal scroll
        if (t < 1) {
            requestAnimationFrame(() => this.animateScroll(element, navBarHeight));
        }
    }

    private getNavBarHeight(): number {
        // measure size of navigation bar
        const measurer = document.createElement("div");
        measurer.style.position = "fixed";
        measurer.style.top = "0";
        measurer.style.height = "100vh";

        document.body.appendChild(measurer);
        const size = measurer.getBoundingClientRect();
        document.body.removeChild(measurer);

        return size.height - window.innerHeight;
    }

}
