#!/usr/bin/env node

import fs from "node:fs";
import { resolve, isAbsolute } from "node:path";
import { stdin } from "node:process";
import { Buffer } from "node:buffer";

stdin.setEncoding("utf-8");

const [, , ...rest] = process.argv;
let option: string | null;
let filename: string | null;
let file: string = "";

[option, filename] = rest;

if (rest.length == 1 && !rest[0].startsWith("-")) {
  filename = rest[0];
  option = null;
}

function getFilePath(filename: string) {
  if (isAbsolute(filename)) {
    return filename;
  }

  return resolve(import.meta.dirname, filename);
}

function c(file: string) {
  const size = Buffer.byteLength(file);
  return size;
}

function l(file: string) {
  const lines = file.split("\n").length - 1;
  return lines;
}

function w(file: string) {
  const words = file.trim().split(/\s+/).filter(Boolean).length;
  return words;
}

function m(file: string) {
  const chars = [...file].length;
  return chars;
}

function processCommand(option: string | null) {
  let result;
  if (option === "-c") {
    result = c(file);
  }

  if (option === "-l") {
    result = l(file);
  }

  if (option === "-w") {
    result = w(file);
  }

  if (option === "-m") {
    result = m(file);
  }

  return result;
}

if (filename) {
  file = fs.readFileSync(getFilePath(filename), "utf-8");

  if (option) {
    console.log(`${processCommand(option)} ${filename}`);
  } else {
    console.log(
      `${processCommand("-l")} ${processCommand("-w")} ${processCommand("-c")} ${filename}`,
    );
  }
} else {
  stdin.on("data", (chunk) => {
    file += chunk;
  });

  stdin.on("end", () => {
    if (option) {
      console.log(processCommand(option));
    } else {
      console.log(
        `${processCommand("-l")} ${processCommand("-w")} ${processCommand("-c")}`,
      );
    }
  });
}
