import { ClientError } from "../models/view-models/client-error.vm";
import { NetError } from "../models/errors/net.error";
import { BackError } from "../models/errors/back.error";
import { LogLevels } from "../models/enums/log-levels.enum";

export class LoggerService {

    public readonly events: HTMLElement = document.createElement("div");

    public logLevel: LogLevels = LogLevels.ERROR;
    public loginUrl: string | null = null;

    public log(message: string, logLevel: LogLevels = LogLevels.INFO) {
        if (logLevel <= this.logLevel) {
            console.log(message);
            this.showModalWithError(message, void 0, logLevel);
        }
    }

    public warning(message: string, logLevel: LogLevels = LogLevels.WARN) {
        if (logLevel <= this.logLevel) {
            console.warn(message);
            this.showModalWithError(message, void 0, logLevel);
        }
    }

    public error(message: string, error?: Error, logLevel: LogLevels = LogLevels.ERROR) {
        if (logLevel <= this.logLevel) {
            console.error(message, error);
            this.showModalWithError(message, error, logLevel);
        }
    }

    private showModalWithError(message: string, error?: Error, logLevel: LogLevels = LogLevels.ERROR): void {
        if (error && error instanceof NetError && error.status === 401 && this.loginUrl) {
            window.location.href = this.loginUrl;
            return;
        }

        const clientError: ClientError = new ClientError();

        if (error) {
            clientError.message =
                "Ошибка в " + message + ": " + error.name + " " + error.message;
        } else {
            clientError.message = "Ошибка в " + message;
        }

        clientError.error = JSON.stringify(
            error,
            Object.getOwnPropertyNames(error)
        );

        if ((error && error instanceof NetError) || error instanceof BackError) {
            clientError.errorBody = error.body;
        }

        const varNavigator: { [key: string]: object } = {};
        for (const i in navigator) {
            varNavigator[i] = (navigator as any)[i];
        }
        delete varNavigator.plugins;
        delete varNavigator.mimeTypes;
        clientError.browser = JSON.stringify(varNavigator);

        // let errorType: string = "error";
        // if (error instanceof NetError && error.status === 503) {
        //     errorType = "updateserver";
        // }

        // if (environment.production) {
        //     this.events.dispatchEvent(
        //         new CustomEvent(errorType, {
        //             detail: { text: JSON.stringify(clientError) }
        //         })
        //     );
        // } else {
        //     alertify.error(clientError.message);
        // }
    }
}
