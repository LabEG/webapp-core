
export function debounce(timeout: number = 500) {
    return function(target: object, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor {

        let timeOut: number | null = null;

        return {
            configurable: true,
            enumerable: descriptor.enumerable,
            value(...arg: Object[]) {

                if (timeOut) {
                    clearTimeout(timeOut);
                }

                timeOut = window.setTimeout(
                    () => {
                        timeOut = null;
                        // tslint:disable-next-line:no-invalid-this
                        descriptor.value.apply(this, arg);
                    },
                    timeout
                );

            }
        };
    };
}
