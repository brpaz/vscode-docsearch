import { Docset } from '../../../docsets/docset';
import { DocsetProvider, SearchProvider, SearchResult } from '../providers';
import fetch, { Response } from 'node-fetch';
import MapperFactory from './mapper/factory';

const HITS_PER_PAGE = 10;

export interface AlgoliaProviderConfig {
  indexName: string;
  apiKey: string;
  appId: string;
  facets?: Array<string>;
}

/**
 * Class for searching documentation in websites powered by Algolia.
 */
export class AlgoliaSearchProvider implements SearchProvider {
  constructor(private mapperFactory: MapperFactory) {}
  async search(docset: Docset, query: string): Promise<SearchResult[]> {
    const algoliaConfig = docset.searchConfig as AlgoliaProviderConfig;

    const response = await this.fetchResults(algoliaConfig, query);
    const data = await response.json();

    if ('hits' in data) {
      return this.mapResults(docset, data);
    }

    throw new Error(`Unknown Algolia response: ${JSON.stringify(data)}`);
  }

  getKey(): string {
    return DocsetProvider.Algolia;
  }

  private async fetchResults(algoliaConfig: AlgoliaProviderConfig, query: string): Promise<Response> {
    const searchURL = `https://${algoliaConfig.appId}-dsn.algolia.net/1/indexes/${algoliaConfig.indexName}/query`;

    return fetch(searchURL, {
      method: 'POST',
      body: JSON.stringify({
        query,
        hitsPerPage: HITS_PER_PAGE,
        facetFilters: algoliaConfig.facets || [],
      }),
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'vscode-docsearch-extension/1.0',
        'X-Algolia-API-Key': algoliaConfig.apiKey,
        'X-Algolia-Application-Id': algoliaConfig.appId,
      },
    });
  }

  private mapResults(docset: Docset, data: unknown): SearchResult[] {
    const mapper = this.mapperFactory.getMapper(docset.id);
    return mapper.map(docset, data);
  }
}
