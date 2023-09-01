import {NetError} from "./../../models/errors/net.error.js";
import {BackError} from "./../../models/errors/back.error.js";

export class ClientError {

    public message: string = "Empty message";

    public browser?: object = void 0;

    public browserHash: string = "0";

    public error?: Record<string, string | undefined> = void 0;

    public errorHash: string = "0";

    public count: number = 1;

    public location: string = location.href;

    public constructor (
        message: string | null = null,
        error: Error | null = null
    ) {
        this.message = error ?
            `ClientError ${String(message)}. ${error.name}: ${error.message}` :
            `ClientError ${String(message)}`;
        this.fillBrowser();
        if (error) {
            this.fillError(error);
        }
        this.updateHashes();
    }

    public updateHashes (): void {
        this.browserHash = String(this.hashCode(navigator.userAgent));
        if (this.error) {
            const text = [this.error.name, this.error.message, this.error.stack].join("").trim();
            this.errorHash = String(this.hashCode(text));
        }
    }

    // eslint-disable-next-line @typescript-eslint/class-methods-use-this
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
        let netError = {};

        if (error instanceof NetError || error instanceof BackError) {
            netError = {
                status: error.status ?? void 0,
                body: `Server response: \n${error.body ?? "Empty"}`
            };
        }

        // Error serialize
        this.error = {
            name: error.name,
            message: error.message,
            stack: error.stack,
            ...netError
        };
    }

    // Navigator serialization
    protected fillBrowser (): void {
        this.browser = {
            hardwareConcurrency: navigator.hardwareConcurrency,
            language: navigator.language,
            languages: navigator.languages,
            userAgent: navigator.userAgent,
            cookieEnabled: navigator.cookieEnabled,
            doNotTrack: navigator.doNotTrack,
            pdfViewerEnabled: navigator.pdfViewerEnabled
        };
    }

}
