export enum DocsetProvider {
  Algolia = 'algolia',
  MkDocs = 'mkdocs',
}

export interface AlgoliaProviderConfig {
  indexName: string;
  apiKey: string;
  appId: string;
  facets?: Array<string>;
}

export interface MkDocsProviderConfig {
  indexUrl: string;
}

export interface Docset {
  id: string;
  name: string;
  description?: string;
  siteUrl: string;
  enabled: boolean;
  provider: DocsetProvider;
  searchConfig: AlgoliaProviderConfig | MkDocsProviderConfig;
}
