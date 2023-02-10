import { DocsetProvider, AlgoliaProviderConfig, MkDocsProviderConfig, DevDocsProviderConfig } from '../models';

export type ProviderConfig = AlgoliaProviderConfig | MkDocsProviderConfig | DevDocsProviderConfig;

export interface Docset {
  id: string;
  name: string;
  description?: string;
  siteUrl: string;
  enabled: boolean;
  provider: DocsetProvider;
  searchConfig: ProviderConfig;
}
