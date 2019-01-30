import { ClientError } from "../models/view-models/client-error.vm";
import { LogLevels } from "../models/enums/log-levels.enum";

export class LoggerService {

    public readonly events: EventTarget = document.createElement("div");
    public logLevel: LogLevels = LogLevels.ERROR;

    public log(message: string, logLevel: LogLevels = LogLevels.INFO) {
        if (logLevel <= this.logLevel) {
            console.log(message);
            this.processError(message, void 0, logLevel);
        }
    }

    public warning(message: string, logLevel: LogLevels = LogLevels.WARN) {
        if (logLevel <= this.logLevel) {
            console.warn(message);
            this.processError(message, void 0, logLevel);
        }
    }

    public error(message: string, error?: Error, logLevel: LogLevels = LogLevels.ERROR) {
        if (logLevel <= this.logLevel) {
            console.error(message, error);
            this.processError(message, error, logLevel);
        }
    }

    protected processError(message: string, error?: Error, logLevel: LogLevels = LogLevels.ERROR): void {

        const clientError: ClientError = new ClientError(message, error);

        this.events.dispatchEvent(new CustomEvent<ILoggerDetail>(
            "error",
            {
                detail: {
                    error: error,
                    clientError: clientError
                }
            })
        );

        this.sendClientError(clientError);

    }

    protected sendClientError(clientError: ClientError): void {
        // todo: overide and process client error, example send to server or show modal with error
    }

}

export interface ILoggerDetail {
    error: Error | void,
    clientError: ClientError
}