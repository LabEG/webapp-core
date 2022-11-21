import {NetError} from "./../../models/errors/net.error.js";
import {BackError} from "./../../models/errors/back.error.js";

export class ClientError {

    public message: string | null = null;

    public browser: string | null = null;

    public browserHash: number = 0;

    public error: string | null = null;

    public errorHash: number = 0;

    public errorBody: string | null = null;

    public count: number = 1;

    public location: string = location.href;

    public constructor (
        message: string | null = null,
        error: Error | null = null
    ) {
        this.message = error ?
            `Ошибка в ${String(message)}. ${error.name}: ${error.message}` :
            `Ошибка в ${String(message)}`;
        this.fillBrowser();
        if (error) {
            this.fillError(error);
        }
        this.updateHashes();
    }

    public updateHashes (): void {
        this.browserHash = this.hashCode(this.browser ?? "");
        this.errorHash = this.hashCode(this.error ?? "");
    }

    protected hashCode (text: string): number {
        let hash = 0;
        let index = 0;
        let chr = 0;
        if (text.length === 0) {
            return hash;
        }
        for (index = 0; index < text.length; index += 1) {
            chr = text.charCodeAt(index);
            hash = ((hash << 5) - hash) + chr;
            hash |= 0; // Convert to 32bit integer
        }
        return hash;
    }

    protected fillError (error: Error): void {
        // Error serialize
        this.error = JSON.stringify(error, Object.getOwnPropertyNames(error));

        // Body
        if (error instanceof NetError || error instanceof BackError) {
            this.errorBody = error.body;
        }
    }

    // Navigator serialization
    protected fillBrowser (): void {
        const varNavigator: Record<string, unknown> = {};
        // eslint-disable-next-line guard-for-in
        for (const index in navigator) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
            varNavigator[index] = (navigator as any)[index];
        }
        delete varNavigator.plugins;
        delete varNavigator.mimeTypes;
        this.browser = JSON.stringify(varNavigator);
    }

}
