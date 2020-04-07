const child = require('child_process');
const expect = require('chai').expect;

function directoryContentEquals(compare1, compare2) {
  var diffDirsCmd = child.spawnSync("diff", [ "-u", "-r", compare1, compare2]);
  expect(diffDirsCmd.status).equal(0, diffDirsCmd.stdout.toString());
}

module.exports = {
  directoryContentEquals
}