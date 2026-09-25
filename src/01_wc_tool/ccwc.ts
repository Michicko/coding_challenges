#!/usr/bin/env node

import fs from "node:fs";
import { resolve } from "node:path";

let [, , option, filename] = process.argv;
let result;
let file = fs.readFileSync(getFile(filename), "utf-8");

function getFile(filename: string) {
  if (!filename.includes("/")) {
    return resolve(import.meta.dirname, filename);
  }
  return resolve(filename);
}

function c(filename: string) {
  const splited = filename.split("/");
  const name = splited[splited.length - 1];

  fs.stat(filename, (err, stats) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log(`${stats.size} ${name}`);
  });
}

function l(file: string) {
  const lines = [...file].filter((el) => el === "\n").length;
  console.log(`${lines} ${filename}`);
}

function w(file: string) {
  const words = file.trim().split(/\s+/).filter(Boolean).length;
  console.log(`${words} ${filename}`);
}

function m(file: string) {
  const chars = [...file.trim()].length;
  console.log(`${chars} ${filename}`);
}

if (option === "-c") {
  let path = getFile(filename);
  result = c(path);
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
