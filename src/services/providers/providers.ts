import { Docset } from '../../models';

export interface SearchResult {
  title: string;
  description: string;
  url: string;
  category: string;
}

export interface SearchProvider {
  search(docset: Docset, query: string): Promise<SearchResult[]>;
  getKey(): string;
}
