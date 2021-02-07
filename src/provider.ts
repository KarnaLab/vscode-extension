import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

import { CustomContext } from './types';

const ALIAS_CONTEXT_VALUE = "alias";
export class KarnaProvider implements vscode.TreeDataProvider<vscode.TreeItem> {
  constructor(private workspaceRoot: vscode.WorkspaceFolder | undefined) {}

  getTreeItem(element: KarnaProviderWithCustomContext): KarnaProviderWithCustomContext {
    return element;
  }

  getConfiguration(fsPath: string) {
    const file = fs.readFileSync(path.join(fsPath, "karna.json"))?.toString();

    if (!file) {
      vscode.window.showInformationMessage("No karna config file found");
      return [];
    } else {
      return JSON.parse(file);
    }
  }

  getChildren(element?: KarnaProviderWithCustomContext): Thenable<KarnaProviderWithCustomContext[]> {
    if (!this.workspaceRoot) {
      vscode.window.showInformationMessage("Empty workspace");
      return Promise.resolve([]);
    }

    const { deployments } = this.getConfiguration(this.workspaceRoot.uri.fsPath);
      
    if (!deployments) {
      return Promise.resolve([]);
    }

    if (element) {
      const { label } = element;

      const aliases = deployments[label]["aliases"];

      return Promise.resolve(Object.keys(aliases).map(alias => {
        const customContext = { 
          alias, 
          functionName: label, 
          path: this.workspaceRoot?.uri.fsPath as string,
        };
        const item = new KarnaProviderWithCustomContext(alias, vscode.TreeItemCollapsibleState.None, customContext);
        item.contextValue = ALIAS_CONTEXT_VALUE;
        return item;
      }))
    } else {
      return Promise.resolve(Object.keys(deployments).map((functionName) => 
        new KarnaProviderWithCustomContext(functionName, vscode.TreeItemCollapsibleState.Expanded)))
    }
  }

  private _onDidChangeTreeData: vscode.EventEmitter<KarnaProviderWithCustomContext | undefined | null | void> = new vscode.EventEmitter<KarnaProviderWithCustomContext | undefined | null | void>();
  readonly onDidChangeTreeData: vscode.Event<KarnaProviderWithCustomContext | undefined | null | void> = this._onDidChangeTreeData.event;

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }
}

class KarnaProviderWithCustomContext extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    public customContext?: CustomContext,  
    ) {
    super(label, collapsibleState);
    this.customContext = customContext;
  }
}
