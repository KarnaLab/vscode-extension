import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export class KarnaProvider implements vscode.TreeDataProvider<vscode.TreeItem> {
  constructor(private workspaceRoot: vscode.WorkspaceFolder | undefined) {}

  getTreeItem(element: Dependency): Dependency {
    return element;
  }

  getChildren(element?: Dependency): Thenable<Dependency[]> {
    if (!this.workspaceRoot) {
      vscode.window.showInformationMessage('No dependency in empty workspace');
      return Promise.resolve([]);
    }

    const file = JSON.parse(fs.readFileSync(path.join(this.workspaceRoot.uri.fsPath, 'karna.json')).toString());

    if (element) {
      //@ts-ignore
      const aliases = file.deployments[element.label]['aliases'];

      return Promise.resolve(Object.keys(aliases).map(alias => {
        const item = new Dependency(alias, vscode.TreeItemCollapsibleState.None, {alias, functionName: element.label, path: this.workspaceRoot?.uri.fsPath });
        item.contextValue = 'alias';
        return item;
      }))
    } else {
      return Promise.resolve(Object.keys(file.deployments).map((functionName) => 
        new Dependency(functionName, vscode.TreeItemCollapsibleState.Expanded)))
    }
  }

  private _onDidChangeTreeData: vscode.EventEmitter<Dependency | undefined | null | void> = new vscode.EventEmitter<Dependency | undefined | null | void>();
  readonly onDidChangeTreeData: vscode.Event<Dependency | undefined | null | void> = this._onDidChangeTreeData.event;

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }
}

class Dependency extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    public customContext: any = {},  
    ) {
    super(label, collapsibleState);
    this.customContext = customContext;
  }
}
