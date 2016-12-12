"use strict";

function EventRecord(eventName, x, y) {
    this.record = {
        eventName: eventName,
        x: x,
        y: y,
        time: Date.now()
    };
}

function Prints(loggingDestination, options) {
    options = options || {};
    this.loggingDestination = loggingDestination;

    this.canvas = document.createElement('canvas');
    this.canvas.style.position = "absolute";
    this.canvas.style.height = window.outerHeight;
    this.canvas.style.width = window.innerWidth;
    this.canvas.style.top = 0;
    this.canvas.style.left = 0;
    this.zIndex = options.zIndex || -999999999;
    this.hide();

    document.body.appendChild(this.canvas);

    this.ctx = this.canvas.getContext("2d");
    this.ctx.canvas.width = window.innerWidth;
    this.ctx.canvas.height = window.innerHeight;

    this.eventLog = []
}

Prints.prototype.hide = function () {
    this.canvas.style.opacity = 0;
    this.canvas.style.zIndex = this.zIndex;
};

Prints.prototype.show = function () {
    this.canvas.style.opacity = 1;
    this.canvas.style.zIndex = 100;
};

Prints.prototype.recordMousePosition = function writeMousePosition(event, options) {
    options = options || {};

    var x = event.clientX;
    var y = event.clientY;
    this.ctx.fillStyle = options.color || "black";
    var actualSize = (options.size || 1)/2.0;

    if (options.shape === "circle") {
        this.ctx.beginPath();
        this.ctx.arc(x, y, actualSize, 0, 2 * Math.PI, false);
        this.ctx.fill();
        return;
    }
    this.ctx.fillRect(x, y, actualSize, actualSize);
};

Prints.prototype.addToLog = function (name, triggerEvent) {
    this.eventLog.push(new EventRecord(name, triggerEvent.clientX, triggerEvent.clientY))
};

Prints.prototype.createNewTracker = function (element, triggerEvent, options) {
    options = options || {};

    var prints = this;
    var shouldLog = options.logEvent || false;
    element[triggerEvent] = function () {
        if (shouldLog) {
            prints.addToLog(triggerEvent, event);
        }
        prints.recordMousePosition(event, options)
    };
};

Prints.prototype.createNewLogSendEvent = function (triggerEvent, options) {
    options = options || {};

    var prints = this;

    var sendImage = options.image || false,
        sendEvents = options.events || false;

    document[triggerEvent] = function () {
        if (sendImage) prints.sendLoggedPng();
        if (sendEvents) prints.sendLoggedEvents();
    };
};

Prints.prototype.sendLoggedPng = function () {
    this.show();
    var image = this.canvas.toDataURL("image/png");
    this.hide();

    var request = new XMLHttpRequest();
    // TODO Figure out if there is a way to do this in an async manner while still forcing it to be sent always.
    request.open('POST', this.loggingDestination, false);
    request.setRequestHeader('Content-Type', "text/plain");

    // TODO Compress before sending
    request.send(image);
};

Prints.prototype.sendLoggedEvents = function () {
    var request = new XMLHttpRequest();

    // TODO Figure out if there is a way to do this in an async manner while still forcing it to be sent always.
    request.open('POST', this.loggingDestination, false);
    request.setRequestHeader('Content-Type', "'application/json; charset=UTF-8'");

    // TODO Compress before sending
    var data = JSON.stringify(this.eventLog);
    request.send(data);
};
