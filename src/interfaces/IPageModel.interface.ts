export interface PageModel<T> {
  pageSize: number;
  currentPage: number;
  totalItems: number;
  totalPages: number;
  items: T[];
}
