import {ClientError} from "../models/view-models/client-error.vm.js";
import {LogLevels} from "../models/enums/log-levels.enum.js";
import {EventTargetJs} from "../helper/EventTarget.js";

export class LoggerService {

    public readonly events: EventTarget = new EventTargetJs();

    public logLevel: LogLevels = LogLevels.Error;

    public log (message: string, logLevel: LogLevels = LogLevels.Info): void {
        if (logLevel <= this.logLevel) {
            // eslint-disable-next-line no-console
            console.log(message);
            this.processError(message, void 0, logLevel);
        }
    }

    public warning (message: string, logLevel: LogLevels = LogLevels.Warn): void {
        if (logLevel <= this.logLevel) {
            // eslint-disable-next-line no-console
            console.warn(message);
            this.processError(message, void 0, logLevel);
        }
    }

    public error (message: string, error?: Error, logLevel: LogLevels = LogLevels.Error): void {
        if (logLevel <= this.logLevel) {
            // eslint-disable-next-line no-console
            console.error(message, error);
            this.processError(message, error, logLevel);
        }
    }

    protected processError (message: string, error?: Error, logLevel: LogLevels = LogLevels.Error): void {
        const clientError: ClientError = new ClientError(message, error);

        this.events.dispatchEvent(new CustomEvent<ILoggerDetail>("error", {detail: {error,
            clientError}}));

        this.sendClientError(clientError, logLevel);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    protected sendClientError (clientError: ClientError, logLevel: LogLevels): void {
        // Overide and process client error, example send to server or show modal with error
    }

}

export interface ILoggerDetail {
    error?: Error;
    clientError: ClientError;
}
