import type { IGraphQuery } from "./graph-query.vm";

export enum PageListQueryFilterMethod {
    Less = "Less",
    LessOrEqual = "LessOrEqual",
    Equal = "Equal",
    GreatOrEqual = "GreatOrEqual",
    Great = "Great",
    Like = "Like",
    ILike = "ILike"
}

export class PageListQueryFilter {

    public property: string = "";

    public method?: PageListQueryFilterMethod = PageListQueryFilterMethod.Equal;

    public value: string | number = "";

    constructor(property: string, value: string | number, method: PageListQueryFilterMethod = PageListQueryFilterMethod.Equal) {
        this.property = property;
        this.method = method;
        this.value = value;
    }

}

export enum PageListQuerySortDirection {
    Asc = "Asc",
    Desc = "Desc"
}

export class PageListQuerySort {

    public property: string = "";

    public direction?: PageListQuerySortDirection = PageListQuerySortDirection.Asc;

    constructor(property: string, direction: PageListQuerySortDirection = PageListQuerySortDirection.Asc) {
        this.property = property;
        this.direction = direction;
    }

}

export class PageListQuery {

    public pageNumber?: number = 0;

    public pageSize?: number = 0;

    public filter?: PageListQueryFilter[] = [];

    public sort?: PageListQuerySort[] = [];

    public graph?: IGraphQuery = void 0;

}
