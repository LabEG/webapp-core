/* eslint-disable func-style */

export function debounce (timeout: number = 500) {
    return function newMethod (target: object, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor {
        let timeOut: number = 0;

        return {
            configurable: true,
            enumerable: descriptor.enumerable,
            value (...arg: object[]): void {
                if (timeOut) {
                    clearTimeout(timeOut);
                }

                timeOut = window.setTimeout(
                    () => {
                        timeOut = 0;
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
                        descriptor.value.apply(this, arg);
                    },
                    timeout
                );
            }
        };
    };
}
