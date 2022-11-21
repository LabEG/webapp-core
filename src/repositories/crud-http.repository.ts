import {HttpRepository} from "./http.repository.js";
import type {ICrudRepository} from "./icrud.repository.js";
import type {Serializable} from "ts-serializable";
import type {IGraphQuery} from "../models/view-models/graph-query.vm.js";
import type {PageListQuery} from "../models/view-models/page-list-query.vm.js";
import type {PagedList} from "../models/view-models/paged-list.vm.js";

export abstract class CrudHttpRepository<T1 extends Serializable> extends HttpRepository implements ICrudRepository<T1> {

    protected abstract apiRoot: string;

    protected abstract modelConstructor: new () => T1;

    public async getById (id: number | string, ...keys: (number | string)[]): Promise<T1> {
        let url = this.apiRoot;
        keys.forEach((key: string): void => {
            url = url.replace(/\{.+\}/gu, String(key));
        });
        return this.customRequestAsT("GET", `${url}/${id}`, void 0, this.modelConstructor);
    }

    public async getAll (...keys: (number | string)[]): Promise<T1[]> {
        let url = this.apiRoot;
        keys.forEach((key: string): void => {
            url = url.replace(/\{.+\}/gu, String(key));
        });
        return this.customRequestAsArrayT("GET", `${url}/`, void 0, [this.modelConstructor]);
    }

    public async create (value: T1, ...keys: (number | string)[]): Promise<T1> {
        let url = this.apiRoot;
        keys.forEach((key: string): void => {
            url = url.replace(/\{.+\}/gu, String(key));
        });
        return this.customRequestAsT("POST", `${url}/`, value, this.modelConstructor);
    }

    public async update (id: number | string, value: T1, ...keys: (number | string)[]): Promise<void> {
        let url = this.apiRoot;
        keys.forEach((key: string): void => {
            url = url.replace(/\{.+\}/gu, String(key));
        });
        return this.customRequest("PUT", `${url}/${id}`, value, void 0);
    }

    public async delete (id: number | string, ...keys: (number | string)[]): Promise<void> {
        let url = this.apiRoot;
        keys.forEach((key: string): void => {
            url = url.replace(/\{.+\}/gu, String(key));
        });
        return this.customRequest("DELETE", `${url}/${id}`, void 0, void 0);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public async getGraphById (id: number | string, ...keys: (IGraphQuery | number | string)[]): Promise<T1> {
        await Promise.resolve();
        throw new Error("Method not implemented.");
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public async getPaged (...keys: (PageListQuery | number | string)[]): Promise<PagedList<T1>> {
        await Promise.resolve();
        throw new Error("Method not implemented.");
    }

}
