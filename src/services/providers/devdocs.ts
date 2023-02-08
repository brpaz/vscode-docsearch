import { Docset, DocsetProvider } from '../../models';
import { SearchProvider, SearchResult } from './providers';

export class DevDocsProvider implements SearchProvider {
  async search(docset: Docset, query: string): Promise<SearchResult[]> {
    return [];
  }

  getKey(): string {
    return DocsetProvider.DevDocs;
  }
}
