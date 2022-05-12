import { Command } from 'commander';
import { dirname, resolve } from 'path';
import { existsSync } from 'fs';
import { Log } from 'smake';
import { green, yellow } from 'colors/safe';
import { mkdir, writeFile } from 'fs/promises';

function command(program: Command) {
  program
    .command('vscode')
    .description('generate vscode tasks and launchers')
    .option('-d, --debug', 'debug mode')
    .option('-f, --file <path>', 'specify the smake build file')
    .action(async (opts) => {
      const file = resolve(opts.file || 'smake.js');
      if (!existsSync(file)) {
        Log.e('Cannot find', yellow(file));
        process.exit(1);
      }
      const builds = require(file) as any[];
      const files: Array<{
        path: string;
        content: string;
        okMsg: string;
      }> = [];
      const ts = builds.filter((t) => t.vscode);
      for (const t of ts) {
        await t.vscode(files, { debug: opts.debug }, t, builds);
      }
      for (const f of files) {
        await mkdir(dirname(f.path), { recursive: true });
        await writeFile(f.path, f.content);
        if (f.okMsg) console.log(f.okMsg);
      }
      console.log(green('VSCode OK.'));
    });
}

export { command };
