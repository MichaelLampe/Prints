// Setup tracking
var p = new Prints("http://localhost:5000");
p.createNewTracker(document, "onclick", {color: "red", size: 10, shape: "circle", logEvent: true});
p.createNewTracker(document, "onmousemove", {color: "white", size: 2});

var showButton = document.getElementById("show");
var currentlyShowing = false;
showButton.onclick = function () {
    if (!currentlyShowing) {
        p.show();
    } else {
        p.hide();
    }

    currentlyShowing = !currentlyShowing;
};
