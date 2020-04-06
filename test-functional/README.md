# Local Test

```sh
./node_modules/.bin/cucumber-js feature/complex-metadata-types.feature --tags "not @skipped"
```

## Debug

```sh
NODE_OPTIONS=--inspect-brk ./node_modules/.bin/cucumber-js feature/complex-metadata-types.feature --tags "not @skipped" --require step-definitions/complexMetadata.js --require step-definitions/changeSet.js
```
