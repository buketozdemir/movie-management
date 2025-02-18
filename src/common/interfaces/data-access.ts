import { FilterQuery, SortOrder } from 'mongoose';

export type StringObject = string | object | undefined;

export interface BaseQueryParams<T> {
  filter?: FilterQuery<T>;
  projection?: StringObject;
}

export interface PageQueryParams<T> extends BaseQueryParams<T> {
  page?: number;
  limit?: number;
  sort?: string | { [key: string]: SortOrder | { $meta: any } } | [string, SortOrder][] | undefined | null;
  sortOrder?: number;
}

export interface PaginationResult<T> {
  data: T[];
  page: number;
  limit: number;
  totalCount: number;
}

export interface QueryParams {
  filter?: object;
  projection?: string | object;
  sort?: object;
}

export interface PaginatedQueryParams {
  filter?: object | any;
  projection?: string | any;
  sort?: any;
  sortOrder?: number;
  page?: number;
  limit?: number;
}

export interface AggregateQueryParams {
  pipeline: object[];
  projection?: string | object;
  sort?: string;
  sortOrder?: number;
  page?: number;
  limit?: number;
}

export interface UpdateArrayItemParams {
  fieldName: string;
  payload: any;
  filterName?: string;
}
