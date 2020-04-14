# Local Test

Steps:

Create a scratch

```sh
sfdx force:org:create --definitionfile project-scratch-def.json --setdefaultusername -a scratch
```

```sh
./node_modules/.bin/cucumber-js feature/complex-metadata-types.feature --tags "not @skipped"
```

## Debug

```sh
NODE_OPTIONS=--inspect-brk ./node_modules/.bin/cucumber-js feature/complex-metadata-types.feature --tags "not @skipped" --require step-definitions/complexMetadata.js --require step-definitions/changeSet.js
```
