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
    .option('--downloadUrl', 'Download server')
    .option('--cacheDir <cacheDir>', 'File path to cache directory')
    .option('--cache <boolean>', 'If true the existing cache is used. Otherwise it removes and redownloads it.', false)
    .option('--ffmpeg <boolean>', 'If true the chromium ffmpeg is replaced by community version with proprietary codecs.', false)
    .option('--nodeAddon', 'Download Node headers', false)
    .option('--unref', 'Prevent the parent process from waiting for a given subprocess. This is useful if you are using nw package to call the executable and want to prevent zombie processes eating up memory.', false)
    .option('--shaSum', 'If true, then shasums are verified. Otherwise, it is ignored.', true)
    .allowExcessArguments(true)
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
    unref: options.unref,
    args: program.args.slice(1),
  });

}