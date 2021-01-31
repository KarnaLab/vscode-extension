import * as vscode from "vscode";
import { which } from 'shelljs';

import { deploy } from "./deploy";
import { KarnaProvider } from './provider';

export function activate(context: vscode.ExtensionContext) {
  console.log(
    'Congratulations, your extension "karna-vs-code-extension" is now active!'
  );

  const TreeView = new KarnaProvider(vscode.workspace?.workspaceFolders?.[0]);

  vscode.window.createTreeView('karna-vs-code-extension', {
    treeDataProvider: TreeView
  });

  try {
    if (!which("karna")) {
      throw ('Karna is required: Follow https://github.com/karbonn/karna to install it.');
    };

    const refreshEntry = "karna-vs-code-extension.refreshEntry";
    const uploadEntry = "karna-vs-code-extension.uploadEntry";
    const deleteAliasEntry = "karna-vs-code-extension.deleteAliasEntry";
  
    const refreshEntryHandler = () => { TreeView.refresh(); };
    const deleteAliasEntryHandler = () => {};
  
    context.subscriptions.push(vscode.commands.registerCommand(refreshEntry, refreshEntryHandler));
    context.subscriptions.push(vscode.commands.registerCommand(uploadEntry, deploy));
    context.subscriptions.push(vscode.commands.registerCommand(deleteAliasEntry, deleteAliasEntryHandler));
    
  } catch (e) {
    vscode.window.showErrorMessage(e);
  }
}

export function deactivate() {}
