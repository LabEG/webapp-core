/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable func-style */

// eslint-disable-next-line @typescript-eslint/no-type-alias
type ClassConstructor = new (...params: object[]) => object;

const singletonsList: Map<new () => object, object> = new Map<new () => object, object>();

export function singleton(constructor: ClassConstructor, params: ClassConstructor[]): object {
    if (singletonsList.has(constructor)) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return singletonsList.get(constructor)!;
    }
    const object = new constructor(...params.map((paramConstructor: ClassConstructor) => singleton(
        paramConstructor,
        (Reflect as any).getMetadata("design:paramtypes", paramConstructor) || []
    )));
    singletonsList.set(constructor, object);

    return object;
}

export function autowired(target: object, propertyKey: string | symbol): void {
    const type: ClassConstructor = (Reflect as any).getMetadata("design:type", target, propertyKey) as ClassConstructor;
    const paramTypes: ClassConstructor[] = (Reflect as any).getMetadata("design:paramtypes", type) as [] || [];

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
