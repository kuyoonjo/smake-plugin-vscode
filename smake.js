const { Shell, findKey } = require('@smake/utils');
const { magenta } = require('colors/safe');

const npmTarget = new Shell('NPM_command', 'npm', ['run', 'build']);
npmTarget.vscode = async (files, opts, target, targets) => {
    const key = findKey(target, targets);
    const vscodeTasksFilePath = '.vscode/tasks.json';
    files.push({
        path: vscodeTasksFilePath, content: JSON.stringify({
            version: '2.0.0',
            tasks: [{
                label: 'NPM Command',
                type: 'shell',
                command: 'smake',
                args: ['build', key],
                options: {
                    cwd: '${workspaceRoot}',
                },
                problemMatcher: [],
            }],
        }, null, 2),
        okMsg: magenta('NPM task OK'),
    });
};

module.exports = [npmTarget];