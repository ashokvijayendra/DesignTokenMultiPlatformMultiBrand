/*
Copyright © 2021 The Sage Group plc or its licensors. All Rights reserved
 */
const { resolve } = require('path')
const {
  readJsonSync,
  outputJsonSync,
  existsSync,
  appendFileSync
} = require('fs-extra')
const pick = require('lodash/pick')
const kebabCase = require('lodash/kebabCase');
const { getFileList } = require('./utils/list-files');

function copyPackageJSON() {
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

function addFontCssClasses() {
  try {
    //* create font css classes from build/json/brands-*.json files
    const brandJsonFileNamesArr = getFileList('build/json');
    brandJsonFileNamesArr.forEach(brandJSONFilePath => {
      const brandJSON = readJsonSync(brandJSONFilePath);
      const cssClassArr = [];
      for (const cssPropName in brandJSON) {
        if (Object.hasOwnProperty.call(brandJSON, cssPropName) && cssPropName.startsWith('font')) { // only font* keynames
          const fontObject = brandJSON[cssPropName];
          let cssClassStr = '';
          for (const fontPropName in fontObject) {
            if (Object.hasOwnProperty.call(fontObject, fontPropName)) {
              let fontValue = fontObject[fontPropName];
              const cssKebabProp = kebabCase(fontPropName);
              if (cssKebabProp === 'font-family') {
                fontValue = '"' + fontValue + '"'; // add double quotes to font family prop
              }
              cssClassStr += `${cssKebabProp}: ${fontValue}; `;
            }
          }
          const cssClass = `.${cssPropName} { ${cssClassStr} }`;
          cssClassArr.push(cssClass);
        }
      }

      const cssClassesStr = cssClassArr.join('\n');

      const [cssFilePath, scssFilePath] = ['web', 'scss'] // make css file paths
        .map(dirName => {
          const filePath = brandJSONFilePath.replace('json', dirName);
          const correctcssExt = filePath.replace('.json', dirName === 'web' ? '.css' : '.scss');

          return correctcssExt;
        });

      //* appending css classes string to respective css & scss files
      [cssFilePath, scssFilePath].forEach(filePath => {
        if (!existsSync(filePath)) throw new Error(filePath + ' does not exist');
        const appendHeader = `

/**
* Added from postbuild script
*/

`;
        appendFileSync(filePath, appendHeader + cssClassesStr);
      })
    })

  } catch (error) {
    console.log('Error adding font css classes');
    console.log(error);
  }
}

async function main() {
  copyPackageJSON();
  addFontCssClasses();
}

main()