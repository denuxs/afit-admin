export interface Catalog {
  id: number;
  name: string;
  key: string;
  image: string;
  created: Date;
}

export interface CatalogList {
  count: number;
  next: string | null;
  previous: string | null;
  results: Catalog[];
}

export type CatalogDto = Omit<Catalog, 'id' | 'created'>;

export interface CatalogParams {
  search: string;
  ordering: string;
  key: string;
  page: number;
}
