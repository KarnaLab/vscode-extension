import * as vscode from "vscode";
const shell = require("shelljs");

interface IRequirement {
  key: string;
  package: string;
}

const REQUIREMENTS: IRequirement[] = [
  {
    key: "karna",
    package: "https://github.com/karbonn/karna"
  },
  {
    key: "aws",
    package: "https://github.com/aws/aws-cli"
  }
];

export default async function(): Promise<string | void> {
  return new Promise((resolve, reject) => {
    REQUIREMENTS.forEach(requirement => {
      if (!shell.which(requirement.key)) {
        reject(`
        ${requirement.key} not found! \n
        Please install it @ ${requirement.package}
        `);
      }
    });
    resolve();
  });
}
