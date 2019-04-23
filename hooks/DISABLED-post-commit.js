#!/usr/bin/env node
const fs = require('fs');
const jsdoc2md = require('jsdoc-to-markdown');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const writeFile = util.promisify(fs.writeFile);


const README_PATH = 'README.md';
const JSDOC_FILES = 'Profiler.js';
const REPLACE_PATTERN = /<!-- START JSDOCS -->.*<!-- END JSDOCS -->/is;

// Load the README and generate the JSDocs
const README = fs.readFileSync(README_PATH, 'utf8');
const JSDOCS = jsdoc2md.renderSync({files: JSDOC_FILES, 'heading-depth': 2});

// Inject the docs into the README file.
const output = README.replace(REPLACE_PATTERN, `<!-- START JSDOCS -->\n${JSDOCS}\n<!-- END JSDOCS -->`);

// If this resulted in changes to the file, try to update.
if (output !== README) {
    // Check for uncommitted changes
    exec(`git diff --name-only`)
        .then(({stdout}) => {
            /*
             * The `git diff --name-only` command returns the names of all files with uncommitted changes,
             * otherwise it will print nothing. So we can use this to test if there are any changes.
             */
            if (stdout) throw new Error('You have uncommitted changes. Cannot automatically update the JSDoc.');
        })

        // Then write the changes to the file.
        .then(() => writeFile(README_PATH, output, 'utf8'))

        // Then commit the changes.
        .then(() => exec(`git commit ${README_PATH} -m "docs(automatic): auto-update jsdocs"`))

        // Catch the error if anything goes wrong.
        .catch(error => {
            console.error(error);
            process.exit(error.code || 1);
        });
}



