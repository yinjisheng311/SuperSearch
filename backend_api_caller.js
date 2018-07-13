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


// var entities_dict = {};
var global_links = []


// function fetch_data(query, links){}


function fetch_data(query, links){
    // query = "query string that was entered by user"
    // links = ["url1", "url2" ...]
    global_links = links;
    return scrape_website({}, scrape_website, collation);
}

function scrape_website(entities_dict, callback_1, callback_2){
    if(global_links.length==0){
        return callback_2(entities_dict);
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
        callback_1(entities_dict, scrape_website, callback_2);
    };
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.setRequestHeader("X-TextRazor-key", "ddda20bb2b317510ee16e68556f8ae5e17266dedfb839642fa584639");
    xhttp.send(`url=${url}&extractors=entities`);
}

function collation(entities_dict){
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
    return final_5_entities;
}

