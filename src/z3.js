'use strict';

var path = require('path'),
    EOL = require('os').EOL,
    spawn = require('child_process').spawn;

module.exports = Z3;

var z3exec = path.join(__dirname, !!process.platform.match(/^win/i) ? '../z3/z3.exe' : '../z3/z3');

function Z3() {
    this.process = spawn(z3exec, ['-smt2', '-in']);
    this.process.stdin.setEncoding('utf8');
    this.process.stdout.setEncoding('utf8');

    this.readCallback = null;
    this.pendingLines = [];
    this.pendingTimer = null;

    this.process.stdout.on('readable', function () {
        var line, lines = [];

        var addedLine = false;
        while (null != (line = this.process.stdout.read())) {
            addedLine = true;
            this.pendingLines.push(line);
        }

        if (addedLine) {
            if (this.pendingTimer) clearTimeout(this.pendingTimer);
            this.pendingTimer = setTimeout(function() {
                this.pendingTimer = null;
                if (this.readCallback) {
                    this.readCallback(this.pendingLines.join(''));
                    this.pendingLines = [];
                }
            }.bind(this), 2);
        }
    }.bind(this));
}

Z3.prototype.kill = function() {
    this.process.kill();
};

Z3.prototype.write = function (input, callback) {
    input = input.replace(/\r?\n+/ig, EOL);
    if (input[input.length - 1] !== '\n') input += EOL;

    this.process.stdout.pause();
    this.process.stdin.write(input, 'utf8', function () {
        this.readCallback = callback;
        this.process.stdout.resume();
    }.bind(this));
};
