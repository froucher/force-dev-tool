const child = require('child_process');
const path = require('path');

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
  }

  testDeploy() {
    let pathOf = this.getPathList();
    let ret = child.spawnSync(
      'node', [pathOf.forceDevTool, 'deploy', '-d', pathOf.changeSet, '-c'], {
        cwd: path.join(__dirname, '..'),
        env: Object.assign(process.env, {
          NODE_OPTIONS: process.debugPort ? '' : process.env.NODE_OPTIONS
        })
    });
    if (ret.status !== 0) {
      throw {
        'name': 'test deploy error',
        'description': ret.stderr.toString()
      }
    }
    return ret;
  }

  getPathList() {
    let changeSetPath =  path.join(this._cwd, 'config/deployments/test');

    return {
      expected: this._expectedFolder ? path.join(__dirname, '../data', this._expectedFolder) : '',
      changeSet: changeSetPath,
      packageXml: path.join(changeSetPath, 'package.xml'),
      forceDevTool: path.resolve(__dirname, '../../bin/cli'),
      destructiveXml: path.join(changeSetPath, 'destructiveChanges.xml')
    }
  }
}

module.exports = new Cli();