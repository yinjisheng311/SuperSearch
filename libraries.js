console.log("injecting all the necessary libraries");
var link = document.createElement("link");
// link.href = "https://code.getmdl.io/1.3.0/material.indigo-pink.min.css";
link.href = "https://code.getmdl.io/1.3.0/material.indigo-blue.min.css";
link.rel = "stylesheet";
document.getElementsByTagName("head")[0].appendChild(link);

var script = document.createElement("script");
script.src = "https://code.getmdl.io/1.3.0/material.min.js";
document.getElementsByTagName("head")[0].appendChild(script);

// var extensionOrigin = 'chrome-extension://' + chrome.runtime.id;
// if (!location.ancestorOrigins.contains(extensionOrigin)) {

//     loadScript(chrome.runtime.getURL("Chart.js"), function () {
//         //initialization code
//         console.log('done');
//     });

// }