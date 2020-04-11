import { Serializable } from "ts-serializable";
import { IGraphQuery } from "../models/view-models/graph-query.vm";
import { PageListQuery } from "../models/view-models/page-list-query.vm";
import { PagedList } from "../models/view-models/paged-list.vm";

export interface ICrudRepository<T1 extends Serializable> {

    getById: (id: string | number) => Promise<T1>;

    getAll: () => Promise<T1[]>;

    create: (value: T1) => Promise<T1>;

    update: (id: string | number, value: T1) => Promise<void>;

    delete: (id: string | number) => Promise<void>;

    getGraphById: (id: string | number, graphQuery: IGraphQuery) => Promise<T1>;

    getPaged: (pageListQuery: PageListQuery) => Promise<PagedList<T1>>;

}
