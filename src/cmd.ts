import * as vscode from "vscode";

import { create } from "./create";
import { deploy } from "./deploy";

const COMMANDS = ["Create Lambda", "Deploy Lambda"];

const execute = (): Thenable<string | undefined> =>
  vscode.window.showQuickPick(COMMANDS);

const dispatchCommands = (command: string) => {
  switch (command) {
    case "Create Lambda":
      return vscode.window.showWarningMessage(create());
    case "Deploy Lambda":
      return vscode.window.showWarningMessage(deploy());
  }
};
export { execute, dispatchCommands };
