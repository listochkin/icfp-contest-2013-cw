'use strict';
var fs = require('fs'),
    path = require ('path');

module.exports = function (size, index) {
    return JSON.parse(fs.readFileSync(path.join(__dirname, '../train/train-' + size + '-' + index + '.json')));
}
