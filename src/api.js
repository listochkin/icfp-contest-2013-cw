'use strict';

var request = require('request'),
    _ = require('underscore'),
    stringify = require('json-stringify-safe');

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
    this.completedTasks = {};

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
    }.bind(this), cooldown || 50);//.unref();
};

Queue.prototype.callNetwork = function() {
    this.callingNetwork = true;
    var request = this.nextRequest;
    this.methods[request[0]].apply(API, request[1]);
    this.nextTask = null;
    this.nextRequest = null;
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
    if (!this.timer) this.schedule(this.cooldown || 100);
    if (method === 'evaluate' || method === 'guess') {
        var taskId = args[0];
        if (this.completedTasks[taskId]) return; // ignore submissions for completed tsks
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
    if (!this.timer) this.schedule(this.cooldown || 20);
    log('Resubmit: ', task, request);
    if (task != null && this.pendingTasks[task.id] != null) {
        this.pendingTasks[task.id].requests.unshift(request);
    } else {
        this.other.unshift(request)
    }
    request[3] += 1;
    request[4] = REQUEST_PENDING;
    //this.cooldown *= 2;
};

Queue.prototype._wrap = function(api) {
    var methods = {};
    ['problems', 'train', 'evaluate', 'guess'].forEach(function (key) {
        methods[key] = api[key];
        api[key] = function () {
            var args = Array.prototype.splice.call(arguments, 0, arguments.length);
            log('Submitting: ', key, args);
            this.submit(key, args);
        }.bind(this);
    }, this);
    return methods; 
};

Queue.prototype.terminate = function(task) {
    if (!task) return;

    var pending = _(this.pendingTasks).find(function (t) {
        return t.id == task.id;
    });

    if (pending) {
        pending.task = task;
        pending.terminated = new Date();

        this.completedTasks[pending.id] = pending;
        this.pendingTasks[pending.id] = {};
        this.pendingTasks = _(this.pendingTasks).filter(function (t) {
            return !!t['id'];
        });
    }
};

function respond(method) { /* follows by top function arguments */
    var args = Array.prototype.splice.call(arguments, 0, arguments.length),
        currentTask = API.queue.nextTask,
        currentRequest = API.queue.nextRequest;

    return function (error, res, body) {
        log('Network call:', args);
        log('Responce code: ', res.statusCode);
        API.queue.callingNetwork = false;

        if (res.statusCode === 412 || res.statusCode === 410) {
            API.queue.terminate(currentTask);
            return;
        }

        if (res.statusCode === 429 || body === 'Too many requests') {
            // too many requests
            API.queue.resubmit(currentTask, currentRequest);
            return;
        }

        // try {
        //     log('Responce: ', stringify(body));
        //     body = JSON.parse(stringify(body));
        // } catch (e) {
        //     log('===================ERRROR==============', e, e.stack);
        //     // too many requests?
        //     API.queue.resubmit(currentTask, currentRequest);
        // }

        API.queue.cooldown = DEFAULT_COOLDOWN;

        var callback = args[args.length - 1];
        callback(body);
    }
}


var API = {
    LOG_API_CALLS: false,

    problems: function (callback) {
        request(url('myproblems'), respond('problems', callback));
    },

    train: function (size, operators, callback) {
        request({
            url: url('train'),
            method: 'POST',
            json: { size: size, operators: operators || []}
        }, respond('train', size, operators, callback));
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

        request(msg, respond('evaluate', id, program, args, callback));
    },

    guess: function (id, program, callback) {
        request({
            url: url('guess'),
            method: 'POST',
            json: { id: id, program: program }
        }, respond('guess', id, program, callback));
    }
};

var QUEUE = new Queue(API);

module.exports = API;
