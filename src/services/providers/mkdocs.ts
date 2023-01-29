import { Docset, DocsetProvider, MkDocsProviderConfig } from '../../models';
import { SearchProvider, SearchResult } from './providers';
import fetch from 'node-fetch';

interface Doc {
  location: string;
  title: string;
  text: string;
}

/**
 * Class for searching documentation in websites powered by MkDocs.
 */
export class MkDocsSearchProvider implements SearchProvider {
  async search(docset: Docset, query: string): Promise<SearchResult[]> {
    const searchConfig = docset.searchConfig as MkDocsProviderConfig;

    // TODO cache index to avoid fetching it every time.
    const indexedDocs = await this.fetchIndex(searchConfig.indexUrl);

    return indexedDocs
      .filter((doc) => doc.title.toLowerCase().includes(query.toLowerCase()))
      .map((doc) => {
        return {
          title: doc.title,
          description: doc.text,
          url: `${docset.siteUrl}/${doc.location}`,
          category: doc.location.replaceAll('/', ' > ').replaceAll('#', '').replaceAll('-', ' '),
        };
      });
  }

  getKey(): string {
    return DocsetProvider.MkDocs;
  }

  private async fetchIndex(indexUrl: string): Promise<Doc[]> {
    const response = await fetch(indexUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'vscode-docsearch-extension/1.0',
      },
    });

    const data = await response.json();

    if (data.docs.length > 0) {
      return data.docs;
    }

    return [];
  }
}
