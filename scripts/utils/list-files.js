const { statSync,
  readdirSync, } = require('fs-extra');
const { join } = require('path')

function getFileList(dir, recursive = true) {
  return readdirSync(dir).reduce(function (list, file) {
    const name = join(dir, file);
    const isDir = statSync(name).isDirectory();
    return list.concat(isDir && recursive ? getFileList(name) : [name]);
  }, []);
}

module.exports = { getFileList };