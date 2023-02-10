import { DevDocsProviderConfig, DocsetProvider } from '../../models';
import { Docset } from '../../docsets/docset';
import { SearchProvider, SearchResult } from './providers';
import { fetchBuilder, FileSystemCache } from 'node-fetch-cache';
interface Entry {
  name: string;
  path: string;
  type: string;
}
interface Index {
  entries: Array<Entry>;
  types: Array<Entry>;
}

export class DevDocsProvider implements SearchProvider {
  private readonly docsUrl = 'https://devdocs.io';
  private readonly docsIndexURL = `https://devdocs.io/docs/:slug/index.json`;

  private fetch: typeof fetchBuilder;

  constructor(cacheDir: string) {
    this.fetch = fetchBuilder.withCache(new FileSystemCache({ cacheDirectory: cacheDir, ttl: 86400 }));
  }

  async search(docset: Docset, query: string): Promise<SearchResult[]> {
    const searchConfig = docset.searchConfig as DevDocsProviderConfig;

    const indexURL = this.docsIndexURL.replace(':slug', searchConfig.slug);

    const response = await this.fetch(indexURL);

    if (!response.ok) {
      await response.ejectFromCache();
      throw new Error(
        `Error to fetch documentation for ${docset.name}. Response: ${response.status} ${response.statusText}`,
      );
    }

    const data = (await response.json()) as Index;

    const filteredEntries = this.filterEntries(data.entries, query);

    const results = filteredEntries.map((entry) => {
      return {
        title: entry.name,
        category: entry.type,
        url: `${this.docsUrl}/${searchConfig.slug}/${entry.path}`,
      } as SearchResult;
    });

    return results;
  }

  getKey(): string {
    return DocsetProvider.DevDocs;
  }

  private filterEntries(entries: Array<Entry>, query: string): Array<Entry> {
    return entries.filter((entry) => entry.name.toLowerCase().includes(query.toLowerCase()));
  }
}
