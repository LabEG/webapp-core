import { Serializable } from "ts-serializable";
import { IGraphQuery } from '../models/view-models/graph-query.vm';
import { PageListQuery } from '../models/view-models/page-list-query.vm';
import { PagedList } from '../models/view-models/paged-list.vm';

export interface ICrudRepository<T1 extends Serializable> {

    create(value: T1, ...keys: (string | number)[]): Promise<T1>

    getById(id: string | number, ...keys: (string | number)[]): Promise<T1>

    getGraphById(id: string | number, ...keys: (string | number | IGraphQuery)[]): Promise<T1>;

    getAll(...keys: (string | number)[]): Promise<T1[]>;

    getPaged(...keys: (string | number | PageListQuery)[]): Promise<PagedList<T1>>;

    update(value: T1, ...keys: (string | number)[]): Promise<void>;

    delete(...keys: (string | number)[]): Promise<void>;

}