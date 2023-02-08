import * as vscode from 'vscode';
import { DocSetsLoader } from './loader';
import defaultDocsets from './defaultDocsets';

describe('DocSetsLoader', () => {
  let config: vscode.WorkspaceConfiguration;
  let docSetsLoader: DocSetsLoader;

  beforeEach(() => {
    config = {
      get: jest.fn(),
      has: jest.fn(),
      inspect: jest.fn(),
      update: jest.fn(),
    } as vscode.WorkspaceConfiguration;
    docSetsLoader = new DocSetsLoader(config);
    jest.clearAllMocks();
  });

  describe('load', () => {
    it('returns default docsets when config is empty', () => {
      config.get = jest.fn(() => []);
      const docsets = docSetsLoader.load();
      expect(docsets).toEqual(defaultDocsets);
    });

    it('should return all docsets when the config has no docset overrides', () => {
      config.has = jest.fn(() => false);

      const docsetsLoader = new DocSetsLoader(config);
      const docsets = docsetsLoader.load();

      expect(docsets).toStrictEqual(defaultDocsets);
    });

    it('should return exclude docsets that were disabled by the user', () => {
      config.has = jest.fn().mockReturnValue(true);
      config.get = jest.fn().mockReturnValue({
        react: false,
      });

      const docsetsLoader = new DocSetsLoader(config);
      const docsets = docsetsLoader.load();

      expect(docsets.length).toBe(defaultDocsets.length - 1);
      expect(docsets).not.toEqual(expect.arrayContaining([{ id: 'react' }]));
    });
  });
});
