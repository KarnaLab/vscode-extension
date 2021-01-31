import * as vscode from "vscode";
import { cd, exec } from 'shelljs';

interface CustomContext {
  functionName: string; 
  alias: string; 
  path: string
}
const deploy = async ({ customContext }: { customContext:CustomContext}) => {
  const { functionName, alias, path} = customContext;
  vscode.window.showInformationMessage(
    `Karna will begin your deployment with alias: "${alias}" and function: "${functionName}"`
  );

  cd(path);
  
  const child = exec(
    `karna deploy -f ${functionName} -a ${alias}`,
    { async: true }
  );

  vscode.window.withProgress({
    location: vscode.ProgressLocation.Notification,
    cancellable: true,
    //@ts-ignore
  }, (progress: vscode.Progress<{}>, token) => {
    token.onCancellationRequested(() => {
      console.log("User canceled the long running operation");
    });
    
    child.stdout?.on("data", (data: string) => {
      const messages = data
        .replace(/\[1;31m/g, "")
        .replace(/\[1;32m/g, "")
        .replace(/\[1;34m/g, "")
        .replace(/\[0m/g, "")
        .replace(//g, "")
        .split(">")
        .filter((message: string) => !!message.length);

      messages.forEach((message: string) =>
        progress.report({ increment: 10, message }));
    });
  });
};

export { deploy };
