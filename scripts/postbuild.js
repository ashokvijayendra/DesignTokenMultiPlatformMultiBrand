/*
Copyright © 2021 The Sage Group plc or its licensors. All Rights reserved
 */
const { resolve } = require('path')
const {
  readJsonSync,
  outputJsonSync,
} = require('fs-extra')
const pick = require('lodash/pick')


function copyPackageJSON () {
  try {
    const packageDef = readJsonSync(resolve(__dirname, 'package.json'))
    const filteredPackageDef = pick(
      packageDef,
      ['name', 'dependencies', 'repository', 'description', 'author', 'version', 'peerDependencies', 'license', 'tags']
    )

    filteredPackageDef.private = false

    // Writes to package.json in dist
    outputJsonSync(
      resolve(__dirname, '../build/package.json'),
      filteredPackageDef,
      {
        spaces: 2
      }
    )
  } catch (err) {
    console.log('Error copying package.json')
    console.log(err)
  }
}

async function main () {
  copyPackageJSON()
}

main()