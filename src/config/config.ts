import * as vscode from 'vscode';
import { EXTENSION_NAME } from '../constants';
import { Docset } from '../models';
import defaultDocsets from './defaultDocsets';

/**
 * Retrieves the extension's configuration object and updates the 'docsets' property with the default value if it has not been set.
 * @return {vscode.WorkspaceConfiguration} The extension's configuration object.
 */
export function get(): vscode.WorkspaceConfiguration {
  let cfg = vscode.workspace.getConfiguration(EXTENSION_NAME);

  const docsetsConfig = <Docset[]>cfg.get('docsets');

  cfg.update('docsets', defaultDocsets, vscode.ConfigurationTarget.Global);
  cfg = vscode.workspace.getConfiguration(EXTENSION_NAME);

  if (docsetsConfig.length === 0) {
    cfg.update('docsets', defaultDocsets, vscode.ConfigurationTarget.Global);
    cfg = vscode.workspace.getConfiguration(EXTENSION_NAME);
  }

  return cfg;
}
