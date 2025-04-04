export interface Catalog {
  id: number;
  name: string;
  key: string;
  created: Date;
}

export type CatalogDto = Omit<Catalog, 'id' | 'created'>;

export interface CatalogParams {
  search: string;
  ordering: string;
  key: string;
}
