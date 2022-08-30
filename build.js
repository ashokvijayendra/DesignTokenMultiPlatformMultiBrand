const StyleDictionaryPackage = require('style-dictionary');

// HAVE THE STYLE DICTIONARY CONFIG DYNAMICALLY GENERATED

function getStyleDictionaryConfig(brand, platform) {
  return {
    "source": [
      `tokens/platforms/${platform}/*.json`,
      "tokens/globals/**/*.json",
      `tokens/brands/${brand}/*.json`,
    ],
    "platforms": {
      "web": {
        "transformGroup": "web",
        "buildPath": `build/web/${brand}/`,
        "files": [{
          "destination": "tokens.css",
          "format": "css/variables"
        }]
      },
      "js": {
        "transformGroup": "js",
        "buildPath": `build/js/${brand}/`,
        "files": [{
          "destination": "variables.js",
          "format": "javascript/es6"
        }]
      },
      "web/json": {
        "transformGroup": "web",
        "buildPath": `build/json/${brand}/`,
        "files": [
            {
                "destination": "tokens.json",
                "format": "json/flat"
            }
        ]
      },
      "scss": {
        "transformGroup": "web",
        "buildPath": `build/scss/${brand}/`,
        "files": [{
          "destination": "tokens.scss",
          "format": "scss/variables"
        }]
      },
      "android": {
        "transformGroup": "android",
        "buildPath": `build/android/${brand}/`,
        "files": [{
          "destination": "tokens.colors.xml",
          "format": "android/colors"
        },{
          "destination": "tokens.dimens.xml",
          "format": "android/dimens"
        },{
          "destination": "tokens.font_dimens.xml",
          "format": "android/fontDimens"
        }]
      },
      "ios": {
        "transformGroup": "ios",
        "buildPath": `build/ios/${brand}/`,
        "files": [{
          "destination": "tokens.h",
          "format": "ios/macros"
        }]
      }
    }
  };
}

console.log('Build started...');

// PROCESS THE DESIGN TOKENS FOR THE DIFFEREN BRANDS AND PLATFORMS

['brand-1', 'brand-2', 'brand-3'].map(function (brand) {
  ['web', 'ios', 'android',"js","scss","web/json"].map(function (platform) {

    console.log('\n==============================================');
    console.log(`\nProcessing: [${platform}] [${brand}]`);

    const StyleDictionary = StyleDictionaryPackage.extend(getStyleDictionaryConfig(brand, platform));

    StyleDictionary.buildPlatform(platform);

    console.log('\nEnd processing');

  })
})

console.log('\n==============================================');
console.log('\nBuild completed!');
