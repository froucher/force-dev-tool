const child = require('child_process');
const path = require('path');
const expect = require('chai').expect;

class Cli {
  constructor(cwd) {
    this._cwd = cwd;
  }

  setCwd(cwd) {
    this._cwd = cwd
    return this;
  }

  setExpectedFolder(expectedFolder) {
    this._expectedFolder = expectedFolder
    return this;
  }

  changeSetCreate() {
    let diffCmd = child.spawnSync('git', ['diff', '--no-renames', 'HEAD~', 'HEAD'], {
      cwd: this._cwd
    });

    let ret = child.spawnSync(
      'node', [this.getPathList().forceDevTool, 'changeset', 'create', 'test'], {
        cwd: this._cwd,
        input: diffCmd.stdout,
        env: Object.assign(process.env, {
          NODE_OPTIONS: process.debugPort ? '' : process.env.NODE_OPTIONS
        })
    });
    return ret;
  }

  remoteDisplay() {
    let pathOf = this.getPathList();
    let ret = child.spawnSync(
      'node', [pathOf.forceDevTool, 'remote', 'display'], {
        cwd: path.join(__dirname, '..'),
        env: Object.assign(process.env, {
          NODE_OPTIONS: process.debugPort ? '' : process.env.NODE_OPTIONS
        })
    });
    return ret;
  }

  deployFirstCommit() {
    this.deploy(this.getPathList().v0folder);
  }

  deployChangeSet() {
    this.deploy(this.getPathList().changeSet);
  }

  deploy(folder) {
    return process.env.TEST_WITH_SFDX ? this.sfdxDeploy(folder) : this.fdtDeploy(folder);
  }

  sfdxDeploy(folder) {
    let ret = child.spawnSync('sfdx', ['force:mdapi:deploy', '-d', '.', '-w', '10', '--json'], {
        cwd: folder
      })
    let out = JSON.parse(ret.stdout);
    expect(out.status).to.equal(0, out.result.details.toString());
    return out;
  }

  fdtDeploy(folder) {
    let ret = child.spawnSync('node', [this.getPathList().forceDevTool, 'deploy', '-d', folder, '-c'], {
      cwd: path.join(__dirname, '..'),
      env: Object.assign(process.env, {
        NODE_OPTIONS: process.debugPort ? '' : process.env.NODE_OPTIONS
    })});
    expect(ret.status).to.equal(0, ret);
    expect(ret.stdout.toString()).to.include('Running Validation of directory');
    return ret;
  }

  getPathList() {
    let changeSetPath = path.join(this._cwd, 'config/deployments/test');

    return {
      expected: this._expectedFolder ? path.join(this._expectedFolder, 'expected') : '',
      v0folder: this._expectedFolder ? path.join(this._expectedFolder, 'v0/src') : '',
      v1folder: this._expectedFolder ? path.join(this._expectedFolder, 'v0/src') : '',
      changeSet: changeSetPath,
      packageXml: path.join(changeSetPath, 'package.xml'),
      forceDevTool: path.resolve(__dirname, '../../bin/cli'),
      destructiveXml: path.join(changeSetPath, 'destructiveChanges.xml')
    }
  }
}

module.exports = new Cli();