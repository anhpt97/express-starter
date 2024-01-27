export interface PaginationQuery {
  limit: number;
  page: number;
  keyword: string;
  filter: Record<string, any>;
  sort: { by: string; direction: 'ASC' | 'DESC' };
}
