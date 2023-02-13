import * as vscode from 'vscode';
import { DocSetsLoader } from './loader';
import defaultDocsets from './defaultDocsets';
import { Docset } from './docset';
import { DocsetProvider } from '../services/providers/providers';

describe('DocSetsLoader', () => {
  let config: vscode.WorkspaceConfiguration;
  let docsetsLoader: DocSetsLoader;

  beforeEach(() => {
    config = {
      get: jest.fn(),
      has: jest.fn(),
      inspect: jest.fn(),
      update: jest.fn(),
    } as vscode.WorkspaceConfiguration;
    docsetsLoader = new DocSetsLoader(config);
    jest.clearAllMocks();
  });

  describe('load', () => {
    it('returns default docsets when config is empty', () => {
      jest.spyOn(config, 'has').mockReturnValue(false);

      const docsets = docsetsLoader.load();
      expect(docsets).toEqual(defaultDocsets);
    });

    it('should return all docsets when the config has no docset overrides', () => {
      jest.spyOn(config, 'has').mockReturnValue(false);

      const docsets = docsetsLoader.load();

      expect(docsets).toStrictEqual(defaultDocsets);
    });

    it('should return exclude docsets that were disabled by the user', () => {
      jest.spyOn(config, 'has').mockReturnValue(true);
      jest.spyOn(config, 'get').mockReturnValue({
        react: false,
      });

      const docsets = docsetsLoader.load();

      expect(docsets.length).toBe(defaultDocsets.length - 1);
      expect(docsets).not.toEqual(expect.arrayContaining([{ id: 'react' }]));
    });

    it('should merge user defined docsets with default docsets', () => {
      const mockUserDocset: Docset = {
        id: 'user docset',
        name: 'User Docset',
        enabled: true,
        provider: DocsetProvider.Algolia,
        siteUrl: 'https://user-docset.com',
        searchConfig: {
          apiKey: '123',
          appId: '123',
          indexName: 'user-docset',
        },
      };

      jest.spyOn(config, 'has').mockReturnValue(false);
      jest.spyOn(config, 'get').mockReturnValue([mockUserDocset]);

      const docsets = docsetsLoader.load();

      expect(docsets.length).toBe(defaultDocsets.length + 1);
      expect(docsets).not.toEqual(expect.arrayContaining([{ id: 'user docset' }]));
    });
  });
});
