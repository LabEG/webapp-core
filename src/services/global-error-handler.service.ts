
import type {LoggerService} from "./logger.service";

/**
 * For Angular
 */
export class GlobalErrorHandler {

    private readonly loggerService: LoggerService;

    public constructor (loggerService: LoggerService) {
        this.loggerService = loggerService;
    }

    public handleError (error: Error): void {
        this.loggerService.error("Global exception", error);
        // IMPORTANT: Rethrow the error otherwise it gets swallowed
        throw error;
    }

}
