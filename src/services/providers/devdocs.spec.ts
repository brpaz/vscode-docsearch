import { DocsetProvider } from '../../models';
import * as nock from 'nock';
import { DevDocsProvider } from './devdocs';

describe('DevDocs Provider', () => {
  let provider: DevDocsProvider;
  beforeEach(() => {
    provider = new DevDocsProvider();
  });
  it('return the correct provider key', () => {
    expect(provider.getKey()).toEqual(DocsetProvider.DevDocs);
  });

  it('should return a list of search results', async () => {
    expect(true).toBeTruthy();
  });
  afterEach(() => {
    nock.cleanAll();
  });
});
