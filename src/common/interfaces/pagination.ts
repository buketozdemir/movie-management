export interface PaginationFilterOptions<T> extends PaginationFilter {
  filter: T;
}

export interface PaginationFilter {
  page?: number;
  limit?: number;
  sortOrder?: number;
  sort?: string;
  projection?: string;
}
