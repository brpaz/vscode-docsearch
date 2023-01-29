// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { SearchCommand } from './commands/search';
import { DocSearch } from './services/docsearch';
import { EXTENSION_NAME } from './constants';
import { SearchProvider } from './services/providers/providers';
import { AlgoliaSearchProvider } from './services/providers/algolia';
import { get as getConfig } from './config/config';
import { MkDocsSearchProvider } from './services/providers/mkdocs';
import { MapperFactory } from './services/mapper/mapper.factory';

const searchProviders: SearchProvider[] = [new AlgoliaSearchProvider(new MapperFactory()), new MkDocsSearchProvider()];

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  console.log(`Init extension: ${EXTENSION_NAME}`);

  const extensionConfig = getConfig();
  const docsets = extensionConfig.get('docsets', []);
  const docsearchClient = new DocSearch(docsets, searchProviders);

  const searchCommand = new SearchCommand(extensionConfig, docsearchClient);

  context.subscriptions.push(searchCommand.register());
}

// this method is called when your extension is deactivated
export function deactivate() {
  console.log(`Deactivate extension: ${EXTENSION_NAME} `);
}
