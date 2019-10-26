import * as vscode from "vscode";
const fs = require("fs");
const shell = require("shelljs");

interface IDeployment {
  functionName: string;
  aliases: any;
}

interface IConfigFile {
  global: any;
  deployments: IDeployment[];
}

const deploy = async () => {
  const folder = await vscode.window.showOpenDialog({
    canSelectFolders: true,
    canSelectMany: false
  });

  if (!folder) return;

  const path = folder[0].path.replace("/", "");
  shell.cd(path);

  const file = JSON.parse(fs.readFileSync(path + "/karna.json")) as IConfigFile;

  const deployments = file.deployments;

  const target = await vscode.window.showQuickPick(
    deployments.map(f => f.functionName),
    {
      placeHolder: "Target"
    }
  );

  const targetFunction = deployments.find(f => f.functionName === target);

  if (targetFunction) {
    const alias = await vscode.window.showQuickPick(
      Object.keys(targetFunction.aliases),
      {
        placeHolder: "Target"
      }
    );

    vscode.window.showInformationMessage(
      `Karna will begin your deployment with alias: "${alias}" and target: "${target}"`
    );

    const child = shell.exec(
      `karna deploy --target ${target} --alias ${alias}`,
      { async: true }
    );

    child.stdout.on("data", (data: string) => {
      const messages = data
        .replace(/\[1;32m/g, "")
        .replace(/\[1;34m/g, "")
        .replace(/\[0m/g, "")
        .replace(//g, "")
        .split(">")
        .filter((message: string) => !!message.length);

      messages.forEach((message: string) =>
        vscode.window.showInformationMessage(message)
      );
    });
  }
};

export { deploy };
