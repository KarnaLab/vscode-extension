import * as vscode from "vscode";
import { cd, exec } from "shelljs";

import { CustomContext } from "./types";
import { sanitizeStdoutMessages } from "./helpers";

const deploy = async ({ customContext }: { customContext: CustomContext }) => {
  const { functionName, alias, path} = customContext;
  
  vscode.window.showInformationMessage(`Karna begins to deploy ${functionName}:${alias}`);

  cd(path);
  
  const child = exec(
    `karna deploy -f ${functionName} -a ${alias}`,
    { async: true }
  );

  child.stdout?.on("data", (data: string) => {
    const messages = sanitizeStdoutMessages(data);
    const errorMessage = messages.find(message => message.startsWith("Karna: Error"));
    
    if (errorMessage) {
      vscode.window.showErrorMessage(errorMessage);
    }

    const successMessage = 
      messages.find(message => message.startsWith("Karna: Success: API available"))
      || messages.find(message => message.startsWith("Karna: Success: Completed in"));

    if (successMessage) {
      vscode.window.showInformationMessage(successMessage);
    }
  });
};

export default deploy;
