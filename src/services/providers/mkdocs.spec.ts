import { MkDocsProviderConfig, Docset, DocsetProvider } from '../../models';
import { MkDocsSearchProvider } from './mkdocs';
import * as nock from 'nock';

const mockResponse = {
  docs: [
    {
      location: '#overview/test',
      text: 'some text',
      title: 'Some Title',
    },
  ],
};

describe('MkDocs Provider', () => {
  let provider: MkDocsSearchProvider;
  beforeEach(() => {
    provider = new MkDocsSearchProvider();
  });
  it('return the correct provider key', () => {
    expect(provider.getKey()).toEqual('mkdocs');
  });

  it('should return a list of search results', async () => {
    const mockDocset: Docset = {
      id: 'kubernetes',
      name: 'Kubernetes',
      siteUrl: 'https://kubernetes.io',
      enabled: true,
      provider: DocsetProvider.MkDocs,
      searchConfig: {
        indexUrl: 'https://kubernetes.github.io/ingress-nginx/search/search_index.json',
      } as MkDocsProviderConfig,
    };

    const scope = nock('https://kubernetes.github.io', {})
      .get('/ingress-nginx/search/search_index.json')
      .reply(200, mockResponse);

    const results = await provider.search(mockDocset, 'title');
    expect(scope.isDone()).toBeTruthy();
    expect(results.length).toBe(1);
    expect(results).toEqual([
      {
        title: 'Some Title',
        description: 'some text',
        url: 'https://kubernetes.io/#overview/test',
        category: 'overview > test',
      },
    ]);
  });

  afterEach(() => {
    nock.cleanAll();
  });
});
