import {NetError} from "../models/errors/net.error";
import {Serializable} from "ts-serializable";
import {BackError} from '../models/errors/back.error';

export type RepositoryMethod = "HEAD" | "GET" | "POST" | "DELETE" | "PUT";

export abstract class HttpRepository {

    protected abstract apiRoot: string;

    // cache for all get and head request
    protected readonly requestCache: Map<string, [Function, Function][]> = new Map<string, [Function, Function][]>();

    protected async customRequest<T>(
        type: RepositoryMethod,
        url: string,
        body: object | void,
        modelConstructor: T): Promise<T> {

        const isCacheableRequest = type === "GET" || type === "HEAD";
        const cacheKey = `${type} ${url}`;

        // *** setup cache
        if (isCacheableRequest) {
            if (this.requestCache.has(cacheKey)) {
                return new Promise((res, rej) => {
                    this.requestCache.get(cacheKey)!.push([res, rej]); // [res, rej] - its tuple
                }) as Promise<T>;
            } else {
                this.requestCache.set(cacheKey, []);
            }
        }

        // *** process request
        const headers = this.setHeaders();
        let primitive = "";
        try {
            let response = await fetch(
                `${this.apiRoot}/${url}`,
                {
                    method: type,
                    body: typeof body !== "undefined" ? JSON.stringify(body) : void 0,
                    headers: headers,
                    credentials: "include"
                }
            );
            response = await this.handleError(response);
            primitive = await response.text();
        } catch (e) {
            if (isCacheableRequest && this.requestCache.has(cacheKey)) {
                this.requestCache.get(cacheKey)!.forEach((tuple) => {
                    try {
                        tuple[1](e);
                    } catch (e) {
                        console.error(e);
                    }
                });
                this.requestCache.delete(cacheKey);
            }
            throw e;
        }

        let data: unknown = null;
        if (Array.isArray(modelConstructor) && primitive.charAt(0) === "[") {
            data = JSON.parse(primitive);
        } else if (typeof modelConstructor === "object" && primitive.charAt(0) === "{") {
            data = JSON.parse(primitive);
        } else if (typeof modelConstructor === "string" && typeof primitive === "string") {
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
                this.requestCache.get(cacheKey)!.forEach((tuple) => {
                    try {
                        tuple[1](error);
                    } catch (e) {
                        console.error(e);
                    }
                });
                this.requestCache.delete(cacheKey);
            }
            throw error;
        }

        // *** restore cache
        if (isCacheableRequest && this.requestCache.has(cacheKey)) {
            this.requestCache.get(cacheKey)!.forEach((tuple) => {
                try {
                    tuple[0](data as T);
                } catch (e) {
                    console.error(e);
                }
            });
            this.requestCache.delete(cacheKey);
        }
        return data as T;
    }

    protected async customRequestAsT<T extends Serializable>(
        type: RepositoryMethod,
        url: string,
        body: object | void,
        modelConstructor: new () => T): Promise<T> {

        const model: Object | Object[] = await this.customRequest(type, url, body, {});

        if (typeof model === "object" && !Array.isArray(model)) {
            return new modelConstructor().fromJSON(model);
        }

        throw new NetError(`Wrong returned type. Must by ${typeof modelConstructor} but return ${model}`);
    }

    protected async customRequestAsArrayT<T extends Serializable>(
        type: RepositoryMethod,
        url: string,
        body: object | void,
        modelConstructor: [new () => T]): Promise<T[]> {

        const models: Object | Object[] = await this.customRequest(type, url, body, []);

        if (Array.isArray(models)) {
            return models.map((model) => new modelConstructor[0]().fromJSON(model));
        }

        throw new NetError(`Wrong returned type. Must by ${typeof modelConstructor} but return ${models}`);
    }

    protected async handleError(response: Response): Promise<Response> {

        if (response.ok) {
            return response;
        } else {

            const body: string = await response.text();
            let error: NetError | BackError | null = null;

            if (response.status === 401) {

                error = new NetError("Authorization exception", 401);

            } else if (body.indexOf("<") === 0) { // java xml response

                const match: RegExpMatchArray | null = /<b>description<\/b> <u>(.+?)<\/u>/g.exec(body);
                error = new NetError(response.status + " - " + (match && match[1] || response.statusText || "Ошибка не указана"));

            } else if (body.indexOf("{") === 0) { // backend response

                error = this.parseBackendError(response, body);

            } else {
                error = new NetError(response.status + " - " + response.statusText);
            }

            error.status = response.status;
            error.body = body;

            throw error;
        }
    }

    protected setHeaders(): Headers {
        const headers = new Headers();
        headers.set("content-type", "application/json");
        return headers;
    }

    protected parseBackendError(response: Response, body: string): BackError {

        // todo: check on message property

        return new BackError(`${response.status} - ${response.statusText}`);
    }

}
