
import {jsonProperty, Serializable} from "ts-serializable";
import { PageMeta } from "./page-meta.vm";

export class PagedList<TEntity> extends Serializable {

    @jsonProperty(PageMeta)
    public pageMeta: PageMeta = new PageMeta();

    @jsonProperty([Object])
    public elements: TEntity[] = [];
}
