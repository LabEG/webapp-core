export class NetError extends Error {

    public status: number | null = null;

    public body: string | null = null;

    public constructor (message: string, status: number | null = null) {
        super(message);

        // Set the prototype explicitly.
        Object.setPrototypeOf(this, NetError.prototype);

        this.name = "NetError";
        this.status = status;
    }

}
