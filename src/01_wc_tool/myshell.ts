import readline from "node:readline";
import fs from "node:fs/promises";
import { resolve } from "node:path";

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

async function c(text: string) {
  try {
    const stats = await fs.stat(text);

    return stats.size;
  } catch (error) {
    console.log(error);
    return 0;
  }
}

async function l(text: string) {
  try {
    const lines = await fs.readFile(text, "utf-8");

    return [...lines].filter((el) => el === "\n").length;
  } catch (err) {
    console.log(err);
    return 0;
  }
}

async function w(text: string) {
  try {
    const str = await fs.readFile(text, "utf-8");

    return str.trim().split(/\s+/).filter(Boolean).length;
  } catch (error) {
    console.log(error);
    return 0;
  }
}

async function m(text: string) {
  try {
    const str = await fs.readFile(text, "utf-8");
    return [...str.trim()].length;
  } catch (error) {
    console.log(error);
    return 0;
  }
}

rl.on("line", async function (input) {
  let result;
  let file;
  let [command, option, filename] = input.split(" ");

  if (!input.includes("ccwc") || !command) {
    result = "Invalid Command, use ccwc -option filename or file path";
    console.log(result);

    rl.close();
  }

  if (input.split(" ").length === 2) {
    command = input.split(" ")[0];
    filename = input.split(" ")[1];
    file = getFile(filename);
    result = `${await l(file)} ${await w(file)} ${await c(file)}`;
  }

  file = getFile(filename);

  if (option === "-c") {
    result = await c(file);
  }

  if (option === "-l") {
    result = await l(file);
  }

  if (option === "-w") {
    result = await w(file);
  }

  if (option === "-m") {
    result = await m(file);
  }

  console.log(`${result} ${filename}`);

  rl.close();
});
