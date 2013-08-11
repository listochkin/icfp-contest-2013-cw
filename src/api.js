'use strict';

var request = require('request'),
    concat = require('concat-stream'),
    _ = require('underscore');

var KEY = require('../src/key.js');

function url(action) {
    return 'http://icfpc2013.cloudapp.net/' + action + '?auth=' + KEY + 'vpsH1H';
}

function log() {
    if (API.LOG_API_CALLS) console.log.apply(console, arguments);
}

//// API Queue

var DEFAULT_COOLDOWN = 2 * 1000,
    REQUEST_IN_FLY = true,
    REQUEST_PENDING = false;

function Queue(api) {
    this.pendingTasks = {};
    this.other = [];
    this.methods = this._wrap(api);
    api.queue = this;

    this.cooldown = DEFAULT_COOLDOWN;
    this.nextTask = null;
    this.nextRequest = null;
    this.callingNetwork = false;

    this.timer = null;
    this.schedule();
}

Queue.prototype.schedule = function(cooldown) {
    this.timer = setTimeout(function() {
        this.drain();
        this.schedule(this.cooldown);
    }.bind(this), cooldown || 50);
};

Queue.prototype.callNetwork = function() {
    this.callingNetwork = true;
    var request = this.nextRequest;
    this.methods[request[0]].apply(API, request[1]);
};

Queue.prototype.drain = function() {
    if (this.callingNetwork) return;
    // old priority queries first
    log('Tasks in queue', this.pendingTasks);
    var task = _.chain(this.pendingTasks).filter(function (task) {
        return task.requests.length > 0 && task.requests[0][4] !== REQUEST_IN_FLY;
    }).min(function (task) {
        return task.time;
    }).value();
    if (task instanceof Object) {
        this.nextTask = task;
        this.nextRequest = task.requests.shift();
        log('Task: ', task, this.nextRequest);
        this.callNetwork();
        return;
    }
    // other queries
    this.nextTask = null;
    var request = _(this.other).find(function (r) {
        return r[4] !== REQUEST_IN_FLY;
    });
    if (request) {
        this.nextRequest = request;
        this.other = _(this.other).without(request);
        log('Other task:', this.nextRequest);
    }
    if (this.nextRequest) this.callNetwork(); else this.cooldown = DEFAULT_COOLDOWN;
};

Queue.prototype.submit = function(method, args) {
    if (method === 'evaluate' || method === 'guess') {
        var taskId = args[0];
        if (!this.pendingTasks[taskId]) {
            this.pendingTasks[taskId] = {
                id: taskId,
                time: new Date(),
                requests: []
            };
        }
        this.pendingTasks[taskId].requests.push([method, args, _.uniqueId('r'), 0, REQUEST_PENDING]);
    } else {
        this.other.push([method, args, _.uniqueId('r'), 0]);
    }
};

Queue.prototype.resubmit = function(task, request) {
    log('Resubmit: ', task, request);
    if (task != null) {
        this.pendingTasks[task.id].requests.unshift(request);
    } else {
        this.other.unshift(request)
    }
    request[3] += 1;
    request[4] = REQUEST_PENDING;
    this.cooldown *= 2;
};

Queue.prototype._wrap = function(api) {
    var methods = {};
    for (var key in api) {
        if (api[key] instanceof Function) {
            (function (key) {
                methods[key] = api[key];
                api[key] = function () {
                    var args = Array.prototype.splice.call(arguments, 0, arguments.length);
                    log('Submitting: ', key, args);
                    this.submit(key, args);
                }.bind(this);
            }).call(this, key);
        }
    }
    return methods; 
};

function respond (method) { /* follows by top function arguments */
    var args = Array.prototype.splice.call(arguments, 0, arguments.length),
        currentTask = API.queue.nextTask,
        currentRequest = API.queue.nextRequest;

    return function (body) {
        log('Network call:', args);
        API.queue.callingNetwork = false;
        try {
            log('Responce: ', body.toString());
            body = JSON.parse(body.toString());

            API.queue.cooldown = DEFAULT_COOLDOWN;

            var callback = args[args.length - 1];
            callback(body);
        } catch (e) {
            log('===================ERRROR==============', e, e.stack);
            // too many requests
            API.queue.resubmit(currentTask, currentRequest);
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

var QUEUE = new Queue(API);

module.exports = API;
