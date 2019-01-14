
import {LoggerService} from "./logger.service";

export class GlobalErrorHandler {

    private readonly loggerService: LoggerService;

    constructor(loggerService: LoggerService) {
        this.loggerService = loggerService;
    }

    public handleError(error: Error) {
        this.loggerService.error("Global exception", error);
        // IMPORTANT: Rethrow the error otherwise it gets swallowed
        throw error;
    }

}
