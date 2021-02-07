export const sanitizeStdoutMessages = (messages: string) => messages
  .replace(/\[1;31m/g, "")
  .replace(/\[1;32m/g, "")
  .replace(/\[1;34m/g, "")
  .replace(/\[0m/g, "")
  .replace(//g, "")
  .replace(/\d{4}\/\d{2}\/\d{2} \d{2}:\d{2}:\d{2}/g, "")
  .split(">")
  .map(message => message.trim())
  .filter((message: string) => !!message.length);
  