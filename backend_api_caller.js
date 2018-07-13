chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        // TODO keep a state of all created graphs so that no recreation upon refresh
        if (request.type == 'links') {
            var links = request.links;
            var query = request.query;
            console.log(request);
            console.log(sender);
			fetch_data(query,links);			
            //scrape_url(links[0])
        }
        if (request.type == 'open_network_graph') {
            open_network_graph_popup(request.query);
        }
    });


function scrape_url(url) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        console.log(this.status);
        if (this.readyState == 4 && this.status == 200) {
            console.log(xhttp.responseText);
        }
    }
    xhttp.open("GET", url, true);
    console.log("sending a request to " + url);
    xhttp.send();
}

function open_network_graph_popup(query) {
    graph_url = chrome.runtime.getURL('network_graph.html')
    console.log("recieve open network graph command");
    console.log(graph_url);
    chrome.windows.create({
            url: [graph_url],
            type: "popup",
            state: 'normal'
        },
        function(windows) {
            var message = {
                type: 'network_graph_data',
                query: query,
                data: '555'
            };
            chrome.runtime.sendMessage(message);
            //execute_script_in_popup(windows, query);
        }
    ); //callback needed?
}

function execute_script_in_popup(windows, query) {
    //tab = windows.tab[0];
    console.log(windows);
    tab_id = windows.tabs[0].id;
    chrome.tabs.executeScript(
        tab_id, {
            // add listener
            file: 'network_graph.js'
        },
        function() {
            // send message 
            var message = {
                type: 'network_graph_data',
                query: query,
                data: '555'
            };
            chrome.runtime.sendMessage(message);
        });

}

function get_data(query, links) {
    //TODO check if query is cached
    //TODO api calls here
}

function fetch_data(query, links){
// NIC INSERT UR CODE HERE
}
