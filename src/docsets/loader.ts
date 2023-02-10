import * as vscode from 'vscode';
import { Docset } from './docset';
import defaultDocsets from './defaultDocsets';
import { CONFIG_DEFAULT_DOCSETS } from '../constants';

export class DocSetsLoader {
  constructor(private config: vscode.WorkspaceConfiguration) {}

  /**
   * This loads the available docsets. It will return docsets that are not disabled by default and by the user, it the extension settings
   */
  load(): Docset[] {
    const allDocsets = defaultDocsets.filter((docset) => docset.enabled);

    if (!this.config.has(CONFIG_DEFAULT_DOCSETS)) {
      return allDocsets;
    }

    const docsetOverrides = this.config.get<Record<string, boolean>>(CONFIG_DEFAULT_DOCSETS);

    if (docsetOverrides !== undefined) {
      return allDocsets.filter((docset: Docset) => {
        return docsetOverrides[docset.id] !== false;
      });
    }

    return allDocsets;
  }
}
