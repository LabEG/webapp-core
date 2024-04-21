/* eslint-disable @typescript-eslint/class-methods-use-this */
/* eslint-disable @typescript-eslint/no-invalid-void-type */
/* eslint-disable @typescript-eslint/ban-types */
import {NetError} from "../models/errors/net.error.js";
import type {Serializable} from "ts-serializable";
import {BackError} from "../models/errors/back.error.js";

// eslint-disable-next-line @typescript-eslint/no-type-alias
export type Methods = "DELETE" | "GET" | "HEAD" | "POST" | "PUT";

export abstract class HttpRepository {

    // Cache for all get and head request
    protected readonly requestCache: Map<string, [Function, Function][]> = new Map<string, [Function, Function][]>();

    protected abstract apiRoot: string;

    // eslint-disable-next-line max-statements, complexity, max-lines-per-function, @typescript-eslint/max-params
    protected async customRequest<T>(
        type: Methods,
        url: string,
        body: object | void,
        modelConstructor: T
    ): Promise<T> {
        const isCacheableRequest = type === "GET" || type === "HEAD";
        const cacheKey = `${type} ${url}`;

        // *** Setup cache
        if (isCacheableRequest) {
            if (this.requestCache.has(cacheKey)) {
                return new Promise((res: (val: T) => void, rej: () => void) => {
                    this.requestCache.get(cacheKey)?.push([res, rej]); // [res, rej] - its tuple
                });
            }
            this.requestCache.set(cacheKey, []);
        }

        // *** Process request
        const headers = this.setHeaders();
        let primitive: string = "";
        try {
            let response = await fetch(
                url,
                {
                    method: type,
                    body: typeof body === "undefined" ? void 0 : JSON.stringify(body),
                    headers,
                    credentials: "include"
                }
            );
            response = await this.handleError(response);
            primitive = await response.text();
        } catch (fetchError: unknown) {
            if (isCacheableRequest && this.requestCache.has(cacheKey)) {
                this.requestCache.get(cacheKey)?.forEach((tuple: [Function, Function]) => {
                    try {
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                        tuple[1](fetchError);
                    } catch (re: unknown) {
                        // eslint-disable-next-line no-console, @typescript-eslint/no-unsafe-call
                        console.error(re);
                    }
                });
                this.requestCache.delete(cacheKey);
            }
            throw fetchError;
        }

        let data: unknown = null;
        if (Array.isArray(modelConstructor) && primitive.startsWith("[")) {
            data = JSON.parse(primitive) as object;
        } else if (typeof modelConstructor === "object" && primitive.startsWith("{")) {
            data = JSON.parse(primitive) as object;
        } else if (typeof modelConstructor === "string") {
            data = primitive;
        } else if (typeof modelConstructor === "number") {
            data = Number(primitive);
        } else if (typeof modelConstructor === "boolean") {
            data = Boolean(primitive);
        } else if (typeof modelConstructor === "undefined") {
            data = void 0;
        } else {
            const error = new NetError(`Wrong returned type. Must by ${typeof modelConstructor} but return ${typeof primitive}`);
            if (isCacheableRequest && this.requestCache.has(cacheKey)) {
                this.requestCache.get(cacheKey)?.forEach((tuple: [Function, Function]) => {
                    try {
                        tuple[1](error);
                    } catch (typeError: unknown) {
                        // eslint-disable-next-line no-console, @typescript-eslint/no-unsafe-call
                        console.error(typeError);
                    }
                });
                this.requestCache.delete(cacheKey);
            }
            throw error;
        }

        // *** Restore cache
        if (isCacheableRequest && this.requestCache.has(cacheKey)) {
            this.requestCache.get(cacheKey)?.forEach((tuple: [Function, Function]) => {
                try {
                    tuple[0](data as T);
                } catch (promiseError: unknown) {
                    // eslint-disable-next-line no-console, @typescript-eslint/no-unsafe-call
                    console.error(promiseError);
                }
            });
            this.requestCache.delete(cacheKey);
        }
        return data as T;
    }

    // eslint-disable-next-line @typescript-eslint/max-params
    protected async customRequestAsT<T extends Serializable>(
        type: Methods,
        url: string,
        body: object | void,
        ModelConstructor: new () => T
    ): Promise<T> {
        const model: Object = await this.customRequest(type, url, body, {});
        return new ModelConstructor().fromJSON(model);
    }

    // eslint-disable-next-line @typescript-eslint/max-params
    protected async customRequestAsArrayT<T extends Serializable>(
        type: Methods,
        url: string,
        body: object | void,
        modelConstructor: [new () => T]
    ): Promise<T[]> {
        const models: Object[] = await this.customRequest(type, url, body, []);
        return models.map((model: Object) => new modelConstructor[0]().fromJSON(model));
    }

    // eslint-disable-next-line max-statements
    protected async handleError (response: Response): Promise<Response> {
        if (response.ok) {
            return response;
        }

        const body: string = await response.text();
        let error: BackError | NetError | null = null;

        if (response.status === 401) {
            error = new NetError("Authorization exception", 401);
        } else if (body.startsWith("<")) { // Java xml response
            // eslint-disable-next-line prefer-named-capture-group
            const match: RegExpMatchArray | null = (/<b>description<\/b> <u>(.+?)<\/u>/gu).exec(body);
            error = new NetError(`${response.status} - ${((match?.[1] ?? response.statusText) || "Ошибка не указана")}`);
        } else if (body.startsWith("{")) { // Backend response
            error = this.parseBackendError(response, body);
        } else {
            error = new NetError(`${response.status} - ${response.statusText}`);
        }

        error.status = response.status;
        error.body = body;

        // eslint-disable-next-line @typescript-eslint/no-throw-literal
        throw error;
    }

    protected setHeaders (): Headers {
        const headers = new Headers();
        headers.set("content-type", "application/json");
        headers.set("Pragma", "no-cache");
        return headers;
    }

    protected parseBackendError (response: Response, body: string): BackError {
        // Override method, check on message property
        const backError = new BackError(`${response.status} - ${response.statusText}`);
        backError.body = body;

        return backError;
    }

}
