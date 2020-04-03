import { NetError } from "./../../models/errors/net.error";
import { BackError } from "./../../models/errors/back.error";

export class ClientError {

    public message: string | null = null;
    public browser: string | null = null;
    public browserHash: number = 0;
    public error: string | null = null;
    public errorHash: number = 0;
    public errorBody: string | null = null;
    public count: number = 1;

    constructor(
        message: string | null = null,
        error: Error | null = null
    ) {
        this.message = error ?
            `Ошибка в ${message}. ${error.name}: ${error.message}` :
            `Ошибка в ${message}`;
        this.fillBrowser();
        if (error) {
            this.fillError(error);
        }
        this.updateHashes();
    }

    public updateHashes(): void {
        this.browserHash = this.hashCode(this.browser ?? "");
        this.errorHash = this.hashCode(this.error ?? "");
    }

    protected hashCode(text: string): number {
        let hash = 0;
        let i = 0;
        let chr = 0;
        if (text.length === 0) {
            return hash;
        }
        for (i = 0; i < text.length; i += 1) {
            chr = text.charCodeAt(i);
            hash = ((hash << 5) - hash) + chr;
            hash |= 0; // Convert to 32bit integer
        }
        return hash;
    }

    protected fillError(error: Error): void {
        // error serialize
        this.error = JSON.stringify(error, Object.getOwnPropertyNames(error));

        // body
        if ((error && error instanceof NetError) || error instanceof BackError) {
            this.errorBody = error.body;
        }
    }

    // navigator serialization
    protected fillBrowser(): void {
        const varNavigator: { [key: string]: object } = {};
        // eslint-disable-next-line guard-for-in
        for (const i in navigator) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
            varNavigator[i] = (navigator as any)[i];
        }
        delete varNavigator.plugins;
        delete varNavigator.mimeTypes;
        this.browser = JSON.stringify(varNavigator);
    }

}
