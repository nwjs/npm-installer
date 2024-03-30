#!/usr/bin/env node

import process from 'node:process';

import { program } from 'commander';

import parse from '../src/parse.js';
import run from '../src/run.js';

await cli();

async function cli() {

  program
    .option('--version <string>')
    .option('--flavor <flavor>')
    .option('--platform <platform>')
    .option('--arch <arch>')
    .option('--cacheDir <cacheDir>')
    .argument('<app>')
    .parse(process.argv);

  let options = program.opts();
  options = await parse(options);

  await run({
    version: options.version,
    flavor: options.flavor,
    platform: options.platform,
    arch: options.arch,
    cacheDir: options.cacheDir,
    srcDir: program.args[0],
  });

}