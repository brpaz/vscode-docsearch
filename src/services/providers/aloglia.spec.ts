import { AlgoliaProviderConfig } from '../../models';
import { Docset } from '../../docsets/docset';
import { AlgoliaSearchProvider } from './algolia';
import * as nock from 'nock';
import { MapperFactory } from '../mapper/mapper.factory';

const mockAlgoliaResponse = {
  hits: [
    {
      url: 'https://example.com',
      anchor: 'configuring-your-testing-environment',
      content: null,
      hierarchy: {
        lvl0: 'How to Upgrade to React 18',
        lvl1: 'Configuring Your Testing Environment',
        lvl2: null,
        lvl3: null,
        lvl4: null,
        lvl5: null,
        lvl6: null,
      },
    },
  ],
} as any;

describe('Algolia Provider', () => {
  let provider: AlgoliaSearchProvider;
  beforeEach(() => {
    provider = new AlgoliaSearchProvider(new MapperFactory());
  });
  it('return the correct provider key', () => {
    expect(provider.getKey()).toEqual('algolia');
  });

  it('should return a list of search results', async () => {
    const mockDocset = {
      id: 'react',
      name: 'React',
      siteUrl: 'https://reactjs.org',
      provider: 'algolia',
      searchConfig: {
        apiKey: 'app-key',
        appId: 'app-id',
        indexName: 'react',
      } as AlgoliaProviderConfig,
    } as Docset;

    const scope = nock('https://app-id-dsn.algolia.net', {
      reqheaders: {
        'Content-Type': 'application/json',
        'X-Algolia-API-Key': 'app-key',
        'X-Algolia-Application-Id': 'app-id',
      },
    })
      .post('/1/indexes/react/query')
      .reply(200, mockAlgoliaResponse);

    const results = await provider.search(mockDocset, 'test');
    expect(results.length).toBe(1);

    const hit = results[0];

    expect(hit.title).toEqual('Configuring Your Testing Environment');
    expect(hit.url).toEqual('https://example.com');
    expect(hit.category).toEqual('How to Upgrade to React 18');
    expect(scope.isDone()).toBeTruthy();
  });

  afterEach(() => {
    nock.cleanAll();
  });
});
