import { DocsetProvider, MkDocsProviderConfig } from '../../models';
import { Docset } from '../../docsets/docset';
import { SearchProvider, SearchResult } from './providers';
import { fetchBuilder, FileSystemCache } from 'node-fetch-cache';

interface Doc {
  location: string;
  title: string;
  text: string;
}

/**
 * Class for searching documentation in websites powered by MkDocs.
 */
export class MkDocsSearchProvider implements SearchProvider {
  private fetch: typeof fetchBuilder;

  constructor(cacheDir: string) {
    this.fetch = fetchBuilder.withCache(new FileSystemCache({ cacheDirectory: cacheDir, ttl: 86400 }));
  }

  async search(docset: Docset, query: string): Promise<SearchResult[]> {
    const searchConfig = docset.searchConfig as MkDocsProviderConfig;

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
    const response = await this.fetch(indexUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'vscode-docsearch-extension/1.0',
      },
    });

    if (!response.ok) {
      await response.ejectFromCache();
      throw new Error(`Error to fetch documentation. Response: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();

    if ('docs' in data && data.docs.length > 0) {
      return data.docs;
    }

    return [];
  }
}
