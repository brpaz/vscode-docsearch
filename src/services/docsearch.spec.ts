import { DocSearch } from './docsearch';
import { SearchProvider } from './providers/providers';
import { AlgoliaProviderConfig, Docset, DocsetProvider } from '../models';

describe('DocSearch service', () => {
  let docSearch: DocSearch;
  let providers: SearchProvider[];
  const mockDocset: Docset = {
    id: 'react',
    name: 'React',
    provider: DocsetProvider.Algolia,
    enabled: true,
    siteUrl: 'https://reactjs.org',
    searchConfig: {
      apiKey: 'app-key',
      appId: 'app-id',
      indexName: 'react',
      facets: {},
    } as AlgoliaProviderConfig,
  };

  beforeEach(() => {
    providers = [
      {
        getKey: jest.fn().mockReturnValue('algolia'),
        search: jest.fn().mockReturnValue([{ title: 'result1', url: 'url1' }]),
      },
    ];
    docSearch = new DocSearch([mockDocset], providers);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should set the docsets and providers properties', () => {
      expect(docSearch.getDocsets()).toEqual([mockDocset]);
      expect(docSearch.getProviders()).toEqual(providers);
    });
  });

  describe('findDocsetById', () => {
    it('should return the docset if it is found', () => {
      expect(docSearch.fincDocsetById('react')).toEqual(mockDocset);
    });

    it('should return undefined if the docset is not found', () => {
      expect(docSearch.fincDocsetById('docset2')).toBeUndefined();
    });
  });

  describe('getDocsets', () => {
    it('should return the docsets property', () => {
      expect(docSearch.getDocsets()).toEqual([mockDocset]);
    });
  });

  describe('search', () => {
    it('should call the search method of the correct provider and return the results', async () => {
      const results = await docSearch.search('react', 'query');
      expect(providers[0].search).toBeCalledWith(mockDocset, 'query');
      expect(results).toEqual([{ title: 'result1', url: 'url1' }]);
    });

    it('should throw an error if the docset is not found', async () => {
      await expect(docSearch.search('docset2', 'query')).rejects.toThrow('Docset docset2 not found');
    });

    it('should throw an error if the provider is not found', async () => {
      jest.spyOn(providers[0], 'getKey').mockReturnValue('provider2');
      await expect(docSearch.search('react', 'query')).rejects.toThrow('No provider found for algolia');
    });
  });
});
