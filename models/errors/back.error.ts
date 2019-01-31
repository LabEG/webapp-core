export class BackError extends Error {

    public status: number | null = null;
    public body: string | null = null;

    constructor(m: string, status: number | null = null) {
        super(m);

        // Set the prototype explicitly.
        Object.setPrototypeOf(this, BackError.prototype);

        this.name = "BackError";
        this.status = status;
    }
}
