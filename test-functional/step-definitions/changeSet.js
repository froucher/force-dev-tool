const { Given, When, Then } = require('cucumber');
const forceDevTool = require('../lib/force-dev-tool')
const git = require('../lib/git');
const path = require('path');
const chai = require('chai');
const expect = chai.expect;
chai.use(require('chai-fs'));

Given('a list of {string} metadata in {string} which has been added and updated in a git repository', function (child, data) {
  git.addChangeSet(data);
});

Given('a list of {string} metadata in {string} which has been removed in a git repository', function (child, data) {
  git.addChangeSet(data);
});

When('a user launches a change set with force-dev-tool', function () {
  let ret = forceDevTool.setCwd(git.getRepoPath()).changeSetCreate();
  expect(ret.stdout.toString()).to.include('Manifest:');
});

Then('it will create a change set with the list of {string} metadata', function (child) {
  let pathOf = forceDevTool.setExpectedFolder(git.getDataPath()).getPathList();
  expect(pathOf.changeSet).to.be.a.directory().and.equal(pathOf.expected, 'Unexpected changeset');
  expect(pathOf.packageXml).to.be.a.file().with.contents.that.match(new RegExp(`<name>${child}</name>`));
});

Then('excluding any {string} metadata in the change set', function (parent) {
  let pathOf = forceDevTool.getPathList();
  expect(pathOf.packageXml).to.be.a.file().and.not.have.contents.that.match(new RegExp(`<name>${parent}</name>`));
});

Then('it will create a destructive change with the list of {string} metadata', function (child) {
  let pathOf = forceDevTool.setExpectedFolder(git.getDataPath()).getPathList();
  expect(pathOf.changeSet).to.be.a.directory().and.equal(pathOf.expected, 'Unexpected changeset');
  expect(pathOf.destructiveXml).to.be.a.file().with.contents.that.match(new RegExp(`<name>${child}</name>`));
});

Then('the change set can be deployed correctly', function () {
  let ret = forceDevTool.testDeploy();
  expect(ret.stdout.toString()).to.include('Running Validation of directory');
});
