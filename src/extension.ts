import * as vscode from "vscode";
import { which } from "shelljs";

import deploy from "./deploy";
import removeAlias from "./removeAlias";
import { KarnaProvider } from "./provider";

export function activate(context: vscode.ExtensionContext) {
  const TreeView = new KarnaProvider(vscode.workspace?.workspaceFolders?.[0]);
  const options = {
    treeDataProvider: TreeView,
  };
  
  vscode.window.createTreeView("karna-vs-code-extension", options);

  try {
    if (!which("karna")) {
      throw ("Karna is required: Follow https://github.com/karbonn/karna to install it.");
    };

    const refreshEntry = "karna-vs-code-extension.refreshEntry";
    const deployEntry = "karna-vs-code-extension.deployEntry";
    const removeAliasEntry = "karna-vs-code-extension.removeAliasEntry";
  
    context.subscriptions.push(vscode.commands.registerCommand(refreshEntry, () => TreeView.refresh()));
    context.subscriptions.push(vscode.commands.registerCommand(deployEntry, deploy));
    context.subscriptions.push(vscode.commands.registerCommand(removeAliasEntry, removeAlias));
    
  } catch (e) {
    vscode.window.showErrorMessage(e);
  }
}

export function deactivate() {}
