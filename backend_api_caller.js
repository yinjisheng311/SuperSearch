chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        // TODO keep a state of all created graphs so that no recreation upon refresh
        if (request.type == 'links') {
            var links = request.links;
            var query = request.query;
            var tab_id = sender.tab.id;
            console.log(request);
            console.log(sender);
            fetch_data(query, links, function(data){
                var message = {
                    query: query,
                    data: data,
                    type: 'return_data'
                };
                console.log(message);
                send_return_data(message, tab_id);
            });
            // var message = {};
            // send_return_data(message, tab_id);
        }
        if (request.type == 'open_network_graph') {
            console.log("sending data to network graph 1");
            console.log(request);
            open_network_graph_popup(request.query, request.data);
        }
    });


function send_return_data(message, tab_id) {
    chrome.tabs.sendMessage(tab_id, message, function(response) {
        if (response && response.status) {} else {
            setTimeout(function() {
                console.log(tab.id)
                console.log(chrome.runtime.lastError);
                console.log(response);
                send_return_data(message, tab_id);
            }, 500);
        }
    });
}


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
    console.log("sending data to network graph 2");
    console.log(data);
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
        data: data
    };


    chrome.tabs.sendMessage(tab.id, message, function(response) {
        if (response && response.status) {} else {
            setTimeout(function() {
                console.log(tab.id)
                console.log(chrome.runtime.lastError);
                console.log(response);
                send_init_data(windows, query, data);
            }, 500);
        }
    });
}


// var entities_dict = {};
var global_links = []


// function fetch_data(query, links){}


function fetch_data(query, links, _callback){
    // query = "query string that was entered by user"
    // links = ["url1", "url2" ...]
    global_links = links;
    scrape_website({}, scrape_website, collation, _callback);
}

function scrape_website(entities_dict, callback_1, callback_2, callback_3){
    if(global_links.length==0){
        return callback_2(entities_dict, callback_3);
    }
    url = global_links.pop();
    console.log("scraping website ", url);
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "https://api.textrazor.com");
    xhttp.onload = function(){
        if(this.readyState != 4 && this.status != 200){
            console.log("ERROR: readyState is ", this.readyState, " status is ", this.status, " . They should be 4 and 200");
            return;
        }
    
        var resp = JSON.parse(xhttp.responseText)["response"];
        var entities = resp["entities"];
        var categories = resp["categories"];
    
        for(idx in entities){
            // keys = {"confidenceScore", "endingPos", "entityEnglishId", "entityId", "id", "matchedText", "matchingTokens":Array, "relevanceScore", "startingPos", "type":Array, "unit", "wikiLink"}
            entity = entities[idx];
            id = entity.entityId
            if (!(id in entities_dict)){
                entities_dict[id] = {
                    "rel_score": (entity.relevanceScore <= 1 ? entity.relevanceScore : 1),
                    "con_score": (entity.confidenceScore <= 10 ? entity.confidenceScore : 10),
                    "count" : 1 ,
                    "url" : entity.wikiLink
                }
            }else{
                entities_dict[id]["rel_score"] += (entity.relevanceScore <= 1 ? entity.relevanceScore : 1);
                entities_dict[id]["con_score"] += (entity.confidenceScore <= 10 ? entity.confidenceScore : 10);
                entities_dict[id]["count"] += 1;
            }
        }
    
        for (id in entities_dict){
            freq = entities_dict[id]["count"]
            weighted_rel = entities_dict[id]["rel_score"]/freq
            if(weighted_rel < 0.5){
                delete entities_dict[id];
                continue;
            }
            con_penalty = 15;
            score =  weighted_rel * entities_dict[id]["con_score"]/freq/con_penalty;
            if (score < 0.5){
                delete entities_dict[id];
                continue;
            }
            entities_dict[id]["overall"] = score;
            entities_dict[id]["rel_score"] = weighted_rel;
            entities_dict[id]["con_score"] = entities_dict[id]["con_score"]/freq;
        }
        return callback_1(entities_dict, scrape_website, callback_2, callback_3);
    };
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.setRequestHeader("X-TextRazor-key", "ddda20bb2b317510ee16e68556f8ae5e17266dedfb839642fa584639");
    xhttp.send(`url=${url}&extractors=entities`);
}

function collation(entities_dict, callback_3){
    var sortable = [];
    for (id in entities_dict){
        sortable.push([id, entities_dict[id]]);
    }

    sortable.sort(function(a,b){
        // Sort by overall score, then frequency
        return b[1]["overall"] - a[1]["overall"] || b[1]["count"] - a[1]["count"];;
    });

    var final_5_entities = [];

    for (var idx=0; idx<5;idx++){
        id = sortable[idx][0];
        arr = sortable[idx][1];
        final_5_entities.push({"entity_name":id, "relevance_score":arr["rel_score"], "confidence_score":arr["con_score"], "overall_score":arr["overall"], "frequency":arr["count"], "url":arr["url"]});
    }

    console.log(final_5_entities);
    callback_3(final_5_entities);
}

