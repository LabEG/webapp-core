
export class ScrollService {

    protected startTime: number = performance.now();

    protected scrollTime: number = 500;

    protected startScrollTop: number = 0;

    protected endScrollTop: number = 1;

    public scrollToId (elementId: string): void {
        const element: Element | null = document.querySelector(`#${elementId}`);
        if (element instanceof HTMLElement) {
            this.scrollToElement(element);
        }
    }

    public scrollToElement (element: Element): void {
        const navBarHeight = this.getNavBarHeight();

        // Measure scroll position
        const elemRect: ClientRect = element.getBoundingClientRect();
        this.startTime = performance.now();
        this.scrollTime = Math.abs(elemRect.top) / 2;
        let {scrollTop} = document.documentElement;
        scrollTop = scrollTop === 0 ? document.body.scrollTop : scrollTop;
        this.startScrollTop = scrollTop;
        this.endScrollTop = this.startScrollTop - navBarHeight + elemRect.top;

        this.animateScroll(element, navBarHeight);
    }

    // eslint-disable-next-line max-statements
    protected animateScroll (element: Element, navBarHeight: number): void {
        // Check if element moved
        const elemRect: ClientRect = element.getBoundingClientRect();
        let {scrollTop} = document.documentElement;
        scrollTop = scrollTop === 0 ? document.body.scrollTop : scrollTop;
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
            requestAnimationFrame(() => this.animateScroll(element, navBarHeight));
        }
    }

    private getNavBarHeight (): number {
        // Measure size of navigation bar
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
