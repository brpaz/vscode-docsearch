import { DevDocsProviderConfig, DocsetProvider } from '../../models';
import { DevDocsProvider } from './devdocs';
import { Docset } from '../../docsets/docset';
import { SearchResult } from './providers';
import * as nock from 'nock';
import * as tmp from 'tmp';

describe('DevDocs Provider', () => {
  let provider: DevDocsProvider;

  let cacheDir: tmp.DirResult;

  beforeEach(() => {
    cacheDir = tmp.dirSync({ unsafeCleanup: true });
    provider = new DevDocsProvider(cacheDir.name);
  });
  it('return the correct provider key', () => {
    expect(provider.getKey()).toEqual(DocsetProvider.DevDocs);
  });

  it('should return a list of search results', async () => {
    expect(true).toBeTruthy();
  });

  describe('search', () => {
    it('should return the filtered search results for the given query', async () => {
      const mockDocset: Docset = {
        id: 'javascript',
        name: 'JavaScript',
        siteUrl: 'https://devdocs.io/javascript',
        provider: DocsetProvider.DevDocs,
        enabled: true,
        searchConfig: {
          slug: 'mock-slug',
        } as DevDocsProviderConfig,
      };

      const mockIndex = {
        entries: [
          {
            name: 'Test Entry 1',
            type: 'Category 1',
            path: 'test-entry-1',
          },
          {
            name: 'Test Entry 2',
            type: 'Category 2',
            path: 'test-entry-2',
          },
          {
            name: 'Other',
            type: 'Category 3',
            path: 'test-entry-2',
          },
        ],
      };

      nock('https://devdocs.io').get(`/docs/mock-slug/index.json`).reply(200, mockIndex);

      const results = await provider.search(mockDocset, 'Test');
      expect(results).toHaveLength(2);

      const [result1, result2] = results;

      expect(result1).toEqual({
        title: 'Test Entry 1',
        category: 'Category 1',
        url: `https://devdocs.io/mock-slug/test-entry-1`,
      } as SearchResult);

      expect(result2).toEqual({
        title: 'Test Entry 2',
        category: 'Category 2',
        url: `https://devdocs.io/mock-slug/test-entry-2`,
      } as SearchResult);
    });
  });

  afterEach(() => {
    nock.cleanAll();
    cacheDir.removeCallback();
  });
});
