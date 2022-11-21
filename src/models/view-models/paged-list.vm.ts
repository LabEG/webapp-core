
import {jsonProperty, Serializable} from "ts-serializable";
import {PageMeta} from "./page-meta.vm.js";

export class PagedList<TEntity> extends Serializable {

    @jsonProperty(PageMeta)
    public pageMeta: PageMeta = new PageMeta();

    @jsonProperty([Object])
    public elements: TEntity[] = [];

}
