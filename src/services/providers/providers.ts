import { Docset } from '../../docsets/docset';

export interface SearchResult {
  title: string;
  description: string;
  url: string;
  category: string;
}

export enum DocsetProvider {
  Algolia = 'algolia',
  MkDocs = 'mkdocs',
  DevDocs = 'devdocs',
}

export interface SearchProvider {
  search(docset: Docset, query: string): Promise<SearchResult[]>;
  getKey(): string;
}
