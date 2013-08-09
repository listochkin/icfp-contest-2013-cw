'use strict';

var request = require('request'),
    concat = require('concat-stream');

var KEY = require('../src/key.js');

function url(action) {
    return 'http://icfpc2013.cloudapp.net/' + action + '?auth=' + KEY + 'vpsH1H';
}

module.exports = {
    problems: function problems(callback) {
        request(url('myproblems')).pipe(concat(function (body) {
            body = JSON.parse(body.toString());
            callback(body);
        }));
    },

    train: function train(size, operators, callback) {
        request({
            url: url('train'),
            method: 'POST',
            json: { size: size, operators: operators || []}
        }).pipe(concat(function (body) {
            body = JSON.parse(body.toString());
            callback(body);
        }));
    }
};
