#!/usr/bin/env node

import process from 'node:process';

import { program } from 'commander';

import parse from '../src/parse.js';
import run from '../src/run.js';

await cli();

async function cli() {

  program
    .argument('[app]', 'File path to project', '.')
    .option('--version <string>', 'NW.js version')
    .option('--flavor <flavor>', 'NW.js flavor')
    .option('--platform <platform>', 'Host platform')
    .option('--arch <arch>', 'Host architecture')
    .option('--cacheDir <cacheDir>', 'File path to cache directory')
    .allowUnknownOption() // this allows chromium and node options to be passed through to the nwjs binary
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
    args: program.args.slice(1),
  });

}