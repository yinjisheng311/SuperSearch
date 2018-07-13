chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        // TODO keep a state of all created graphs so that no recreation upon refresh
        if (request.type == 'links') {
            var links = request.links;
            var query = request.query;
            var tab_id = request.tab_id
            console.log(request);
            console.log(sender);
            data = fetch_data(query, links);
            var message = {
                query: query,
                data: data,
                type: 'return_data'
            };
            chrome.tabs.sendMessage(tab_id, message);

        }
        if (request.type == 'open_network_graph') {
            open_network_graph_popup(request.query, request.data);
            chrome.run
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

function open_network_graph_popup(query, data) {
    graph_url = chrome.runtime.getURL('network_graph.html')
    console.log("recieve open network graph command");
    console.log(graph_url);
    chrome.windows.create({
            url: [graph_url],
            type: "popup",
            state: 'normal'
        },
        function(windows) {
            send_init_data(windows, query, data);
        }
    );
}

function send_init_data(windows, query, data) {
    tab = windows.tabs[0];
    var message = {
        type: 'network_graph_data',
        query: query,
        data: '555' //replace with data: data
    };


    chrome.tabs.sendMessage(tab.id, message, function(response) {
        if (response && response.status) {} else {
            setTimeout(function() {
                console.log(tab.id)
                console.log(chrome.runtime.lastError);
                console.log(response);
                send_init_data(windows, query);
            }, 500);
        }
    });
}

function fetch_data(query, links) {
    // NIC INSERT UR CODE HERE
}
