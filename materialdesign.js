var link = document.createElement("link");
link.href = "https://code.getmdl.io/1.3.0/material.indigo-pink.min.css";
link.rel = "stylesheet";
document.getElementsByTagName("head")[0].appendChild(link);

var script = document.createElement("script");
script.defer = true;
script.src = "https://code.getmdl.io/1.3.0/material.min.js";
document.getElementsByTagName("head")[0].appendChild(script);
