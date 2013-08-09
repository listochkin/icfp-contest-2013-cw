var api = require('./api.js'),
    fs = require('fs'),
    path = require('path');

var size = 14, index = 0, o = {};
o.interval = setInterval(function () {
    if (size > 16) {
        clearInterval(o.interval); done(); return;
    }
    if (index > 5) {
        index = 0; size += 1; return;
    }

    api.train(size, [], function (problem) {
        fs.writeFile(
            path.join(__dirname, '../train/train-' + size + '-' + index + '.json'),
            JSON.stringify(problem, null, '\t'), function () {
        });
    });

    index += 1;
}, 20 * 1000);
