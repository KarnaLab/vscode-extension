import * as vscode from "vscode";
import { cd, exec } from "shelljs";

import { CustomContext } from "./types";
import { sanitizeStdoutMessages } from "./helpers";

const removeAlias = async ({ customContext }: { customContext:CustomContext }) => {
  const { functionName, alias, path} = customContext;
  const options = {
    placeHolder: "Are you sure ?",
  };
  const response = await vscode.window.showQuickPick(["Yes", "No"], options);

  if (response === "Yes") {
    vscode.window.showInformationMessage(`Karna begins to remove ${functionName}:${alias}`);

    cd(path);
    const child = exec(
      `karna remove-alias -f ${functionName} -a ${alias}`,
      { async: true }
    );

    child.stdout?.on("data", (data: string) => {
      const messages = sanitizeStdoutMessages(data);
      const errorMessage = messages.find(message => message.startsWith("Karna: Error"));
      
      if (errorMessage) {
        vscode.window.showErrorMessage(errorMessage);
      }
  
      const successMessage = 
        messages.find(message => message.startsWith("Karna: Success: Alias removed"));
  
      if (successMessage) {
        vscode.window.showInformationMessage(successMessage);
      }
    });
  }
};

export default removeAlias;
