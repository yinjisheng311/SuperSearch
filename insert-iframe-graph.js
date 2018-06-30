console.log('super search launched');

var top_result_bar = document.getElementById("appbar");
// var graph_div = document.createElement('div');
// graph_div.setAttribute("id", "cy");
// main_body_div.appendChild(graph_div);

// var download_button = document.createElement("button");
// download_button.setAttribute("class", "mdl-button mdl-js-button mdl-button--raised");
// download_button.innerHTML = "whatever";
// main_body_div.appendChild(download_button);


console.log('this is loading');
var extensionOrigin = 'chrome-extension://' + chrome.runtime.id;
if (!location.ancestorOrigins.contains(extensionOrigin)) {
    // var script3 = document.createElement("script");
    // script3.defer = true;
    // script3.src = chrome.runtime.getURL("cytoscape.js");
    // node_container_div.appendChild(script3);
    var iframe = document.createElement("iframe");
    iframe.src = chrome.runtime.getURL("/components/iframe-graph/iframe-graph.html");
    iframe.width = '1000';
    iframe.height = '200';
    top_result_bar.insertAdjacentElement("afterend", iframe);

    // top_result_bar.appendChild(iframe);
}
console.log('this is loaded');

{/* <script src="cytoscape.js"></script>
<script>
    var cy = cytoscape({
        container: document.getElementById('cy'),
        elements: [ // list of graph elements to start with
            { // node a
                data: {
                    id: 'a'
                }
            },
            { // node b
                data: {
                    id: 'b'
                }
            },
            { // edge ab
                data: {
                    id: 'ab',
                    source: 'a',
                    target: 'b'
                }
            }
        ],

        style: [ // the stylesheet for the graph
            {
                selector: 'node',
                style: {
                    'background-color': '#666',
                    'label': 'data(id)'
                }
            },

            {
                selector: 'edge',
                style: {
                    'width': 3,
                    'line-color': '#ccc',
                    'target-arrow-color': '#ccc',
                    'target-arrow-shape': 'triangle'
                }
            }
        ],

        layout: {
            name: 'grid',
            rows: 1
        }
    });
</script> */}