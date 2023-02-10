import * as vscode from 'vscode';
import { DocSearch } from '../services/docsearch';
import { Docset } from '../docsets/docset';
import { SearchResult } from '../services/providers/providers';
import { SEARCH_COMMAND_ID } from './commands';

const MAX_LIST_RESULTS = 10;

class DocsetQuickPickItem implements vscode.QuickPickItem {
  label: string;
  id: string;
  detail: string;
  description: string;

  constructor(docset: Docset) {
    this.id = docset.id;
    this.label = docset.name;
    this.detail = docset.description || '';
    this.description = docset.provider.toString();
  }

  getDocsetId() {
    return this.id;
  }

  getDocsetName() {
    return this.label;
  }
}

class SearchResultQuickPickItem implements vscode.QuickPickItem {
  label: string;
  detail: string;
  url: string;

  constructor(searchResult: SearchResult) {
    this.label = searchResult.title;
    this.detail = searchResult.category;
    this.url = searchResult.url;
  }
}

/**
 * Search command.
 * This command is responsible for providing the search UI for the user.
 */
export default class SearchCommand {
  constructor(private config: vscode.WorkspaceConfiguration, private docsearch: DocSearch) {}

  execute() {
    const docsets = this.docsearch.getDocsets();
    this.showDocsetsQuickPick(docsets);
  }

  private showDocsetsQuickPick(docsets: Docset[]) {
    const quickPick = vscode.window.createQuickPick();

    quickPick.placeholder = 'Select the documentation you want to search';
    quickPick.items = docsets.map((docset) => new DocsetQuickPickItem(docset));
    quickPick.onDidChangeSelection((selection) => this.handleDocsetSelection(selection[0] as DocsetQuickPickItem));
    quickPick.show();
  }

  private showSearchResultsQuickPick(results: SearchResult[], query: string, selection: DocsetQuickPickItem) {
    const resultsPick = vscode.window.createQuickPick();
    resultsPick.placeholder = `Results for ${query} in ${selection.getDocsetName()}`;

    resultsPick.items = results.slice(0, MAX_LIST_RESULTS).map((result) => new SearchResultQuickPickItem(result));

    resultsPick.onDidChangeSelection((selection) => {
      const selectedItem = selection[0] as SearchResultQuickPickItem;
      const docUrl = selectedItem.url;

      if (!docUrl) {
        return;
      }

      vscode.commands.executeCommand('vscode.open', vscode.Uri.parse(docUrl));
    });

    resultsPick.show();
  }

  private async handleDocsetSelection(selection: DocsetQuickPickItem) {
    const query = await vscode.window.showInputBox({
      prompt: `Searching ${selection.getDocsetName()} documentation`,
      placeHolder: `Start typing your search query`,
      validateInput(value) {
        return value.length >= 3 ? null : 'Please enter a minimum of 3 characters';
      },
    });

    if (query) {
      try {
        const results = await this.docsearch.search(selection.getDocsetId(), query);

        if (results.length === 0) {
          vscode.window.showInformationMessage(`No results found for ${query} in ${selection.getDocsetName()}`);
          return;
        }

        this.showSearchResultsQuickPick(results, query, selection);
      } catch (e: unknown) {
        const error = e as Error;

        console.log(e);
        vscode.window.showErrorMessage(`Error searching ${selection.getDocsetName()}: ${error.message}`);
        return;
      }
    }
  }

  register(): vscode.Disposable {
    return vscode.commands.registerCommand(SEARCH_COMMAND_ID, () => this.execute());
  }
}
