import * as vscode from "vscode";
import { cd, exec } from 'shelljs';

interface CustomContext {
  functionName: string; 
  alias: string; 
  path: string
}

const deploy = async ({ customContext }: { customContext:CustomContext}) => {
  const { functionName, alias, path} = customContext;
  vscode.window.showInformationMessage(`Karna begins to deploy ${functionName}:${alias}`);

  cd(path);
  
  const child = exec(
    `karna deploy -f ${functionName} -a ${alias}`,
    { async: true }
  );

  child.stdout?.on("data", (data: string) => {
    const messages = data
      .replace(/\[1;31m/g, "")
      .replace(/\[1;32m/g, "")
      .replace(/\[1;34m/g, "")
      .replace(/\[0m/g, "")
      .replace(//g, "")
      .replace(/\d{4}\/\d{2}\/\d{2} \d{2}:\d{2}:\d{2}/g, "")
      .split(">")
      .map(message => message.trim())
      .filter((message: string) => !!message.length)

    const errorMessage = messages.find(message => message.startsWith('Karna: Error'));
    
    if (errorMessage) {
      vscode.window.showErrorMessage(errorMessage);
    }

    const successMessage = 
      messages.find(message => message.startsWith('Karna: Success: API available'))
      || messages.find(message => message.startsWith('Karna: Success: Completed in'));

    if (successMessage) {
      vscode.window.showInformationMessage(successMessage);
    }
  });
};

export { deploy };
