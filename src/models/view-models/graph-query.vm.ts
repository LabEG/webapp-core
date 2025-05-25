/* eslint-disable @typescript-eslint/no-type-alias */

export type IGraphQueryDeep5 = Record<string, object | null>;

export type IGraphQueryDeep4 = Record<string, IGraphQueryDeep5 | null>;

export type IGraphQueryDeep3 = Record<string, IGraphQueryDeep4 | null>;

export type IGraphQueryDeep2 = Record<string, IGraphQueryDeep3 | null>;

export type IGraphQueryDeep1 = Record<string, IGraphQueryDeep2 | null>;

export type IGraphQuery = Record<string, IGraphQueryDeep1 | null>;
