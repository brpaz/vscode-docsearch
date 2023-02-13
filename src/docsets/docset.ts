import { AlgoliaProviderConfig } from '../services/providers/algolia';
import { DevDocsProviderConfig } from '../services/providers/devdocs';
import { MkDocsProviderConfig } from '../services/providers/mkdocs';
import { DocsetProvider } from '../services/providers/providers';

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
