const Generator = require('yeoman-generator');
// path = require('path'),
// glob = require('glob');

module.exports = class extends Generator {

    prompting() {
        if (this.options.isSubgeneratorCall) {
            this.destinationRoot(this.options.cwd);
            this.options.oneTimeConfig = this.config.getAll();
            return;
        }
    }
    writing() {
        this.createApplication();
    }

    install() {
        if (process.platform !== "win32") {
            // eslint-disable-next-line no-console
            console.warn("Install cordova => `sudo npm install --global cordova`");
        } else {
            this.npmInstall(["cordova"], {
                "global": true
            });
        }
    }

    end() {
        if (this.options.isSubgeneratorCall) {
            return;
        }
    }

    createApplication() {
        let nameSpace = this.config.get('namespace')
        const projectName = this.config.get('projectname')
        if (!nameSpace.includes(".")) {
            nameSpace = `${this.config.get('namespace')}.${projectName}`
        }
        this.spawnCommandSync('cordova', ['create', 'cordova_app', nameSpace, projectName]);

        const oConfig = this.options.oneTimeConfig;
        this.fs.copyTpl(this.templatePath("scripts/cordovaPrepare.js"), this.destinationPath("scripts/cordovaPrepare.js"), oConfig);
    }
};