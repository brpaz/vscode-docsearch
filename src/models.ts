export enum DocsetProvider {
  Algolia = 'algolia',
  MkDocs = 'mkdocs',
  DevDocs = 'devdocs',
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

export interface DevDocsProviderConfig {
  slug: string;
}
