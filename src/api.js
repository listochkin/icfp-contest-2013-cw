'use strict';

var request = require('request'),
    concat = require('concat-stream');

var KEY = require('../src/key.js');

function url(action) {
    return 'http://icfpc2013.cloudapp.net/' + action + '?auth=' + KEY + 'vpsH1H';
}

var cooldown = 7 * 1000;

function log() {
    if (API.LOG_API_CALLS) console.log.apply(console, arguments);
}

function respond (method) { /* follows by top function arguments */
    var args = Array.prototype.splice.call(arguments, 0, arguments.length);

    return function (body) {
        log('Network call:', args);
        try {
            log('Responce: ', body.toString());
            body = JSON.parse(body.toString());
            // reset cooldown
            cooldown = 7 * 1000;

            var callback = args[args.length - 1];
            callback(body);
        } catch (e) {
            // too many requests
            log('retrying...', method, cooldown);
            setTimeout(function (method, args) {
                API[method].apply(API, args);
            }, cooldown, method, args.splice(1, args.length - 1));

            // auto grow cooldown time on subsequent retries;
            cooldown *= 2;
        }
    }
}


var API = {
    LOG_API_CALLS: false,

    problems: function problems(callback) {
        request(url('myproblems')).pipe(concat(respond('problems', callback)));
    },

    train: function train(size, operators, callback) {
        request({
            url: url('train'),
            method: 'POST',
            json: { size: size, operators: operators || []}
        }).pipe(concat(respond('train', size, operators, callback)));
    },

    evaluate: function (id, program, args, callback) {
        var msg = {
            url: url('eval'),
            method: 'POST',
            json: { id: id }
        };
        if (program)
            msg.json.program = program;
        else
            msg.json['arguments'] = args;
            
        //log(msg);
            
        request(msg).pipe(concat(respond('evaluate', id, program, args, callback)));
    },

    guess: function (id, program, callback) {
        request({
            url: url('guess'),
            method: 'POST',
            json: { id: id, program: program }
        }).pipe(concat(respond('guess', id, program, callback)));
    }
};

module.exports = API;
