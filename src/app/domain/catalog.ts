export interface Catalog {
  id: number;
  name: string;
  key: string;
  created: Date;
}

export interface CatalogDto {
  name: string;
  key: string;
}
