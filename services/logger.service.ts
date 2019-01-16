import { ClientError } from "../models/view-models/client-error.vm";
import { NetError } from "../models/errors/net.error";
import { BackError } from "../models/errors/back.error";
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

        const clientError: ClientError = new ClientError();

        if (error) {
            clientError.message = "Ошибка в " + message + ": " + error.name + " " + error.message;
        } else {
            clientError.message = "Ошибка в " + message;
        }

        // error serialize
        clientError.error = JSON.stringify(error, Object.getOwnPropertyNames(error));

        // body
        if ((error && error instanceof NetError) || error instanceof BackError) {
            clientError.errorBody = error.body;
        }

        // navigator serialize
        const varNavigator: { [key: string]: object } = {};
        for (const i in navigator) {
            varNavigator[i] = (navigator as any)[i];
        }
        delete varNavigator.plugins;
        delete varNavigator.mimeTypes;
        clientError.browser = JSON.stringify(varNavigator);

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