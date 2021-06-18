export class BackError extends Error {

    public status: number | null = null;

    public body: string | null = null;

    public constructor (message: string, status: number | null = null) {
        super(message);

        // Set the prototype explicitly.
        Object.setPrototypeOf(this, BackError.prototype);

        this.name = "BackError";
        this.status = status;
    }

}
