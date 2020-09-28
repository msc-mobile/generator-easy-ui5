const fs = require("fs-extra");
const program = require('commander');

program
    .option('--source <source>', 'Specify source webapp folder')
    .option('--dest <dest>', 'Specify cordova www folder')
    .action(function(file) {

        if (!program.source) {
            console.error("No source defined!");
            return;
        }

        if (!program.dest) {
            console.error("No dest defined!");
            return;
        }

        console.log(`removing contents from ${program.dest}`);
        fs.removeSync(program.dest);

        console.log(`copying contents of ${program.source} to ${program.dest}`);
        fs.copySync(program.source, program.dest);

        console.log("done...");

    })
    .parse(process.argv);