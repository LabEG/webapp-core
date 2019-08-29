type ClassConstructor = new (...params: object[]) => object;

export function autowired(target: object, propertyKey: string | symbol): void {

    // tslint:disable-next-line:no-any
    const type: ClassConstructor = (Reflect as any).getMetadata("design:type", target, propertyKey);
    const paramTypes: ClassConstructor[] = (Reflect as any).getMetadata("design:paramtypes", type) || [];

    Object.defineProperty(
        target,
        propertyKey,
        {
            configurable: false,
            enumerable: false,
            value: singleton(type, paramTypes),
            writable: false
        }
    );
}

const singletonsList: Map<new () => object, object> = new Map<new () => object, object>();

export function singleton(constructor: ClassConstructor, params: ClassConstructor[]): object {
    if (singletonsList.has(constructor)) {
        return singletonsList.get(constructor) as object;
    } else {
        const object = new constructor(...params.map((paramConstructor) => singleton(
            paramConstructor,
            (Reflect as any).getMetadata("design:paramtypes", paramConstructor) || []
        )));
        singletonsList.set(constructor, object);

        return object;
    }

}
