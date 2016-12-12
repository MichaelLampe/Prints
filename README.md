# Prints
#### The minimal user tracking library.

A simple, vanilla user tracking library.  Supports adding hooks to any element in the DOM, which then can be exported to both PNG and JSON formats for downstream use.

### Example
#### "Hello world"
Create a new prints that should POST logs to port 5000 on localhost
```JAVASCRIPT
var points = new Prints("http://localhost:5000");
```

Whenever the user clicks, create circle with diameter 10 around that location.  Also, log the time that event occured.
```JAVASCRIPT
points.createNewTracker(document, "onclick", {color: "red", size: 10, shape: "circle", logEvent: true});
```

When the user tries to exit the page, send their interactions to a safe place.
```JAVASCRIPT
window.onbeforeunload = function() {
  points.sendLoggedPng
  points.sendLoggedEvents
}
```
