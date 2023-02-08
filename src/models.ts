export enum DocsetProvider {
  Algolia = 'algolia',
  MkDocs = 'mkdocs',
  Website = 'website',
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

export interface WebsiteConfig {
  url: string;
}

export interface DevDocsConfig {
  slug: string;
}

export interface Docset {
  id: string;
  name: string;
  description?: string;
  siteUrl: string;
  enabled: boolean;
  provider: DocsetProvider;
  searchConfig: AlgoliaProviderConfig | MkDocsProviderConfig | DevDocsConfig | WebsiteConfig;
}
