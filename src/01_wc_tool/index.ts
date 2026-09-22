import readline from "node:readline";
import fs from "node:fs/promises";
import { join, isAbsolute, resolve } from "node:path";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Get the file according to the path
function getFile(filename: string) {
  if (!filename.includes("/")) {
    return resolve(import.meta.dirname, filename);
  }
  return resolve(filename);
}

async function c(filename: string) {
  try {
    // get the actual file path
    const file = getFile(filename);
    console.log("file: ", file);

    const stats = await fs.stat(file);

    return stats.size;
  } catch (error) {
    console.log(error);
  }
}

async function l(filename: string) {
  try {
    const file = getFile(filename);
    const lines = (await fs.readFile(file, "utf-8")).split("\n");
    return lines.length;
  } catch (err) {
    console.log(err);
  }
}

rl.on("line", async function (input) {
  let result;
  const [command, option, file] = input.split(" ");

  if (!input.startsWith("ccwc") || !command) {
    result = "Invalid Command, use ccwc -option filepath";
    console.log(result);

    rl.close();
  }

  if (option === "-c") {
    result = await c(file);
  }

  if (option === "-l") {
    result = await l(file);
  }

  console.log(`${result} ${file}`);

  rl.close();
});
